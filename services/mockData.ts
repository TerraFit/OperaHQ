import { Employee, UserRole, Shift, SOPAttempt, AuditLog, PlanningEvent } from '../types';

export const CURRENT_USER_ID = 'emp-001'; // Acting as logged in user for demo

export const MOCK_EMPLOYEES: Employee[] = [
  {
    id: 'emp-001',
    firstName: 'Thabo',
    lastName: 'Molefe',
    role: UserRole.MANAGER,
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

export const MOCK_SOP_ATTEMPTS: SOPAttempt[] = [
  {
    id: 'att-001',
    sopCode: 'ZL-SOP-001',
    userId: 'emp-001',
    score: 100,
    passed: true,
    timestamp: '2023-10-01T10:00:00Z'
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