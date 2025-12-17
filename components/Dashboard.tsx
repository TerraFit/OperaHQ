
import React, { useContext, useState, useEffect } from 'react';
import { AppContext } from '../App';
import { MOCK_SHIFTS } from '../services/mockData';
import { getExpandedCardData } from '../services/mockDashboardData';
import { UserRole, InteractiveDashboardCardConfig } from '../types';
import { BedDouble, Clock, AlertCircle, Calendar, Users, ClipboardCheck, Timer } from 'lucide-react';
import InteractiveDashboardCard from './InteractiveDashboardCard';

export default function Dashboard() {
  const { user } = useContext(AppContext);
  const [expandedCardId, setExpandedCardId] = useState<string | null>(null);

  if (!user) return null;

  const isManager = user.role === UserRole.MANAGER || user.role === UserRole.ADMIN;

  const cards: InteractiveDashboardCardConfig[] = [
    {
      id: 'occupancy',
      type: 'occupancy',
      title: "TODAY'S OCCUPANCY",
      icon: <BedDouble size={24} />,
      currentValue: "67%",
      subValue: "4 of 6 Rooms",
      status: 'normal',
      isExpandable: true
    },
    {
      id: 'rooms_pending',
      type: 'rooms_pending',
      title: "ROOMS PENDING",
      icon: <Clock size={24} />,
      currentValue: "3",
      subValue: "Ensure ready by 14:00",
      status: 'warning',
      isExpandable: true
    },
    {
      id: 'hours_this_week',
      type: 'hours_this_week',
      title: "HOURS THIS WEEK",
      icon: <Timer size={24} />,
      currentValue: "32.5",
      subValue: "/ 45.0 Max",
      status: 'normal',
      isExpandable: true
    },
    {
      id: 'sop_status',
      type: 'sop_status',
      title: "SOP COMPLIANCE",
      icon: <ClipboardCheck size={24} />,
      currentValue: "94%",
      subValue: "2 Expiring Soon",
      status: 'success',
      isExpandable: true
    }
  ];

  const handleCardExpandToggle = (id: string) => {
    setExpandedCardId(prev => prev === id ? null : id);
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Welcome, {user.firstName}</h2>
          <p className="text-gray-500 text-sm">Zebra Lodge Compliance Dashboard</p>
        </div>
        <div className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-800 text-xs font-medium border border-green-200">
          <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>
          System Active
        </div>
      </div>

      {isManager ? (
        <section>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-gray-800">Operational Overview</h3>
            <span className="text-xs text-gray-400">Click cards for details</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 auto-rows-min">
            {cards.map(card => (
              <InteractiveDashboardCard 
                key={card.id}
                card={card}
                isExpanded={expandedCardId === card.id}
                onToggleExpand={handleCardExpandToggle}
                onExpand={getExpandedCardData}
              />
            ))}
          </div>
        </section>
      ) : (
        /* STAFF VIEW FALLBACK */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
           {/* Simple static cards for staff if needed, or reuse the interactive ones with isExpandable=false */}
           <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h3 className="text-gray-500 text-sm font-medium uppercase">Hours This Week</h3>
              <div className="text-3xl font-bold mt-2 text-gray-900">32.5</div>
              <div className="text-gray-400 text-xs mt-1">/ 45.0 Max</div>
           </div>
           <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h3 className="text-gray-500 text-sm font-medium uppercase">Leave Days</h3>
              <div className="text-3xl font-bold mt-2 text-green-600">{user.holidaysEarned.toFixed(1)}</div>
              <div className="text-gray-400 text-xs mt-1">Accrued</div>
           </div>
        </div>
      )}

      {/* Shared Widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <Calendar size={18} className="text-gray-500" /> Next Shift
            </h3>
          </div>
          <div className="p-6">
             {/* Mock Shift Display */}
             <div className="flex justify-between items-center">
                <div>
                  <div className="text-sm text-gray-500">Tomorrow</div>
                  <div className="font-medium text-gray-900">07:45 - 16:00</div>
                </div>
                <div className="text-right">
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">Morning Shift</span>
                </div>
             </div>
             <div className="mt-4 p-3 bg-yellow-50 rounded border border-yellow-100 text-sm text-yellow-800 flex gap-2">
                <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
                <span>Remember: Mandatory 45min break after 5 hours.</span>
             </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
           <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <Clock size={18} className="text-gray-500" /> Time Clock
            </h3>
          </div>
          <div className="p-6 flex items-center gap-4">
             <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-red-600">
                 <Clock size={24} />
             </div>
             <div>
                 <p className="font-medium text-gray-900">Currently Clocked Out</p>
                 <p className="text-sm text-gray-500">Last activity: Yesterday 21:00</p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
