
import React from 'react';

// ROLES
export enum UserRole {
  SUPER_ADMIN = 'super_admin',
  GENERAL_MANAGER = 'general_manager',
  DEPARTMENT_MANAGER = 'department_manager',
  SUPERVISOR = 'supervisor',
  TEAM_LEADER = 'team_leader',
  STAFF = 'staff',
  TRAINEE = 'trainee'
}

// SHIFT TYPES (TIME BASED)
export type ChefShiftType = 'split' | 'morning' | 'evening' | 'function_lunch' | 'double_split' | 'full_day';

export interface ShiftConfig {
  type: ChefShiftType;
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  secondStartTime?: string; // For splits
  secondEndTime?: string; // For splits
  totalHours: number;
}

// Added Shift interface used for individual work records
export interface Shift {
  id: string;
  employeeId: string;
  date: string;
  type: string;
  start: string;
  end: string;
  totalHours: number;
  status: 'scheduled' | 'clocked_in' | 'clocked_out' | 'break';
  breakTaken: boolean;
}

// ROSTER CODES (PLANNING BASED)
export type RosterShiftCode = 'D' | 'H' | 'O' | 'N' | 'P' | 'S' | 'L' | 'V' | 'M';

export interface RosterLegendItem {
  code: RosterShiftCode;
  name: string;
  color: string;
  textColor: string;
  description: string;
}

export interface RosterEntry {
  id: string;
  staffId: string;
  date: string; // YYYY-MM-DD
  code: RosterShiftCode;
  notes?: string;
}

// EMPLOYEE SCHEMA
export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  photoUrl?: string;
  role: UserRole;
  jobTitle: string;
  department: string;
  employmentType: 'permanent' | 'casual';
  dateStarted: string; // ISO Date
  birthday: string; // ISO Date
  idNumber: string;
  phone: string;
  email: string;
  privateAddress?: string;
  status: 'active' | 'inactive' | 'on_leave';

  // Performance & Totals
  warnings: number;
  praises: number;
  guestCompliments: number;
  guestComplaints: number;
  absencesCount: number;
  lateArrivalsCount: number;
  holidaysEarned: number;
  holidaysTaken: number;
  overtimeBalance: number;

  // Additional fields used in profile and uniforms
  clothingSize?: string;
  shoeSize?: string;
  uniformSize?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
}

// SOP MODULE TYPES
export type SOPDepartment = 'kitchen' | 'housekeeping' | 'maintenance' | 'grounds' | 'front_desk' | 'laundry' | 'general' | 'personal' | 'all';

export interface SOP {
  id: string;
  code: string;
  title: string;
  department: SOPDepartment;
  category: string;
  version: string;
  contentHtml: string;
  summary?: string;
  questions: {
    question: string;
    options: string[];
    correctIndex: number;
  }[];
  passingScore: number;
  timeLimitMinutes: number;
  retestIntervalWeeks: number;
}

export interface SOPAttempt {
  id: string;
  sopId: string;
  sopCode: string;
  userId: string;
  score: number;
  passed: boolean;
  timestamp: string;
  validUntil: string;
  nextEligibleDate: string;
  testDurationSeconds?: number;
}

export type SOPCreationMethod = 'ai_generated' | 'internal' | 'external';

export interface SOPCreationRequest {
  id: string;
  title: string;
  department: SOPDepartment;
  category: string;
  description?: string;
  priority: 'low' | 'medium' | 'high';
  status: 'draft' | 'assigned' | 'in_progress' | 'review' | 'completed';
  method: SOPCreationMethod;
  assignedBy: string;
  createdAt: string;
  deadline?: string;
  progress: number;
  assignedToId?: string;
  assignedToName?: string;
  aiGenerated?: boolean;
  externalEmail?: string;
}

// PLANNING & EVENTS
export interface SpecialEvent {
  id: string;
  title: string;
  description?: string;
  date: string;
  startTime?: string;
  endTime?: string;
  expectedGuests?: number;
  staffRequired?: number;
  status: 'confirmed' | 'pending';
  type: 'function' | 'management_absence' | 'holiday' | 'other';
  managerId?: string;
}

export interface PlanningEvent {
  id: string;
  date: string;
  title: string;
  type: string;
  description: string;
  createdBy: string;
}

// AUDIT
export interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  action: string;
  reason: string;
  changes: string;
}

// DASHBOARD TYPES
export type CardType = 'occupancy' | 'rooms_pending' | 'hours_this_week' | 'sop_status';

export interface InteractiveDashboardCardConfig {
  id: string;
  type: CardType;
  title: string;
  icon: any;
  currentValue: string;
  subValue?: string;
  status: 'normal' | 'warning' | 'critical' | 'success';
  isExpandable: boolean;
}

export interface CardExpandedContent {
  occupancy?: any;
  roomsPending?: any;
  hoursThisWeek?: any;
  sopStatus?: any;
}

// MAINTENANCE MODULE TYPES
export type MaintenanceFrequency = 'DAILY' | 'WEEKLY' | 'EVERY_TWO_WEEKS' | 'MONTHLY' | 'PERIODICALLY' | 'SUMMER_SEASONAL';
export type MachineType = 'chainsaw' | 'tractor' | 'brush_cutter' | 'generator' | 'sprayer';
export type TaskPriority = 'low' | 'medium' | 'high' | 'emergency';

