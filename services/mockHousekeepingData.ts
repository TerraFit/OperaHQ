
import { 
  RoomOccupancy, 
  Guest, 
  HotelEvent, 
  CleaningChecklistItem, 
  MinibarItem,
  MinibarInventory
} from '../types';

export const MOCK_GUESTS: Guest[] = [
  {
    id: 'gst-001',
    name: 'Mr. & Mrs. Van Der Merwe',
    numberOfAdults: 2,
    numberOfChildren: 1,
    childrenDetails: [{ name: 'Johan', age: 5 }],
    foodRestrictions: ['Vegetarian (Mrs)'],
    specialRequests: 'Extra pillows'
  },
  {
    id: 'gst-002',
    name: 'Sarah Johnson',
    numberOfAdults: 1,
    numberOfChildren: 0,
    foodRestrictions: ['Gluten-free']
  }
];

export const MOCK_ROOMS: RoomOccupancy[] = [
  {
    id: 'rm-001',
    name: 'Colonial',
    status: 'check_in_today',
    cleaningStatus: 'not_cleaned',
    assignedAttendantId: 'emp-002', // Sarah
    guestId: 'gst-001',
    checkInDate: new Date().toISOString().split('T')[0],
    checkOutDate: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
    dinnerIncluded: true,
    extraBed: true,
    babyCot: false,
    minibarBalance: 245.00
  },
  {
    id: 'rm-002',
    name: 'Earth',
    status: 'check_out_today',
    cleaningStatus: 'cleaned',
    assignedAttendantId: 'emp-002',
    guestId: 'gst-002',
    checkInDate: new Date(Date.now() - 86400000 * 2).toISOString().split('T')[0],
    checkOutDate: new Date().toISOString().split('T')[0],
    dinnerIncluded: true,
    extraBed: false,
    babyCot: false,
    minibarBalance: 120.00,
    lastCleaned: new Date().toISOString(),
    inspectedBy: 'emp-001'
  },
  {
    id: 'rm-003',
    name: 'Stone',
    status: 'stay_over',
    cleaningStatus: 'cleaning_in_progress',
    assignedAttendantId: 'emp-002',
    checkInDate: new Date(Date.now() - 86400000).toISOString().split('T')[0],
    checkOutDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    dinnerIncluded: false,
    extraBed: false,
    babyCot: false,
    minibarBalance: 45.00
  },
  {
    id: 'rm-004',
    name: 'Leopard',
    status: 'stay_over',
    cleaningStatus: 'not_cleaned',
    assignedAttendantId: 'emp-002',
    checkInDate: new Date(Date.now() - 86400000).toISOString().split('T')[0],
    checkOutDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
    dinnerIncluded: true,
    extraBed: false,
    babyCot: false,
    minibarBalance: 0
  },
  {
    id: 'rm-005',
    name: 'Ocean',
    status: 'check_out_today',
    cleaningStatus: 'not_cleaned',
    assignedAttendantId: 'emp-002',
    checkInDate: new Date(Date.now() - 86400000).toISOString().split('T')[0],
    checkOutDate: new Date().toISOString().split('T')[0],
    dinnerIncluded: false,
    extraBed: false,
    babyCot: false,
    minibarBalance: 0
  },
  {
    id: 'rm-006',
    name: 'Country',
    status: 'vacant',
    cleaningStatus: 'cleaned',
    checkInDate: '',
    checkOutDate: '',
    dinnerIncluded: false,
    extraBed: false,
    babyCot: false,
    minibarBalance: 0
  }
];

export const MOCK_EVENTS: HotelEvent[] = [
  {
    id: 'evt-001',
    name: 'Smith Wedding Reception',
    type: 'wedding',
    date: new Date().toISOString().split('T')[0],
    startTime: '14:00',
    endTime: '23:00',
    guestCount: 85,
    location: 'Garden & Main Hall',
    status: 'confirmed'
  }
];

export const MOCK_MINIBAR_ITEMS: MinibarItem[] = [
  { id: 'mb-001', name: 'Mixed Nuts 50g', price: 35.00, standardStock: 2 },
  { id: 'mb-002', name: 'Chocolate Bar', price: 25.00, standardStock: 2 },
  { id: 'mb-003', name: 'Cabernet 187ml', price: 120.00, standardStock: 1 },
  { id: 'mb-004', name: 'Chardonnay 187ml', price: 110.00, standardStock: 1 },
  { id: 'mb-005', name: 'Local Lager 340ml', price: 45.00, standardStock: 2 },
  { id: 'mb-006', name: 'Sparkling Water', price: 30.00, standardStock: 2 },
  { id: 'mb-007', name: 'Still Water', price: 25.00, standardStock: 2 },
  { id: 'mb-008', name: 'Cola 330ml', price: 28.00, standardStock: 2 },
  { id: 'mb-009', name: 'Lemonade 330ml', price: 28.00, standardStock: 2 }
];

// SAMPLE INVENTORY FOR A ROOM
export const MOCK_ROOM_INVENTORY: Record<string, MinibarInventory> = {
  'mb-001': { itemId: 'mb-001', currentStock: 2, consumed: 0 },
  'mb-002': { itemId: 'mb-002', currentStock: 1, consumed: 1 }, // 1 consumed
  'mb-003': { itemId: 'mb-003', currentStock: 1, consumed: 0 },
  'mb-004': { itemId: 'mb-004', currentStock: 0, consumed: 1 }, // 1 consumed
  'mb-005': { itemId: 'mb-005', currentStock: 2, consumed: 0 },
  'mb-006': { itemId: 'mb-006', currentStock: 0, consumed: 2 }, // 2 consumed
  'mb-007': { itemId: 'mb-007', currentStock: 2, consumed: 0 },
  'mb-008': { itemId: 'mb-008', currentStock: 2, consumed: 0 },
  'mb-009': { itemId: 'mb-009', currentStock: 2, consumed: 0 },
};

