
import React from 'react';
import { MOCK_ROOMS, MOCK_EVENTS } from '../services/mockHousekeepingData';
import { MOCK_EMPLOYEES, MOCK_SHIFTS } from '../services/mockData';
import { Users, Calendar, AlertTriangle, BedDouble, Key, CheckCircle } from 'lucide-react';

export default function OccupancyOverview() {
  const today = new Date().toISOString().split('T')[0];
  
  // Calculations
  const totalRooms = MOCK_ROOMS.length;
  const occupiedRooms = MOCK_ROOMS.filter(r => ['occupied', 'stay_over', 'check_out_today'].includes(r.status)).length;
  const occupancyRate = Math.round((occupiedRooms / totalRooms) * 100);
  
  const checkIns = MOCK_ROOMS.filter(r => r.status === 'check_in_today').length;
  const checkOuts = MOCK_ROOMS.filter(r => r.status === 'check_out_today').length;
  const stayOvers = MOCK_ROOMS.filter(r => r.status === 'stay_over').length;
  
  const staffOnShift = MOCK_SHIFTS.filter(s => s.date === today).length;
  const eventsToday = MOCK_EVENTS.filter(e => e.date === today);

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Occupancy Card */}
        <div className="flex-1 bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-sm font-bold text-gray-500 uppercase">Today's Occupancy</h3>
              <div className="text-3xl font-bold text-gray-900 mt-1">{occupancyRate}%</div>
              <div className="text-xs text-gray-400">{occupiedRooms} of {totalRooms} Rooms</div>
            </div>
            <div className={`p-2 rounded-lg ${occupancyRate > 80 ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
              <BedDouble size={24} />
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="p-2 bg-blue-50 rounded border border-blue-100">
              <div className="font-bold text-blue-700">{checkIns}</div>
              <div className="text-blue-600">Check-ins</div>
            </div>
            <div className="p-2 bg-orange-50 rounded border border-orange-100">
              <div className="font-bold text-orange-700">{checkOuts}</div>
              <div className="text-orange-600">Check-outs</div>
            </div>
            <div className="p-2 bg-gray-50 rounded border border-gray-100">
              <div className="font-bold text-gray-700">{stayOvers}</div>
              <div className="text-gray-600">Stay-over</div>
            </div>
          </div>
        </div>

        {/* Staff & Events */}
        <div className="flex-1 flex flex-col gap-4">
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
             <div>
               <h3 className="text-xs font-bold text-gray-500 uppercase">Staff on Duty</h3>
               <div className="text-xl font-bold text-gray-900">{staffOnShift} <span className="text-sm font-normal text-gray-400">/ {MOCK_EMPLOYEES.length}</span></div>
             </div>
             <div className="bg-blue-50 p-2 rounded-lg text-blue-600">
               <Users size={20} />
             </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex-1">
             <div className="flex items-center justify-between mb-2">
               <h3 className="text-xs font-bold text-gray-500 uppercase">Events Today</h3>
               <Calendar size={16} className="text-gray-400" />
             </div>
             {eventsToday.length > 0 ? (
               <div className="space-y-2">
                 {eventsToday.map(evt => (
                   <div key={evt.id} className="text-sm border-l-2 border-purple-500 pl-2">
                     <div className="font-medium">{evt.name}</div>
                     <div className="text-xs text-gray-500">{evt.startTime} - {evt.endTime} • {evt.guestCount} Pax</div>
                   </div>
                 ))}
               </div>
             ) : (
               <div className="text-sm text-gray-400 italic">No events scheduled.</div>
             )}
          </div>
        </div>
      </div>
      
      {/* Alerts Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
         {checkIns > 0 && (
           <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg flex items-center gap-3 text-sm text-blue-800">
             <Key size={16} />
             <span>{checkIns} guests arriving today. Ensure rooms ready by 14:00.</span>
           </div>
         )}
         {MOCK_ROOMS.some(r => r.cleaningStatus === 'not_cleaned' && r.status !== 'vacant') && (
           <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg flex items-center gap-3 text-sm text-yellow-800">
             <AlertTriangle size={16} />
             <span>Rooms pending cleaning: {MOCK_ROOMS.filter(r => r.cleaningStatus === 'not_cleaned').length}</span>
           </div>
         )}
      </div>
    </div>
  );
}
