
import React, { useState, useContext, useMemo } from 'react';
import { AppContext } from '../App';
import { MOCK_ROOMS, MOCK_GUESTS, MOCK_MINIBAR_ITEMS, MOCK_ROOM_INVENTORY, CLEANING_CHECKLIST } from '../services/mockHousekeepingData';
import { RoomOccupancy, CleaningChecklistItem, MinibarItem, UserRole, Employee, RoomAttendantCardConfig, RoomAttendantCardType, RoomAttendantExpandedData } from '../types';
import InteractiveRoomCard from './InteractiveRoomCard';
import { 
  BedDouble, 
  CheckSquare, 
  Wine, 
  Search, 
  ArrowLeft, 
  CheckCircle, 
  AlertTriangle, 
  ThermometerSun, 
  Waves,
  Save,
  Clock,
  User,
  LogOut,
  Users,
  Briefcase
} from 'lucide-react';

// HELPER: Get Guest details
const getGuest = (guestId?: string) => MOCK_GUESTS.find(g => g.id === guestId);

// HELPER: Mock Data Generator for Expanded Views
const generateMockExpandedData = async (type: RoomAttendantCardType): Promise<RoomAttendantExpandedData> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 600));

    // Base Mock Data
    const mockAttendants = [
        { id: 'emp-002', name: 'Sarah Nkosi', role: 'Attendant', status: 'active', roomsAssigned: 5, roomsCompleted: 2, averageTime: 42, qualityScore: 98, workloadPercentage: 80, currentRooms: [{id: 'rm-001', name: 'Colonial', estimatedTime: 30}] },
        { id: 'emp-003', name: 'Mike Smith', role: 'Attendant', status: 'on_break', roomsAssigned: 4, roomsCompleted: 1, averageTime: 45, qualityScore: 95, workloadPercentage: 60, currentRooms: [] }
    ];

    const mockRooms = [
        { id: 'rm-001', name: 'Colonial', priorityLevel: 4, cleaningType: 'check_out', attendantName: 'Sarah Nkosi', attendantStatus: 'active', assignedByName: 'Thabo M', assignedAt: new Date().toISOString(), estimatedMinutes: 45, scheduledStart: new Date().toISOString(), status: 'in_progress' },
        { id: 'rm-003', name: 'Stone', priorityLevel: 2, cleaningType: 'stay_over', attendantName: 'Sarah Nkosi', attendantStatus: 'active', assignedByName: 'Thabo M', assignedAt: new Date().toISOString(), estimatedMinutes: 30, scheduledStart: new Date(Date.now() + 3600000).toISOString(), status: 'assigned' },
        { id: 'rm-006', name: 'Country', priorityLevel: 5, cleaningType: 'check_in', attendantName: 'Mike Smith', attendantStatus: 'on_break', assignedByName: 'Thabo M', assignedAt: new Date().toISOString(), estimatedMinutes: 60, scheduledStart: new Date(Date.now() - 3600000).toISOString(), status: 'assigned' }
    ];

    const mockCompletedRooms = [
        { id: 'rm-002', name: 'Earth', cleaningType: 'check_out', attendantId: 'emp-002', attendantName: 'Sarah Nkosi', actualMinutes: 40, onTime: true, timeDifference: 0, completedAt: new Date(Date.now() - 7200000).toISOString(), qualityScore: 9, minibarTotal: 120 }
    ];

    switch (type) {
        case 'assigned':
            return {
                assigned: {
                    rooms: mockRooms as any,
                    attendants: mockAttendants as any,
                    timeAllocation: [],
                    shiftCoverage: []
                }
            };
        case 'completed':
            return {
                completed: {
                    rooms: mockCompletedRooms,
                    attendants: mockAttendants,
                    timeMetrics: [{ actualMinutes: 40, onTime: true }, { actualMinutes: 55, onTime: false }],
                    qualityScores: [{ score: 9 }, { score: 8 }]
                }
            };
        case 'priority':
            return {
                priority: {
                    rooms: [
                        { id: 'rm-001', name: 'Colonial', priorityLevel: 4, reason: 'VIP Arrival', deadline: new Date(Date.now() + 3600000).toISOString(), assignedTo: 'Sarah Nkosi', escalated: false },
                        { id: 'rm-006', name: 'Country', priorityLevel: 5, reason: 'Late Check-out', deadline: new Date(Date.now() + 1800000).toISOString(), assignedTo: null, escalated: true }
                    ],
                    reasons: [
                        { type: 'VIP', count: 1, icon: <User size={16} /> },
                        { type: 'Check-in', count: 2, icon: <Clock size={16} /> },
                        { type: 'Maintenance', count: 0, icon: <AlertTriangle size={16} /> }
                    ],
                    deadlines: [],
                    escalations: [
                        { id: 'esc-1', title: 'Cleaning Delayed', level: 'High', room: 'Country', reason: 'Late checkout', assignedTo: 'Thabo M' }
                    ]
                }
            };
        case 'inspected':
            return { inspected: { summary: {} } }; // Stub
        default:
            return {};
    }
};

