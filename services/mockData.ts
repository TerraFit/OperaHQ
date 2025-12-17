
import { Employee, UserRole, Shift, SOPAttempt, AuditLog, PlanningEvent, SOP } from '../types';
import { STANDARD_SOPS } from '../constants';

export const CURRENT_USER_ID = 'emp-001'; // Acting as logged in user for demo

export const MOCK_EMPLOYEES: Employee[] = [
  {
    id: 'admin-001',
    firstName: 'System',
    lastName: 'Admin',
    role: UserRole.SUPER_ADMIN,
    jobTitle: 'Super Administrator',
    department: 'Administration',
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
    dateStarted: '2020-01-15',
    birthday: '1985-06-12',
    idNumber: '8506125899081',
    phone: '+27 82 555 1234',
    email: 'thabo.m@zebralodge.co.za',
    privateAddress: '12 Acacia Avenue, Pretoria',
    clothingSize: 'L',
    shoeSize: '9',
    uniformSize: 'L',
    emergencyContactName: 'Grace Molefe',
    emergencyContactPhone: '+27 82 555 9999',
    status: 'active',
    warnings: 0,
    praises: 5,
    guestCompliments: 12,
    guestComplaints: 0,
    absencesCount: 0,
    lateArrivalsCount: 1,
    holidaysEarned: 15.3,
    holidaysTaken: 10,
    overtimeBalance: 2.5
  },
  {
    id: 'emp-002',
    firstName: 'Sarah',
    lastName: 'Nkosi',
    role: UserRole.STAFF,
    jobTitle: 'Commis Chef',
    department: 'Kitchen',
    dateStarted: '2023-03-01',
    birthday: '1998-11-23',
    idNumber: '9811230055089',
    phone: '+27 71 222 3344',
    email: 'sarah.n@zebralodge.co.za',
    clothingSize: 'S',
    shoeSize: '5',
    uniformSize: 'S',
    emergencyContactName: 'Joseph Nkosi',
    emergencyContactPhone: '+27 71 222 5555',
    status: 'active',
    warnings: 1,
    praises: 2,
    guestCompliments: 3,
    guestComplaints: 0,
    absencesCount: 1,
    lateArrivalsCount: 2,
    holidaysEarned: 5.1,
    holidaysTaken: 0,
    overtimeBalance: 0
  }
];

export const MOCK_SHIFTS: Shift[] = [
  {
    id: 'sh-101',
    employeeId: 'emp-002',
    date: new Date().toISOString().split('T')[0],
    type: 'split',
    start: new Date().toISOString(), // Mocking active shift
    end: '',
    totalHours: 8.25,
    status: 'scheduled',
    breakTaken: false
  }
];

// Use the standard definitions from constants
export const MOCK_SOPS: SOP[] = [...STANDARD_SOPS];

export const MOCK_SOP_ATTEMPTS: SOPAttempt[] = [
  {
    id: 'att-001',
    sopCode: 'ZL-SOP-001',
    sopId: 'sop-001',
    userId: 'emp-001',
    score: 100,
    passed: true,
    timestamp: new Date(Date.now() - 30 * 86400000).toISOString(), // 30 days ago (eligible for retest)
    validUntil: new Date(Date.now() + 335 * 86400000).toISOString(),
    nextEligibleDate: new Date(Date.now() - 2 * 86400000).toISOString() // 2 days ago
  },
  {
    id: 'att-002',
    sopCode: 'ZL-SOP-002',
    sopId: 'sop-002',
    userId: 'emp-001',
    score: 80,
    passed: false,
    timestamp: new Date().toISOString(), // Just failed
    validUntil: '',
    nextEligibleDate: new Date(Date.now() + 28 * 86400000).toISOString() // 28 days from now
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
  },
  {
    id: 'log-002',
    timestamp: '2023-10-28T09:15:00Z',
    userId: 'admin-001',
    action: 'USER_ROLE_UPDATE',
    reason: 'Promotion',
    changes: 'Promoted Sarah Nkosi to Team Leader'
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
  },
  {
    id: 'evt-002',
    date: new Date(Date.now() + 86400000).toISOString().split('T')[0], // Tomorrow
    title: 'Health Inspection',
    type: 'deadline',
    description: 'Prepare kitchen for external audit',
    createdBy: 'emp-001'
  }
];