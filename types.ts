
import React from 'react';


// ROLES
export enum UserRole {
  STAFF = 'staff',
  SUPERVISOR = 'supervisor',
  MANAGER = 'manager',
  ADMIN = 'admin'
}

// SHIFT TYPES
export type ChefShiftType = 'split' | 'morning' | 'evening' | 'function_lunch' | 'double_split';

export interface ShiftConfig {
  type: ChefShiftType;
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  secondStartTime?: string; // For splits
  secondEndTime?: string; // For splits
  totalHours: number;
}

// EMPLOYEE SCHEMA (Matches SQL mandate)
export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  photoUrl?: string;
  role: UserRole; // Mapped from DB 'role'
  jobTitle: string; // Chef, Housekeeper etc
  department: string;
  dateStarted: string; // ISO Date
  birthday: string; // ISO Date
  idNumber: string;
  phone: string;
  email: string;
  privateAddress?: string; // Manager/Admin only

  // Employment Details
  clothingSize?: string;
  shoeSize?: string;
  uniformSize?: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  status: 'active' | 'inactive' | 'on_leave';

  // Performance
  warnings: number;
  praises: number;
  guestCompliments: number;
  guestComplaints: number;
  absencesCount: number;
  lateArrivalsCount: number;
  holidaysEarned: number;
  holidaysTaken: number;
  overtimeBalance: number;
}

// SCHEDULE & TIME
export interface Shift {
  id: string;
  employeeId: string;
  date: string; // YYYY-MM-DD
  type: ChefShiftType;
  start: string; // ISO Date
  end: string; // ISO Date
  totalHours: number;
  status: 'scheduled' | 'clocked_in' | 'clocked_out' | 'break';
  breakTaken: boolean;
  actualClockIn?: string; // ISO Date
  actualClockOut?: string; // ISO Date
}

// PLANNING
export interface PlanningEvent {
  id: string;
  date: string; // YYYY-MM-DD
  title: string;
  type: 'meeting' | 'training' | 'deadline' | 'other';
  description?: string;
  createdBy: string;
}

// SOP
export interface SOP {
  code: string;
  title: string;
  department: string;
}

export interface SOPAttempt {
  id: string;
  sopCode: string;
  userId: string;
  score: number; // 0-100
  passed: boolean;
  timestamp: string;
}

// AUDIT
export interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  action: string;
  reason: string;
  changes: string; // JSON string
}

// COMPLIANCE RESULTS
export interface ComplianceCheck {
  valid: boolean;
  errors: string[];
}

// --- MAINTENANCE TYPES (SOP 9.9.1) ---

export type MaintenanceFrequency = 'DAILY' | 'WEEKLY' | 'EVERY_TWO_WEEKS' | 'MONTHLY' | 'PERIODICALLY' | 'SUMMER_SEASONAL';
export type MaintenanceArea = 'zebra_lodge' | 'private_area' | 'property';
export type MachineType = 'brush_cutter' | 'chainsaw' | 'tractor' | 'mini_excavator' | 'earth_auger' | 'lawn_mower' | 'pool_pump' | 'generator' | 'sprayer';
export type TaskPriority = 'emergency' | 'high' | 'medium' | 'low' | 'scheduled';
export type TaskStatus = 'assigned' | 'acknowledged' | 'in_progress' | 'on_hold' | 'completed' | 'verified' | 'failed' | 'cancelled';

export interface WeatherData {
  temperature: number;
  windSpeed: number;
  isRaining: boolean;
  rainLast24Hours: number;
}

export interface MachineCertification {
  id: string;
  employeeId: string;
  machineType: MachineType;
  score: number;
  testDate: string; // ISO
  requiresRetestBy?: string; // ISO
  consecutiveFails: number;
}

export interface MaintenanceTask {
  id: string;
  code: string;
  description: string;
  area: MaintenanceArea;
  frequency: MaintenanceFrequency;
  estimatedMinutes: number;
  
  // Specific constraints
  conditionalRequirements?: Record<string, boolean>; // e.g. { "only_in_winter": true }
  
  // Daily/Weekly specifics
  requiresPhoto?: boolean;
  requiresMeasurement?: boolean;
  measurementUnit?: string;
  
  // Weekly specific
  dayOfWeek?: number; // 1=Mon, 7=Sun
  
  // Bi-Weekly specific
  weekParity?: 'odd' | 'even' | 'both';
  requiresSupervisorCheck?: boolean;
  
  // Monthly specifics
  requiresTcrMethod?: boolean;
  tcrWidthMeters?: number;
  requiresTimeLogging?: boolean;
  