interface RoomCardProps {
  room: RoomOccupancy;
  user: Employee | null;
  onStart: (id: string) => void;
  onInspect: (id: string) => void;
}

const RoomCard: React.FC<RoomCardProps> = ({ room, user, onStart, onInspect }) => {
  const isPriority = room.status === 'check_out_today' || room.status === 'check_in_today';
  const statusColor = 
    room.cleaningStatus === 'cleaned' ? 'bg-green-100 text-green-800 border-green-200' :
    room.cleaningStatus === 'inspected' ? 'bg-blue-100 text-blue-800 border-blue-200' :
    isPriority ? 'bg-orange-50 text-orange-800 border-orange-200' :
    'bg-gray-50 text-gray-700 border-gray-200';

  return (
    <div className={`p-4 rounded-xl border shadow-sm ${statusColor} transition-all`}>
      <div className="flex justify-between items-start mb-2">
         <div>
           <h3 className="font-bold text-lg">{room.name}</h3>
           <div className="text-xs uppercase font-bold tracking-wide opacity-75">{room.status.replace(/_/g, ' ')}</div>
         </div>
         {isPriority && <AlertTriangle size={18} className="text-orange-600" />}
      </div>
      
      <div className="space-y-2 my-3 text-sm opacity-90">
         <div className="flex items-center gap-2">
           <User size={14} />
           <span>{room.guestId ? getGuest(room.guestId)?.name : 'Vacant'}</span>
         </div>
         <div className="flex items-center gap-2">
           <Clock size={14} />
           <span>{room.cleaningStatus.replace(/_/g, ' ')}</span>
         </div>
      </div>

      {user?.role === UserRole.STAFF && room.cleaningStatus !== 'inspected' && (
         <button 
           onClick={() => onStart(room.id)}
           className="w-full bg-white bg-opacity-80 hover:bg-opacity-100 text-current font-bold py-2 rounded shadow-sm border border-current border-opacity-20"
         >
           {room.cleaningStatus === 'not_cleaned' ? 'Start Cleaning' : 'Resume'}
         </button>
      )}

      {(user?.role === UserRole.MANAGER || user?.role === UserRole.SUPERVISOR) && (
         <div className="flex gap-2">
            <button onClick={() => onStart(room.id)} className="flex-1 bg-white p-2 rounded text-xs font-bold shadow-sm">View</button>
            <button onClick={() => onInspect(room.id)} className="flex-1 bg-blue-600 text-white p-2 rounded text-xs font-bold shadow-sm">Inspect</button>
         </div>
      )}
    </div>
  );
};

