import { ChefShiftType, ShiftConfig, SOP, UserRole } from './types';

// ZEBRA LODGE COORDINATES (Mocked for demo purposes)
export const WORKPLACE_LOCATION = {
  lat: -25.0000, 
  lng: 28.0000 
};

// STRICT GEOFENCING: 15 Meters
export const GEO_FENCE_RADIUS_METERS = 15;

// SOUTH AFRICAN PUBLIC HOLIDAYS (2024/2025 Example)
export const SA_PUBLIC_HOLIDAYS = [
  '2024-01-01', '2024-03-21', '2024-03-29', '2024-04-01', '2024-04-27', 
  '2024-05-01', '2024-06-16', '2024-08-09', '2024-09-24', '2024-12-16', 
  '2024-12-25', '2024-12-26',
  '2025-01-01', '2025-03-21', '2025-04-18', '2025-04-21', '2025-04-27',
  '2025-05-01', '2025-06-16', '2025-08-09', '2025-09-24', '2025-12-16',
  '2025-12-25', '2025-12-26'
];

export const CHEF_SHIFTS: Record<ChefShiftType, ShiftConfig> = {
  split: {
    type: 'split',
    startTime: '07:45',
    endTime: '11:00',
    secondStartTime: '16:00',
    secondEndTime: '21:00',
    totalHours: 8.25
  },
  morning: {
    type: 'morning',
    startTime: '07:45',
    endTime: '11:00',
    totalHours: 3.25
  },
  evening: {
    type: 'evening',
    startTime: '16:00',
    endTime: '21:00',
    totalHours: 5.0
  },
  function_lunch: {
    type: 'function_lunch',
    startTime: '10:00',
    endTime: '14:00',
    totalHours: 4.0
  },
  double_split: {
    type: 'double_split',
    startTime: '07:45',
    endTime: '14:00',
    secondStartTime: '16:00',
    secondEndTime: '21:00',
    totalHours: 11.25
  }
};

export const STANDARD_SOPS: SOP[] = [
  { code: 'ZL-SOP-001', title: 'Food Safety Level 1', department: 'kitchen' },
  { code: 'ZL-SOP-002', title: 'Knife Safety', department: 'kitchen' },
  { code: 'ZL-SOP-003', title: 'Chemical Handling', department: 'all' },
  { code: 'ZL-SOP-004', title: 'Personal Hygiene', department: 'all' },
  { code: 'ZL-SOP-005', title: 'Waste Management', department: 'kitchen' },
  { code: 'ZL-SOP-006', title: 'Receiving Goods', department: 'kitchen' },
  { code: 'ZL-SOP-007', title: 'Storage Procedures', department: 'kitchen' },
  { code: 'ZL-SOP-008', title: 'Thawing Procedures', department: 'kitchen' },
  { code: 'ZL-SOP-009', title: 'Cooking Temperatures', department: 'kitchen' },
  { code: 'ZL-SOP-010', title: 'Cooling Food', department: 'kitchen' },
  { code: 'ZL-SOP-011', title: 'Reheating Food', department: 'kitchen' },
  { code: 'ZL-SOP-012', title: 'Serving Food', department: 'kitchen' },
  { code: 'ZL-SOP-013', title: 'Cleaning Schedules', department: 'kitchen' },
  { code: 'ZL-SOP-014', title: 'Pest Control', department: 'kitchen' },
  { code: 'ZL-SOP-015', title: 'Laundry Handling', department: 'housekeeping' },
  { code: 'ZL-SOP-016', title: 'Room Cleaning Steps', department: 'housekeeping' },
  { code: 'ZL-SOP-017', title: 'Lost and Found', department: 'all' },
  { code: 'ZL-SOP-018', title: 'Key Control', department: 'all' },
  { code: 'ZL-SOP-019', title: 'Guest Greeting', department: 'all' },
  { code: 'ZL-SOP-020', title: 'Complaint Handling', department: 'all' },
  { code: 'ZL-SOP-021', title: 'Telephone Etiquette', department: 'all' },
  { code: 'ZL-SOP-022', title: 'Uniform Standards', department: 'all' },
  { code: 'ZL-SOP-023', title: 'Time & Attendance', department: 'all' },
  { code: 'ZL-SOP-024', title: 'Incident Reporting', department: 'all' },
  { code: 'ZL-SOP-025', title: 'Emergency Evacuation', department: 'all' }
];

export const PERMISSIONS = {
  [UserRole.STAFF]: ['employee:read:own', 'schedule:read:own', 'sop:read:assigned', 'sop:complete', 'clock:self'],
  [UserRole.SUPERVISOR]: ['employee:read:dept', 'schedule:read:dept', 'sop:read:dept', 'sop:assign', 'clock:self'],
  [UserRole.MANAGER]: ['employee:read:all', 'employee:write', 'schedule:write', 'sop:write', 'audit:read', 'clock:override'],
  [UserRole.ADMIN]: ['*']
};