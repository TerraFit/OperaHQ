
import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from '../App';
import { GasLocation, GasTank, GasCheckRecord } from '../types';
import { MOCK_GAS_LOCATIONS, MOCK_GAS_TANKS } from '../services/mockGasData';
import { GasService } from '../services/gasService';
import { 
  Flame, 
  Scale, 
  Camera, 
  Save, 
  AlertTriangle, 
  CheckCircle, 
  ArrowRight, 
  ShieldAlert,
  ThermometerSnowflake,
  X 
} from 'lucide-react';

interface LocationCardProps {
  loc: GasLocation;
  onClick: (l: GasLocation) => void;
  styleClass?: string;
  badgeClass?: string;
  badgeText?: string;
}

const LocationCard: React.FC<LocationCardProps> = ({ loc, onClick, styleClass, badgeClass, badgeText }) => {
  const isOverdue = loc.nextCheckDue ? new Date(loc.nextCheckDue) < new Date() : false;

  return (
    <div 
      onClick={() => onClick(loc)}
      className={`relative group bg-white rounded-xl shadow-sm border transition-all duration-300 cursor-pointer hover:-translate-y-1 hover:shadow-lg ${styleClass || 'border-gray-200 hover:border-blue-300'}`}
    >
      <div className="p-5">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="font-bold text-gray-900">{loc.name}</h3>
            <div className={`text-xs mt-0.5 px-2 py-0.5 rounded inline-block font-bold ${badgeClass || 'bg-blue-100 text-blue-600'}`}>
              {loc.tankSize}kg • {loc.code}
            </div>
          </div>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isOverdue ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-green-100 text-green-600'}`}>
             <Flame size={16} />
          </div>
        </div>

        <div className="space-y-2 mt-4">
           <div className="flex justify-between text-xs">
             <span className="text-gray-500">Last Checked</span>
             <span className="font-medium text-gray-700">
               {loc.lastChecked ? new Date(loc.lastChecked).toLocaleDateString(undefined, {month: 'short', day: 'numeric'}) : 'Never'}
             </span>
           </div>
           
           <div className="flex justify-between text-xs">
             <span className="text-gray-500">Status</span>
             <span className="font-bold text-green-600">Active</span>
           </div>
        </div>
        
        <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between items-center">
            {badgeText && <span className="text-[10px] font-bold text-gray-400 uppercase">{badgeText}</span>}
            <span className="text-xs font-bold text-blue-600 flex items-center gap-1 group-hover:gap-2 transition-all ml-auto">
                Perform Check <ArrowRight size={12} />
            </span>
        </div>
      </div>
    </div>
  );
};

