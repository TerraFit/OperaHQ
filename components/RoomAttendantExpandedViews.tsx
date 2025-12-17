
import React, { useState } from 'react';
import { 
  RoomAttendantCardType, 
  RoomAttendantExpandedData, 
  AssignedRoom, 
  AssignedAttendant,
  CompletedRoom,
  PriorityRoom,
  Escalation
} from '../types';
import { 
  Clock, 
  User, 
  AlertTriangle, 
  CheckCircle, 
  TrendingUp, 
  Activity,
  BarChart2
} from 'lucide-react';

interface ExpandedViewProps {
  cardType: RoomAttendantCardType;
  data: RoomAttendantExpandedData;
}

const formatTime = (isoString: string) => {
  return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const calculateTimeRemaining = (deadlineIso: string) => {
  const diff = new Date(deadlineIso).getTime() - new Date().getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 0) return 'Overdue';
  if (minutes < 60) return `${minutes}m remaining`;
  return `${Math.floor(minutes / 60)}h ${minutes % 60}m remaining`;
};

// --- MOCK COMPONENTS FOR MISSING DEPENDENCIES ---
const AttendantPerformanceDetails = ({ attendantId, performanceData }: { attendantId: string, performanceData: any }) => (
  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mt-2">
    <div className="text-sm font-bold text-gray-700">Performance Details for ID: {attendantId}</div>
    <div className="text-xs text-gray-500">Rooms Completed: {performanceData?.roomsCompleted || 0}</div>
    <div className="text-xs text-gray-500">Avg Time: {performanceData?.averageTime || 0}m</div>
  </div>
);

const TimeDistributionChart = ({ data }: { data: any[] }) => (
  <div className="h-32 bg-gray-50 rounded-lg flex items-end justify-around p-2 border border-gray-200">
    {data.map((item, i) => (
      <div key={i} className="w-4 bg-blue-400 rounded-t" style={{ height: `${Math.min(item.actualMinutes, 100)}%` }} title={`${item.actualMinutes}m`}></div>
    ))}
  </div>
);

// --- EXPANDED VIEWS ---

