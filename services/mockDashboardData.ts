
import { CardExpandedContent } from '../types';

export const getExpandedCardData = async (cardType: string): Promise<CardExpandedContent> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 600));

  const mockData: CardExpandedContent = {
    occupancy: {
      rooms: [
        { id: '1', name: 'Colonial', status: 'check_in_today', guestCount: 2, checkInTime: '14:00', cleaningStatus: 'in_progress' },
        { id: '2', name: 'Earth', status: 'check_out_today', guestCount: 1, checkOutTime: '10:00', cleaningStatus: 'completed' },
        { id: '3', name: 'Stone', status: 'stay_over', guestCount: 2, cleaningStatus: 'pending' },
        { id: '4', name: 'Leopard', status: 'vacant', guestCount: 0, cleaningStatus: 'cleaned' },
        { id: '5', name: 'Ocean', status: 'occupied', guestCount: 2, cleaningStatus: 'in_progress' },
        { id: '6', name: 'Country', status: 'check_in_today', guestCount: 2, checkInTime: '15:00', cleaningStatus: 'pending' },
      ],
      checkInsToday: [
        { id: 'ci1', roomName: 'Colonial', estimatedTime: '14:00', guestCount: 2, roomReady: false },
        { id: 'ci2', roomName: 'Country', estimatedTime: '15:00', guestCount: 2, roomReady: false },
      ],
      checkOutsToday: [
        { id: 'co1', roomName: 'Earth', dueTime: '10:00', cleaningStarted: true, minibarTotal: 120 },
      ],
      stayOvers: [],
      occupancyTrend: [
        { date: 'Mon', value: 45 },
        { date: 'Tue', value: 55 },
        { date: 'Wed', value: 67 },
        { date: 'Thu', value: 70 },
        { date: 'Fri', value: 90 },
        { date: 'Sat', value: 100 },
        { date: 'Sun', value: 85 },
      ],
      revenueProjection: {
        today: 12500,
        thisWeek: 85400,
        thisMonth: 345000
      }
    },
    roomsPending: {
      rooms: [
        { roomId: '1', roomName: 'Colonial', status: 'in_progress', cleaningType: 'check_in' },
        { roomId: '6', roomName: 'Country', status: 'pending', cleaningType: 'check_in' },
        { roomId: '3', roomName: 'Stone', status: 'pending', cleaningType: 'stay_over' },
      ],
      priorityOrder: [
        { roomId: '1', roomName: 'Colonial', priority: 'high', status: 'in_progress', assignedTo: 'Sarah', progress: 65, estimatedMinutes: 30, cleaningType: 'check_in' },
        { roomId: '6', roomName: 'Country', priority: 'high', status: 'pending', assignedTo: null, estimatedMinutes: 45, cleaningType: 'check_in' },
        { roomId: '3', roomName: 'Stone', priority: 'medium', status: 'pending', assignedTo: 'Mike', progress: 0, estimatedMinutes: 30, cleaningType: 'stay_over' },
      ],
      assignedAttendants: [
        { id: 'a1', name: 'Sarah Nkosi', onBreak: false, available: false, assignedRooms: 3, completedRooms: 1, averageTime: 42, qualityScore: 98, currentRooms: ['Colonial'] },
        { id: 'a2', name: 'Mike Smith', onBreak: true, available: false, assignedRooms: 2, completedRooms: 0, averageTime: 45, qualityScore: 95, currentRooms: ['Stone'] },
      ],
      estimatedCompletion: { time: '13:45' },
      qualityIssues: [
        { id: 'q1', roomName: 'Earth', description: 'Minibar not restocked', priority: 'medium' }
      ]
    },
    hoursThisWeek: {
      dailyHours: [
        { date: new Date().toISOString(), hours: 8.5, regularHours: 8.5, overtimeHours: 0, breakMinutes: 45, effectiveHours: 7.75 },
        { date: new Date(Date.now()-86400000).toISOString(), hours: 9.5, regularHours: 9, overtimeHours: 0.5, breakMinutes: 45, effectiveHours: 8.75 },
        { date: new Date(Date.now()-86400000*2).toISOString(), hours: 8.0, regularHours: 8, overtimeHours: 0, breakMinutes: 45, effectiveHours: 7.25 },
      ],
      projectHours: { total: 32.5, remaining: 12.5 },
      overtimeForecast: { hours: 2.5, cost: 450 },
      laborCost: { actual: 15400, vsBudget: 2.5 },
      departmentBreakdown: [
        { name: 'Kitchen', hours: 145 },
        { name: 'Housekeeping', hours: 120 },
        { name: 'Maintenance', hours: 85 },
        { name: 'Front Desk', hours: 90 },
      ]
    },
    sopStatus: {
      certifications: [
        { id: 'c1', name: 'Food Safety L1', status: 'certified' },
        { id: 'c2', name: 'Fire Safety', status: 'certified' },
        { id: 'c3', name: 'Guest Relations', status: 'expired' },
      ],
      expiringSoon: [
        { id: 'e1', employeeName: 'Thabo Molefe', sopCode: 'ZL-SOP-005', sopName: 'Waste Management', expiryDate: new Date(Date.now() + 86400000*5).toISOString(), daysUntilExpiry: 5 },
        { id: 'e2', employeeName: 'Sarah Nkosi', sopCode: 'ZL-SOP-015', sopName: 'Laundry Handling', expiryDate: new Date(Date.now() + 86400000*12).toISOString(), daysUntilExpiry: 12 },
      ],
      pendingTests: [
        { id: 'p1', employeeName: 'Mike Smith', sopCode: 'ZL-SOP-025', sopName: 'Emergency Evacuation', dueDate: new Date(Date.now() + 86400000).toISOString(), overdue: false },
      ],
      complianceRate: { overall: 94, departmentCount: 4 },
      departmentScores: [
        { department: 'Kitchen', totalStaff: 5, certifiedStaff: 5, complianceRate: 100 },
        { department: 'Housekeeping', totalStaff: 8, certifiedStaff: 7, complianceRate: 87.5 },
        { department: 'Maintenance', totalStaff: 3, certifiedStaff: 3, complianceRate: 100 },
        { department: 'Front Desk', totalStaff: 4, certifiedStaff: 3, complianceRate: 75 },
      ]
    }
  };

  return mockData;
};