export default function GasManagementModule() {
  const { user } = useContext(AppContext);
  const [locations, setLocations] = useState<GasLocation[]>([]);
  const [currentLocation, setCurrentLocation] = useState<GasLocation | null>(null);
  
  useEffect(() => {
    const hydrated = MOCK_GAS_LOCATIONS.map(loc => ({
      ...loc,
      currentTank: MOCK_GAS_TANKS.find(t => t.id === loc.currentTankId)
    }));
    setLocations(hydrated);
  }, []);

  const GasCheckForm = ({ location, onClose }: { location: GasLocation, onClose: () => void }) => {
    const [tareWeight, setTareWeight] = useState<string>(location.currentTank?.tareWeight.toString() || '');
    const [fullWeight, setFullWeight] = useState<string>(location.currentTank?.fullWeight.toString() || '');
    const [measuredWeight, setMeasuredWeight] = useState<string>('');
    const [photo, setPhoto] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const procedure = GasService.getCheckProcedure(location.code, location.tankSize);

    // Derived Values
    const tare = parseFloat(tareWeight) || 0;
    const full = parseFloat(fullWeight) || 0;
    const measured = parseFloat(measuredWeight) || 0;
    
    const remaining = GasService.calculateRemainingGas(measured, tare);
    const percentage = GasService.calculatePercentage(measured, tare, full);
    const assessment = GasService.getAssessment(percentage);
    const action = GasService.getActionRequired(percentage);

    const handleSubmit = async () => {
      setIsSubmitting(true);
      const newCheck: GasCheckRecord = {
        id: `chk-${Date.now()}`,
        date: new Date().toISOString(),
        checkedBy: user?.id || 'unknown',
        locationId: location.id,
        tankId: location.currentTankId || 'unknown',
        measuredWeight: measured,
        tareWeight: tare,
        fullWeight: full,
        remainingGas: remaining,
        percentage,
        assessment,
        actionRequired: action,
        photoUrl: photo
      };

      console.log("Saving Check:", newCheck);
      if (percentage < 30) await GasService.sendLowGasAlert(location.name, percentage);

      const updatedLocs = locations.map(l => 
        l.id === location.id ? { ...l, lastChecked: new Date().toISOString() } : l
      );
      setLocations(updatedLocs);

      setTimeout(() => {
        setIsSubmitting(false);
        onClose();
      }, 800);
    };

    return (
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden animate-in fade-in zoom-in-95">
        <div className={`px-6 py-4 flex justify-between items-center text-white ${
            procedure.safetyLevel === 'critical' ? 'bg-red-600' :
            procedure.safetyLevel === 'high' ? 'bg-orange-600' : 'bg-gray-900'
        }`}>
          <div>
            <h2 className="text-lg font-bold flex items-center gap-2">
              <Scale size={20} /> {location.checkFrequency === 'monthly' ? 'Monthly' : 'Weekly'} Check Procedure
            </h2>
            <div className="text-xs text-white/80 mt-1 uppercase font-bold tracking-wide">
              Level: {procedure.safetyLevel} Safety Protocol
            </div>
          </div>
          <button onClick={onClose} className="hover:bg-white/10 p-2 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            {/* SAFETY CHECKLIST */}
            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
               <h3 className="text-sm font-bold text-blue-800 uppercase mb-3 flex items-center gap-2">
                 <ShieldAlert size={16} /> Mandatory Safety Steps
               </h3>
               <ul className="space-y-2">
                 {procedure.steps.map((step, idx) => (
                   <li key={idx} className="flex items-start gap-2 text-sm text-blue-900">
                     <div className="mt-0.5 w-4 h-4 rounded-full border border-blue-300 flex items-center justify-center bg-white text-[10px] font-bold text-blue-500">
                       {idx + 1}
                     </div>
                     {step}
                   </li>
                 ))}
               </ul>
               {procedure.requiresTwoPersonCheck && (
                 <div className="mt-4 p-2 bg-red-100 text-red-800 text-xs font-bold text-center rounded border border-red-200">
                   ⚠️ TWO-PERSON CHECK REQUIRED
                 </div>
               )}
            </div>

            {/* WEIGHT INPUT */}
            <div className="bg-white p-4 rounded-xl border-l-4 border-blue-600 shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-2">
                <label className="font-bold text-blue-900">Current Weight Reading</label>
                <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-500">Scale</span>
              </div>
              <div className="flex items-center gap-2">
                <input 
                  type="number" 
                  value={measuredWeight} 
                  onChange={e => setMeasuredWeight(e.target.value)}
                  className="flex-1 text-right text-xl font-bold p-2 border border-blue-300 rounded focus:ring-2 focus:ring-blue-600 outline-none text-blue-900"
                  placeholder="0.0"
                  autoFocus
                />
                <span className="font-bold text-blue-700 w-8">kg</span>
              </div>
            </div>
          </div>

          {/* RESULTS PREVIEW */}
          <div className="space-y-6 flex flex-col justify-between">
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 h-full">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-gray-800">Analysis</h3>
                <span className="text-xs font-mono text-gray-400">Tare: {tare}kg</span>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-end border-b border-gray-200 pb-2">
                  <span className="text-sm text-gray-500">Remaining Gas</span>
                  <span className="text-2xl font-bold text-gray-900">{remaining} <span className="text-sm text-gray-400 font-normal">kg</span></span>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-500">Capacity Used</span>
                    <span className="font-bold text-gray-900">{percentage}%</span>
                  </div>
                  <div className="h-4 bg-gray-200 rounded-full overflow-hidden relative shadow-inner">
                    <div 
                      className={`h-full transition-all duration-500 ${percentage < 15 ? 'bg-red-500' : percentage < 30 ? 'bg-orange-500' : 'bg-green-500'}`}
                      style={{ width: `${Math.min(Math.max(percentage, 0), 100)}%` }}
                    />
                  </div>
                </div>

                <div className="flex justify-between items-center pt-2">
                  <span className="text-sm text-gray-500">Assessment</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                    assessment === 'critical' || assessment === 'empty' ? 'bg-red-100 text-red-700' :
                    assessment === 'low' ? 'bg-orange-100 text-orange-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    {assessment}
                  </span>
                </div>

                <div className="bg-white p-3 rounded border border-gray-200 text-center mt-4">
                  <span className="block text-xs text-gray-400 uppercase mb-1">Required Action</span>
                  <span className={`font-bold ${action === 'REFILL NOW' ? 'text-red-600 animate-pulse' : 'text-gray-700'}`}>
                    {action}
                  </span>
                </div>
              </div>
            </div>

            <button 
                 onClick={handleSubmit}
                 disabled={!measured || isSubmitting}
                 className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-3 rounded-lg shadow-md transition-all flex items-center justify-center gap-2"
               >
                 {isSubmitting ? 'Processing...' : <><Save size={18} /> Confirm Check</>}
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Grouping Logic
  const kitchenPrivate = locations.filter(l => l.isAlwaysActive && !l.name.includes('Geyser'));
  const geysers = locations.filter(l => l.isAlwaysActive && l.name.includes('Geyser'));
  const guestRooms = locations.filter(l => l.department === 'guest_rooms');
  const backup = locations.filter(l => l.tankSize === 9 && !l.isAlwaysActive);

  return (
    <div className="space-y-8 p-4 md:p-6 min-h-screen bg-gray-50/50">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Flame className="text-orange-500" /> Gas Management
          </h1>
          <p className="text-gray-500 text-sm mt-1">Operational Safety & Supply Tracking</p>
        </div>
      </div>

      {currentLocation ? (
        <GasCheckForm location={currentLocation} onClose={() => setCurrentLocation(null)} />
      ) : (
        <div className="space-y-8">
           {/* 1. KITCHEN & PRIVATE AREAS */}
           <section className="bg-red-50/50 p-6 rounded-2xl border border-red-100">
             <div className="flex justify-between items-center mb-4">
               <h2 className="text-lg font-bold text-red-900 flex items-center gap-2">
                 🔥 Kitchen & Private Areas (Always Active)
               </h2>
               <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">High Priority</span>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {kitchenPrivate.map(loc => (
                    <LocationCard key={loc.id} loc={loc} onClick={setCurrentLocation} />
                ))}
             </div>
           </section>

           {/* 2. GEYSERS */}
           <section className="bg-red-50/50 p-6 rounded-2xl border border-red-100">
             <div className="flex justify-between items-center mb-4">
               <h2 className="text-lg font-bold text-red-900 flex items-center gap-2">
                 🚿 Rooms & Private Areas Geysers (Always Active)
               </h2>
               <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">Essential Services</span>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {geysers.map(loc => (
                    <LocationCard key={loc.id} loc={loc} onClick={setCurrentLocation} />
                ))}
             </div>
           </section>

           {/* 3. GUEST ROOMS */}
           <section className="bg-green-50/50 p-6 rounded-2xl border border-green-100">
             <div className="flex justify-between items-center mb-4">
               <h2 className="text-lg font-bold text-green-900 flex items-center gap-2">
                 🏨 Guest Room Cylinders
               </h2>
               <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">Standard Priority</span>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {guestRooms.map(loc => (
                    <LocationCard 
                      key={loc.id} 
                      loc={loc} 
                      onClick={setCurrentLocation} 
                      styleClass={loc.tankSize === 48 ? 'border-yellow-200 bg-yellow-50 hover:border-yellow-400' : ''}
                      badgeClass={loc.tankSize === 48 ? 'bg-yellow-200 text-yellow-800' : undefined}
                      badgeText={loc.tankSize === 48 ? 'Large Commercial' : undefined}
                    />
                ))}
             </div>
           </section>

           {/* 4. BACKUP */}
           <section className="bg-gray-100/50 p-6 rounded-2xl border border-gray-200">
             <div className="flex justify-between items-center mb-4">
               <h2 className="text-lg font-bold text-gray-700 flex items-center gap-2">
                 🔄 Backup & Emergency
               </h2>
               <span className="bg-gray-200 text-gray-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">Low Priority</span>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {backup.map(loc => (
                    <LocationCard 
                      key={loc.id} 
                      loc={loc} 
                      onClick={setCurrentLocation} 
                      styleClass="opacity-90 border-gray-300 bg-gray-50 hover:opacity-100"
                      badgeClass="bg-gray-200 text-gray-700"
                      badgeText="Emergency Use Only"
                    />
                ))}
             </div>
           </section>
        </div>
      )}
    </div>
  );
}