export default function RoomAttendantModule() {
  const { user } = useContext(AppContext);
  
  // Navigation State
  const [view, setView] = useState<'dashboard' | 'cleaning' | 'inspection'>('dashboard');
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  
  // Card State
  const [expandedCardId, setExpandedCardId] = useState<string | null>(null);
  
  // Cleaning Workflow State
  const [checklistProgress, setChecklistProgress] = useState<Record<string, boolean>>({});
  const [minibarCounts, setMinibarCounts] = useState<Record<string, number>>({}); 
  
  // Derived Data
  const selectedRoom = MOCK_ROOMS.find(r => r.id === selectedRoomId);
  const guest = selectedRoom ? getGuest(selectedRoom.guestId) : undefined;
  
  const displayedRooms = user?.role === UserRole.STAFF 
    ? MOCK_ROOMS.filter(r => r.assignedAttendantId === user.id)
    : MOCK_ROOMS;

  // --- CARD CONFIGURATION ---
  const cards: RoomAttendantCardConfig[] = useMemo(() => [
    {
      id: 'card-assigned',
      type: 'assigned',
      title: 'Assigned',
      icon: <Briefcase size={24} />,
      count: displayedRooms.length,
      subText: 'Rooms pending today',
      backgroundColor: '#ebf5fb',
      borderColor: '#3498db',
      textColor: '#2c3e50',
      expandable: true
    },
    {
      id: 'card-completed',
      type: 'completed',
      title: 'Completed',
      icon: <CheckCircle size={24} />,
      count: displayedRooms.filter(r => r.cleaningStatus === 'cleaned' || r.cleaningStatus === 'inspected').length,
      subText: 'Rooms finished',
      backgroundColor: '#eafaf1',
      borderColor: '#27ae60',
      textColor: '#1e8449',
      expandable: true
    },
    {
      id: 'card-priority',
      type: 'priority',
      title: 'Priority',
      icon: <AlertTriangle size={24} />,
      count: displayedRooms.filter(r => r.status === 'check_out_today' || r.status === 'check_in_today').length,
      subText: 'Check-in/out',
      backgroundColor: '#fdedec',
      borderColor: '#e74c3c',
      textColor: '#c0392b',
      expandable: true
    },
    {
      id: 'card-inspected',
      type: 'inspected',
      title: 'Inspected',
      icon: <Search size={24} />,
      count: displayedRooms.filter(r => r.cleaningStatus === 'inspected').length,
      subText: 'Passed QA',
      backgroundColor: '#f4ecf7',
      borderColor: '#9b59b6',
      textColor: '#8e44ad',
      expandable: true // Set to false if no view yet, but we stubbed it
    }
  ], [displayedRooms]);

  // --- ACTIONS ---

  const handleStartRoom = (roomId: string) => {
    setSelectedRoomId(roomId);
    setChecklistProgress({});
    const initialCounts: Record<string, number> = {};
    Object.values(MOCK_ROOM_INVENTORY).forEach(inv => { initialCounts[inv.itemId] = 0; });
    setMinibarCounts(initialCounts);
    setView('cleaning');
  };

  const handleInspectRoom = (roomId: string) => {
    setSelectedRoomId(roomId);
    setView('inspection');
  };

  const toggleChecklistItem = (itemId: string) => {
    setChecklistProgress(prev => ({ ...prev, [itemId]: !prev[itemId] }));
  };

  const updateMinibarConsumption = (itemId: string, delta: number) => {
    setMinibarCounts(prev => ({ ...prev, [itemId]: Math.max(0, (prev[itemId] || 0) + delta) }));
  };

  const completeRoom = () => {
    const criticalItems = CLEANING_CHECKLIST.filter(i => i.isCritical);
    const criticalIncomplete = criticalItems.some(i => !checklistProgress[i.id]);
    if (criticalIncomplete && !confirm("Critical items incomplete. Force complete?")) return;
    alert(`Room ${selectedRoom?.name} marked as CLEANED.`);
    setView('dashboard');
    setSelectedRoomId(null);
  };

  const passInspection = () => {
    alert(`Room ${selectedRoom?.name} PASSED inspection.`);
    setView('dashboard');
    setSelectedRoomId(null);
  };

  // --- SUB-COMPONENTS ---

  const CleaningView = () => {
    if (!selectedRoom) return null;
    const completedCount = Object.values(checklistProgress).filter(Boolean).length;
    const progress = Math.round((completedCount / CLEANING_CHECKLIST.length) * 100);
    let minibarTotal = 0;
    let previousBalance = selectedRoom.minibarBalance;

    return (
      <div className="max-w-3xl mx-auto space-y-6 animate-in slide-in-from-right">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
           <div className="flex justify-between items-center mb-4">
              <div>
                <button onClick={() => setView('dashboard')} className="text-gray-500 hover:text-gray-900 flex items-center gap-1 mb-2">
                  <ArrowLeft size={16} /> Back to List
                </button>
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                   Cleaning: {selectedRoom.name}
                   <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded border uppercase">
                     {selectedRoom.status.replace(/_/g, ' ')}
                   </span>
                </h2>
              </div>
              <div className="text-right">
                 <div className="text-3xl font-bold text-blue-600">{progress}%</div>
                 <div className="text-xs text-gray-500">Completed</div>
              </div>
           </div>
           {guest && (
             <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 text-sm text-blue-900 flex gap-4">
                <span><strong>Guests:</strong> {guest.numberOfAdults} Ad, {guest.numberOfChildren} Ch</span>
                {guest.foodRestrictions && <span><strong>Dietary:</strong> {guest.foodRestrictions.join(', ')}</span>}
             </div>
           )}
        </div>

        <div className="space-y-8">
           <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex items-center gap-2 font-bold text-gray-700">
                <CheckSquare className="text-blue-500" /> Cleaning Checklist
              </div>
              <div className="divide-y divide-gray-100">
                {CLEANING_CHECKLIST.map(item => (
                  <label key={item.id} className="flex items-start gap-3 p-4 hover:bg-gray-50 cursor-pointer transition-colors">
                     <input 
                       type="checkbox" 
                       checked={!!checklistProgress[item.id]} 
                       onChange={() => toggleChecklistItem(item.id)}
                       className="mt-1 w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                     />
                     <div>
                       <div className="font-medium text-gray-900 flex items-center gap-2">
                         {item.description}
                         {item.isCritical && <span className="text-[10px] bg-red-100 text-red-700 px-1.5 rounded font-bold">CRITICAL</span>}
                       </div>
                       <div className="text-xs text-gray-400 capitalize">{item.category} • {item.subcategory}</div>
                     </div>
                  </label>
                ))}
              </div>
           </div>

           <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center font-bold text-gray-700">
                 <div className="flex items-center gap-2"><Wine className="text-purple-500" /> Minibar Check</div>
                 <div className="text-sm">Prev Balance: R {previousBalance.toFixed(2)}</div>
              </div>
              <table className="w-full text-sm">
                 <thead className="bg-gray-100 text-gray-500 font-semibold border-b">
                    <tr><th className="p-3 text-left">Item</th><th className="p-3 text-center">Price</th><th className="p-3 text-center">Consumed</th><th className="p-3 text-right">Total</th></tr>
                 </thead>
                 <tbody className="divide-y divide-gray-100">
                    {MOCK_MINIBAR_ITEMS.map(item => {
                       const consumed = minibarCounts[item.id] || 0;
                       const rowTotal = consumed * item.price;
                       minibarTotal += rowTotal;
                       return (
                         <tr key={item.id} className="hover:bg-gray-50">
                            <td className="p-3 font-medium text-gray-900">{item.name}</td>
                            <td className="p-3 text-center text-gray-500">R {item.price}</td>
                            <td className="p-3 text-center">
                               <div className="inline-flex items-center border rounded-lg bg-white">
                                  <button onClick={() => updateMinibarConsumption(item.id, -1)} className="px-2 py-1 hover:bg-gray-100">-</button>
                                  <span className="px-2 font-bold min-w-[30px]">{consumed}</span>
                                  <button onClick={() => updateMinibarConsumption(item.id, 1)} className="px-2 py-1 hover:bg-gray-100">+</button>
                               </div>
                            </td>
                            <td className="p-3 text-right font-bold text-gray-900">R {rowTotal.toFixed(2)}</td>
                         </tr>
                       );
                    })}
                 </tbody>
              </table>
           </div>

           <button onClick={completeRoom} className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-xl shadow-md transition-colors flex items-center justify-center gap-2">
             <CheckCircle /> Complete Room & Submit
           </button>
        </div>
      </div>
    );
  };

  const InspectionView = () => {
     if (!selectedRoom) return null;
     return (
       <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden animate-in zoom-in-95">
          <div className="bg-blue-600 p-6 text-white flex justify-between items-start">
             <div><h2 className="text-xl font-bold">Room Inspection: {selectedRoom.name}</h2></div>
             <button onClick={() => setView('dashboard')} className="bg-white/20 hover:bg-white/30 p-2 rounded"><ArrowLeft size={20} /></button>
          </div>
          <div className="p-8 space-y-6">
             <div className="bg-green-50 border border-green-200 p-4 rounded-lg flex items-center gap-3">
               <CheckCircle className="text-green-600" size={24} />
               <div><h3 className="font-bold text-green-800">Cleaning Reported Complete</h3></div>
             </div>
             <div className="space-y-4">
               <h3 className="font-bold text-gray-700 border-b pb-2">Spot Checks Required</h3>
               {['Under bed dust-free', 'Toilet seal intact', 'Shower drain clear', 'Minibar verified', 'Safe open'].map(check => (
                 <label key={check} className="flex items-center gap-3"><input type="checkbox" className="w-5 h-5 text-blue-600 rounded" /><span className="text-gray-900">{check}</span></label>
               ))}
             </div>
             <div className="flex gap-4 pt-4">
                <button onClick={passInspection} className="flex-1 bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700">Pass & Release</button>
                <button onClick={() => alert("Marked for re-cleaning.")} className="flex-1 bg-red-100 text-red-700 font-bold py-3 rounded-lg hover:bg-red-200">Fail / Re-clean</button>
             </div>
          </div>
       </div>
     );
  };

  // --- MAIN RENDER ---

  if (view === 'cleaning') return <CleaningView />;
  if (view === 'inspection') return <InspectionView />;

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Waves className="text-blue-500" /> Room Attendant Module
          </h2>
          <p className="text-gray-500 text-sm mt-1">
             Shift: 08:00 - 16:00 • {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
          </p>
        </div>
        <div className="flex items-center gap-4 text-sm">
           <div className="bg-orange-50 px-3 py-1.5 rounded-lg border border-orange-100 text-orange-800 flex items-center gap-2">
             <ThermometerSun size={16} /> Sunny 28°C
           </div>
        </div>
      </div>

      {/* Interactive Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
         {cards.map(card => (
             <InteractiveRoomCard 
                key={card.id}
                card={card}
                isActive={expandedCardId === card.id}
                isExpanded={expandedCardId === card.id}
                onCardClick={setExpandedCardId}
                onCardExpand={() => generateMockExpandedData(card.type)}
                onCardClose={() => setExpandedCardId(null)}
             />
         ))}
      </div>

      {/* Main Room List - Hidden when a card is expanded to reduce clutter, or kept below */}
      {!expandedCardId && (
        <div className="animate-in fade-in slide-in-from-bottom-4">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Room List</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayedRooms.map(room => (
                <RoomCard 
                    key={room.id} 
                    room={room} 
                    user={user} 
                    onStart={handleStartRoom}
                    onInspect={handleInspectRoom}
                />
                ))}
            </div>
        </div>
      )}
    </div>
  );
}
