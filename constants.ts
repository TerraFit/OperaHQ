
import { ChefShiftType, ShiftConfig, SOP, UserRole, DepartmentVisualConfig } from './types';

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

const DEFAULT_SOP_PROPS = {
  category: 'general',
  version: '1.0',
  contentHtml: '<p>Standard procedure content.</p>',
  questions: [],
  passingScore: 100,
  timeLimitMinutes: 30,
  retestIntervalWeeks: 4
};

export const STANDARD_SOPS: SOP[] = [
  // KITCHEN
  { id: 'sop-001', code: 'ZL-SOP-001', title: 'Food Safety Level 1', department: 'kitchen', category: 'food_safety', version: '1.0', contentHtml: '<h1>Food Safety</h1><p>Full SOP content...</p>', questions: [{question: "Danger zone temp?", options: ["0-5", "5-60", "60+"], correctIndex: 1}], passingScore: 100, timeLimitMinutes: 30, retestIntervalWeeks: 4 },
  { id: 'sop-002', code: 'ZL-SOP-002', title: 'Knife Safety & Handling', department: 'kitchen', category: 'safety', version: '1.0', contentHtml: '<h1>Knife Safety</h1><p>Full content...</p>', questions: [{question: "Pass knife how?", options: ["Blade", "Handle", "Throw"], correctIndex: 1}], passingScore: 100, timeLimitMinutes: 30, retestIntervalWeeks: 4 },
  { id: 'sop-003', code: 'ZL-SOP-003', title: 'Commercial Oven Operation', department: 'kitchen', category: 'equipment', version: '1.0', contentHtml: '<p>Content...</p>', questions: [], passingScore: 100, timeLimitMinutes: 30, retestIntervalWeeks: 4 },
  { id: 'sop-004', code: 'ZL-SOP-004', title: 'Walk-in Fridge Safety', department: 'kitchen', category: 'safety', version: '1.0', contentHtml: '<p>Content...</p>', questions: [], passingScore: 100, timeLimitMinutes: 30, retestIntervalWeeks: 4 },
  { id: 'sop-005', code: 'ZL-SOP-005', title: 'Dishwashing & Sanitization', department: 'kitchen', category: 'hygiene', version: '1.0', contentHtml: '<p>Content...</p>', questions: [], passingScore: 100, timeLimitMinutes: 30, retestIntervalWeeks: 4 },
  
  // HOUSEKEEPING
  { id: 'sop-006', code: 'ZL-SOP-006', title: 'Room Cleaning Procedure', department: 'housekeeping', category: 'cleaning', version: '1.0', contentHtml: '<p>Content...</p>', questions: [], passingScore: 100, timeLimitMinutes: 30, retestIntervalWeeks: 4 },
  { id: 'sop-007', code: 'ZL-SOP-007', title: 'Chemical Handling & Dilution', department: 'housekeeping', category: 'safety', version: '1.0', contentHtml: '<p>Content...</p>', questions: [], passingScore: 100, timeLimitMinutes: 30, retestIntervalWeeks: 4 },
  { id: 'sop-008', code: 'ZL-SOP-008', title: 'Linen Handling Protocol', department: 'housekeeping', category: 'hygiene', version: '1.0', contentHtml: '<p>Content...</p>', questions: [], passingScore: 100, timeLimitMinutes: 30, retestIntervalWeeks: 4 },
  { id: 'sop-009', code: 'ZL-SOP-009', title: 'Minibar Restocking', department: 'housekeeping', category: 'inventory', version: '1.0', contentHtml: '<p>Content...</p>', questions: [], passingScore: 100, timeLimitMinutes: 30, retestIntervalWeeks: 4 },
  { id: 'sop-010', code: 'ZL-SOP-010', title: 'Lost Property Procedure', department: 'housekeeping', category: 'guest_services', version: '1.0', contentHtml: '<p>Content...</p>', questions: [], passingScore: 100, timeLimitMinutes: 30, retestIntervalWeeks: 4 },

  // MAINTENANCE
  { id: 'sop-011', code: 'ZL-SOP-011', title: 'Basic Electrical Safety', department: 'maintenance', category: 'safety', version: '1.0', contentHtml: '<p>Content...</p>', questions: [], passingScore: 100, timeLimitMinutes: 30, retestIntervalWeeks: 4 },
  { id: 'sop-012', code: 'ZL-SOP-012', title: 'Pool Chemical Handling', department: 'maintenance', category: 'chemical', version: '1.0', contentHtml: '<p>Content...</p>', questions: [], passingScore: 100, timeLimitMinutes: 30, retestIntervalWeeks: 4 },
  { id: 'sop-013', code: 'ZL-SOP-013', title: 'Ladder Safety', department: 'maintenance', category: 'safety', version: '1.0', contentHtml: '<p>Content...</p>', questions: [], passingScore: 100, timeLimitMinutes: 30, retestIntervalWeeks: 4 },
  { id: 'sop-014', code: 'ZL-SOP-014', title: 'Pressure Washer Operation', department: 'maintenance', category: 'equipment', version: '1.0', contentHtml: '<p>Content...</p>', questions: [], passingScore: 100, timeLimitMinutes: 30, retestIntervalWeeks: 4 },
  { id: 'sop-015', code: 'ZL-SOP-015', title: 'Generator Operation & Testing', department: 'maintenance', category: 'critical', version: '1.0', contentHtml: '<p>Content...</p>', questions: [], passingScore: 100, timeLimitMinutes: 30, retestIntervalWeeks: 4 },

  // GROUNDS
  { id: 'sop-016', code: 'ZL-SOP-016', title: 'Chainsaw Operation', department: 'grounds', category: 'dangerous', version: '1.0', contentHtml: '<p>Content...</p>', questions: [], passingScore: 100, timeLimitMinutes: 30, retestIntervalWeeks: 4 },
  { id: 'sop-017', code: 'ZL-SOP-017', title: 'Brush Cutter Safety', department: 'grounds', category: 'dangerous', version: '1.0', contentHtml: '<p>Content...</p>', questions: [], passingScore: 100, timeLimitMinutes: 30, retestIntervalWeeks: 4 },
  { id: 'sop-018', code: 'ZL-SOP-018', title: 'Tractor Operation', department: 'grounds', category: 'vehicle', version: '1.0', contentHtml: '<p>Content...</p>', questions: [], passingScore: 100, timeLimitMinutes: 30, retestIntervalWeeks: 4 },
  { id: 'sop-019', code: 'ZL-SOP-019', title: 'Chemical Spraying', department: 'grounds', category: 'chemical', version: '1.0', contentHtml: '<p>Content...</p>', questions: [], passingScore: 100, timeLimitMinutes: 30, retestIntervalWeeks: 4 },
  { id: 'sop-020', code: 'ZL-SOP-020', title: 'Fire Extinguisher Use', department: 'all', category: 'safety', version: '1.0', contentHtml: '<p>Content...</p>', questions: [], passingScore: 100, timeLimitMinutes: 30, retestIntervalWeeks: 4 },

  // FRONT DESK & GENERAL
  { id: 'sop-021', code: 'ZL-SOP-021', title: 'Check-in Procedure', department: 'front_desk', category: 'guest_services', version: '1.0', contentHtml: '<p>Content...</p>', questions: [], passingScore: 100, timeLimitMinutes: 30, retestIntervalWeeks: 4 },
  { id: 'sop-022', code: 'ZL-SOP-022', title: 'Emergency Evacuation', department: 'all', category: 'safety', version: '1.0', contentHtml: '<p>Content...</p>', questions: [], passingScore: 100, timeLimitMinutes: 30, retestIntervalWeeks: 4 },
  { id: 'sop-023', code: 'ZL-SOP-023', title: 'First Aid Response', department: 'all', category: 'safety', version: '1.0', contentHtml: '<p>Content...</p>', questions: [], passingScore: 100, timeLimitMinutes: 30, retestIntervalWeeks: 4 },
  { id: 'sop-024', code: 'ZL-SOP-024', title: 'CCTV & Security', department: 'front_desk', category: 'security', version: '1.0', contentHtml: '<p>Content...</p>', questions: [], passingScore: 100, timeLimitMinutes: 30, retestIntervalWeeks: 4 },
  { id: 'sop-025', code: 'ZL-SOP-025', title: 'Data Protection (POPIA)', department: 'all', category: 'compliance', version: '1.0', contentHtml: '<p>Content...</p>', questions: [], passingScore: 100, timeLimitMinutes: 30, retestIntervalWeeks: 4 }
];

