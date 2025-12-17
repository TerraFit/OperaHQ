
import React, { useState, useContext, useEffect } from 'react';
import { AppContext } from '../App';
import { MaintenanceService } from '../services/maintenanceService';
import { MOCK_MAINTENANCE_TASKS, MOCK_ASSIGNED_TASKS } from '../services/mockMaintenanceData';
import { MaintenanceTask, MaintenanceLog, MaintenanceFrequency, AssignedTask, UserRole, WeatherData } from '../types';
import MaintenancePlanning from './MaintenancePlanning';
import { 
  ClipboardList, 
  CheckCircle, 
  Circle, 
  AlertTriangle, 
  Scale, 
  Clock, 
  Grape,
  Droplets,
  LayoutDashboard,
  Hammer,
  AlertOctagon,
  Camera,
  X,
  Wind,
  ThermometerSun,
  CloudRain
} from 'lucide-react';

interface TaskCardProps { 
  task: MaintenanceTask; 
  isCompleted: boolean; 
  onClick: (task: MaintenanceTask) => void;
  weather?: WeatherData;
}

const TaskCard: React.FC<TaskCardProps> = ({ 
  task, 
  isCompleted, 
  onClick,
  weather
}) => {
  // Check weather constraints if applicable
  let weatherWarning = null;
  if (task.weatherConstraints && weather) {
      const check = MaintenanceService.SummerVineyardRules.validateSprayWeatherConditions(weather);
      if (!check.valid) {
          weatherWarning = check.error;
      }
  }

  return (
    <div 
      onClick={() => !isCompleted && !weatherWarning && onClick(task)}
      className={`p-4 rounded-xl border mb-3 transition-all cursor-pointer flex items-center justify-between
        ${isCompleted 
          ? 'bg-green-50 border-green-200 opacity-75' 
          : weatherWarning 
            ? 'bg-gray-100 border-gray-200 opacity-60 cursor-not-allowed'
            : 'bg-white border-gray-200 hover:border-blue-300 hover:shadow-sm'
        }
      `}
    >
      <div className="flex items-start gap-3">
        {isCompleted ? <CheckCircle className="text-green-600 mt-1" size={20} /> : <Circle className="text-gray-300 mt-1" size={20} />}
        <div className="flex-1">
           <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono font-bold text-gray-400">{task.code}</span>
              <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded
                ${task.area === 'zebra_lodge' ? 'bg-orange-100 text-orange-700' : 
                  task.area === 'private_area' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}
              `}>{task.area.replace('_', ' ')}</span>
              {task.conditionalRequirements && (
                 <span className="text-[10px] bg-yellow-100 text-yellow-800 px-1.5 py-0.5 rounded flex items-center gap-1">
                   <AlertTriangle size={10} /> Conditional
                 </span>
              )}
              {task.category === 'vineyard' && (
                  <span className="text-[10px] bg-purple-100 text-purple-800 px-1.5 py-0.5 rounded flex items-center gap-1 font-bold">
                      <Grape size={10} /> Vineyard
                  </span>
              )}
           </div>
           <p className={`font-medium text-sm ${isCompleted ? 'text-gray-500 line-through' : 'text-gray-900'}`}>{task.description}</p>
           <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
             <span className="flex items-center gap-1"><Clock size={12} /> {task.estimatedMinutes} min</span>
             {task.requiresMeasurement && <span className="flex items-center gap-1 text-blue-600 font-bold"><Scale size={12} /> Measurement Req.</span>}
             {task.requiresTcrMethod && <span className="flex items-center gap-1 text-indigo-600 font-bold"><Droplets size={12} /> TCR Method</span>}
           </div>
           
           {weatherWarning && (
               <div className="mt-2 text-xs text-red-600 font-bold flex items-center gap-1 bg-red-50 p-1.5 rounded">
                   <AlertOctagon size={12} /> {weatherWarning}
               </div>
           )}
        </div>
      </div>
      {!isCompleted && !weatherWarning && <div className="text-gray-300"><ClipboardList size={20} /></div>}
    </div>
  );
};

// NEW: Assigned Task Card for Employees
interface AssignedTaskCardProps {
    task: AssignedTask;
    onClick: (t: AssignedTask) => void;
}

const AssignedTaskCard: React.FC<AssignedTaskCardProps> = ({ task, onClick }) => {
    return (
        <div 
            onClick={() => onClick(task)}
            className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:border-blue-400 cursor-pointer mb-3 relative overflow-hidden"
        >
            <div className={`absolute top-0 left-0 w-1 h-full ${
                task.priority === 'emergency' ? 'bg-red-500' : 
                task.priority === 'high' ? 'bg-orange-500' : 'bg-blue-500'
            }`}></div>
            
            <div className="pl-3">
                <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold text-gray-900">{task.title}</h4>
                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                         task.priority === 'emergency' ? 'bg-red-100 text-red-700' : 
                         task.priority === 'high' ? 'bg-orange-100 text-orange-700' : 'bg-blue-50 text-blue-700'
                    }`}>{task.priority}</span>
                </div>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{task.description}</p>
                
                <div className="flex justify-between items-end">
                    <div className="text-xs text-gray-500">
                        Due: {task.dueTime}
                        {task.machinesRequired && task.machinesRequired.length > 0 && (
                            <div className="flex gap-1 mt-1">
                                {task.machinesRequired.map(m => (
                                    <span key={m} className="bg-gray-100 text-gray-600 px-1.5 rounded capitalize">{m.replace('_', ' ')}</span>
                                ))}
                            </div>
                        )}
                    </div>
                    <div className="text-right">
                        <div className="text-lg font-bold text-blue-600">{task.progress}%</div>
                        <div className="text-[10px] text-gray-400 uppercase">Progress</div>
                    </div>
                </div>
                
                <div className="w-full bg-gray-100 h-1.5 rounded-full mt-3">
                    <div className="bg-blue-600 h-1.5 rounded-full transition-all" style={{width: `${task.progress}%`}}></div>
                </div>
            </div>
        </div>
    );
};

