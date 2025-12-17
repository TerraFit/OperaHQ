import React, { useState, useContext, useMemo } from 'react';
import { AppContext } from '../App';
import { CHEF_SHIFTS, SA_PUBLIC_HOLIDAYS } from '../constants';
import { ComplianceService } from '../services/complianceService';
import { ChefShiftType, Shift } from '../types';
import { Plus, AlertOctagon, Check, Calendar, Plane, CalendarRange, Filter, Download, Printer } from 'lucide-react';

export default function Schedule() {
  const { user, employees, shifts, setShifts } = useContext(AppContext);
  
  // Creation State
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [selectedType, setSelectedType] = useState<ChefShiftType>('split');
  const [isMultiDay, setIsMultiDay] = useState(false);
  const [endDate, setEndDate] = useState<string>(
    new Date(Date.now() + 86400000).toISOString().split('T')[0]
  );
  const [excludeWeekends, setExcludeWeekends] = useState(true);
  const [excludeHolidays, setExcludeHolidays] = useState(true);
  
  const [validationError, setValidationError] = useState<string[]>([]);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // View State
  const [viewMode, setViewMode] = useState<'single' | 'multi'>('single');
  const [viewStartDate, setViewStartDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [viewEndDate, setViewEndDate] = useState<string>(
    new Date(Date.now() + 6 * 86400000).toISOString().split('T')[0] // 7 days default
  );
  const [filterEmployee, setFilterEmployee] = useState<string>('all');

  // --- ACTIONS ---

  const handleAddShift = () => {
    if (!user) return;
    setValidationError([]);
    setSuccessMsg(null);

    const config = CHEF_SHIFTS[selectedType];
    const proposedShifts: Shift[] = [];
    
    if (isMultiDay) {
        // Multi-Day Generation Logic
        const start = new Date(selectedDate);
        const end = new Date(endDate);
        
        if (end < start) {
            setValidationError(["End date must be after start date."]);
            return;
        }

        // Generate Dates
        for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
            const dateStr = d.toISOString().split('T')[0];
            const dayOfWeek = d.getDay(); // 0 = Sun, 6 = Sat
            
            // Exclusions
            if (excludeWeekends && (dayOfWeek === 0 || dayOfWeek === 6)) continue;
            if (excludeHolidays && SA_PUBLIC_HOLIDAYS.includes(dateStr)) continue;

            proposedShifts.push({
                id: `new-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                employeeId: user.id,
                date: dateStr,
                type: selectedType,
                start: `${dateStr}T${config.startTime}:00`,
                end: `${dateStr}T${config.endTime}:00`,
                totalHours: config.totalHours,
                status: 'scheduled',
                breakTaken: false
            });
        }

        if (proposedShifts.length === 0) {
            setValidationError(["No valid shifts generated with current exclusions."]);
            return;
        }

    } else {
        // Single Day
        proposedShifts.push({
            id: `new-${Date.now()}`,
            employeeId: user.id,
            date: selectedDate,
            type: selectedType,
            start: `${selectedDate}T${config.startTime}:00`,
            end: `${selectedDate}T${config.endTime}:00`,
            totalHours: config.totalHours,
            status: 'scheduled',
            breakTaken: false
        });
    }

    // Validation Loop
    // We must validate each proposed shift against the Accumulated state (Existing + Previously Validated in this batch)
    let accumulatedShifts = [...shifts];
    const errors: string[] = [];
    
    // Filter existing shifts for this employee to check for conflicts (double booking)
    const existingEmployeeShifts = shifts.filter(s => s.employeeId === user.id);

    for (const shift of proposedShifts) {
        // 1. Double Booking Check
        if (existingEmployeeShifts.some(s => s.date === shift.date)) {
            errors.push(`Conflict: Shift already exists on ${shift.date}`);
            continue;
        }

        // 2. Compliance Check
        // We pass 'accumulatedShifts' which includes existing shifts + any new shifts validated in previous iterations of this loop
        // Filter specifically for the employee inside validateSchedule logic via compliance service if needed, 
        // but validateSchedule expects 'existingShifts' context.
        // We need to pass ONLY the employee's shifts to validateSchedule for accurate weekly calc.
        const employeeAccumulated = accumulatedShifts.filter(s => s.employeeId === user.id);
        
        const check = ComplianceService.validateSchedule(shift, employeeAccumulated);
        
        if (!check.valid) {
            errors.push(`Compliance Error on ${shift.date}: ${check.errors.join(', ')}`);
        } else {
            // Add to accumulation for next iteration's weekly calculation
            accumulatedShifts.push(shift);
        }
    }

    if (errors.length > 0) {
        setValidationError(errors.slice(0, 5)); // Limit error display
        return;
    }

    // If all valid
    setShifts(accumulatedShifts);
    setSuccessMsg(`Successfully scheduled ${proposedShifts.length} shift(s).`);
  };

  // --- VIEW HELPERS ---

  // Calculate stats for the current user
  const userShifts = shifts.filter(s => s.employeeId === user?.id);
  const weekHours = ComplianceService.calculateWeeklyHours(userShifts);
  const leaveBalance = user ? ComplianceService.calculateLeaveBalance(user.holidaysEarned, user.holidaysTaken) : 0;

  // Matrix View Generators
  const matrixDates = useMemo(() => {
    const dates = [];
    const start = new Date(viewStartDate);
    const end = new Date(viewEndDate);
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        dates.push(new Date(d));
    }
    return dates;
  }, [viewStartDate, viewEndDate]);

  const matrixEmployees = useMemo(() => {
     if (filterEmployee !== 'all') {
         return employees.filter(e => e.id === filterEmployee);
     }
     return employees;
  }, [employees, filterEmployee]);

  const getShiftForCell = (empId: string, date: Date) => {
      const dateStr = date.toISOString().split('T')[0];
      return shifts.find(s => s.employeeId === empId && s.date === dateStr);
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
           <h2 className="text-2xl font-bold text-gray-900">Schedule Management</h2>
           <p className="text-sm text-gray-500">Manage individual and team rosters</p>
        </div>
        
        <div className="flex items-center gap-3">
           <div className="bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm text-sm flex items-center gap-2">
             <Plane size={16} className="text-blue-500" />
             <span className="text-gray-500 mr-1">Leave Balance:</span>
             <span className="font-bold text-gray-900">{leaveBalance.toFixed(1)} Days</span>
           </div>
           <div className="bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm text-sm">
             <span className="text-gray-500 mr-2">My Weekly Total:</span>
             <span className={`font-bold ${weekHours > 45 ? 'text-red-600' : 'text-green-600'}`}>
               {weekHours} / 45 hrs
             </span>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Shift Creator */}
        <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-sm border border-gray-200 h-fit">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Plus size={20} className="text-blue-500" /> Create Schedule
          </h3>
          
          <div className="space-y-4">
            {/* Multi-Day Toggle */}
            <div className="flex items-center gap-2 p-3 bg-gray-50 rounded border border-gray-100">
               <input 
                 type="checkbox" 
                 id="md-toggle"
                 checked={isMultiDay}
                 onChange={(e) => setIsMultiDay(e.target.checked)}
                 className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
               />
               <label htmlFor="md-toggle" className="text-sm font-bold text-gray-700 select-none">Multi-Day Shift</label>
            </div>

            {isMultiDay ? (
               // MULTI-DAY INPUTS
               <div className="space-y-3 animate-in slide-in-from-top-2">
                 <div className="grid grid-cols-2 gap-2">
                   <div>
                     <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Start Date</label>
                     <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className="w-full p-2 border border-gray-300 rounded text-sm" />
                   </div>
                   <div>
                     <label className="block text-xs font-bold text-gray-500 uppercase mb-1">End Date</label>
                     <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="w-full p-2 border border-gray-300 rounded text-sm" />
                   </div>
                 </div>
                 
                 <div className="space-y-2 p-3 border border-dashed border-gray-300 rounded bg-gray-50/50">
                    <label className="flex items-center gap-2 text-sm text-gray-700">
                      <input type="checkbox" checked={excludeWeekends} onChange={e => setExcludeWeekends(e.target.checked)} />
                      Exclude Weekends
                    </label>
                    <label className="flex items-center gap-2 text-sm text-gray-700">
                      <input type="checkbox" checked={excludeHolidays} onChange={e => setExcludeHolidays(e.target.checked)} />
                      Exclude Public Holidays
                    </label>
                 </div>
               </div>
            ) : (
               // SINGLE DAY INPUT
               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                 <div className="relative">
                   <Calendar className="absolute left-3 top-2.5 text-gray-400" size={16} />
                   <input 
                     type="date" 
                     value={selectedDate}
                     onChange={(e) => setSelectedDate(e.target.value)}
                     className="w-full pl-10 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
                   />
                 </div>
               </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Shift Type</label>
              <select 
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value as ChefShiftType)}
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                {Object.entries(CHEF_SHIFTS).map(([key, config]) => (
                  <option key={key} value={key}>
                    {key.replace('_', ' ').toUpperCase()} ({config.totalHours}h)
                  </option>
                ))}
              </select>
              <div className="mt-2 text-xs text-gray-500 bg-gray-50 p-2 rounded">
                 {CHEF_SHIFTS[selectedType].startTime} - {CHEF_SHIFTS[selectedType].endTime}
                 {CHEF_SHIFTS[selectedType].secondStartTime && ` & ${CHEF_SHIFTS[selectedType].secondStartTime} - ${CHEF_SHIFTS[selectedType].secondEndTime}`}
              </div>
            </div>

            {validationError.length > 0 && (
              <div className="bg-red-50 p-3 rounded border border-red-200 text-sm text-red-700">
                <div className="flex items-center gap-2 font-bold mb-1">
                  <AlertOctagon size={16} /> Compliance Block
                </div>
                <ul className="list-disc list-inside text-xs space-y-1">
                  {validationError.map((err, i) => <li key={i} className="truncate">{err}</li>)}
                </ul>
              </div>
            )}

            {successMsg && (
              <div className="bg-green-50 p-3 rounded border border-green-200 text-sm text-green-700 flex items-center gap-2">
                <Check size={16} /> {successMsg}
              </div>
            )}

            <button 
              onClick={handleAddShift}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors shadow-sm"
            >
              {isMultiDay ? 'Validate & Add Bulk Schedule' : 'Validate & Add Shift'}
            </button>
          </div>
        </div>

        {/* Schedule View */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
          {/* View Controls */}
          <div className="p-4 border-b border-gray-200 bg-gray-50 flex flex-wrap gap-4 items-center justify-between">
             <div className="flex items-center gap-2 bg-white p-1 rounded-lg border border-gray-300">
                <button 
                  onClick={() => setViewMode('single')}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${viewMode === 'single' ? 'bg-gray-100 text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  Single Day
                </button>
                <button 
                  onClick={() => setViewMode('multi')}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${viewMode === 'multi' ? 'bg-gray-100 text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  Multi-Day
                </button>
             </div>

             {viewMode === 'multi' && (
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-2">
                     <input type="date" value={viewStartDate} onChange={e => setViewStartDate(e.target.value)} className="p-1.5 text-xs border rounded" />
                     <span className="text-gray-400 text-xs">to</span>
                     <input type="date" value={viewEndDate} onChange={e => setViewEndDate(e.target.value)} className="p-1.5 text-xs border rounded" />
                  </div>
                  <select value={filterEmployee} onChange={e => setFilterEmployee(e.target.value)} className="p-1.5 text-xs border rounded">
                     <option value="all">All Staff</option>
                     {employees.map(e => <option key={e.id} value={e.id}>{e.firstName} {e.lastName}</option>)}
                  </select>
                </div>
             )}
          </div>

          <div className="overflow-x-auto flex-1">
            {viewMode === 'single' ? (
              <table className="w-full text-left text-sm">
                <thead className="bg-white border-b border-gray-200">
                  <tr>
                    <th className="p-4 font-semibold text-gray-900">Date</th>
                    <th className="p-4 font-semibold text-gray-900">Type</th>
                    <th className="p-4 font-semibold text-gray-900">Time</th>
                    <th className="p-4 font-semibold text-gray-900">Hours</th>
                    <th className="p-4 font-semibold text-gray-900">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {userShifts.map((shift) => (
                    <tr key={shift.id} className="hover:bg-gray-50">
                      <td className="p-4">{shift.date}</td>
                      <td className="p-4 uppercase text-xs font-bold text-gray-600 tracking-wide">{shift.type.replace('_', ' ')}</td>
                      <td className="p-4 text-gray-500">
                        {CHEF_SHIFTS[shift.type].startTime} - {CHEF_SHIFTS[shift.type].endTime}
                        {CHEF_SHIFTS[shift.type].secondStartTime && ` / ${CHEF_SHIFTS[shift.type].secondStartTime} - ${CHEF_SHIFTS[shift.type].secondEndTime}`}
                      </td>
                      <td className="p-4 font-medium">{shift.totalHours}h</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${
                          shift.status === 'scheduled' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                          shift.status === 'clocked_in' ? 'bg-green-50 text-green-700 border-green-200' :
                          'bg-gray-100 text-gray-600 border-gray-200'
                        }`}>
                          {shift.status.replace('_', ' ')}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {userShifts.length === 0 && (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-gray-400">No shifts scheduled</td>
                    </tr>
                  )}
                </tbody>
              </table>
            ) : (
              // MULTI-DAY MATRIX VIEW
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                   <tr>
                     <th className="p-2 border border-gray-200 bg-gray-50 min-w-[120px] sticky left-0 z-10 font-bold text-gray-700">Employee</th>
                     {matrixDates.map(d => (
                       <th key={d.toISOString()} className="p-2 border border-gray-200 bg-gray-50 text-center min-w-[50px]">
                         <div className="font-bold text-gray-900">{d.toLocaleDateString('en-US', { weekday: 'short' })}</div>
                         <div className="text-gray-500">{d.getDate()}</div>
                       </th>
                     ))}
                     <th className="p-2 border border-gray-200 bg-gray-100 font-bold text-gray-800 text-center">Total</th>
                   </tr>
                </thead>
                <tbody>
                   {matrixEmployees.map(emp => {
                     let totalHours = 0;
                     return (
                       <tr key={emp.id} className="hover:bg-gray-50">
                         <td className="p-2 border border-gray-200 bg-white sticky left-0 font-medium text-gray-900 whitespace-nowrap">
                           {emp.firstName} {emp.lastName}
                         </td>
                         {matrixDates.map(d => {
                            const shift = getShiftForCell(emp.id, d);
                            if (shift) totalHours += shift.totalHours;
                            return (
                              <td key={d.toISOString()} className="p-1 border border-gray-200 text-center h-12">
                                {shift ? (
                                  <div 
                                    className={`w-full h-full rounded flex flex-col items-center justify-center p-1 cursor-help
                                      ${shift.type === 'split' ? 'bg-blue-100 text-blue-800' : 
                                        shift.type === 'morning' ? 'bg-green-100 text-green-800' :
                                        shift.type === 'evening' ? 'bg-indigo-100 text-indigo-800' :
                                        shift.type === 'double_split' ? 'bg-purple-100 text-purple-800' :
                                        'bg-gray-100 text-gray-800'}
                                    `}
                                    title={`${shift.type} (${shift.totalHours}h)`}
                                  >
                                    <span className="font-black text-[10px] uppercase leading-none">{shift.type.substring(0,1)}</span>
                                    <span className="text-[9px] font-medium leading-none mt-0.5">{shift.totalHours}</span>
                                  </div>
                                ) : (
                                  <div className="w-full h-full bg-gray-50/50"></div>
                                )}
                              </td>
                            );
                         })}
                         <td className="p-2 border border-gray-200 text-center font-bold bg-gray-50">
                           <span className={totalHours > 45 ? 'text-red-600' : 'text-green-600'}>
                             {totalHours.toFixed(1)}
                           </span>
                         </td>
                       </tr>
                     );
                   })}
                </tbody>
              </table>
            )}
          </div>
          
          {viewMode === 'multi' && (
             <div className="p-3 bg-gray-50 border-t border-gray-200 text-xs text-gray-500 flex gap-4">
                <span className="font-bold">Legend:</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 bg-blue-100 border border-blue-300"></span> Split</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 bg-green-100 border border-green-300"></span> Morning</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 bg-indigo-100 border border-indigo-300"></span> Evening</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 bg-purple-100 border border-purple-300"></span> Double</span>
             </div>
          )}
        </div>
      </div>
    </div>
  );
}