  // Periodic specifics
  triggerEvents?: string[];
  vineyardPhase?: string;
  requiresManagementInstruction?: boolean;

  // VINEYARD SPECIFIC
  category?: 'vineyard' | 'general';
  weatherConstraints?: {
    maxWindSpeed?: number;
    maxTemp?: number;
    noRain?: boolean;
  };
  measurementsRequired?: ('shoot_length' | 'grass_height' | 'area')[];
  ppeRequired?: string[];
}

export interface AssignedTask {
  id: string;
  templateId?: string; // If linked to standard task
  title: string;
  description: string;
  priority: TaskPriority;
  
  // Assignment
  assignedTo: string; // Employee ID
  assignedBy: string; // Employee ID
  assignedAt: string; // ISO
  dueDate: string; // YYYY-MM-DD
  dueTime: string; // HH:mm
  
  // Machines
  machinesRequired?: MachineType[];
  
  // Status & Progress
  status: TaskStatus;
  progress: number; // 0 to 100
  // JSONB column to track progress and associated data
  milestones: Record<number, {
    completedAt: string;
    notes?: string;
    photoUrl?: string;
  }>;
  
  // Completion
  completedAt?: string;
  timeSpentMinutes?: number;
}

export interface MaintenanceLog {
  id: string;
  taskId: string;
  taskCode: string;
  userId: string;
  date: string; // YYYY-MM-DD
  status: 'completed' | 'skipped' | 'pending';
  notes?: string;
  
  // Evidence
  photoUrl?: string;
  measurementValue?: number;
  
  // Vineyard Specific Measurements
  measurements?: Record<string, number>;
  
  // Time Logging (Trails/Machines)
  timeSpentHours?: number;
  
  // Gas Bottle Specifics
  gasBottleData?: {
    bottleId: string;
    currentWeight: number;
    valveCondition: 'good' | 'needs_attention' | 'replace';
    hoseCondition: 'good' | 'cracked' | 'replace';
    regulatorCondition: 'good' | 'faulty' | 'replace';
    leakTestResult: 'no_leaks' | 'minor_leak' | 'major_leak';
  };
  
  completedAt: string; // ISO
}

// --- OCCUPANCY & HOUSEKEEPING TYPES ---

export type RoomStatusType = 'vacant' | 'occupied' | 'check_in_today' | 'check_out_today' | 'stay_over' | 'out_of_order' | 'cleaning_in_progress' | 'cleaned';
export type CleaningStatusType = 'not_cleaned' | 'cleaning_in_progress' | 'cleaned' | 'inspected' | 'failed_inspection';

export interface Guest {
  id: string;
  name: string;
  email?: string;
  numberOfAdults: number;
  numberOfChildren: number;
  childrenDetails?: { name: string; age: number }[];
  foodRestrictions?: string[];
  specialRequests?: string;
}

export interface RoomOccupancy {
  id: string;
  name: string; // e.g., "Colonial", "Earth"
  status: RoomStatusType;
  cleaningStatus: CleaningStatusType;
  assignedAttendantId?: string;
  
  // Booking Details
  guestId?: string;
  checkInDate: string; // YYYY-MM-DD
  checkOutDate: string; // YYYY-MM-DD
  
  // Requirements
  dinnerIncluded: boolean;
  extraBed: boolean;
  babyCot: boolean;
  
  // Minibar
  minibarBalance: number;
  
  // Workflow
  lastCleaned?: string; // ISO
  inspectedBy?: string;
}

export interface HotelEvent {
  id: string;
  name: string;
  type: 'wedding' | 'conference' | 'business_lunch' | 'private_dinner' | 'other';
  date: string;
  startTime: string;
  endTime: string;
  guestCount: number;
  location: string;
  status: 'confirmed' | 'in_progress' | 'completed';
}

export interface CleaningChecklistItem {
  id: string;
  itemCode: string;
  category: 'bedroom' | 'bathroom' | 'living_area' | 'kitchenette' | 'outside' | 'safety' | 'amenities' | 'minibar' | 'pool_area';
  subcategory: string;
  description: string;
  isCritical: boolean;
  completed?: boolean; // Runtime state
}

export interface MinibarItem {
  id: string;
  name: string;
  price: number;
  standardStock: number;
}

export interface MinibarInventory {
  itemId: string;
  currentStock: number;
  consumed: number; // Runtime state for billing
}

