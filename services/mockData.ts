
import { Employee, UserRole, Shift, SOPAttempt, AuditLog, PlanningEvent, SOP, SOPCreationRequest, RosterEntry, SpecialEvent } from '../types';
import { STANDARD_SOPS } from '../constants';

export const CURRENT_USER_ID = 'emp-001';

export const MOCK_EMPLOYEES: Employee[] = [
  {
    id: 'admin-001',
    firstName: 'System',
    lastName: 'Admin',
    role: UserRole.SUPER_ADMIN,
    jobTitle: 'Super Administrator',
    department: 'Administration',
    employmentType: 'permanent',
    dateStarted: '2020-01-01',
    birthday: '1980-01-01',
    idNumber: '8001015000080',
    phone: '+27 82 000 0000',
    email: 'admin@zebralodge.co.za',
    status: 'active',
    warnings: 0,
    praises: 0,
    guestCompliments: 0,
    guestComplaints: 0,
    absencesCount: 0,
    lateArrivalsCount: 0,
    holidaysEarned: 0,
    holidaysTaken: 0,
    overtimeBalance: 0,
    emergencyContactName: 'Admin Support',
    emergencyContactPhone: '+27 82 000 9999'
  },
  {
    id: 'gm-001',
    firstName: 'Sarah',
    lastName: 'Connor',
    role: UserRole.GENERAL_MANAGER,
    jobTitle: 'General Manager',
    department: 'Management',
    employmentType: 'permanent',
    dateStarted: '2021-03-15',
    birthday: '1982-05-20',
    idNumber: '8205200055081',
    phone: '+27 83 555 1111',
    email: 'gm@zebralodge.co.za',
    status: 'active',
    warnings: 0,
    praises: 10,
    guestCompliments: 25,
    guestComplaints: 0,
    absencesCount: 0,
    lateArrivalsCount: 0,
    holidaysEarned: 20,
    holidaysTaken: 5,
    overtimeBalance: 0,
    emergencyContactName: 'John Connor',
    emergencyContactPhone: '+27 83 555 2222'
  },
  {
    id: 'emp-001',
    firstName: 'Thabo',
    lastName: 'Molefe',
    role: UserRole.DEPARTMENT_MANAGER,
    jobTitle: 'Head Chef',
    department: 'Kitchen',
    employmentType: 'permanent',
    dateStarted: '2020-01-15',
    birthday: '1985-06-12',
    idNumber: '8506125899081',
    phone: '+27 82 555 1234',
    email: 'thabo.m@zebralodge.co.za',
    status: 'active',
    warnings: 0,
    praises: 5,
    guestCompliments: 12,
    guestComplaints: 0,
    absencesCount: 0,
    lateArrivalsCount: 1,
    holidaysEarned: 15.3,
    holidaysTaken: 10,
    overtimeBalance: 2.5,
    emergencyContactName: 'Grace Molefe',
    emergencyContactPhone: '+27 82 555 9999'
  },
  {
    id: 'emp-002',
    firstName: 'Sarah',
    lastName: 'Nkosi',
    role: UserRole.STAFF,
    jobTitle: 'Commis Chef',
    department: 'Kitchen',
    employmentType: 'permanent',
    dateStarted: '2023-03-01',
    birthday: '1998-11-23',
    idNumber: '9811230055089',
    phone: '+27 71 222 3344',
    email: 'sarah.n@zebralodge.co.za',
    status: 'active',
    warnings: 1,
    praises: 2,
    guestCompliments: 3,
    guestComplaints: 0,
    absencesCount: 1,
    lateArrivalsCount: 2,
    holidaysEarned: 5.1,
    holidaysTaken: 0,
    overtimeBalance: 0,
    emergencyContactName: 'Joseph Nkosi',
    emergencyContactPhone: '+27 71 222 5555'
  },
  {
    id: 'emp-003',
    firstName: 'Mike',
    lastName: 'Smith',
    role: UserRole.STAFF,
    jobTitle: 'Housekeeper',
    employmentType: 'permanent',
    department: 'Housekeeping',
    dateStarted: '2023-05-10',
    birthday: '1995-02-14',
    idNumber: '9502145000088',
    phone: '+27 72 333 4455',
    email: 'mike.s@zebralodge.co.za',
    status: 'active',
    warnings: 0,
    praises: 1,
    guestCompliments: 2,
    guestComplaints: 0,
    absencesCount: 0,
    lateArrivalsCount: 0,
    holidaysEarned: 4.0,
    holidaysTaken: 0,
    overtimeBalance: 0,
    emergencyContactName: 'Jane Smith',
    emergencyContactPhone: '+27 72 333 9999'
  }
];