// DEPARTMENT VISUAL IDENTITY
export const DEPARTMENT_VISUALS: Record<string, DepartmentVisualConfig> = {
  kitchen: { color: '#FF6B6B', icon: '🍳', bgLight: '#FFF5F5' },
  housekeeping: { color: '#4ECDC4', icon: '🧹', bgLight: '#F0FCFB' },
  maintenance: { color: '#45B7D1', icon: '🔧', bgLight: '#F0F9FC' },
  front_desk: { color: '#96CEB4', icon: '💼', bgLight: '#F5FAF7' },
  laundry: { color: '#FFEAA7', icon: '👕', bgLight: '#FFFDF5' },
  grounds: { color: '#55EFC4', icon: '🌳', bgLight: '#F5FFFC' },
  general: { color: '#DDA0DD', icon: '🌍', bgLight: '#FDF5FD' },
  personal: { color: '#F8C8DC', icon: '👤', bgLight: '#FFF5F9' },
  all: { color: '#A0AEC0', icon: '📚', bgLight: '#F7FAFC' }
};

export const PERMISSIONS = {
  [UserRole.SUPER_ADMIN]: ['*'], // Full System Access
  
  [UserRole.GENERAL_MANAGER]: [
    'users:manage', 'departments:manage', 'sops:manage_all', 'training:assign_all',
    'reports:full', 'certificates:issue', 'compliance:oversee', 'employee:read:all',
    'schedule:write', 'audit:read', 'clock:override'
  ],
  
  [UserRole.DEPARTMENT_MANAGER]: [
    'users:manage_dept', 'sops:manage_dept', 'training:assign_dept', 'reports:dept',
    'schedule:view_dept', 'employee:read:dept', 'schedule:write', 'sop:read:dept',
    'sop:assign', 'clock:self'
  ],
  
  [UserRole.SUPERVISOR]: [
    'users:view_team', 'progress:track_team', 'training:assign_team', 'reports:team',
    'sops:view_dept', 'employee:read:dept', 'schedule:read:dept', 'sop:read:assigned',
    'sop:complete', 'clock:self'
  ],
  
  [UserRole.TEAM_LEADER]: [
    'users:view_team', 'progress:track_team', 'reports:basic', 'sops:view_assigned',
    'training:complete', 'profile:manage', 'employee:read:own', 'schedule:read:own',
    'clock:self'
  ],
  
  [UserRole.STAFF]: [
    'sops:view_assigned', 'training:complete', 'profile:manage', 'certificates:view',
    'employee:read:own', 'schedule:read:own', 'sop:complete', 'clock:self'
  ],
  
  [UserRole.TRAINEE]: [
    'sops:view_assigned', 'training:complete', 'profile:view', 'employee:read:own',
    'schedule:read:own', 'clock:self'
  ]
};