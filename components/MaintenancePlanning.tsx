
import React, { useState, useContext, useMemo } from 'react';
import { AppContext } from '../App';
import { MaintenanceService } from '../services/maintenanceService';
import { MOCK_ASSIGNED_TASKS } from '../services/mockMaintenanceData';
import { AssignedTask, MachineType, TaskPriority, Employee, MaintenanceTask } from '../types';
import { 
  CalendarRange, 
  Plus, 
  AlertTriangle, 
  CheckCircle, 
  User, 
  Filter, 
  FileText,
  AlertOctagon,
  Wrench
} from 'lucide-react';

export default function MaintenancePlanning() {
  const { employees } = useContext(AppContext);
  const [tasks, setTasks] = useState<AssignedTask[]>(MOCK_ASSIGNED_TASKS);
  const [filterDept, setFilterDept] = useState('all');
  const [showAssignModal, setShowAssignModal] = useState(false);

  // New Assignment Form State
  const [newTask, setNewTask] = useState<{
    title: string;
    description: string;
    priority: TaskPriority;
    assignedTo: string;
    dueDate: string;
    dueTime: string;
    machinesRequired: MachineType[];
  }>({
    title: '',
    description: '',
    priority: 'medium',
    assignedTo: '',
    dueDate: new Date().toISOString().split('T')[0],
    dueTime: '12:00',
    machinesRequired: []
  });

  const [machineValidation, setMachineValidation] = useState<{valid: boolean, error?: string} | null>(null);

  const handleAssignTask = () => {
    // Validate Machines
    if (newTask.machinesRequired.length > 0 && newTask.assignedTo) {
      for (const machine of newTask.machinesRequired) {
        const check = MaintenanceService.validateMachineAccess(newTask.assignedTo, machine);
        if (!check.allowed) {
          setMachineValidation({ valid: false, error: `${check.message}` });
          return;
        }
      }
    }

    const assignment: AssignedTask = {
      id: `at-${Date.now()}`,
      title: newTask.title,
      description: newTask.description,
      priority: newTask.priority,
      assignedTo: newTask.assignedTo,
      assignedBy: 'manager', // Mock
      assignedAt: new Date().toISOString(),
      dueDate: newTask.dueDate,
      dueTime: newTask.dueTime,
      machinesRequired: newTask.machinesRequired,
      status: 'assigned',
      progress: 0,
      milestones: {}
    };

    setTasks([...tasks, assignment]);
    setShowAssignModal(false);
    setMachineValidation(null);
    setNewTask({
        title: '', description: '', priority: 'medium', assignedTo: '', 
        dueDate: new Date().toISOString().split('T')[0], dueTime: '12:00', machinesRequired: []
    });
  };

  const getEmpName = (id: string) => {
    const e = employees.find(emp => emp.id === id);
    return e ? `${e.firstName} ${e.lastName}` : 'Unknown';
  };

  // Group Standard Tasks for Planning Grid
  const dailyTasks = useMemo(() => MaintenanceService.getTasksByFrequency('DAILY'), []);
  const weeklyTasks = useMemo(() => MaintenanceService.getTasksByFrequency('WEEKLY'), []);
  const biWeeklyTasks = useMemo(() => MaintenanceService.getTasksByFrequency('EVERY_TWO_WEEKS'), []);
  const monthlyTasks = useMemo(() => MaintenanceService.getTasksByFrequency('MONTHLY'), []);

  const TaskCardSmall: React.FC<{ t: MaintenanceTask }> = ({ t }) => (
    <div className="p-2 bg-gray-50 border border-gray-200 rounded text-xs mb-1 hover:border-blue-300 cursor-pointer">
      <div className="font-bold truncate">{t.description}</div>
      <div className="text-gray-500">{t.area} • {t.estimatedMinutes}m</div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start gap-4">
        <div>
           <h2 className="text-xl font-bold text-gray-900">Weekly Maintenance Planning</h2>
           <p className="text-sm text-gray-500">Assign tasks, manage resources, and plan routine maintenance.</p>
        </div>
        <div className="flex gap-2">
            <button onClick={() => setShowAssignModal(true)} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-blue-700">
                <Plus size={18} /> Assign Manual Task
            </button>
            <button className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg font-bold hover:bg-gray-50">
                <FileText size={18} /> Export PDF
            </button>
        </div>
      </div>

      {/* ACTIVE ASSIGNMENTS DASHBOARD */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
            <h3 className="font-bold text-gray-800 flex items-center gap-2">
                <Wrench size={18} className="text-blue-500" /> Active Assignments
            </h3>
            <div className="flex items-center gap-2 text-sm">
                <Filter size={14} className="text-gray-400" />
                <select className="bg-transparent border-none font-medium text-gray-600 focus:ring-0">
                    <option value="all">All Departments</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="grounds">Grounds</option>
                </select>
            </div>
        </div>
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 text-gray-500 font-semibold border-b border-gray-200">
                    <tr>
                        <th className="p-4">Task</th>
                        <th className="p-4">Priority</th>
                        <th className="p-4">Assigned To</th>
                        <th className="p-4">Due</th>
                        <th className="p-4">Status</th>
                        <th className="p-4">Progress</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {tasks.map(task => (
                        <tr key={task.id} className="hover:bg-gray-50">
                            <td className="p-4 font-medium text-gray-900">
                                {task.title}
                                <div className="text-xs text-gray-500 truncate max-w-[200px]">{task.description}</div>
                            </td>
                            <td className="p-4">
                                <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                                    task.priority === 'emergency' ? 'bg-red-100 text-red-700' :
                                    task.priority === 'high' ? 'bg-orange-100 text-orange-700' :
                                    'bg-blue-50 text-blue-700'
                                }`}>{task.priority}</span>
                            </td>
                            <td className="p-4">
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold">
                                        {getEmpName(task.assignedTo).charAt(0)}
                                    </div>
                                    {getEmpName(task.assignedTo)}
                                </div>
                            </td>
                            <td className="p-4">{task.dueDate} {task.dueTime}</td>
                            <td className="p-4 capitalize">{task.status.replace('_', ' ')}</td>
                            <td className="p-4">
                                <div className="w-24 bg-gray-200 rounded-full h-2">
                                    <div className="bg-blue-600 h-2 rounded-full" style={{width: `${task.progress}%`}}></div>
                                </div>
                                <span className="text-xs text-gray-500 mt-1 block">{task.progress}%</span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </div>

      {/* PLANNING GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="font-bold text-gray-800 mb-3 border-b pb-2">Daily Tasks</h3>
            <div className="space-y-1 h-96 overflow-y-auto pr-2">
                {dailyTasks.map(t => <TaskCardSmall key={t.id} t={t} />)}
            </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="font-bold text-gray-800 mb-3 border-b pb-2">Weekly Tasks</h3>
            <div className="space-y-1 h-96 overflow-y-auto pr-2">
                {weeklyTasks.map(t => <TaskCardSmall key={t.id} t={t} />)}
            </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="font-bold text-gray-800 mb-3 border-b pb-2">Bi-Weekly Tasks</h3>
            <div className="space-y-1 h-96 overflow-y-auto pr-2">
                {biWeeklyTasks.map(t => <TaskCardSmall key={t.id} t={t} />)}
            </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="font-bold text-gray-800 mb-3 border-b pb-2">Monthly Tasks</h3>
            <div className="space-y-1 h-96 overflow-y-auto pr-2">
                {monthlyTasks.map(t => <TaskCardSmall key={t.id} t={t} />)}
            </div>
        </div>
      </div>

      {/* ASSIGNMENT MODAL */}
      {showAssignModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden animate-in zoom-in-95">
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                    <h3 className="font-bold text-gray-900">Assign New Task</h3>
                    <button onClick={() => setShowAssignModal(false)} className="text-gray-400 hover:text-gray-600">×</button>
                </div>
                <div className="p-6 space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Task Title</label>
                        <input type="text" className="w-full p-2 border rounded" value={newTask.title} onChange={e => setNewTask({...newTask, title: e.target.value})} />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Description</label>
                        <textarea className="w-full p-2 border rounded h-20" value={newTask.description} onChange={e => setNewTask({...newTask, description: e.target.value})} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">Priority</label>
                            <select className="w-full p-2 border rounded" value={newTask.priority} onChange={e => setNewTask({...newTask, priority: e.target.value as TaskPriority})}>
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                                <option value="emergency">Emergency</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">Assign To</label>
                            <select className="w-full p-2 border rounded" value={newTask.assignedTo} onChange={e => setNewTask({...newTask, assignedTo: e.target.value})}>
                                <option value="">Select Employee...</option>
                                {employees.map(e => (
                                    <option key={e.id} value={e.id}>{e.firstName} {e.lastName} ({e.jobTitle})</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">Due Date</label>
                            <input type="date" className="w-full p-2 border rounded" value={newTask.dueDate} onChange={e => setNewTask({...newTask, dueDate: e.target.value})} />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">Time</label>
                            <input type="time" className="w-full p-2 border rounded" value={newTask.dueTime} onChange={e => setNewTask({...newTask, dueTime: e.target.value})} />
                        </div>
                    </div>
                    
                    <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Machines Required (Triggers SOP Validation)</label>
                        <div className="flex flex-wrap gap-2">
                            {['chainsaw', 'tractor', 'brush_cutter', 'generator'].map(m => (
                                <label key={m} className="flex items-center gap-2 text-sm bg-gray-50 px-3 py-2 rounded border cursor-pointer hover:bg-gray-100">
                                    <input 
                                        type="checkbox" 
                                        checked={newTask.machinesRequired.includes(m as MachineType)} 
                                        onChange={e => {
                                            if (e.target.checked) setNewTask({...newTask, machinesRequired: [...newTask.machinesRequired, m as MachineType]});
                                            else setNewTask({...newTask, machinesRequired: newTask.machinesRequired.filter(x => x !== m)});
                                        }}
                                    />
                                    <span className="capitalize">{m.replace('_', ' ')}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {machineValidation && (
                        <div className="p-3 bg-red-50 text-red-700 text-sm rounded border border-red-200 flex items-start gap-2">
                            <AlertOctagon size={16} className="mt-0.5" />
                            <div>
                                <span className="font-bold block">Assignment Blocked</span>
                                {machineValidation.error}
                            </div>
                        </div>
                    )}
                </div>
                <div className="p-6 border-t border-gray-100 flex justify-end gap-3">
                    <button onClick={() => setShowAssignModal(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded">Cancel</button>
                    <button onClick={handleAssignTask} className="px-4 py-2 bg-blue-600 text-white font-bold rounded hover:bg-blue-700">Assign Task</button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
}