export const MOCK_SHIFTS: Shift[] = [
  {
    id: 'sh-101',
    employeeId: 'emp-002',
    date: new Date().toISOString().split('T')[0],
    type: 'split',
    start: new Date().toISOString(),
    end: '',
    totalHours: 8.25,
    status: 'scheduled',
    breakTaken: false
  }
];

export const MOCK_ROSTER_ENTRIES: RosterEntry[] = [
  { id: 're-001', staffId: 'emp-001', date: '2024-12-01', code: 'O' },
  { id: 're-002', staffId: 'emp-001', date: '2024-12-02', code: 'D' },
];

export const MOCK_SPECIAL_EVENTS: SpecialEvent[] = [
  {
    id: 'evt-001',
    title: '5 DEC FUNCTION',
    description: '30 Guests for Lunch',
    date: '2024-12-05',
    startTime: '11:00',
    endTime: '15:00',
    expectedGuests: 30,
    staffRequired: 5,
    status: 'confirmed',
    type: 'function'
  },
  {
    id: 'evt-002',
    title: 'MANAGEMENT ABSENCE',
    description: 'Sarah Connor at Conference',
    date: '2024-12-12',
    status: 'confirmed',
    type: 'management_absence',
    managerId: 'gm-001'
  },
  {
    id: 'evt-003',
    title: 'Day of Reconciliation',
    date: '2024-12-16',
    status: 'confirmed',
    type: 'holiday'
  }
];

export const MOCK_SOPS: SOP[] = [...STANDARD_SOPS];

export const MOCK_SOP_ATTEMPTS: SOPAttempt[] = [
  {
    id: 'att-001',
    sopCode: 'ZL-SOP-001',
    sopId: 'sop-001',
    userId: 'emp-001',
    score: 100,
    passed: true,
    timestamp: new Date(Date.now() - 30 * 86400000).toISOString(),
    validUntil: new Date(Date.now() + 335 * 86400000).toISOString(),
    nextEligibleDate: new Date(Date.now() - 2 * 86400000).toISOString()
  }
];

export const MOCK_SOP_REQUESTS: SOPCreationRequest[] = [
  {
    id: 'req-001',
    title: 'VIP Suite Preparation',
    department: 'housekeeping',
    category: 'guest_service',
    description: 'Special procedures for preparing VIP suites and presidential rooms',
    priority: 'high',
    status: 'in_progress',
    method: 'internal',
    assignedToName: 'Sarah Nkosi',
    assignedToId: 'emp-002',
    assignedBy: 'admin-001',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    deadline: new Date(Date.now() + 86400000 * 3).toISOString(),
    progress: 75
  }
];

export const MOCK_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'log-001',
    timestamp: '2023-10-27T08:00:00Z',
    userId: 'emp-001',
    action: 'SCHEDULE_CREATE',
    reason: 'Weekly roster generation',
    changes: 'Created shift sh-101'
  }
];

export const MOCK_PLANNING_EVENTS: PlanningEvent[] = [
  {
    id: 'evt-001',
    date: new Date().toISOString().split('T')[0],
    title: 'Staff Meeting',
    type: 'meeting',
    description: 'Weekly alignment',
    createdBy: 'emp-001'
  }
];