export interface RoomAttendantTask {
  roomId: string;
  roomName: string;
  priority: 'high' | 'medium' | 'low'; // High = Check-out/Check-in
  status: CleaningStatusType;
  occupancyStatus: RoomStatusType;
  guest?: Guest;
  checklistProgress: number; // Percentage
  startTime?: string;
}

// --- DASHBOARD INTERACTIVE CARD TYPES ---

export type CardType = 
  | 'occupancy'          
  | 'hours_this_week'    
  | 'overtime_balance'   
  | 'leave_days'         
  | 'next_shift'         
  | 'staff_on_duty'      
  | 'events_today'       
  | 'sop_status'         
  | 'time_clock'         
  | 'rooms_pending'      
  | 'weekly_summary';    

export interface CardExpandedContent {
  occupancy?: {
    rooms: any[]; // Using specific types in implementation
    checkInsToday: any[];
    checkOutsToday: any[];
    stayOvers: any[];
    occupancyTrend: any[];
    revenueProjection: any;
  };
  
  hoursThisWeek?: {
    dailyHours: any[];
    projectHours: any;
    overtimeForecast: any;
    laborCost: any;
    departmentBreakdown: any[];
  };
  
  overtimeBalance?: any;
  leaveDays?: any;
  nextShift?: any;
  staffOnDuty?: any;
  eventsToday?: any;
  
  sopStatus?: {
    certifications: any[];
    expiringSoon: any[];
    pendingTests: any[];
    complianceRate: any;
    departmentScores: any[];
  };
  
  timeClock?: any;
  
  roomsPending?: {
    rooms: any[];
    priorityOrder: any[];
    assignedAttendants: any[];
    estimatedCompletion: any;
    qualityIssues: any[];
  };
}

export interface InteractiveDashboardCardConfig {
  id: string;
  type: CardType;
  title: string;
  icon: string | React.ReactNode;
  currentValue: string | number;
  subValue?: string;
  status: 'normal' | 'warning' | 'critical' | 'success';
  isExpandable: boolean;
}

// --- ROOM ATTENDANT CARD TYPES ---

export type RoomAttendantCardType = 
  | 'assigned' | 'in_progress' | 'completed' | 'priority' 
  | 'inspected' | 'attendants' | 'supplies' | 'quality';

export interface RoomAttendantCardConfig {
  id: string;
  type: RoomAttendantCardType;
  title: string;
  icon: React.ReactNode;
  count: number;
  subText: string;
  backgroundColor: string;
  borderColor: string;
  textColor: string;
  expandable: boolean;
}

export interface AssignedRoom {
  id: string;
  name: string;
  priorityLevel: number;
  cleaningType: string;
  attendantName: string;
  attendantStatus: 'active' | 'on_break' | 'inactive';
  assignedByName: string;
  assignedAt: string; // ISO
  estimatedMinutes: number;
  scheduledStart: string; // ISO
  status: string;
}

export interface AssignedAttendant {
  id: string;
  name: string;
  role: string;
  status: string;
  roomsAssigned: number;
  roomsCompleted: number;
  averageTime: number;
  qualityScore: number;
  currentRooms: { id: string; name: string; estimatedTime: number }[];
  workloadPercentage: number;
}

export interface ShiftCoverage {
  shiftId: string;
  startTime: string;
  endTime: string;
  coverageRate: number;
  attendants: { id: string; name: string; rooms: number }[];
}

export interface CompletedRoom {
  id: string;
  name: string;
  cleaningType: string;
  attendantId: string;
  attendantName: string;
  actualMinutes: number;
  onTime: boolean;
  timeDifference: number;
  completedAt: string;
  qualityScore: number;
  minibarTotal: number;
}

export interface PriorityRoom {
  id: string;
  name: string;
  priorityLevel: number;
  reason: string;
  deadline: string;
  assignedTo: string | null;
  escalated: boolean;
}

export interface Escalation {
  id: string;
  title: string;
  level: string;
  room: string;
  reason: string;
  assignedTo: string;
}

export interface RoomAttendantExpandedData {
  assigned?: {
    rooms: AssignedRoom[];
    attendants: AssignedAttendant[];
    timeAllocation: any[]; 
    shiftCoverage: ShiftCoverage[];
  };
  completed?: {
    rooms: CompletedRoom[];
    attendants: any[];
    timeMetrics: any[];
    qualityScores: any[];
  };
  priority?: {
    rooms: PriorityRoom[];
    reasons: { type: string; count: number; icon: React.ReactNode }[];
    deadlines: any[];
    escalations: Escalation[];
  };
  inspected?: {
    summary: any; // Placeholder for inspection details if needed
  };
}
