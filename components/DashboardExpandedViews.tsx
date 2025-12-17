
import React from 'react';
import { CardType, CardExpandedContent } from '../types';
import { Clock, Users, AlertTriangle, CheckCircle, BarChart3, TrendingUp, Calendar, DollarSign } from 'lucide-react';

interface ExpandedViewProps {
  type: CardType;
  data: CardExpandedContent;
}

const OccupancyExpandedView = ({ data }: { data: NonNullable<CardExpandedContent['occupancy']> }) => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Room Status List */}
      <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
        <h4 className="text-sm font-bold text-gray-700 uppercase mb-3">Room Status</h4>
        <div className="space-y-2">
          {data.rooms.map((room: any) => (
            <div key={room.id} className="flex justify-between items-center bg-white p-2 rounded shadow-sm border border-gray-100">
              <div className="flex items-center gap-3">
                <div className={`w-2 h-8 rounded-full ${
                  room.status.includes('occupied') ? 'bg-red-400' : 
                  room.status.includes('check_in') ? 'bg-blue-400' : 
                  room.status.includes('check_out') ? 'bg-orange-400' : 'bg-green-400'
                }`} />
                <div>
                  <div className="font-bold text-gray-900">{room.name}</div>
                  <div className="text-xs text-gray-500 capitalize">{room.status.replace(/_/g, ' ')}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium">{room.guestCount} Guests</div>
                <div className={`text-xs px-2 py-0.5 rounded-full ${
                  room.cleaningStatus === 'completed' ? 'bg-green-100 text-green-700' : 
                  room.cleaningStatus === 'in_progress' ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {room.cleaningStatus.replace(/_/g, ' ')}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Financials & Check-ins */}
      <div className="space-y-4">
        <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
          <h4 className="text-sm font-bold text-blue-800 uppercase mb-2 flex items-center gap-2">
            <DollarSign size={16} /> Revenue Projection
          </h4>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div>
              <div className="text-xs text-blue-600">Today</div>
              <div className="font-bold text-blue-900">R {data.revenueProjection.today}</div>
            </div>
            <div>
              <div className="text-xs text-blue-600">Week</div>
              <div className="font-bold text-blue-900">R {data.revenueProjection.thisWeek / 1000}k</div>
            </div>
            <div>
              <div className="text-xs text-blue-600">Month</div>
              <div className="font-bold text-blue-900">R {data.revenueProjection.thisMonth / 1000}k</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <h4 className="text-sm font-bold text-gray-700 uppercase mb-3">Check-ins Today</h4>
          {data.checkInsToday.map((ci: any) => (
            <div key={ci.id} className="flex justify-between items-center text-sm border-b border-gray-100 last:border-0 py-2">
              <div>
                <span className="font-bold">{ci.roomName}</span>
                <span className="text-gray-500 mx-2">•</span>
                <span className="text-gray-600">{ci.estimatedTime}</span>
              </div>
              <span className={`text-xs px-2 py-1 rounded ${ci.roomReady ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                {ci.roomReady ? 'Ready' : 'Prep'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

const RoomsExpandedView = ({ data }: { data: NonNullable<CardExpandedContent['roomsPending']> }) => (
  <div className="space-y-6">
    {/* Queue Visualization */}
    <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
      <h4 className="text-sm font-bold text-gray-700 uppercase mb-3 flex justify-between">
        <span>Cleaning Queue (Priority)</span>
        <span className="text-blue-600">Est. Finish: {data.estimatedCompletion.time}</span>
      </h4>
      <div className="space-y-2">
        {data.priorityOrder.map((room: any, idx: number) => (
          <div key={room.roomId} className="flex items-center gap-4 bg-white p-3 rounded-lg shadow-sm border border-gray-200">
            <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center font-bold text-xs text-gray-600">
              {idx + 1}
            </div>
            <div className="flex-1">
              <div className="flex justify-between">
                <h5 className="font-bold text-gray-900">{room.roomName}</h5>
                <span className={`text-xs font-bold uppercase px-2 rounded ${
                  room.priority === 'high' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                }`}>{room.priority}</span>
              </div>
              <div className="flex justify-between items-center mt-1">
                <div className="text-xs text-gray-500 capitalize">{room.cleaningType.replace(/_/g, ' ')} • {room.estimatedMinutes} min</div>
                <div className="flex items-center gap-2">
                  {room.assignedTo ? (
                    <span className="text-xs bg-gray-100 px-2 py-0.5 rounded text-gray-600 font-medium">
                      {room.assignedTo}
                    </span>
                  ) : (
                    <span className="text-xs text-orange-500 font-bold">Unassigned</span>
                  )}
                  {room.progress > 0 && (
                    <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-green-500" style={{width: `${room.progress}%`}} />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* Staff Status */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {data.assignedAttendants.map((att: any) => (
        <div key={att.id} className="bg-white p-3 rounded-xl border border-gray-200 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold">
            {att.name.charAt(0)}
          </div>
          <div className="flex-1">
            <div className="font-bold text-sm">{att.name}</div>
            <div className="text-xs text-gray-500">
              {att.onBreak ? <span className="text-orange-500">On Break</span> : <span className="text-green-600">Active</span>}
              <span className="mx-1">•</span>
              Qual: {att.qualityScore}%
            </div>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold text-gray-900">{att.completedRooms}/{att.assignedRooms}</div>
            <div className="text-[10px] text-gray-400 uppercase">Rooms</div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const HoursExpandedView = ({ data }: { data: NonNullable<CardExpandedContent['hoursThisWeek']> }) => (
  <div className="space-y-6">
    <div className="grid grid-cols-3 gap-4">
      <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 text-center">
        <div className="text-xs font-bold text-blue-600 uppercase mb-1">Projected Total</div>
        <div className="text-2xl font-bold text-blue-900">{data.projectHours.total}h</div>
        <div className="text-xs text-blue-500">{data.projectHours.remaining}h remaining</div>
      </div>
      <div className="bg-orange-50 p-4 rounded-xl border border-orange-100 text-center">
        <div className="text-xs font-bold text-orange-600 uppercase mb-1">Overtime Est.</div>
        <div className="text-2xl font-bold text-orange-900">{data.overtimeForecast.hours}h</div>
        <div className="text-xs text-orange-500">Cost: R {data.overtimeForecast.cost}</div>
      </div>
      <div className="bg-green-50 p-4 rounded-xl border border-green-100 text-center">
        <div className="text-xs font-bold text-green-600 uppercase mb-1">Labor Cost</div>
        <div className="text-2xl font-bold text-green-900">R {data.laborCost.actual}</div>
        <div className="text-xs text-green-500">{data.laborCost.vsBudget}% vs budget</div>
      </div>
    </div>

    {/* Simple Bar Chart Visualization with CSS */}
    <div className="bg-white p-4 rounded-xl border border-gray-200">
      <h4 className="text-sm font-bold text-gray-700 uppercase mb-4">Department Breakdown</h4>
      <div className="space-y-3">
        {data.departmentBreakdown.map((dept: any) => (
          <div key={dept.name} className="flex items-center gap-3 text-sm">
            <div className="w-24 font-medium text-gray-600">{dept.name}</div>
            <div className="flex-1 h-6 bg-gray-100 rounded-full overflow-hidden relative">
              <div 
                className="h-full bg-blue-500 rounded-full" 
                style={{ width: `${(dept.hours / 200) * 100}%` }} // Mock scale
              />
              <span className="absolute inset-0 flex items-center pl-2 text-xs font-bold text-white drop-shadow-md">
                {dept.hours} hrs
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const SOPExpandedView = ({ data }: { data: NonNullable<CardExpandedContent['sopStatus']> }) => (
  <div className="space-y-6">
    <div className="grid grid-cols-2 gap-4">
      <div className="bg-green-50 p-4 rounded-xl border border-green-100 flex items-center gap-4">
        <div className="p-3 bg-white rounded-full text-green-600 shadow-sm">
          <CheckCircle size={24} />
        </div>
        <div>
          <div className="text-2xl font-bold text-green-900">{data.complianceRate.overall}%</div>
          <div className="text-xs text-green-700 font-bold uppercase">Compliance Rate</div>
        </div>
      </div>
      <div className="bg-red-50 p-4 rounded-xl border border-red-100 flex items-center gap-4">
        <div className="p-3 bg-white rounded-full text-red-600 shadow-sm">
          <AlertTriangle size={24} />
        </div>
        <div>
          <div className="text-2xl font-bold text-red-900">{data.expiringSoon.length}</div>
          <div className="text-xs text-red-700 font-bold uppercase">Expiring Soon</div>
        </div>
      </div>
    </div>

    <div className="bg-white p-4 rounded-xl border border-gray-200">
      <h4 className="text-sm font-bold text-gray-700 uppercase mb-3">Critical Actions Needed</h4>
      <div className="space-y-3">
        {data.expiringSoon.map((item: any) => (
          <div key={item.id} className="flex justify-between items-center p-3 bg-red-50/50 rounded-lg border border-red-100">
            <div>
              <div className="font-bold text-gray-900">{item.employeeName}</div>
              <div className="text-xs text-gray-500">{item.sopName} ({item.sopCode})</div>
            </div>
            <div className="text-right">
              <div className="text-xs font-bold text-red-600">Expires in {item.daysUntilExpiry} days</div>
              <button className="mt-1 text-xs bg-white border border-red-200 text-red-600 px-2 py-1 rounded hover:bg-red-50">
                Schedule Retest
              </button>
            </div>
          </div>
        ))}
        {data.pendingTests.map((item: any) => (
          <div key={item.id} className="flex justify-between items-center p-3 bg-yellow-50/50 rounded-lg border border-yellow-100">
            <div>
              <div className="font-bold text-gray-900">{item.employeeName}</div>
              <div className="text-xs text-gray-500">{item.sopName} (New)</div>
            </div>
            <div className="text-right">
              <div className="text-xs font-bold text-yellow-600">Due {new Date(item.dueDate).toLocaleDateString()}</div>
              <button className="mt-1 text-xs bg-white border border-yellow-200 text-yellow-600 px-2 py-1 rounded hover:bg-yellow-50">
                Remind
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const DefaultExpandedView = ({ data }: { data: any }) => (
  <div className="text-center text-gray-500 py-10">
    Detailed metrics for this section are being aggregated.
  </div>
);

export default function DashboardExpandedViews({ type, data }: ExpandedViewProps) {
  switch (type) {
    case 'occupancy': return <OccupancyExpandedView data={data.occupancy!} />;
    case 'rooms_pending': return <RoomsExpandedView data={data.roomsPending!} />;
    case 'hours_this_week': return <HoursExpandedView data={data.hoursThisWeek!} />;
    case 'sop_status': return <SOPExpandedView data={data.sopStatus!} />;
    default: return <DefaultExpandedView data={data} />;
  }
}
