import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from '../App';
import { GasLocation, GasTank, GasCheckRecord, GasCheckAssessment } from '../types';
import { MOCK_GAS_LOCATIONS, MOCK_GAS_TANKS } from '../services/mockGasData';
import { GasService } from '../services/gasService';
import { 
  Flame, 
  ThermometerSnowflake, 
  Scale, 
  Camera, 
  Save, 
  AlertTriangle, 
  CheckCircle, 
  ArrowRight, 
  History, 
  X 
} from 'lucide-react';

interface LocationCardProps {
  loc: GasLocation;
  onClick: (l: GasLocation) => void;
}

// Extracted LocationCard to avoid inline definition issues and prop type errors
const LocationCard: React.FC<LocationCardProps> = ({ loc, onClick }) => (
  <div 
    onClick={() => onClick(loc)}
    className={`relative group bg-white rounded-xl shadow-sm border transition-all duration-300 cursor-pointer hover:-translate-y-1 hover:shadow-lg
      ${loc.hasWinterHeater && !loc.winterActive 
          ? 'opacity-60 border-gray-200 bg-gray-50' 
          : 'border-gray-200 hover:border-blue-300'
      }
    `}
  >
    <div className="p-5">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-bold text-gray-900">{loc.name}</h3>
          <div className="text-xs text-gray-500 mt-0.5">{loc.tankSize}kg • {loc.code}</div>
        </div>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
           loc.hasWinterHeater ? (loc.winterActive ? 'bg-blue-100 text-blue-600' : 'bg-gray-200 text-gray-400') : 'bg-orange-100 text-orange-600'
        }`}>
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
         
         {loc.hasWinterHeater && (
           <div className="flex justify-between text-xs">
             <span className="text-gray-500">Status</span>
             <span className={`font-bold ${loc.winterActive ? 'text-blue-600' : 'text-gray-400'}`}>
               {loc.winterActive ? 'Winter Active' : 'Summer Inactive'}
             </span>
           </div>
         )}
      </div>
      
      {(!loc.hasWinterHeater || loc.winterActive) && (
          <div className="mt-4 pt-3 border-t border-gray-100 flex justify-end">
              <span className="text-xs font-bold text-blue-600 flex items-center gap-1 group-hover:gap-2 transition-all">
                  Perform Check <ArrowRight size={12} />
              </span>
          </div>
      )}
    </div>
  </div>
);

export default function GasManagementModule() {
  const { user } = useContext(AppContext);
  const [locations, setLocations] = useState<GasLocation[]>([]);
  const [tanks, setTanks] = useState<GasTank[]>(MOCK_GAS_TANKS);
  const [currentLocation, setCurrentLocation] = useState<GasLocation | null>(null);
  const [isWinterMode, setIsWinterMode] = useState<boolean>(true);
  
  // Hydrate locations with tank data
  useEffect(() => {
    const hydrated = MOCK_GAS_LOCATIONS.map(loc => ({
      ...loc,
      currentTank: MOCK_GAS_TANKS.find(t => t.id === loc.currentTankId)
    }));
    setLocations(hydrated);
  }, []);

  const handleSeasonToggle = (enabled: boolean) => {
    setIsWinterMode(enabled);
    const updated = locations.map(l => ({
        ...l,
        winterActive: l.hasWinterHeater ? enabled : l.winterActive
    }));
    setLocations(updated);
    // In real app, API call to SeasonalGasManager
  };

  const GasCheckForm = ({ location, onClose }: { location: GasLocation, onClose: () => void }) => {
    const [tareWeight, setTareWeight] = useState<string>(location.currentTank?.tareWeight.toString() || '');
    const [fullWeight, setFullWeight] = useState<string>(location.currentTank?.fullWeight.toString() || '');
    const [measuredWeight, setMeasuredWeight] = useState<string>('');
    const [photo, setPhoto] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState(false);

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
      
      // 1. Create Record
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

      // 2. Mock Email Trigger
      if (percentage < 30) {
        await GasService.sendLowGasAlert(location.name, percentage);
      }

      // 3. Update Local State (Mock DB Update)
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
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden animate-in fade-in slide-in-from-bottom-4">
        <div className="bg-gray-900 px-6 py-4 flex justify-between items-center text-white">
          <div>
            <h2 className="text-lg font-bold flex items-center gap-2">
              <Scale size={20} /> Weekly Gas Check
            </h2>
            <div className="text-xs text-gray-400 mt-1">
              {location.name} • {location.tankSize}kg Tank
            </div>
          </div>
          <button onClick={onClose} className="hover:bg-white/10 p-2 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* INPUT SECTION */}
          <div className="space-y-6">
            <div className="bg-white p-4 rounded-xl border-l-4 border-blue-500 shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-2">
                <label className="font-bold text-gray-700">Tare Weight (Empty)</label>
                <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-500">Stamp on tank</span>
              </div>
              <div className="flex items-center gap-2">
                <input 
                  type="number" 
                  value={tareWeight} 
                  onChange={e => setTareWeight(e.target.value)}
                  className="flex-1 text-right text-xl font-bold p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="0.0"
                />
                <span className="font-bold text-gray-500 w-8">kg</span>
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border-l-4 border-blue-500 shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-2">
                <label className="font-bold text-gray-700">Full Weight</label>
                <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-500">Tare + Capacity</span>
              </div>
              <div className="flex items-center gap-2">
                <input 
                  type="number" 
                  value={fullWeight} 
                  onChange={e => setFullWeight(e.target.value)}
                  className="flex-1 text-right text-xl font-bold p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="0.0"
                />
                <span className="font-bold text-gray-500 w-8">kg</span>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-xl border-l-4 border-blue-600 shadow-sm border border-blue-100">
              <div className="flex justify-between items-center mb-2">
                <label className="font-bold text-blue-900">Current Weight</label>
                <span className="text-xs bg-white px-2 py-1 rounded text-blue-600 font-bold">Scale Reading</span>
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

          {/* RESULTS SECTION */}
          <div className="space-y-6 flex flex-col justify-between">
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 h-full">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-gray-800">Results</h3>
                {measured > 0 && <span className="text-xs font-mono text-gray-400">AUTO-CALC</span>}
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
                  <div className="h-6 bg-gray-200 rounded-full overflow-hidden relative shadow-inner">
                    <div 
                      className={`h-full transition-all duration-500 ${
                        percentage < 15 ? 'bg-red-500' : 
                        percentage < 30 ? 'bg-orange-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${Math.min(Math.max(percentage, 0), 100)}%` }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white drop-shadow-md">
                      {percentage}%
                    </div>
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
                  <span className="block text-xs text-gray-400 uppercase mb-1">Action Required</span>
                  <span className={`font-bold ${action === 'REFILL NOW' ? 'text-red-600 animate-pulse' : 'text-gray-700'}`}>
                    {action}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
               <button 
                 className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-lg border border-dashed border-gray-300 text-gray-500 hover:bg-gray-50 transition-colors ${photo ? 'border-green-500 text-green-600 bg-green-50' : ''}`}
                 onClick={() => setPhoto(photo ? '' : 'mock-photo-url')}
               >
                 <Camera size={18} /> {photo ? 'Photo Added' : 'Add Photo'}
               </button>
               
               <button 
                 onClick={handleSubmit}
                 disabled={!measured || isSubmitting}
                 className="flex-[2] bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-3 rounded-lg shadow-md transition-all flex items-center justify-center gap-2"
               >
                 {isSubmitting ? 'Saving...' : <><Save size={18} /> Save Check</>}
               </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 p-6 min-h-screen bg-gray-50/50">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Flame className="text-orange-500" /> Gas Management
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Weekly tank monitoring and seasonal configuration.
          </p>
        </div>

        <div className="flex items-center gap-4 bg-gray-50 p-2 rounded-lg border border-gray-200">
           <span className="text-sm font-bold text-gray-600 pl-2">Winter Mode</span>
           <button 
             onClick={() => handleSeasonToggle(!isWinterMode)}
             className={`relative w-14 h-8 rounded-full transition-colors duration-300 focus:outline-none ${isWinterMode ? 'bg-blue-600' : 'bg-orange-400'}`}
           >
             <div className={`absolute top-1 left-1 bg-white w-6 h-6 rounded-full transition-transform duration-300 flex items-center justify-center shadow-sm ${isWinterMode ? 'translate-x-6' : 'translate-x-0'}`}>
                {isWinterMode ? <ThermometerSnowflake size={14} className="text-blue-600" /> : <Flame size={14} className="text-orange-500" />}
             </div>
           </button>
        </div>
      </div>

      {currentLocation ? (
        <GasCheckForm location={currentLocation} onClose={() => setCurrentLocation(null)} />
      ) : (
        <div className="space-y-8">
           {/* Section 1: Room Heaters (Seasonal) */}
           <div>
             <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
               <ThermometerSnowflake size={16} /> Room Heaters ({isWinterMode ? 'Active' : 'Inactive'})
             </h3>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {locations.filter(l => l.hasWinterHeater).map(loc => (
                    <LocationCard key={loc.id} loc={loc} onClick={setCurrentLocation} />
                ))}
             </div>
           </div>

           {/* Section 2: Permanent Installations */}
           <div>
             <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
               <Flame size={16} /> Kitchen & Private Areas (Always Active)
             </h3>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {locations.filter(l => !l.hasWinterHeater).map(loc => (
                    <LocationCard key={loc.id} loc={loc} onClick={setCurrentLocation} />
                ))}
             </div>
           </div>
        </div>
      )}
    </div>
  );
}