export default function MaintenanceModule() {
  const { user, mockTime } = useContext(AppContext);
  const [activeTab, setActiveTab] = useState<MaintenanceFrequency | 'TODAY' | 'VINEYARD'>('TODAY');
  const [logs, setLogs] = useState<MaintenanceLog[]>([]);
  
  // View Mode: 'staff' (Execution) or 'manager' (Planning)
  const [viewMode, setViewMode] = useState<'staff' | 'manager'>(user?.role === UserRole.STAFF ? 'staff' : 'manager');

  // Vineyard State
  const [vineyardPhase, setVineyardPhase] = useState<string>('dormant');
  
  // Weather State (Mock)
  const [weather, setWeather] = useState<WeatherData>({
      temperature: 24,
      windSpeed: 10,
      isRaining: false,
      rainLast24Hours: 0
  });
  
  // Modal State
  const [selectedTask, setSelectedTask] = useState<MaintenanceTask | null>(null);
  const [selectedAssignedTask, setSelectedAssignedTask] = useState<AssignedTask | null>(null);
  const [formState, setFormState] = useState<any>({});
  
  // New: Progress Tracking State
  const [progressUpdate, setProgressUpdate] = useState<{val: number, notes: string}>({ val: 0, notes: '' });
  
  // Machine Validation State
  const [machinePopup, setMachinePopup] = useState<{
      open: boolean;
      machine: string;
      result: { allowed: boolean; level: string; message: string; actions: string[] };
  } | null>(null);

  // Data for View
  const todayTasks = MaintenanceService.getTasksForDate(mockTime);
  const vineyardTasks = MaintenanceService.getTasksByFrequency('SUMMER_SEASONAL');
  
  const filteredTasks = activeTab === 'TODAY' ? todayTasks 
    : activeTab === 'VINEYARD' ? vineyardTasks
    : MOCK_MAINTENANCE_TASKS.filter(t => t.frequency === activeTab);
    
  // Assigned Tasks for Current User
  const myAssignedTasks = MOCK_ASSIGNED_TASKS.filter(t => t.assignedTo === user?.id);

  const handleTaskClick = (task: MaintenanceTask) => {
    setSelectedTask(task);
    setFormState({}); // Reset form
  };

  const handleAssignedTaskClick = (task: AssignedTask) => {
      setSelectedAssignedTask(task);
      // Initialize progress state
      setProgressUpdate({
          val: task.progress,
          notes: task.milestones?.[task.progress]?.notes || ''
      });
  };

  const handleCompleteTask = () => {
    if (!user || !selectedTask) return;

    // Additional Validation for Vineyard Tasks
    if (selectedTask.category === 'vineyard') {
        const { measurementsRequired } = selectedTask;
        if (measurementsRequired) {
            if (measurementsRequired.includes('shoot_length')) {
               const check = MaintenanceService.SummerVineyardRules.validateShootTrimmingHeight(Number(formState.shootLengthAfter));
               if (!check.valid) {
                   alert(check.error);
                   return;
               }
            }
            if (measurementsRequired.includes('grass_height')) {
                const check = MaintenanceService.SummerVineyardRules.validateMowingHeight(Number(formState.grassHeightBefore), Number(formState.grassHeightAfter));
                if (!check.valid) {
                    alert(check.error);
                    return;
                }
            }
        }
        if (selectedTask.requiresPhoto && !formState.photoUrl) {
            alert("Photo documentation required for this task.");
            return;
        }
    }

    const newLog: MaintenanceLog = {
      id: `log-${Date.now()}`,
      taskId: selectedTask.id,
      taskCode: selectedTask.code,
      userId: user.id,
      date: mockTime.toISOString().split('T')[0],
      status: 'completed',
      completedAt: new Date().toISOString(),
      ...formState
    };

    setLogs([...logs, newLog]);
    setSelectedTask(null);
  };
  
  const handleSaveProgress = () => {
      if (!selectedAssignedTask) return;
      
      // Mutate mock object (in real app, API call)
      selectedAssignedTask.progress = progressUpdate.val;
      selectedAssignedTask.status = progressUpdate.val === 100 ? 'completed' : 'in_progress';
      
      if (!selectedAssignedTask.milestones) selectedAssignedTask.milestones = {};
      
      // Update milestones map
      selectedAssignedTask.milestones[progressUpdate.val] = {
          completedAt: new Date().toISOString(),
          notes: progressUpdate.notes
      };
      
      setSelectedAssignedTask(null); // Close modal
  };

  const handleMachineCheck = (machine: string) => {
      if (!user) return;
      // Trigger validation popup
      const check = MaintenanceService.validateMachineAccess(user.id, machine as any);
      setMachinePopup({
          open: true,
          machine,
          result: check
      });
  };

  const isCompleted = (taskId: string) => {
    const dateStr = mockTime.toISOString().split('T')[0];
    return MaintenanceService.isTaskCompleted(taskId, dateStr, logs);
  };

  // MANAGER VIEW
  if (viewMode === 'manager') {
      return (
          <div className="space-y-6 animate-in fade-in">
             <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Maintenance Management</h2>
                <div className="flex bg-gray-100 p-1 rounded-lg">
                    <button onClick={() => setViewMode('manager')} className="px-4 py-2 bg-white shadow-sm rounded-md text-sm font-bold text-blue-600">Planning</button>
                    <button onClick={() => setViewMode('staff')} className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700">My Tasks</button>
                </div>
             </div>
             <MaintenancePlanning />
          </div>
      );
  }

  // STAFF VIEW
  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <ClipboardList className="text-blue-600" /> Maintenance Routine
          </h2>
          <p className="text-gray-500 text-sm mt-1">SOP 9.9.1 Operational Compliance • {mockTime.toDateString()}</p>
        </div>
        
        <div className="flex items-center gap-4">
            {(user?.role === UserRole.MANAGER || user?.role === UserRole.ADMIN) && (
                 <button onClick={() => setViewMode('manager')} className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2">
                     <LayoutDashboard size={16} /> Manager View
                 </button>
            )}
            <div className="flex items-center gap-2">
            <select 
                className="bg-gray-100 border border-gray-200 rounded-lg text-sm p-2 font-medium"
                value={vineyardPhase}
                onChange={(e) => setVineyardPhase(e.target.value)}
            >
                <option value="dormant">Vineyard: Dormant</option>
                <option value="after_first_leaves">Vineyard: First Leaves</option>
                <option value="spring">Vineyard: Spring</option>
                <option value="harvest">Vineyard: Harvest</option>
            </select>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT COLUMN: ASSIGNED TASKS (PRIORITY) */}
          <div className="lg:col-span-1 space-y-4">
              <h3 className="font-bold text-gray-800 flex items-center gap-2 border-b pb-2">
                  <AlertTriangle className="text-orange-500" size={18} /> 
                  My Assigned Tasks ({myAssignedTasks.length})
              </h3>
              
              {myAssignedTasks.length === 0 ? (
                  <div className="p-6 bg-gray-50 rounded-xl border border-dashed border-gray-200 text-center text-gray-400 text-sm">
                      No high priority assignments.
                  </div>
              ) : (
                  myAssignedTasks.map(t => (
                      <AssignedTaskCard key={t.id} task={t} onClick={handleAssignedTaskClick} />
                  ))
              )}
          </div>

          {/* RIGHT COLUMN: ROUTINE TASKS */}
          <div className="lg:col-span-2 space-y-4">
              <div className="flex justify-between items-center border-b pb-2">
                  <h3 className="font-bold text-gray-800 flex items-center gap-2">
                      <ClipboardList className="text-blue-500" size={18} /> 
                      Routine Checklist
                  </h3>
                  
                  {activeTab === 'VINEYARD' && (
                      <div className="flex items-center gap-3 text-xs bg-purple-50 px-3 py-1 rounded-full text-purple-800 border border-purple-100">
                          <span className="flex items-center gap-1"><ThermometerSun size={12} /> {weather.temperature}°C</span>
                          <span className="flex items-center gap-1"><Wind size={12} /> {weather.windSpeed}km/h</span>
                          <span className="flex items-center gap-1"><CloudRain size={12} /> {weather.isRaining ? 'Rain' : 'Dry'}</span>
                      </div>
                  )}
              </div>
              
              {/* Tabs */}
                <div className="flex overflow-x-auto pb-2 gap-2 hide-scrollbar">
                    {['TODAY', 'VINEYARD', 'DAILY', 'WEEKLY', 'EVERY_TWO_WEEKS', 'MONTHLY', 'PERIODICALLY'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab as any)}
                        className={`px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-colors flex items-center gap-2
                        ${activeTab === tab 
                            ? tab === 'VINEYARD' ? 'bg-purple-600 text-white shadow-md' : 'bg-blue-600 text-white shadow-md' 
                            : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'}
                        `}
                    >
                        {tab === 'VINEYARD' && <Grape size={14} />}
                        {tab.replace(/_/g, ' ')}
                    </button>
                    ))}
                </div>

                {/* Routine List */}
                <div className="space-y-1">
                    {filteredTasks.length === 0 ? (
                    <div className="p-8 text-center text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                        No tasks scheduled for this view.
                    </div>
                    ) : (
                    filteredTasks.map(task => (
                        <TaskCard 
                        key={task.id} 
                        task={task} 
                        isCompleted={isCompleted(task.id)}
                        onClick={handleTaskClick} 
                        weather={weather}
                        />
                    ))
                    )}
                </div>
          </div>
      </div>

      {/* ROUTINE TASK EXECUTION MODAL */}
      {selectedTask && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden animate-in zoom-in-95">
             <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
               <h3 className="font-bold text-gray-900">Execute Task</h3>
               <div className="text-xs font-mono text-gray-400">{selectedTask.code}</div>
             </div>
             
             <div className="p-6 max-h-[70vh] overflow-y-auto">
                <div className="mb-6">
                    <p className="text-lg font-medium text-gray-900">{selectedTask.description}</p>
                    {selectedTask.category === 'vineyard' && (
                        <div className="mt-2 text-xs text-purple-700 bg-purple-50 p-2 rounded border border-purple-100">
                            <strong>Seasonal Task:</strong> Adhere to summer trimming limits.
                        </div>
                    )}
                </div>
                
                {/* DYNAMIC FORM FIELDS */}
                <div className="space-y-4">
                   {/* GAS BOTTLE FORM */}
                   {selectedTask.requiresMeasurement && selectedTask.code === 'ZL-WEEKLY-002' && (
                     <div className="bg-yellow-50 p-4 rounded border border-yellow-200 space-y-3">
                        <h4 className="font-bold text-yellow-800 flex items-center gap-2"><Scale size={16} /> Electronic Scale Measurement</h4>
                        <div>
                          <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Bottle ID</label>
                          <input type="text" className="w-full p-2 border rounded" placeholder="e.g. GB-01" onChange={e => setFormState({...formState, bottleId: e.target.value})} />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Weight (kg)</label>
                          <input type="number" className="w-full p-2 border rounded" placeholder="0.00" onChange={e => setFormState({...formState, currentWeight: parseFloat(e.target.value)})} />
                        </div>
                     </div>
                   )}

                   {/* VINEYARD MEASUREMENTS */}
                   {selectedTask.measurementsRequired && (
                       <div className="bg-purple-50 p-4 rounded border border-purple-200 space-y-3">
                           <h4 className="font-bold text-purple-800 flex items-center gap-2"><Scale size={16} /> Required Measurements</h4>
                           
                           {selectedTask.measurementsRequired.includes('shoot_length') && (
                               <>
                                   <div>
                                       <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Shoot Length After Trim (cm)</label>
                                       <input type="number" className="w-full p-2 border rounded" placeholder="Max 15cm" onChange={e => setFormState({...formState, shootLengthAfter: e.target.value})} />
                                   </div>
                               </>
                           )}
                           
                           {selectedTask.measurementsRequired.includes('grass_height') && (
                               <>
                                   <div>
                                       <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Grass Height Before (cm)</label>
                                       <input type="number" className="w-full p-2 border rounded" onChange={e => setFormState({...formState, grassHeightBefore: e.target.value})} />
                                   </div>
                                   <div>
                                       <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Grass Height After (cm)</label>
                                       <input type="number" className="w-full p-2 border rounded" placeholder="Min 5cm" onChange={e => setFormState({...formState, grassHeightAfter: e.target.value})} />
                                   </div>
                               </>
                           )}
                       </div>
                   )}

                   {/* PHOTO UPLOAD */}
                   {selectedTask.requiresPhoto && (
                       <div className="bg-gray-50 p-4 rounded border border-gray-200">
                           <h4 className="font-bold text-gray-800 mb-2 flex items-center gap-2"><Camera size={16} /> Photo Evidence Required</h4>
                           <button className="w-full bg-white border border-gray-300 py-2 rounded text-sm font-bold text-gray-600 hover:bg-gray-50 flex items-center justify-center gap-2"
                               onClick={() => setFormState({...formState, photoUrl: 'data:image/mock'})} // Mock capture
                           >
                               <Camera size={16} /> {formState.photoUrl ? 'Photo Captured' : 'Take Photo'}
                           </button>
                       </div>
                   )}

                   {/* PPE CHECKLIST */}
                   {selectedTask.ppeRequired && (
                       <div className="bg-blue-50 p-4 rounded border border-blue-200">
                           <h4 className="font-bold text-blue-800 mb-2 text-xs uppercase">PPE Compliance Check</h4>
                           <div className="grid grid-cols-2 gap-2">
                               {selectedTask.ppeRequired.map(ppe => (
                                   <label key={ppe} className="flex items-center gap-2 text-xs">
                                       <input type="checkbox" className="rounded" /> {ppe.replace('_', ' ')}
                                   </label>
                               ))}
                           </div>
                       </div>
                   )}

                   {/* TIME LOGGING FORM */}
                   {selectedTask.requiresTimeLogging && (
                     <div className="bg-blue-50 p-4 rounded border border-blue-200">
                        <h4 className="font-bold text-blue-800 mb-2 flex items-center gap-2"><Clock size={16} /> Time Log Required</h4>
                        <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Hours Spent</label>
                        <input type="number" step="0.5" className="w-full p-2 border rounded bg-white" placeholder="e.g. 2.5" onChange={e => setFormState({...formState, timeSpentHours: parseFloat(e.target.value)})} />
                        <p className="text-xs text-blue-600 mt-2">Log exact time for payroll and audit.</p>
                     </div>
                   )}
                   
                   {/* STANDARD NOTES */}
                   <div>
                     <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Notes / Issues Found</label>
                     <textarea className="w-full p-2 border border-gray-300 rounded h-24" placeholder="Describe any issues..." onChange={e => setFormState({...formState, notes: e.target.value})}></textarea>
                   </div>
                </div>
             </div>

             <div className="p-6 border-t border-gray-100 flex gap-3">
               <button onClick={handleCompleteTask} className="flex-1 bg-green-600 text-white font-bold py-3 rounded hover:bg-green-700 shadow-sm">
                 Confirm Completion
               </button>
               <button onClick={() => setSelectedTask(null)} className="flex-1 bg-gray-100 text-gray-700 font-bold py-3 rounded hover:bg-gray-200">
                 Cancel
               </button>
             </div>
          </div>
        </div>
      )}

      {/* ASSIGNED TASK PROGRESS MODAL */}
      {selectedAssignedTask && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden animate-in zoom-in-95">
                <div className="bg-blue-600 p-6 text-white flex justify-between items-start">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs bg-white/20 px-2 py-0.5 rounded font-bold uppercase">{selectedAssignedTask.priority}</span>
                            <span className="text-xs opacity-75">Due: {selectedAssignedTask.dueTime}</span>
                        </div>
                        <h3 className="text-xl font-bold">{selectedAssignedTask.title}</h3>
                    </div>
                    <button onClick={() => setSelectedAssignedTask(null)} className="text-white/80 hover:text-white"><X size={24} /></button>
                </div>

                <div className="p-6 space-y-6">
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 text-sm text-gray-700">
                        {selectedAssignedTask.description}
                    </div>

                    {/* Machine Usage */}
                    {selectedAssignedTask.machinesRequired && selectedAssignedTask.machinesRequired.length > 0 && (
                        <div>
                            <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2"><Hammer size={16} /> Machines Required</h4>
                            <div className="flex gap-2">
                                {selectedAssignedTask.machinesRequired.map(m => (
                                    <button 
                                        key={m}
                                        onClick={() => handleMachineCheck(m)} 
                                        className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded text-sm font-medium capitalize"
                                    >
                                        {m.replace('_', ' ')}
                                    </button>
                                ))}
                            </div>
                            <p className="text-xs text-gray-400 mt-1">Click machine to verify certification status.</p>
                        </div>
                    )}

                    {/* Progress Slider */}
                    <div>
                        <h4 className="font-bold text-gray-900 mb-3">Update Progress</h4>
                        <div className="flex justify-between items-center mb-2 px-2">
                            {[0, 25, 50, 75, 100].map(step => (
                                <button 
                                    key={step}
                                    onClick={() => setProgressUpdate({...progressUpdate, val: step})}
                                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs border-2 transition-all
                                        ${progressUpdate.val >= step 
                                            ? 'bg-blue-600 border-blue-600 text-white scale-110 shadow-md' 
                                            : 'bg-white border-gray-200 text-gray-400 hover:border-blue-300'}
                                    `}
                                >
                                    {step}
                                </button>
                            ))}
                        </div>
                        <div className="w-full bg-gray-100 h-2 rounded-full mt-2">
                            <div className="bg-blue-600 h-2 rounded-full transition-all" style={{width: `${progressUpdate.val}%`}}></div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Progress Notes</label>
                        <textarea 
                            className="w-full p-2 border border-gray-300 rounded h-20 text-sm" 
                            placeholder="Details about work done..."
                            value={progressUpdate.notes}
                            onChange={(e) => setProgressUpdate({...progressUpdate, notes: e.target.value})}
                        ></textarea>
                    </div>

                    <div className="flex gap-2">
                         <button className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-gray-200">
                             <Camera size={18} /> Add Photo
                         </button>
                         <button onClick={handleSaveProgress} className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700">
                             Save Update
                         </button>
                    </div>
                </div>
            </div>
        </div>
      )}

      {/* MACHINE VALIDATION POPUP */}
      {machinePopup && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[60] p-4">
              <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95">
                  <div className={`p-6 text-center ${
                      machinePopup.result.level === 'failed' || machinePopup.result.level === 'none' ? 'bg-red-50' : 
                      machinePopup.result.level === 'conditional' ? 'bg-yellow-50' : 'bg-green-50'
                  }`}>
                      <div className={`w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-4 ${
                          machinePopup.result.level === 'failed' || machinePopup.result.level === 'none' ? 'bg-red-100 text-red-600' : 
                          machinePopup.result.level === 'conditional' ? 'bg-yellow-100 text-yellow-600' : 'bg-green-100 text-green-600'
                      }`}>
                          <AlertOctagon size={32} />
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 mb-1 capitalize">{machinePopup.machine.replace('_', ' ')}</h3>
                      <div className="font-bold text-sm uppercase mb-2">{machinePopup.result.level}</div>
                      <p className="text-sm text-gray-600">{machinePopup.result.message}</p>
                  </div>
                  <div className="p-4 bg-gray-50 border-t border-gray-100">
                      <h4 className="text-xs font-bold text-gray-500 uppercase mb-2">Required Actions</h4>
                      <ul className="text-sm space-y-1 mb-4">
                          {machinePopup.result.actions.map(action => (
                              <li key={action} className="flex items-center gap-2">
                                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                                  {action.replace(/_/g, ' ')}
                              </li>
                          ))}
                      </ul>
                      <button 
                        onClick={() => setMachinePopup(null)}
                        className="w-full bg-white border border-gray-300 text-gray-700 font-bold py-2 rounded hover:bg-gray-50"
                      >
                          Acknowledge
                      </button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
}
