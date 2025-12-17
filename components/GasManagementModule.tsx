
import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from '../App';
import { GasLocation, GasTank, GasCheckRecord, GasCheckAssessment } from '../types';
import { MOCK_GAS_LOCATIONS, MOCK_GAS_TANKS } from '../services/mockGasData';
import { GasService } from '../services/gasService';
import { 
  Flame, 
  Scale, 
  Save, 
  ArrowRight, 
  X,
  AlertTriangle,
  CheckCircle,
  Ban
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
                <Scale size={14} /> Weigh Tank <ArrowRight size={12} />
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
    const [currentWeightStr, setCurrentWeightStr] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Tank Details
    const tare = location.currentTank?.tareWeight || 0;
    const full = location.currentTank?.fullWeight || 0;
    const capacity = full - tare;

    // Calculations
    const currentWeight = parseFloat(currentWeightStr) || 0;
    const gasRemaining = GasService.calculateRemainingGas(currentWeight, tare);
    const percentage = GasService.calculatePercentage(currentWeight, tare, full);
    const assessment = GasService.getAssessment(percentage, gasRemaining);
    const action = GasService.getActionRequired(assessment);

    const handleSubmit = async () => {
      if (!currentWeight) return;
      setIsSubmitting(true);
      
      const newCheck: GasCheckRecord = {
        id: `chk-${Date.now()}`,
        date: new Date().toISOString(),
        checkedBy: user?.id || 'unknown',
        locationId: location.id,
        tankId: location.currentTankId || 'unknown',
        measuredWeight: currentWeight,
        tareWeight: tare,
        fullWeight: full,
        remainingGas: gasRemaining,
        percentage,
        assessment,
        actionRequired: action,
        photoUrl: '' // Photo removed from requirement
      };

      console.log("Saving Weight Check:", newCheck);
      
      // Trigger alerts if low
      if (assessment === 'low' || assessment === 'empty') {
        await GasService.sendLowGasAlert(location.name, percentage);
      }

      // Update Local State
      const updatedLocs = locations.map(l => 
        l.id === location.id ? { ...l, lastChecked: new Date().toISOString() } : l
      );
      setLocations(updatedLocs);

      setTimeout(() => {
        setIsSubmitting(false);
        onClose();
        // Optional: Show prompt for refill if empty
        if (assessment === 'empty') {
            alert(`Tank is EMPTY. Please replace tank at ${location.name} immediately.`);
        }
      }, 500);
    };

    // Assessment Colors/Icons
    const getStatusUI = (status: GasCheckAssessment) => {
        switch (status) {
            case 'empty': return { color: 'text-red-600', bg: 'bg-red-50 border-red-200', icon: <Ban size={24} /> };
            case 'low': return { color: 'text-yellow-600', bg: 'bg-yellow-50 border-yellow-200', icon: <AlertTriangle size={24} /> };
            case 'adequate': return { color: 'text-blue-600', bg: 'bg-blue-50 border-blue-200', icon: <CheckCircle size={24} /> };
            case 'full': return { color: 'text-green-600', bg: 'bg-green-50 border-green-200', icon: <CheckCircle size={24} /> };
            default: return { color: 'text-gray-600', bg: 'bg-gray-50 border-gray-200', icon: <Scale size={24} /> };
        }
    };

    const ui = getStatusUI(assessment);

    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95">
            {/* Header */}
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                        ⚖️ Weigh Tank
                    </h2>
                    <p className="text-xs text-gray-500">{location.name} • {location.tankSize}kg</p>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                    <X size={20} className="text-gray-500" />
                </button>
            </div>

            <div className="p-6 space-y-6">
                {/* Info Grid */}
                <div className="grid grid-cols-2 gap-4 text-sm bg-gray-50 p-3 rounded-xl border border-gray-100">
                    <div>
                        <span className="block text-gray-400 text-xs font-bold uppercase">Tare Weight</span>
                        <span className="font-mono font-bold text-gray-700">{tare} kg</span>
                    </div>
                    <div>
                        <span className="block text-gray-400 text-xs font-bold uppercase">Capacity</span>
                        <span className="font-mono font-bold text-gray-700">{capacity} kg</span>
                    </div>
                </div>

                {/* Input Section */}
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Total Weight (Scale Reading)</label>
                    <div className="relative">
                        <input 
                            type="number" 
                            step="0.1"
                            value={currentWeightStr}
                            onChange={e => setCurrentWeightStr(e.target.value)}
                            className="w-full text-center text-3xl font-bold p-4 border-2 border-blue-100 rounded-xl focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none text-blue-900"
                            placeholder="0.0"
                            autoFocus
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">kg</span>
                    </div>
                    <p className="text-xs text-center text-gray-400 mt-2">Enter the full weight shown on the scale</p>
                </div>

                {/* Calculation Results */}
                {currentWeight > 0 && (
                    <div className={`p-4 rounded-xl border-2 ${ui.bg} transition-all animate-in fade-in slide-in-from-bottom-2`}>
                        <div className="flex justify-between items-center mb-3 border-b border-black/5 pb-2">
                            <span className="text-xs font-bold uppercase opacity-60">Gas Remaining</span>
                            <span className={`text-lg font-bold font-mono ${ui.color}`}>{Math.max(0, gasRemaining).toFixed(1)} kg</span>
                        </div>
                        
                        <div className="space-y-1">
                            <div className="flex justify-between text-xs font-bold mb-1">
                                <span className={ui.color}>{assessment.toUpperCase()}</span>
                                <span>{Math.max(0, percentage).toFixed(1)}%</span>
                            </div>
                            <div className="h-3 bg-white/50 rounded-full overflow-hidden border border-black/5">
                                <div 
                                    className={`h-full transition-all duration-500 ${
                                        assessment === 'empty' ? 'bg-red-500' :
                                        assessment === 'low' ? 'bg-yellow-500' :
                                        assessment === 'adequate' ? 'bg-blue-500' : 'bg-green-500'
                                    }`}
                                    style={{ width: `${Math.min(100, Math.max(0, percentage))}%` }}
                                />
                            </div>
                        </div>

                        <div className={`mt-3 flex items-center gap-2 text-sm font-bold ${ui.color}`}>
                            {ui.icon}
                            {action !== 'None' ? action : 'Status OK'}
                        </div>
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="p-6 bg-gray-50 border-t border-gray-100 flex gap-3">
                <button 
                    onClick={onClose}
                    className="flex-1 px-4 py-3 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-100"
                >
                    Cancel
                </button>
                <button 
                    onClick={handleSubmit}
                    disabled={!currentWeight || isSubmitting}
                    className={`flex-1 px-4 py-3 text-white font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2
                        ${!currentWeight ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 hover:shadow-blue-200 hover:-translate-y-0.5'}
                    `}
                >
                    {isSubmitting ? 'Saving...' : <><Save size={18} /> Save Check</>}
                </button>
            </div>
        </div>
      </div>
    );
  };

  // Grouping Logic
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

      {currentLocation && (
        <GasCheckForm location={currentLocation} onClose={() => setCurrentLocation(null)} />
      )}

      <div className="space-y-8">
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
    </div>
  );
}