export const CLEANING_CHECKLIST: CleaningChecklistItem[] = [
  // BEDROOM
  { id: 'cl-001', category: 'bedroom', subcategory: 'floor', itemCode: 'BR-FLR-001', description: 'Vacuum entire floor including corners', isCritical: true },
  { id: 'cl-002', category: 'bedroom', subcategory: 'floor', itemCode: 'BR-FLR-002', description: 'Clean under the bed', isCritical: true },
  { id: 'cl-003', category: 'bedroom', subcategory: 'furniture', itemCode: 'BR-FUR-001', description: 'Dust all furniture surfaces', isCritical: true },
  { id: 'cl-004', category: 'bedroom', subcategory: 'frame_mirror', itemCode: 'BR-FRM-001', description: 'Clean top frame of doors and windows', isCritical: true },
  { id: 'cl-005', category: 'bedroom', subcategory: 'windows', itemCode: 'BR-WIN-001', description: 'Clean window glass (inside)', isCritical: true },
  { id: 'cl-006', category: 'bedroom', subcategory: 'windows', itemCode: 'BR-WIN-002', description: 'Clean sliding door glass', isCritical: true },
  { id: 'cl-007', category: 'bedroom', subcategory: 'windows', itemCode: 'BR-WIN-003', description: 'Clean sliding door rail', isCritical: true },
  { id: 'cl-008', category: 'bedroom', subcategory: 'lighting', itemCode: 'BR-LGT-001', description: 'Check all bulbs working (bed lights, main lights)', isCritical: true },
  { id: 'cl-009', category: 'bedroom', subcategory: 'electronics', itemCode: 'BR-ELC-001', description: 'Clean TV screen (streak-free)', isCritical: true },
  { id: 'cl-010', category: 'bedroom', subcategory: 'electronics', itemCode: 'BR-ELC-002', description: 'Clean remote controls (sanitize)', isCritical: true },
  { id: 'cl-011', category: 'bedroom', subcategory: 'electronics', itemCode: 'BR-ELC-003', description: 'Test safe operation (open if not in use)', isCritical: true },
  { id: 'cl-012', category: 'bedroom', subcategory: 'electronics', itemCode: 'BR-ELC-004', description: 'Test safe battery (press back button)', isCritical: true },
  { id: 'cl-013', category: 'bedroom', subcategory: 'bed_linen', itemCode: 'BR-BED-001', description: 'Replace all bed linen (sheets, duvet cover, pillowcases)', isCritical: true },
  { id: 'cl-014', category: 'bedroom', subcategory: 'bed_linen', itemCode: 'BR-BED-002', description: 'Arrange cushions (small & large) properly', isCritical: true },
  { id: 'cl-015', category: 'bedroom', subcategory: 'bed_linen', itemCode: 'BR-BED-003', description: 'Check duvet for cleanliness', isCritical: true },
  
  // BATHROOM
  { id: 'cl-016', category: 'bathroom', subcategory: 'toilet', itemCode: 'BA-TOI-001', description: 'Clean toilet bowl (inside)', isCritical: true },
  { id: 'cl-017', category: 'bathroom', subcategory: 'toilet', itemCode: 'BA-TOI-002', description: 'Clean toilet seat (top and underneath)', isCritical: true },
  { id: 'cl-018', category: 'bathroom', subcategory: 'toilet', itemCode: 'BA-TOI-003', description: 'Clean toilet exterior/base', isCritical: true },
  { id: 'cl-019', category: 'bathroom', subcategory: 'floor', itemCode: 'BA-FLR-001', description: 'Clean bathroom floor', isCritical: true },
  { id: 'cl-020', category: 'bathroom', subcategory: 'surfaces', itemCode: 'BA-SUR-001', description: 'Clean basins (including overflow)', isCritical: true },
  { id: 'cl-021', category: 'bathroom', subcategory: 'shower', itemCode: 'BA-SHW-001', description: 'Clean shower walls', isCritical: true },
  { id: 'cl-022', category: 'bathroom', subcategory: 'shower', itemCode: 'BA-SHW-002', description: 'Clean shower floor', isCritical: true },
  { id: 'cl-023', category: 'bathroom', subcategory: 'shower', itemCode: 'BA-SHW-003', description: 'Clear shower drain', isCritical: true },
  { id: 'cl-024', category: 'bathroom', subcategory: 'shower', itemCode: 'BA-SHW-006', description: 'Clean shower glass (streak-free)', isCritical: true },
  { id: 'cl-025', category: 'bathroom', subcategory: 'towels', itemCode: 'BA-TOW-001', description: 'Replace all towels (bath, hand, face)', isCritical: true },
  
  // OUTSIDE
  { id: 'cl-026', category: 'outside', subcategory: 'furniture', itemCode: 'OUT-FUR-001', description: 'Clean outside furniture (sea side)', isCritical: true },
  { id: 'cl-027', category: 'outside', subcategory: 'paving', itemCode: 'OUT-PAV-001', description: 'Sweep paving (sea side)', isCritical: true },
  { id: 'cl-028', category: 'outside', subcategory: 'pest_control', itemCode: 'OUT-PST-001', description: 'Check for spider webs inside room', isCritical: true },
  
  // SAFETY
  { id: 'cl-029', category: 'safety', subcategory: 'equipment', itemCode: 'SF-EQP-001', description: 'Check fire extinguisher (in place, not expired)', isCritical: true },
];
