import React, { useState, useContext } from 'react';
import { AppContext } from '../App';
import { MOCK_PLANNING_EVENTS } from '../services/mockData';
import { UserRole, PlanningEvent, Shift, ChefShiftType, Employee } from '../types';
import { CHEF_SHIFTS } from '../constants';
import { ComplianceService } from '../services/complianceService';
import { 
  Users, 
  Phone, 
  Mail, 
  Briefcase, 
  Plus,
  ChevronLeft,
  ChevronRight,
  Clock,
  Trash2,
  AlertTriangle,
  UserPlus,
  X,
  CalendarPlus
} from 'lucide-react';

type ViewMode = 'month' | 'week' | 'directory';

export default function MonthlyPlanning() {
  const { user, employees, setEmployees, shifts, setShifts } = useContext(AppContext);
  const [activeTab, setActiveTab] = useState<ViewMode>('month');
  
  // Data State
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<PlanningEvent[]>(MOCK_PLANNING_EVENTS);

  // Modal State
  const [showEventModal, setShowEventModal] = useState(false);
  const [showShiftModal, setShowShiftModal] = useState(false);
  const [showEmployeeModal, setShowEmployeeModal] = useState(false);
  
  // Forms
  const [newEvent, setNewEvent] = useState<Partial<PlanningEvent>>({ title: '', date: '', type: 'meeting' });
  const [shiftForm, setShiftForm] = useState<{
    id?: string;
    employeeId: string;
    date: string;
    type: ChefShiftType;
  }>({
    employeeId: '',
    date: new Date().toISOString().split('T')[0],
    type: 'split'
  });
  
  // New Employee Form
  const initialEmployeeForm: Partial<Employee> = {
    firstName: '',
    lastName: '',
    email: '',
    role: UserRole.STAFF,
    department: 'Kitchen',
    jobTitle: 'Chef',
    status: 'active',
    dateStarted: new Date().toISOString().split('T')[0],
    idNumber: '',
    phone: '',
    emergencyContactName: '',
    emergencyContactPhone: ''
  };
  const [employeeForm, setEmployeeForm] = useState<Partial<Employee>>(initialEmployeeForm);

  const [shiftError, setShiftError] = useState<string[]>([]);

  // Permissions
  const canEdit = user?.role === UserRole.MANAGER || user?.role === UserRole.ADMIN;

  // --- HELPERS ---

  const getEmployee = (id: string) => employees.find(e => e.id === id);

  const handlePrev = () => {
    if (activeTab === 'week') {
      const newDate = new Date(currentDate);
      newDate.setDate(newDate.getDate() - 7);
      setCurrentDate(newDate);
    } else {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    }
  };

  const handleNext = () => {
    if (activeTab === 'week') {
      const newDate = new Date(currentDate);
      newDate.setDate(newDate.getDate() + 7);
      setCurrentDate(newDate);
    } else {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    }
  };

  const getWeekRange = (date: Date) => {
    const start = new Date(date);
    start.setDate(start.getDate() - start.getDay()); // Sunday
    const days = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      days.push(d);
    }
    return days;
  };

  // --- ACTIONS ---

  const handleAddEvent = () => {
    if (!newEvent.title || !newEvent.date) return;
    const evt: PlanningEvent = {
      id: `evt-${Date.now()}`,
      title: newEvent.title!,
      date: newEvent.date!,
      type: newEvent.type as any || 'meeting',
      createdBy: user!.id
    };
    setEvents([...events, evt]);
    setShowEventModal(false);
    setNewEvent({ title: '', date: '', type: 'meeting' });
  };

  const handleSaveShift = () => {
    setShiftError([]);
    
    // 1. Basic Form Validation
    if (!shiftForm.employeeId) {
      setShiftError(["Please select an employee."]);
      return;
    }
    if (!shiftForm.date) {
      setShiftError(["Please select a date."]);
      return;
    }

    const config = CHEF_SHIFTS[shiftForm.type];
    
    // 2. Construct proposed shift
    const proposedShift: Shift = {
      id: shiftForm.id || `sh-${Date.now()}`,
      employeeId: shiftForm.employeeId,
      date: shiftForm.date,
      type: shiftForm.type,
      start: `${shiftForm.date}T${config.startTime}:00`,
      end: `${shiftForm.date}T${config.endTime}:00`,
      totalHours: config.totalHours,
      status: 'scheduled',
      breakTaken: false
    };

    // 3. Filter out the shift being edited from existing shifts to avoid self-collision
    const otherShifts = shifts.filter(s => s.id !== proposedShift.id);
    
    // 4. Filter for specific employee
    const employeeShifts = otherShifts.filter(s => s.employeeId === shiftForm.employeeId);

    // 5. CRITICAL: Filter for the SPECIFIC WEEK of the proposed shift
    // Calculating weekly hours requires us to sum only the hours in the relevant week window.
    // We assume Sunday is the start of the week.
    const [y, m, d] = proposedShift.date.split('-').map(Number);
    const pDate = new Date(y, m - 1, d); // Local midnight
    
    const startOfWeek = new Date(pDate);
    startOfWeek.setDate(pDate.getDate() - pDate.getDay()); // Sunday
    startOfWeek.setHours(0,0,0,0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 7); // Next Sunday

    const currentWeekShifts = employeeShifts.filter(s => {
        const [sy, sm, sd] = s.date.split('-').map(Number);
        const sDate = new Date(sy, sm - 1, sd);
        return sDate >= startOfWeek && sDate < endOfWeek;
    });
    
    // 6. Validate against Labor Laws
    const check = ComplianceService.validateSchedule(proposedShift, currentWeekShifts);
    
    if (!check.valid) {
      setShiftError(check.errors);
      return;
    }

    setShifts([...otherShifts, proposedShift]);
    setShowShiftModal(false);
  };

  const handleDeleteShift = (id: string) => {
    if(confirm('Are you sure you want to delete this shift?')) {
      setShifts(shifts.filter(s => s.id !== id));
      setShowShiftModal(false);
    }
  };

  const openShiftModal = (dateStr: string, existingShift?: Shift) => {
    if (!canEdit) return;
    setShiftError([]);
    if (existingShift) {
      setShiftForm({
        id: existingShift.id,
        employeeId: existingShift.employeeId,
        date: existingShift.date,
        type: existingShift.type
      });
    } else {
      setShiftForm({
        employeeId: employees[0]?.id || '',
        date: dateStr,
        type: 'split'
      });
    }
    setShowShiftModal(true);
  };

  const handleCreateEmployee = () => {
    const newId = `emp-${Date.now()}`;
    const newEmployee: Employee = {
      ...employeeForm,
      id: newId,
      // Default values
      photoUrl: '',
      birthday: '1990-01-01', // Default for demo
      clothingSize: '',
      shoeSize: '',
      uniformSize: '',
      warnings: 0,
      praises: 0,
      guestCompliments: 0,
      guestComplaints: 0,
      absencesCount: 0,
      lateArrivalsCount: 0,
      holidaysEarned: 0,
      holidaysTaken: 0,
      overtimeBalance: 0
    } as Employee;

    setEmployees([...employees, newEmployee]);
    setShowEmployeeModal(false);
    setEmployeeForm(initialEmployeeForm);
  };

  // --- SUB-COMPONENTS ---

  const StaffDirectory = () => (
    <div className="space-y-4 animate-in fade-in">
      {canEdit && (
        <div className="flex justify-end gap-3">
           <button 
            onClick={() => openShiftModal(new Date().toISOString().split('T')[0])}
            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-indigo-700 shadow-sm"
          >
            <CalendarPlus size={18} /> New Shift
          </button>
          <button 
            onClick={() => setShowEmployeeModal(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-blue-700 shadow-sm"
          >
            <UserPlus size={18} /> Add New Employee
          </button>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {employees.map((emp) => (
          <div key={emp.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
            <div className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border border-gray-200">
                  {emp.photoUrl ? (
                    <img src={emp.photoUrl} alt="profile" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-gray-500 font-bold text-lg">{emp.firstName[0]}{emp.lastName[0]}</span>
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">{emp.firstName} {emp.lastName}</h3>
                  <p className="text-sm text-blue-600 font-medium flex items-center gap-1">
                    <Briefcase size={12} /> {emp.jobTitle}
                  </p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm text-gray-600 bg-gray-50 p-2 rounded">
                  <Phone size={16} className="text-gray-400" />
                  <span>{emp.phone || 'N/A'}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600 bg-gray-50 p-2 rounded">
                  <Mail size={16} className="text-gray-400" />
                  <span className="truncate">{emp.email || 'N/A'}</span>
                </div>
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
    </div>
  );

  const DayCell = ({ date, isCurrentMonth = true }: { date: Date, isCurrentMonth?: boolean, key?: React.Key }) => {
    // Fix timezone offset for string comparison
    const dateStr = `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    
    const dayEvents = events.filter(e => e.date === dateStr);
    const dayShifts = shifts.filter(s => s.date === dateStr);
    const isToday = new Date().toDateString() === date.toDateString();

    return (
      <div 
        className={`min-h-[120px] border border-gray-100 p-2 transition-colors relative group
          ${isCurrentMonth ? 'bg-white hover:bg-gray-50' : 'bg-gray-50/50 text-gray-400'}
        `}
        onClick={() => {
          // Quick add shift if manager clicks empty space
          if (canEdit) openShiftModal(dateStr);
        }}
      >
        <div className="flex justify-between items-start mb-1">
          <span className={`text-sm font-semibold w-7 h-7 flex items-center justify-center rounded-full ${isToday ? 'bg-blue-600 text-white' : ''}`}>
            {date.getDate()}
          </span>
          {canEdit && (
             <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={(e) => { e.stopPropagation(); setNewEvent({...newEvent, date: dateStr}); setShowEventModal(true); }}
                  className="p-1 hover:bg-blue-100 text-blue-600 rounded"
                  title="Add Event"
                >
                  <Plus size={14} />
                </button>
             </div>
          )}
        </div>

        <div className="space-y-1">
          {/* Events */}
          {dayEvents.map(evt => (
            <div key={evt.id} className={`text-xs px-1.5 py-0.5 rounded border truncate font-medium
              ${evt.type === 'meeting' ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 
                evt.type === 'deadline' ? 'bg-red-50 border-red-200 text-red-700' :
                'bg-gray-100 border-gray-200 text-gray-700'}
            `}>
              {evt.title}
            </div>
          ))}

          {/* Shifts */}
          {dayShifts.map(shift => {
            const emp = getEmployee(shift.employeeId);
            return (
              <div 
                key={shift.id} 
                onClick={(e) => {
                  e.stopPropagation();
                  openShiftModal(dateStr, shift);
                }}
                className={`text-xs px-1.5 py-1 rounded border flex items-center gap-1 cursor-pointer hover:opacity-80
                  ${shift.employeeId === user?.id ? 'bg-green-50 border-green-200 text-green-700' : 'bg-blue-50 border-blue-200 text-blue-700'}
                `}
              >
                <Clock size={10} />
                <span className="font-bold">{emp?.firstName}</span>
                <span className="opacity-75 hidden sm:inline">: {shift.type}</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const CalendarHeader = () => (
    <div className="grid grid-cols-7 text-center border-b border-gray-200 bg-gray-100 text-xs font-semibold text-gray-500 py-2 uppercase">
      <div>Sun</div><div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div>
    </div>
  );

  const MonthView = () => {
    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
    const days = [];

    // Padding
    for (let i = 0; i < firstDay; i++) {
      const prevDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0 - (firstDay - 1 - i));
      days.push(<DayCell key={`prev-${i}`} date={prevDate} isCurrentMonth={false} />);
    }
    // Days
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), i);
      days.push(<DayCell key={i} date={date} />);
    }

    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden animate-in fade-in">
        <CalendarHeader />
        <div className="grid grid-cols-7 bg-gray-200 gap-px">
          {days}
        </div>
      </div>
    );
  };

  const WeekView = () => {
    const weekDates = getWeekRange(currentDate);
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden animate-in fade-in">
        <CalendarHeader />
        <div className="grid grid-cols-7 bg-gray-200 gap-px">
          {weekDates.map((date, i) => (
             <div key={i} className="bg-white min-h-[400px]">
               <DayCell date={date} />
             </div>
          ))}
        </div>
      </div>
    );
  };

  // --- RENDER ---

  const monthLabel = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-200">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Planning & Schedule</h2>
          <p className="text-gray-500 text-sm">Manage shifts, events, and staff overview.</p>
        </div>

        <div className="flex items-center gap-4">
           {canEdit && activeTab !== 'directory' && (
             <button 
                onClick={() => openShiftModal(new Date().toISOString().split('T')[0])}
                className="flex items-center gap-2 bg-indigo-600 text-white px-3 py-1.5 rounded-lg font-bold hover:bg-indigo-700 shadow-sm text-sm"
              >
                <CalendarPlus size={16} /> Add Shift
              </button>
           )}

          {activeTab !== 'directory' && (
            <div className="flex items-center bg-gray-50 rounded-lg p-1 border border-gray-200">
              <button onClick={handlePrev} className="p-2 hover:bg-white hover:shadow-sm rounded-md transition-all"><ChevronLeft size={18} /></button>
              <span className="px-4 font-bold text-gray-700 min-w-[140px] text-center">{monthLabel}</span>
              <button onClick={handleNext} className="p-2 hover:bg-white hover:shadow-sm rounded-md transition-all"><ChevronRight size={18} /></button>
            </div>
          )}

          <div className="flex bg-gray-100 p-1 rounded-lg">
            <button 
              onClick={() => setActiveTab('month')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${activeTab === 'month' ? 'bg-white shadow text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Month
            </button>
            <button 
              onClick={() => setActiveTab('week')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${activeTab === 'week' ? 'bg-white shadow text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Week
            </button>
            <button 
              onClick={() => setActiveTab('directory')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${activeTab === 'directory' ? 'bg-white shadow text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Staff
            </button>
          </div>
        </div>
      </div>

      {activeTab === 'directory' ? <StaffDirectory /> : (
         activeTab === 'month' ? <MonthView /> : <WeekView />
      )}

      {/* --- MODALS --- */}

      {/* Add Planning Event Modal */}
      {showEventModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <h3 className="text-lg font-bold mb-4">Add Planning Event</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input 
                  type="date" 
                  value={newEvent.date}
                  onChange={(e) => setNewEvent({...newEvent, date: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input 
                  type="text" 
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select 
                  value={newEvent.type}
                  onChange={(e) => setNewEvent({...newEvent, type: e.target.value as any})}
                  className="w-full p-2 border border-gray-300 rounded"
                >
                  <option value="meeting">Meeting</option>
                  <option value="training">Training</option>
                  <option value="deadline">Deadline</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
            <div className="mt-6 flex gap-3">
              <button onClick={handleAddEvent} className="flex-1 bg-blue-600 text-white font-bold py-2 rounded hover:bg-blue-700">Save</button>
              <button onClick={() => setShowEventModal(false)} className="flex-1 bg-gray-100 text-gray-700 font-bold py-2 rounded hover:bg-gray-200">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Manage Shift Modal */}
      {showShiftModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 animate-in zoom-in-95">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <Clock className="text-blue-600" /> 
                {shiftForm.id ? 'Edit Shift' : 'Add Shift'}
              </h3>
              {shiftForm.id && (
                <button 
                  onClick={() => handleDeleteShift(shiftForm.id!)}
                  className="text-red-500 hover:bg-red-50 p-2 rounded"
                  title="Delete Shift"
                >
                  <Trash2 size={18} />
                </button>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Employee</label>
                <select 
                  value={shiftForm.employeeId}
                  onChange={(e) => setShiftForm({...shiftForm, employeeId: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded bg-white"
                >
                  <option value="">Select Employee</option>
                  {employees.map(emp => (
                    <option key={emp.id} value={emp.id}>{emp.firstName} {emp.lastName}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input 
                  type="date" 
                  value={shiftForm.date}
                  onChange={(e) => setShiftForm({...shiftForm, date: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Shift Type</label>
                <select 
                  value={shiftForm.type}
                  onChange={(e) => setShiftForm({...shiftForm, type: e.target.value as ChefShiftType})}
                  className="w-full p-2 border border-gray-300 rounded bg-white"
                >
                   {Object.entries(CHEF_SHIFTS).map(([key, config]) => (
                    <option key={key} value={key}>
                      {key.toUpperCase().replace('_', ' ')} ({config.startTime}-{config.endTime})
                    </option>
                  ))}
                </select>
              </div>

              {/* Compliance Errors */}
              {shiftError.length > 0 && (
                <div className="bg-red-50 p-3 rounded border border-red-200 text-sm text-red-700">
                  <div className="flex items-center gap-2 font-bold mb-1">
                    <AlertTriangle size={16} /> Compliance Issues
                  </div>
                  <ul className="list-disc list-inside text-xs space-y-1">
                    {shiftError.map((err, i) => <li key={i}>{err}</li>)}
                  </ul>
                </div>
              )}
            </div>

            <div className="mt-6 flex gap-3">
              <button 
                onClick={handleSaveShift} 
                className="flex-1 bg-blue-600 text-white font-bold py-2 rounded hover:bg-blue-700 shadow-sm"
              >
                {shiftForm.id ? 'Update Shift' : 'Create Shift'}
              </button>
              <button 
                onClick={() => setShowShiftModal(false)} 
                className="flex-1 bg-gray-100 text-gray-700 font-bold py-2 rounded hover:bg-gray-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CREATE EMPLOYEE MODAL (Manager Only) */}
      {showEmployeeModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl p-6 animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
             <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold flex items-center gap-2 text-gray-900">
                  <UserPlus className="text-blue-600" /> New Employee Onboarding
                </h3>
                <button onClick={() => setShowEmployeeModal(false)} className="text-gray-400 hover:text-gray-600">
                  <X size={24} />
                </button>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                   <h4 className="text-sm font-bold text-gray-500 uppercase border-b pb-2">Basic Info</h4>
                   <div>
                     <label className="block text-xs font-bold text-gray-700 mb-1">First Name</label>
                     <input type="text" className="w-full p-2 border rounded" value={employeeForm.firstName} onChange={e => setEmployeeForm({...employeeForm, firstName: e.target.value})} />
                   </div>
                   <div>
                     <label className="block text-xs font-bold text-gray-700 mb-1">Last Name</label>
                     <input type="text" className="w-full p-2 border rounded" value={employeeForm.lastName} onChange={e => setEmployeeForm({...employeeForm, lastName: e.target.value})} />
                   </div>
                   <div>
                     <label className="block text-xs font-bold text-gray-700 mb-1">Email</label>
                     <input type="email" className="w-full p-2 border rounded" value={employeeForm.email} onChange={e => setEmployeeForm({...employeeForm, email: e.target.value})} />
                   </div>
                   <div>
                     <label className="block text-xs font-bold text-gray-700 mb-1">Phone</label>
                     <input type="tel" className="w-full p-2 border rounded" value={employeeForm.phone} onChange={e => setEmployeeForm({...employeeForm, phone: e.target.value})} />
                   </div>
                </div>

                <div className="space-y-4">
                   <h4 className="text-sm font-bold text-gray-500 uppercase border-b pb-2">Employment Details</h4>
                   <div>
                     <label className="block text-xs font-bold text-gray-700 mb-1">Role</label>
                     <select className="w-full p-2 border rounded" value={employeeForm.role} onChange={e => setEmployeeForm({...employeeForm, role: e.target.value as UserRole})}>
                        <option value={UserRole.STAFF}>Staff</option>
                        <option value={UserRole.SUPERVISOR}>Supervisor</option>
                        <option value={UserRole.MANAGER}>Manager</option>
                     </select>
                   </div>
                   <div>
                     <label className="block text-xs font-bold text-gray-700 mb-1">Department</label>
                     <input type="text" className="w-full p-2 border rounded" value={employeeForm.department} onChange={e => setEmployeeForm({...employeeForm, department: e.target.value})} />
                   </div>
                   <div>
                     <label className="block text-xs font-bold text-gray-700 mb-1">Job Title</label>
                     <input type="text" className="w-full p-2 border rounded" value={employeeForm.jobTitle} onChange={e => setEmployeeForm({...employeeForm, jobTitle: e.target.value})} />
                   </div>
                   <div>
                     <label className="block text-xs font-bold text-gray-700 mb-1">ID Number</label>
                     <input type="text" className="w-full p-2 border rounded" value={employeeForm.idNumber} onChange={e => setEmployeeForm({...employeeForm, idNumber: e.target.value})} />
                   </div>
                </div>
             </div>

             <div className="mt-6 pt-6 border-t border-gray-100 flex justify-end gap-3">
               <button onClick={() => setShowEmployeeModal(false)} className="px-6 py-2 bg-gray-100 text-gray-700 font-bold rounded hover:bg-gray-200">Cancel</button>
               <button onClick={handleCreateEmployee} className="px-6 py-2 bg-green-600 text-white font-bold rounded hover:bg-green-700 shadow">Create Employee Card</button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}