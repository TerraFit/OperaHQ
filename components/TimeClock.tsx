import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from '../App';
import { ComplianceService } from '../services/complianceService';
import { WORKPLACE_LOCATION, GEO_FENCE_RADIUS_METERS } from '../constants';
import { MapPin, Lock, Unlock, AlertTriangle, Loader2, CheckCircle } from 'lucide-react';
import { AuditLog } from '../types';

export default function TimeClock() {
  const { user } = useContext(AppContext);
  const [status, setStatus] = useState<'clocked_out' | 'clocked_in' | 'break'>('clocked_out');
  const [locationError, setLocationError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [distance, setDistance] = useState<number | null>(null);

  const verifyLocation = (action: () => void) => {
    setIsVerifying(true);
    setLocationError(null);
    setSuccessMsg(null);

    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by this browser.");
      setIsVerifying(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userLat = position.coords.latitude;
        const userLng = position.coords.longitude;
        
        const dist = ComplianceService.calculateDistance(
          userLat, userLng, 
          WORKPLACE_LOCATION.lat, WORKPLACE_LOCATION.lng
        );
        
        setDistance(Math.round(dist));

        if (dist <= GEO_FENCE_RADIUS_METERS) {
          setSuccessMsg(`Location verified (${Math.round(dist)}m). Action successful.`);
          // Clear success message after 3 seconds
          setTimeout(() => setSuccessMsg(null), 3000);
          action();
        } else {
          setLocationError(`You are ${Math.round(dist)}m away. Must be within ${GEO_FENCE_RADIUS_METERS}m.`);
          
          // Log audit failure
          const auditLog: AuditLog = {
            id: Date.now().toString(),
            timestamp: new Date().toISOString(),
            userId: user?.id || 'unknown',
            action: 'CLOCK_ATTEMPT_FAILED',
            reason: 'Geofence violation',
            changes: JSON.stringify({ dist, lat: userLat, lng: userLng })
          };
          console.log("AUDIT LOG:", auditLog);
        }
        setIsVerifying(false);
      },
      (error) => {
        setLocationError(`Location access denied or failed: ${error.message}`);
        setIsVerifying(false);
      },
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
    );
  };

  const handleClockIn = () => {
    verifyLocation(() => {
      setStatus('clocked_in');
      // In real app: API call to create shift record
    });
  };

  const handleClockOut = () => {
    verifyLocation(() => {
      setStatus('clocked_out');
      // In real app: API call to close shift record
    });
  };

  return (
    <div className="max-w-md mx-auto space-y-6">
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="bg-gray-900 p-6 text-center">
          <h2 className="text-xl font-bold text-white mb-2">Time Clock</h2>
          <div className="text-gray-400 text-sm flex items-center justify-center gap-2">
            <MapPin size={14} /> 
            {distance !== null ? `Distance: ${distance}m (Max: ${GEO_FENCE_RADIUS_METERS}m)` : 'Locating...'}
          </div>
        </div>

        <div className="p-8 flex flex-col items-center">
          {/* Status Indicator */}
          <div className={`w-32 h-32 rounded-full flex items-center justify-center mb-6 border-4 shadow-inner ${
            status === 'clocked_in' 
              ? 'bg-green-100 border-green-500 text-green-700' 
              : 'bg-red-50 border-gray-300 text-gray-500'
          }`}>
            {status === 'clocked_in' ? <Unlock size={48} /> : <Lock size={48} />}
          </div>

          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900">
              {status === 'clocked_in' ? 'You are Clocked In' : 'You are Clocked Out'}
            </h3>
            <p className="text-gray-500 mt-1">
              {status === 'clocked_in' ? 'Shift started at 07:45' : 'Ready to start shift'}
            </p>
          </div>

          {locationError && (
            <div className="mb-6 p-4 bg-red-50 text-red-700 text-sm rounded-lg border border-red-200 flex items-start gap-3 w-full animate-in fade-in slide-in-from-top-1">
              <AlertTriangle className="flex-shrink-0 mt-0.5" size={16} />
              <div>
                <span className="font-bold block">Action Blocked</span>
                {locationError}
              </div>
            </div>
          )}

          {successMsg && (
            <div className="mb-6 p-4 bg-green-50 text-green-700 text-sm rounded-lg border border-green-200 flex items-start gap-3 w-full animate-in fade-in slide-in-from-top-1">
              <CheckCircle className="flex-shrink-0 mt-0.5" size={16} />
              <div>
                <span className="font-bold block">Verified</span>
                {successMsg}
              </div>
            </div>
          )}

          <div className="w-full space-y-3">
            {status === 'clocked_out' ? (
              <button 
                onClick={handleClockIn}
                disabled={isVerifying}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-lg shadow-md transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isVerifying ? <Loader2 className="animate-spin" /> : 'CLOCK IN'}
              </button>
            ) : (
              <button 
                onClick={handleClockOut}
                disabled={isVerifying}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-lg shadow-md transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isVerifying ? <Loader2 className="animate-spin" /> : 'CLOCK OUT'}
              </button>
            )}

            {status === 'clocked_in' && (
              <button className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 rounded-lg shadow-sm transition-colors">
                START BREAK (45m)
              </button>
            )}
          </div>
        </div>
        
        <div className="bg-gray-50 p-4 border-t border-gray-200 text-xs text-center text-gray-500">
          <p>GPS verification required for all actions.</p>
          <p className="mt-1">Violations are logged for audit.</p>
        </div>
      </div>
    </div>
  );
}