const AssignedExpandedView: React.FC<{ data: NonNullable<RoomAttendantExpandedData['assigned']> }> = ({ data }) => {
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  
  return (
    <div className="expanded-assigned">
      <h3 className="text-lg font-bold text-gray-800 mb-4">Rooms Assigned to Attendants</h3>
      
      {/* ATTENDANT ASSIGNMENT OVERVIEW */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-xl text-center">
          <div className="text-xs font-bold text-blue-600 uppercase">Total Rooms</div>
          <div className="text-2xl font-bold text-blue-900">{data.rooms.length}</div>
        </div>
        <div className="bg-green-50 p-4 rounded-xl text-center">
          <div className="text-xs font-bold text-green-600 uppercase">Attendants Working</div>
          <div className="text-2xl font-bold text-green-900">{data.attendants.length}</div>
        </div>
        <div className="bg-purple-50 p-4 rounded-xl text-center">
          <div className="text-xs font-bold text-purple-600 uppercase">Avg Time/Room</div>
          <div className="text-2xl font-bold text-purple-900">
            {data.rooms.length > 0 ? Math.round(data.rooms.reduce((sum, t) => sum + t.estimatedMinutes, 0) / data.rooms.length) : 0}m
          </div>
        </div>
      </div>
      
      {/* ROOM ASSIGNMENT TABLE */}
      <div className="mb-6 bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="px-6 py-3 bg-gray-50 border-b border-gray-200 font-bold text-gray-700 text-sm">Room Assignments</div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-500 font-semibold border-b border-gray-200">
              <tr>
                <th className="p-3">Room</th>
                <th className="p-3">Attendant</th>
                <th className="p-3">Assigned By</th>
                <th className="p-3">Time</th>
                <th className="p-3">Status</th>
                <th className="p-3">Priority</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {data.rooms.map(room => (
                <tr 
                  key={room.id} 
                  className={`hover:bg-blue-50 cursor-pointer ${selectedRoom === room.id ? 'bg-blue-50' : ''}`}
                  onClick={() => setSelectedRoom(room.id)}
                >
                  <td className="p-3">
                    <div className="font-bold text-gray-900">{room.name}</div>
                    <div className="text-xs text-gray-500 capitalize">{room.cleaningType}</div>
                  </td>
                  <td className="p-3">
                    <div className="font-medium text-gray-800">{room.attendantName}</div>
                    <div className="text-xs text-gray-500 flex items-center gap-1">
                      {room.attendantStatus === 'active' ? '🟢 Active' : 
                       room.attendantStatus === 'on_break' ? '🟡 Break' : '⚪ Inactive'}
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="text-gray-900">{room.assignedByName}</div>
                    <div className="text-xs text-gray-400">{formatTime(room.assignedAt)}</div>
                  </td>
                  <td className="p-3">
                    <div className="text-blue-600 font-medium">{room.estimatedMinutes}m</div>
                    <div className="text-xs text-gray-400">{formatTime(room.scheduledStart)}</div>
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold capitalize
                      ${room.status === 'in_progress' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}
                    `}>
                      {room.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <div 
                          key={i} 
                          className={`w-2 h-2 rounded-full ${i < room.priorityLevel ? 'bg-red-500' : 'bg-gray-200'}`}
                        />
                      ))}
                    </div>
                  </td>
                  <td className="p-3 text-right">
                    <div className="flex justify-end gap-2">
                      <button className="px-2 py-1 bg-white border border-gray-200 rounded text-xs font-medium hover:bg-gray-50">View</button>
                      <button className="px-2 py-1 bg-blue-50 text-blue-600 rounded text-xs font-medium hover:bg-blue-100">Reassign</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* ATTENDANT WORKLOAD VIEW */}
      <div className="mb-6">
        <h4 className="text-sm font-bold text-gray-700 uppercase mb-3">Attendant Workload</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.attendants.map(attendant => (
            <div key={attendant.id} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-600">
                  {attendant.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <div className="font-bold text-gray-900">{attendant.name}</div>
                  <div className="text-xs text-gray-500 capitalize">{attendant.role}</div>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full capitalize ${attendant.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                  {attendant.status.replace('_', ' ')}
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                <div className="bg-gray-50 p-2 rounded">
                  <div className="text-gray-500">Assigned</div>
                  <div className="font-bold">{attendant.roomsAssigned}</div>
                </div>
                <div className="bg-gray-50 p-2 rounded">
                  <div className="text-gray-500">Completed</div>
                  <div className="font-bold">{attendant.roomsCompleted}</div>
                </div>
              </div>
              
              <div className="mb-2">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-500">Workload</span>
                  <span className="font-bold text-blue-600">{attendant.workloadPercentage}%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${attendant.workloadPercentage}%` }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const CompletedExpandedView: React.FC<{ data: NonNullable<RoomAttendantExpandedData['completed']> }> = ({ data }) => {
  const [selectedAttendant, setSelectedAttendant] = useState<string | null>(null);
  
  return (
    <div className="expanded-completed">
      <h3 className="text-lg font-bold text-gray-800 mb-4">Rooms Completed Today</h3>
      
      {/* COMPLETION SUMMARY */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
          <div className="text-xs font-bold text-gray-500 uppercase">Total Completed</div>
          <div className="text-2xl font-bold text-gray-900">{data.rooms.length}</div>
          <div className="text-xs text-gray-400">rooms today</div>
        </div>
        <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
          <div className="text-xs font-bold text-gray-500 uppercase">Avg Time</div>
          <div className="text-2xl font-bold text-gray-900">
            {data.rooms.length > 0 ? Math.round(data.timeMetrics.reduce((sum, t) => sum + t.actualMinutes, 0) / data.rooms.length) : 0}m
          </div>
          <div className="text-xs text-gray-400">per room</div>
        </div>
        <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
          <div className="text-xs font-bold text-gray-500 uppercase">On-Time Rate</div>
          <div className="text-2xl font-bold text-gray-900">
            {data.timeMetrics.length > 0 ? Math.round(data.timeMetrics.filter(t => t.onTime).length / data.timeMetrics.length * 100) : 0}%
          </div>
          <div className="text-xs text-gray-400">completed on time</div>
        </div>
        <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
          <div className="text-xs font-bold text-gray-500 uppercase">Avg Quality</div>
          <div className="text-2xl font-bold text-gray-900">
            {data.qualityScores.length > 0 ? Math.round(data.qualityScores.reduce((sum, q) => sum + q.score, 0) / data.qualityScores.length) : 0}/10
          </div>
          <div className="text-xs text-gray-400">inspection score</div>
        </div>
      </div>
      
      {/* COMPLETED ROOMS TABLE */}
      <div className="mb-6 bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="px-6 py-3 bg-gray-50 border-b border-gray-200 font-bold text-gray-700 text-sm">Completed Rooms</div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-500 font-semibold border-b border-gray-200">
              <tr>
                <th className="p-3">Room</th>
                <th className="p-3">Attendant</th>
                <th className="p-3">Time Taken</th>
                <th className="p-3">Completed At</th>
                <th className="p-3">Quality Score</th>
                <th className="p-3">Minibar</th>
                <th className="p-3 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {data.rooms.map(room => (
                <tr key={room.id} className="hover:bg-gray-50">
                  <td className="p-3">
                    <div className="font-bold text-gray-900">{room.name}</div>
                    <div className="text-xs text-gray-500 capitalize">{room.cleaningType}</div>
                  </td>
                  <td className="p-3">
                    <button 
                      className="text-blue-600 hover:underline font-medium text-left"
                      onClick={() => setSelectedAttendant(room.attendantId)}
                    >
                      {room.attendantName}
                    </button>
                  </td>
                  <td className="p-3">
                    <div className="font-bold text-gray-900">{room.actualMinutes}m</div>
                    <div className={`text-xs font-bold ${room.onTime ? 'text-green-600' : 'text-red-600'}`}>
                      {room.onTime ? '✓ On time' : `${room.timeDifference}m late`}
                    </div>
                  </td>
                  <td className="p-3 text-gray-600">{formatTime(room.completedAt)}</td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <span className="font-bold">{room.qualityScore}/10</span>
                      <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div className={`h-full ${room.qualityScore >= 8 ? 'bg-green-500' : 'bg-yellow-500'}`} style={{ width: `${room.qualityScore * 10}%` }} />
                      </div>
                    </div>
                  </td>
                  <td className="p-3">
                    {room.minibarTotal > 0 ? (
                      <span className="font-bold text-gray-900">R{room.minibarTotal}</span>
                    ) : (
                      <span className="text-gray-400">None</span>
                    )}
                  </td>
                  <td className="p-3 text-right">
                    <button className="text-xs bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded font-medium text-gray-700">View Details</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* ATTENDANT PERFORMANCE */}
      {selectedAttendant && (
        <div className="mb-6">
          <AttendantPerformanceDetails 
            attendantId={selectedAttendant}
            performanceData={data.attendants.find(a => a.id === selectedAttendant)}
          />
        </div>
      )}
      
      {/* TIME DISTRIBUTION CHART */}
      <div className="bg-white p-4 rounded-xl border border-gray-200">
        <h4 className="text-sm font-bold text-gray-700 uppercase mb-3">Completion Time Distribution</h4>
        <TimeDistributionChart data={data.timeMetrics} />
      </div>
    </div>
  );
};

const PriorityExpandedView: React.FC<{ data: NonNullable<RoomAttendantExpandedData['priority']> }> = ({ data }) => {
  return (
    <div className="expanded-priority">
      <h3 className="text-lg font-bold text-gray-800 mb-4">High Priority Rooms</h3>
      
      {/* PRIORITY BREAKDOWN */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {data.reasons.map((reason, i) => (
          <div key={i} className="bg-red-50 p-4 rounded-xl border border-red-100 flex items-center gap-4">
            <div className="p-3 bg-white rounded-full text-red-500 shadow-sm">
              {reason.icon}
            </div>
            <div>
              <div className="text-sm font-bold text-red-900 capitalize">{reason.type}</div>
              <div className="text-xs text-red-700">{reason.count} rooms</div>
            </div>
          </div>
        ))}
      </div>
      
      {/* URGENT ROOMS LIST */}
      <div className="mb-6">
        <h4 className="text-sm font-bold text-gray-700 uppercase mb-3">Urgent Rooms Requiring Attention</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.rooms.map(room => (
            <div key={room.id} className="bg-white p-4 rounded-xl border border-l-4 border-red-500 shadow-sm">
              <div className="flex justify-between items-start mb-2">
                <h5 className="font-bold text-lg text-gray-900">{room.name}</h5>
                <span className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded font-bold uppercase">
                  Priority {room.priorityLevel}
                </span>
              </div>
              
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Reason</span>
                  <span className="font-medium">{room.reason}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Deadline</span>
                  <span className="font-medium text-red-600">
                    {formatTime(room.deadline)} 
                    <span className="text-xs ml-1 font-normal">({calculateTimeRemaining(room.deadline)})</span>
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Assigned To</span>
                  <span className={`font-medium ${room.assignedTo ? 'text-gray-900' : 'text-orange-500 font-bold'}`}>
                    {room.assignedTo || 'Unassigned'}
                  </span>
                </div>
              </div>
              
              <div className="flex gap-2">
                <button className="flex-1 bg-blue-600 text-white py-2 rounded text-xs font-bold hover:bg-blue-700">
                  {room.assignedTo ? 'Reassign' : 'Assign Now'}
                </button>
                <button className="flex-1 bg-gray-100 text-gray-700 py-2 rounded text-xs font-bold hover:bg-gray-200">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* ESCALATIONS */}
      {data.escalations.length > 0 && (
        <div className="bg-white p-4 rounded-xl border border-gray-200">
          <h4 className="text-sm font-bold text-gray-700 uppercase mb-3 flex items-center gap-2">
            <AlertTriangle size={16} className="text-red-500" /> Escalated Issues
          </h4>
          <div className="space-y-3">
            {data.escalations.map(escalation => (
              <div key={escalation.id} className="p-3 bg-red-50 rounded-lg border border-red-100 flex justify-between items-center">
                <div>
                  <div className="font-bold text-gray-900">{escalation.title}</div>
                  <div className="text-xs text-gray-600">{escalation.room} • {escalation.reason}</div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-gray-500 mb-1">Assigned: {escalation.assignedTo}</div>
                  <button className="text-xs bg-white text-green-600 border border-green-200 px-2 py-1 rounded font-bold hover:bg-green-50">
                    Mark Resolved
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default function RoomAttendantExpandedViews({ cardType, data }: ExpandedViewProps) {
  switch (cardType) {
    case 'assigned': return <AssignedExpandedView data={data.assigned!} />;
    case 'completed': return <CompletedExpandedView data={data.completed!} />;
    case 'priority': return <PriorityExpandedView data={data.priority!} />;
    default: return <div className="p-8 text-center text-gray-500">Details not available for this card type.</div>;
  }
}
