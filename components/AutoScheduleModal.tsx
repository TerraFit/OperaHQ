
import React, { useState, useContext } from 'react';
import { AppContext } from '../App';
import { AutoScheduleService } from '../services/autoScheduleService';
import { RosterEntry } from '../types';
import { X, Wand2, Calendar, CheckCircle, Loader2, AlertCircle } from 'lucide-react';

interface Props {
  onClose: () => void;
  onApply: (entries: RosterEntry[]) => void;
}

export default function AutoScheduleModal({ onClose, onApply }: Props) {
  const { employees } = useContext(AppContext);
  const [step, setStep] = useState<'config' | 'processing' | 'done'>('config');
  const [months, setMonths] = useState(4);
  const [generatedCount, setGeneratedCount] = useState(0);

  const handleStart = () => {
    setStep('processing');
    
    // Simulate complex calculation delay
    setTimeout(() => {
      const start = new Date();
      start.setDate(1); // Start from 1st of current month
      
      const newEntries = AutoScheduleService.generateRoster(employees, start, months);
      setGeneratedCount(newEntries.length);
      setStep('done');
      
      // Delay final apply to show success state
      setTimeout(() => {
        onApply(newEntries);
        onClose();
      }, 1500);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Wand2 className="text-purple-600" /> Auto-Schedule Engine
            </h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X /></button>
          </div>

          {step === 'config' && (
            <div className="space-y-4">
              <div className="p-4 bg-purple-50 rounded-xl border border-purple-100 text-sm text-purple-800">
                This engine pre-fills schedules for <strong>Permanent Staff</strong> based on department-specific patterns. Casual staff will remain blank.
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Planning Horizon</label>
                <div className="grid grid-cols-2 gap-3">
                  {[1, 2, 4, 6].map(m => (
                    <button 
                      key={m}
                      onClick={() => setMonths(m)}
                      className={`py-3 rounded-xl border-2 font-bold transition-all ${
                        months === m ? 'border-purple-600 bg-purple-50 text-purple-700' : 'border-gray-100 text-gray-500 hover:border-purple-200'
                      }`}
                    >
                      {m} Months
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <CheckCircle size={14} className="text-green-500" /> Maintenance D1/D2/D Rotations
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <CheckCircle size={14} className="text-green-500" /> Kitchen Shift Patterns
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <CheckCircle size={14} className="text-green-500" /> SA Public Holiday Logic
                </div>
              </div>

              <button 
                onClick={handleStart}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-purple-100 flex items-center justify-center gap-2 transition-transform hover:scale-[1.02]"
              >
                Generate 4-Month Roster
              </button>
            </div>
          )}

          {step === 'processing' && (
            <div className="py-12 text-center space-y-4">
              <div className="relative inline-block">
                <Loader2 className="animate-spin text-purple-600 w-12 h-12" />
                <Wand2 className="absolute inset-0 m-auto text-purple-300 w-6 h-6" />
              </div>
              <p className="text-gray-900 font-bold animate-pulse">Computing Deterministic Patterns...</p>
              <p className="text-xs text-gray-500">Adhering to South African Labor Law & Roster Legend</p>
            </div>
          )}

          {step === 'done' && (
            <div className="py-12 text-center space-y-4 animate-in fade-in">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle size={32} />
              </div>
              <h4 className="text-2xl font-bold text-gray-900">Roster Generated!</h4>
              <p className="text-gray-600">Created <strong>{generatedCount}</strong> shift entries for the next {months} months.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