export interface MaintenanceTask {
  id: string;
  code: string;
  description: string;
  area: string;
  frequency: MaintenanceFrequency;
  estimatedMinutes: number;
  dayOfWeek?: number;
  weekParity?: 'odd' | 'even' | 'both';
  requiresMeasurement?: boolean;
  requiresTcrMethod?: boolean;
  tcrWidthMeters?: number;
  requiresTimeLogging?: boolean;
  conditionalRequirements?: Record<string, boolean>;
  triggerEvents?: string[];
  vineyardPhase?: string;
  requiresManagementInstruction?: boolean;
  category?: string;
  ppeRequired?: string[];
  weatherConstraints?: {
    maxWindSpeed: number;
    maxTemp: number;
    noRain: boolean;
  };
  measurementsRequired?: string[];
  requiresPhoto?: boolean;
}

export interface MachineCertification {
  id: string;
  employeeId: string;
  machineType: MachineType;
  score: number;
  testDate: string;
  requiresRetestBy?: string;
  consecutiveFails: number;
}

export interface AssignedTask {
  id: string;
  title: string;
  description: string;
  priority: TaskPriority;
  assignedTo: string;
  assignedBy: string;
  assignedAt: string;
  dueDate: string;
  dueTime: string;
  machinesRequired?: MachineType[];
  status: 'assigned' | 'in_progress' | 'completed';
  progress: number;
  milestones?: Record<number, { completedAt: string; notes: string }>;
}

export interface MaintenanceLog {
  id: string;
  taskId: string;
  taskCode: string;
  userId: string;
  date: string;
  status: 'completed' | 'in_progress';
  completedAt: string;
  [key: string]: any;
}

export interface WeatherData {
  temperature: number;
  windSpeed: number;
  isRaining: boolean;
  rainLast24Hours: number;
}

// HOUSEKEEPING TYPES
export type RoomStatus = 'vacant' | 'occupied' | 'stay_over' | 'check_in_today' | 'check_out_today';
export type CleaningStatus = 'not_cleaned' | 'cleaning_in_progress' | 'cleaned' | 'inspected';

export interface RoomOccupancy {
  id: string;
  name: string;
  status: RoomStatus;
  cleaningStatus: CleaningStatus;
  assignedAttendantId?: string;
  guestId?: string;
  checkInDate: string;
  checkOutDate: string;
  dinnerIncluded: boolean;
  extraBed: boolean;
  babyCot: boolean;
  minibarBalance: number;
  lastCleaned?: string;
  inspectedBy?: string;
}

export interface Guest {
  id: string;
  name: string;
  numberOfAdults: number;
  numberOfChildren: number;
  childrenDetails?: { name: string; age: number }[];
  foodRestrictions?: string[];
  specialRequests?: string;
}

export interface HotelEvent {
  id: string;
  name: string;
  type: string;
  date: string;
  startTime: string;
  endTime: string;
  guestCount: number;
  location: string;
  status: string;
}

export interface CleaningChecklistItem {
  id: string;
  category: string;
  subcategory: string;
  itemCode: string;
  description: string;
  isCritical: boolean;
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
  consumed: number;
}

export type RoomAttendantCardType = 'assigned' | 'completed' | 'priority' | 'inspected' | 'attendants';

export interface RoomAttendantCardConfig {
  id: string;
  type: RoomAttendantCardType;
  title: string;
  icon: any;
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
  cleaningType: string;
  attendantName: string;
  attendantStatus: string;
  assignedByName: string;
  assignedAt: string;
  estimatedMinutes: number;
  scheduledStart: string;
  status: string;
  priorityLevel: number;
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
  workloadPercentage: number;
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
    shiftCoverage: any[];
  };
  completed?: {
    rooms: CompletedRoom[];
    attendants: AssignedAttendant[];
    timeMetrics: { actualMinutes: number; onTime: boolean }[];
    qualityScores: { score: number }[];
  };
  priority?: {
    rooms: PriorityRoom[];
    reasons: { type: string, count: number, icon: any }[];
    deadlines: any[];
    escalations: Escalation[];
  };
  inspected?: {
    summary: any;
  };
}

// GAS MODULE TYPES
export interface GasTank {
  id: string;
  serialNumber: string;
  size: number;
  tareWeight: number;
  fullWeight: number;
  currentWeight: number;
  status: 'in_use' | 'reserved' | 'empty';
  currentLocationId: string;
}

export interface GasLocation {
  id: string;
  code: string;
  name: string;
  department: string;
  tankSize: number;
  priority: number;
  isAlwaysActive: boolean;
  checkFrequency: 'weekly' | 'monthly';
  lastChecked: string;
  nextCheckDue: string;
  currentTankId: string;
  currentTank?: GasTank;
}

export type GasCheckAssessment = 'empty' | 'low' | 'adequate' | 'full';

export interface GasCheckRecord {
  id: string;
  date: string;
  checkedBy: string;
  locationId: string;
  tankId: string;
  measuredWeight: number;
  tareWeight: number;
  fullWeight: number;
  remainingGas: number;
  percentage: number;
  assessment: GasCheckAssessment;
  actionRequired: string;
  photoUrl?: string;
}

// VISUALS
export interface DepartmentVisualConfig {
  color: string;
  icon: string;
  bgLight: string;
}
