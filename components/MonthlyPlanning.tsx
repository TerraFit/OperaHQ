
import React, { useState, useContext, useMemo } from 'react';
import { AppContext } from '../App';
import { 
  MOCK_ROSTER_ENTRIES, 
  MOCK_SPECIAL_EVENTS 
} from '../services/mockData';
import { 
  Employee, 
  RosterEntry, 
  RosterShiftCode, 
  SpecialEvent,
  UserRole 
} from '../types';
import { ROSTER_LEGEND } from '../constants';
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Download, 
  Printer, 
  Settings, 
  Calendar, 
  Users, 
  AlertTriangle,
  PartyPopper,
  X,
  Save
} from 'lucide-react';

export default function MonthlyPlanning() {
  const { user, employees, setEmployees } = useContext(AppContext);
  const [currentDate, setCurrentDate] = useState(new Date());
  
  // Data State
  const [roster, setRoster] = useState<RosterEntry[]>(MOCK_ROSTER_ENTRIES);
  const [events, setEvents] = useState<SpecialEvent[]>(MOCK_SPECIAL_EVENTS);
  const [activeTab, setActiveTab] = useState<'roster' | 'directory'>('roster');

  // Modal State
  const [showEventModal, setShowEventModal] = useState(false);
  const [newEvent, setNewEvent] = useState<Partial<SpecialEvent>>({ 
    title: '', 
    date: '', 
    type: 'function',
    startTime: '',
    endTime: ''
  });

  const [selectedCell, setSelectedCell] = useState<{staffId: string, date: string} | null>(null);

  // --- HELPERS ---

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  
  const getDaysArray = () => {
    const days = [];
    for (let i = 1; i <= daysInMonth; i++) {
      const d = new Date(currentDate.getFullYear(), currentDate.getMonth(), i);
      days.push(d);
    }
    return days;
  };

  const days = getDaysArray();

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const getRosterEntry = (staffId: string, dateStr: string) => {
    return roster.find(r => r.staffId === staffId && r.date === dateStr);
  };

  const getDayEvents = (dateStr: string) => {
    return events.filter(e => e.date === dateStr);
  };

  const handleSetShift = (code: RosterShiftCode) => {
    if (!selectedCell) return;
    
    // Remove existing if any
    const newRoster = roster.filter(r => !(r.staffId === selectedCell.staffId && r.date === selectedCell.date));
    
    // Add new
    newRoster.push({
      id: `ros-${Date.now()}`,
      staffId: selectedCell.staffId,
      date: selectedCell.date,
      code
    });
    
    setRoster(newRoster);
    setSelectedCell(null);
  };

  const handleAddEvent = () => {
    if (!newEvent.title || !newEvent.date) return;
    const evt: SpecialEvent = {
        id: `evt-${Date.now()}`,
        title: newEvent.title!,
        date: newEvent.date!,
        type: newEvent.type as any,
        status: 'confirmed',
        startTime: newEvent.startTime,
        endTime: newEvent.endTime,
        description: newEvent.description
    };
    setEvents([...events, evt]);
    setShowEventModal(false);
    setNewEvent({ title: '', date: '', type: 'function' });
  };

  // Group employees by department
  const groupedEmployees = useMemo(() => {
    const groups: Record<string, Employee[]> = {};
    employees.forEach(emp => {
      const dept = emp.department || 'General';
      if (!groups[dept]) groups[dept] = [];
      groups[dept].push(emp);
    });
    return groups;
  }, [employees]);

  // Filter events for current month
  const monthlyEvents = useMemo(() => {
    return events.filter(e => {
      const d = new Date(e.date);
      return d.getMonth() === currentDate.getMonth() && d.getFullYear() === currentDate.getFullYear();
    });
  }, [events, currentDate]);

  // --- RENDERERS ---

  const StaffDirectory = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in">
        {employees.map((emp) => (
          <div key={emp.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
            <div className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border border-gray-200 font-bold text-gray-500">
                  {emp.firstName[0]}{emp.lastName[0]}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">{emp.firstName} {emp.lastName}</h3>
                  <p className="text-sm text-blue-600 font-medium">{emp.jobTitle}</p>
                </div>
              </div>
              <div className="text-sm text-gray-600 space-y-1">
                 <div>{emp.email}</div>
                 <div>{emp.phone}</div>
              </div>
            </div>
            <div className="px-6 py-3 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{emp.department}</span>
              <span className={`text-xs px-2 py-0.5 rounded font-medium ${emp.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'}`}>
                {emp.status.toUpperCase()}
              </span>
            </div>
          </div>
        ))}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-4">
           <button onClick={handlePrevMonth} className="p-2 hover:bg-gray-100 rounded-lg"><ChevronLeft size={20} /></button>
           <h2 className="text-xl font-bold text-gray-900 w-48 text-center">
             {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
           </h2>
           <button onClick={handleNextMonth} className="p-2 hover:bg-gray-100 rounded-lg"><ChevronRight size={20} /></button>
        </div>

        <div className="flex gap-2">
           <button 
             onClick={() => setActiveTab('roster')} 
             className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${activeTab === 'roster' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
           >
             Roster
           </button>
           <button 
             onClick={() => setActiveTab('directory')} 
             className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${activeTab === 'directory' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
           >
             Directory
           </button>
        </div>

        <div className="flex gap-2">
           <button onClick={() => setShowEventModal(true)} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm font-bold text-sm">
             <Plus size={16} /> Add Event
           </button>
           <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg border border-gray-200"><Printer size={18} /></button>
           <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg border border-gray-200"><Download size={18} /></button>
           <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg border border-gray-200"><Settings size={18} /></button>
        </div>
      </div>

      {activeTab === 'directory' ? <StaffDirectory /> : (
        <>
          {/* LEGEND */}
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex flex-wrap gap-4 items-center text-xs">
             <span className="font-bold text-gray-500 uppercase">Legend:</span>
             {Object.values(ROSTER_LEGEND).map((item) => (
               <div key={item.code} className="flex items-center gap-1.5" title={item.description}>
                 <span 
                   className="w-6 h-6 flex items-center justify-center rounded font-bold shadow-sm"
                   style={{ backgroundColor: item.color, color: item.textColor }}
                 >
                   {item.code}
                 </span>
                 <span className="text-gray-700 font-medium">{item.name}</span>
               </div>
             ))}
          </div>

          {/* EVENTS BAR */}
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 space-y-3">
             <h3 className="text-xs font-bold text-gray-500 uppercase flex items-center gap-2">
               <Calendar size={14} /> Events & Absences this Month
             </h3>
             <div className="flex flex-wrap gap-3">
                {monthlyEvents.map(evt => (
                    <div key={evt.id} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm font-medium
                        ${evt.type === 'management_absence' ? 'bg-red-50 border-red-200 text-red-700' : 'bg-blue-50 border-blue-200 text-blue-700'}
                    `}>
                        {evt.type === 'management_absence' ? <AlertTriangle size={14} /> : <PartyPopper size={14} />}
                        <span className="font-bold">{new Date(evt.date).getDate()} {new Date(evt.date).toLocaleString('default', {month:'short'})}:</span>
                        <span>{evt.title}</span>
                        {evt.startTime && <span className="text-xs opacity-75">({evt.startTime}-{evt.endTime})</span>}
                    </div>
                ))}
                {monthlyEvents.length === 0 && <span className="text-sm text-gray-400 italic">No events scheduled.</span>}
             </div>
          </div>

          {/* ROSTER MATRIX */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-x-auto">
             <table className="w-full text-center text-xs border-collapse">
               <thead>
                 <tr>
                   <th className="p-3 border border-gray-200 bg-gray-50 min-w-[200px] sticky left-0 z-10 text-left font-bold text-gray-700">Staff Member</th>
                   {days.map(d => (
                     <th key={d.toISOString()} className={`p-1 border border-gray-200 bg-gray-50 min-w-[36px] ${
                        d.getDay() === 0 || d.getDay() === 6 ? 'bg-gray-100' : ''
                     }`}>
                       <div className="font-bold text-gray-800">{d.getDate()}</div>
                       <div className="text-[10px] text-gray-500 uppercase">{d.toLocaleDateString('en-US', { weekday: 'short' }).charAt(0)}</div>
                     </th>
                   ))}
                 </tr>
               </thead>
               <tbody>
                 {Object.entries(groupedEmployees).map(([dept, staff]) => (
                   <React.Fragment key={dept}>
                     {/* Department Header */}
                     <tr>
                       <td colSpan={days.length + 1} className="p-2 bg-gray-100 border border-gray-200 text-left font-bold text-gray-600 uppercase text-xs tracking-wider sticky left-0">
                         {dept}
                       </td>
                     </tr>
                     {staff.map(emp => (
                       <tr key={emp.id} className="hover:bg-gray-50">
                         <td className="p-2 border border-gray-200 bg-white text-left font-medium text-gray-900 sticky left-0 z-10 whitespace-nowrap flex items-center gap-2 h-10">
                           <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-[10px] font-bold text-gray-600">
                             {emp.firstName[0]}{emp.lastName[0]}
                           </div>
                           {emp.firstName} {emp.lastName}
                         </td>
                         {days.map(d => {
                           const dateStr = formatDate(d);
                           const entry = getRosterEntry(emp.id, dateStr);
                           const dayEvents = getDayEvents(dateStr);
                           const isWeekend = d.getDay() === 0 || d.getDay() === 6;
                           
                           return (
                             <td 
                               key={dateStr} 
                               className={`border border-gray-200 relative p-0 cursor-pointer hover:ring-2 hover:ring-blue-400 hover:z-20 transition-all ${isWeekend && !entry ? 'bg-gray-50' : ''}`}
                               onClick={() => setSelectedCell({ staffId: emp.id, date: dateStr })}
                             >
                               {entry ? (
                                 <div 
                                   className="w-full h-10 flex items-center justify-center font-bold shadow-sm"
                                   style={{ 
                                     backgroundColor: ROSTER_LEGEND[entry.code].color, 
                                     color: ROSTER_LEGEND[entry.code].textColor 
                                   }}
                                   title={`${ROSTER_LEGEND[entry.code].name}${entry.notes ? ': ' + entry.notes : ''}`}
                                 >
                                   {entry.code}
                                 </div>
                               ) : (
                                 <div className="w-full h-10"></div>
                               )}
                               
                               {/* Event Marker */}
                               {dayEvents.length > 0 && (
                                 <div className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border border-white"></div>
                               )}
                             </td>
                           );
                         })}
                       </tr>
                     ))}
                   </React.Fragment>
                 ))}
               </tbody>
             </table>
          </div>
        </>
      )}

      {/* SHIFT SELECTOR POPUP */}
      {selectedCell && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center" onClick={() => setSelectedCell(null)}>
           <div className="bg-white rounded-xl shadow-xl p-4 w-full max-w-sm animate-in zoom-in-95" onClick={e => e.stopPropagation()}>
              <h3 className="font-bold text-gray-900 mb-4 text-center">Select Shift for {selectedCell.date}</h3>
              <div className="grid grid-cols-3 gap-3">
                 {Object.values(ROSTER_LEGEND).map(item => (
                   <button
                     key={item.code}
                     onClick={() => handleSetShift(item.code)}
                     className="flex flex-col items-center justify-center p-3 rounded-lg border hover:shadow-md transition-all"
                     style={{ borderColor: item.color, backgroundColor: `${item.color}10` }}
                   >
                     <span 
                       className="w-8 h-8 flex items-center justify-center rounded font-bold mb-1 shadow-sm"
                       style={{ backgroundColor: item.color, color: item.textColor }}
                     >
                       {item.code}
                     </span>
                     <span className="text-xs font-bold text-gray-700">{item.name}</span>
                   </button>
                 ))}
                 <button 
                   onClick={() => {
                     // Clear shift logic
                     const newRoster = roster.filter(r => !(r.staffId === selectedCell.staffId && r.date === selectedCell.date));
                     setRoster(newRoster);
                     setSelectedCell(null);
                   }}
                   className="flex flex-col items-center justify-center p-3 rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-500"
                 >
                   <X size={24} />
                   <span className="text-xs font-bold mt-1">Clear</span>
                 </button>
              </div>
           </div>
        </div>
      )}

      {/* ADD EVENT MODAL */}
      {showEventModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 animate-in zoom-in-95">
             <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-gray-900">Add Special Event</h3>
                <button onClick={() => setShowEventModal(false)}><X className="text-gray-400 hover:text-gray-600" /></button>
             </div>
             
             <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Event Title</label>
                  <input type="text" className="w-full p-2 border rounded" value={newEvent.title} onChange={e => setNewEvent({...newEvent, title: e.target.value})} placeholder="e.g. Wedding Function" />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                   <div>
                     <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Date</label>
                     <input type="date" className="w-full p-2 border rounded" value={newEvent.date} onChange={e => setNewEvent({...newEvent, date: e.target.value})} />
                   </div>
                   <div>
                     <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Type</label>
                     <select className="w-full p-2 border rounded" value={newEvent.type} onChange={e => setNewEvent({...newEvent, type: e.target.value as any})}>
                        <option value="function">Function</option>
                        <option value="management_absence">Management Absence</option>
                        <option value="holiday">Public Holiday</option>
                        <option value="other">Other</option>
                     </select>
                   </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                   <div>
                     <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Start Time</label>
                     <input type="time" className="w-full p-2 border rounded" value={newEvent.startTime} onChange={e => setNewEvent({...newEvent, startTime: e.target.value})} />
                   </div>
                   <div>
                     <label className="block text-xs font-bold text-gray-700 uppercase mb-1">End Time</label>
                     <input type="time" className="w-full p-2 border rounded" value={newEvent.endTime} onChange={e => setNewEvent({...newEvent, endTime: e.target.value})} />
                   </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Description / Notes</label>
                  <textarea className="w-full p-2 border rounded h-20" value={newEvent.description} onChange={e => setNewEvent({...newEvent, description: e.target.value})} placeholder="Details about guests, staff required etc..." />
                </div>
             </div>

             <div className="mt-6 flex gap-3">
                <button onClick={() => setShowEventModal(false)} className="flex-1 bg-gray-100 text-gray-700 font-bold py-2 rounded hover:bg-gray-200">Cancel</button>
                <button onClick={handleAddEvent} className="flex-1 bg-blue-600 text-white font-bold py-2 rounded hover:bg-blue-700 flex items-center justify-center gap-2">
                  <Save size={16} /> Save Event
                </button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}
