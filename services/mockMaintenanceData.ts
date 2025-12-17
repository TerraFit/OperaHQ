
import { MaintenanceTask, MachineCertification, AssignedTask } from '../types';

export const MOCK_MACHINE_CERTS: MachineCertification[] = [
  // John Smith (emp-001) - Manager mostly certified
  { id: 'cert-001', employeeId: 'emp-001', machineType: 'chainsaw', score: 95, testDate: '2023-12-01', consecutiveFails: 0 },
  { id: 'cert-002', employeeId: 'emp-001', machineType: 'tractor', score: 90, testDate: '2023-11-15', consecutiveFails: 0 },
  { id: 'cert-005', employeeId: 'emp-001', machineType: 'sprayer', score: 98, testDate: '2023-11-20', consecutiveFails: 0 },
  
  // Sarah Nkosi (emp-002) - Conditional and Failed examples
  { id: 'cert-003', employeeId: 'emp-002', machineType: 'brush_cutter', score: 85, testDate: '2024-01-10', requiresRetestBy: '2024-01-17', consecutiveFails: 0 },
  { id: 'cert-004', employeeId: 'emp-002', machineType: 'chainsaw', score: 75, testDate: '2024-01-12', consecutiveFails: 1 },
];

export const MOCK_ASSIGNED_TASKS: AssignedTask[] = [
  {
    id: 'at-001',
    title: 'Weekly Generator Test',
    description: 'Perform standard weekly test run of the main generator. Check fuel, oil, and coolant levels before starting.',
    priority: 'high',
    assignedTo: 'emp-001', // John
    assignedBy: 'system',
    assignedAt: new Date().toISOString(),
    dueDate: new Date().toISOString().split('T')[0],
    dueTime: '14:00',
    machinesRequired: ['generator'],
    status: 'in_progress',
    progress: 50,
    milestones: {
      25: { completedAt: new Date().toISOString(), notes: 'Fluids checked. All levels normal.' },
      50: { completedAt: new Date().toISOString(), notes: 'Battery voltage 12.6V. Start test pending.' }
    }
  },
  {
    id: 'at-002',
    title: 'Clear Fallen Branch near Gate',
    description: 'Large branch obstructing the service road near the main gate. Use chainsaw to clear.',
    priority: 'medium',
    assignedTo: 'emp-001', // John (Certified)
    assignedBy: 'emp-001',
    assignedAt: new Date().toISOString(),
    dueDate: new Date().toISOString().split('T')[0],
    dueTime: '16:00',
    machinesRequired: ['chainsaw', 'tractor'],
    status: 'assigned',
    progress: 0,
    milestones: {}
  }
];

export const MOCK_MAINTENANCE_TASKS: MaintenanceTask[] = [
  // --- DAILY TASKS (27 Total) ---
  // Zebra Lodge Area (19)
  { id: 'dt-001', code: 'ZL-DAILY-001', description: 'Rake the zebra poop on the lawn', area: 'zebra_lodge', frequency: 'DAILY', estimatedMinutes: 15 },
  { id: 'dt-002', code: 'ZL-DAILY-002', description: 'Insert pills in the mole holes and rake it level', area: 'zebra_lodge', frequency: 'DAILY', estimatedMinutes: 10 },
  { id: 'dt-003', code: 'ZL-DAILY-003', description: 'Remove dog poop', area: 'zebra_lodge', frequency: 'DAILY', estimatedMinutes: 5 },
  { id: 'dt-004', code: 'ZL-DAILY-004', description: 'Rake the gravel', area: 'zebra_lodge', frequency: 'DAILY', estimatedMinutes: 20 },
  { id: 'dt-005', code: 'ZL-DAILY-005', description: 'Water the plants', area: 'zebra_lodge', frequency: 'DAILY', estimatedMinutes: 30 },
  { id: 'dt-006', code: 'ZL-DAILY-006', description: 'Check the walkways and broom if dirty (especially if zebra poop)', area: 'zebra_lodge', frequency: 'DAILY', estimatedMinutes: 15 },
  { id: 'dt-007', code: 'ZL-DAILY-007', description: 'Check the water level', area: 'zebra_lodge', frequency: 'DAILY', estimatedMinutes: 5 },
  { id: 'dt-008', code: 'ZL-DAILY-008', description: 'Fill up the pool and overflow tank', area: 'zebra_lodge', frequency: 'DAILY', estimatedMinutes: 10 },
  { id: 'dt-009', code: 'ZL-DAILY-009', description: 'Fill the wood basket in the living room', area: 'zebra_lodge', frequency: 'DAILY', estimatedMinutes: 5, conditionalRequirements: { 'only_in_winter': true } },
  { id: 'dt-010', code: 'ZL-DAILY-010', description: 'Refill the water features at the main entrance', area: 'zebra_lodge', frequency: 'DAILY', estimatedMinutes: 10 },
  { id: 'dt-011', code: 'ZL-DAILY-011', description: 'Broom the paving in front of the main entrance and the terrace', area: 'zebra_lodge', frequency: 'DAILY', estimatedMinutes: 15 },
  { id: 'dt-012', code: 'ZL-DAILY-012', description: 'Broom the owner\'s entrance and the braai area', area: 'zebra_lodge', frequency: 'DAILY', estimatedMinutes: 10 },
  { id: 'dt-013', code: 'ZL-DAILY-013', description: 'Remove the ash from the braai', area: 'zebra_lodge', frequency: 'DAILY', estimatedMinutes: 5 },
  { id: 'dt-014', code: 'ZL-DAILY-014', description: 'Water the veggie garden', area: 'zebra_lodge', frequency: 'DAILY', estimatedMinutes: 10 },
  { id: 'dt-015', code: 'ZL-DAILY-015', description: 'Pack the stones', area: 'zebra_lodge', frequency: 'DAILY', estimatedMinutes: 15 },
  { id: 'dt-016', code: 'ZL-DAILY-016', description: 'Remove weeds between the stones', area: 'zebra_lodge', frequency: 'DAILY', estimatedMinutes: 20 },
  { id: 'dt-017', code: 'ZL-DAILY-017', description: 'Remove thorn trees growing in the lawn', area: 'zebra_lodge', frequency: 'DAILY', estimatedMinutes: 10 },
  { id: 'dt-018', code: 'ZL-DAILY-018', description: 'Remove weeds in the lawn, especially alongside the walkway, pool area, and rooms', area: 'zebra_lodge', frequency: 'DAILY', estimatedMinutes: 25 },
  { id: 'dt-019', code: 'ZL-DAILY-019', description: 'Check the condition of the outside tables and chairs (damaged paint, loose parts…)', area: 'zebra_lodge', frequency: 'DAILY', estimatedMinutes: 10 },

  // Private Area (7)
  { id: 'dt-020', code: 'PVT-DAILY-001', description: 'Clean the braai', area: 'private_area', frequency: 'DAILY', estimatedMinutes: 10 },
  { id: 'dt-021', code: 'PVT-DAILY-002', description: 'Fill the wood rack in the braai area', area: 'private_area', frequency: 'DAILY', estimatedMinutes: 5 },
  { id: 'dt-022', code: 'PVT-DAILY-003', description: 'Clean the stairs from the rooms to the living area', area: 'private_area', frequency: 'DAILY', estimatedMinutes: 10 },
  { id: 'dt-023', code: 'PVT-DAILY-004', description: 'Remove the ashes from the braai', area: 'private_area', frequency: 'DAILY', estimatedMinutes: 5 },
  { id: 'dt-024', code: 'PVT-DAILY-005', description: 'Remove weeds between the stones', area: 'private_area', frequency: 'DAILY', estimatedMinutes: 15 },
  { id: 'dt-025', code: 'PVT-DAILY-006', description: 'Pack the stones', area: 'private_area', frequency: 'DAILY', estimatedMinutes: 10 },
  { id: 'dt-026', code: 'PVT-DAILY-007', description: 'Clean the outside chairs and tables in front of the living area and at the pool, as well as those in front of the rooms', area: 'private_area', frequency: 'DAILY', estimatedMinutes: 20 },

  // Property (3)
  { id: 'dt-027', code: 'PROP-DAILY-001', description: 'Check the water level of all dams', area: 'property', frequency: 'DAILY', estimatedMinutes: 15 },
  { id: 'dt-028', code: 'PROP-DAILY-002', description: 'Feed the zebras', area: 'property', frequency: 'DAILY', estimatedMinutes: 20, conditionalRequirements: { 'only_during_dry_period': true, 'when_indicated_by_management': true } },
  { id: 'dt-029', code: 'PROP-DAILY-003', description: 'Wash the corners of the building to remove the stain caused by zebras where they scratch themselves, if necessary', area: 'property', frequency: 'DAILY', estimatedMinutes: 10, conditionalRequirements: { 'if_necessary': true } },

  // --- WEEKLY TASKS (8 Total) ---
  { id: 'wt-001', code: 'ZL-WEEKLY-001', description: 'Wash the decks of the safari tents', area: 'zebra_lodge', frequency: 'WEEKLY', estimatedMinutes: 60, dayOfWeek: 1 },
  { id: 'wt-002', code: 'ZL-WEEKLY-002', description: 'Check the Gas Bottle level (use electronic scale and specific form)', area: 'zebra_lodge', frequency: 'WEEKLY', estimatedMinutes: 15, requiresMeasurement: true, dayOfWeek: 1 },
  { id: 'wt-003', code: 'ZL-WEEKLY-003', description: 'Clean the garage (brooming)', area: 'zebra_lodge', frequency: 'WEEKLY', estimatedMinutes: 30, dayOfWeek: 5 },
  { id: 'wt-004', code: 'ZL-WEEKLY-004', description: 'Remove dust from the plants', area: 'zebra_lodge', frequency: 'WEEKLY', estimatedMinutes: 45, dayOfWeek: 3 },
  { id: 'wt-005', code: 'PROP-WEEKLY-001', description: 'Walk the fence and remove any fallen trees or branches', area: 'property', frequency: 'WEEKLY', estimatedMinutes: 120, dayOfWeek: 2 },
  { id: 'wt-006', code: 'PROP-WEEKLY-002', description: 'Walk the fence and repair any broken wire', area: 'property', frequency: 'WEEKLY', estimatedMinutes: 90, dayOfWeek: 2 },
  { id: 'wt-007', code: 'PROP-WEEKLY-003', description: 'Walk the fence and repair any damages due to arson to the management', area: 'property', frequency: 'WEEKLY', estimatedMinutes: 60, dayOfWeek: 2 },
  { id: 'wt-008', code: 'PROP-WEEKLY-004', description: 'Check the trails for fallen trees, damaged structures, or missing arrows', area: 'property', frequency: 'WEEKLY', estimatedMinutes: 90, dayOfWeek: 4 },
  { id: 'wt-009', code: 'PROP-WEEKLY-005', description: 'Proceed with a complete check-up of all machines with deep cleaning and grease', area: 'property', frequency: 'WEEKLY', estimatedMinutes: 180, dayOfWeek: 5 },
  { id: 'wt-010', code: 'PROP-WEEKLY-006', description: 'Clean the bike park toilet, and make sure there is toilet paper', area: 'property', frequency: 'WEEKLY', estimatedMinutes: 20, dayOfWeek: 5 },

  // --- BI-WEEKLY TASKS (5 Total) ---
  { id: 'bw-001', code: 'PROP-BIWEEK-001', description: 'Cut the grass at the gate', area: 'property', frequency: 'EVERY_TWO_WEEKS', estimatedMinutes: 30, weekParity: 'odd' },
  { id: 'bw-002', code: 'PROP-BIWEEK-002', description: 'Remove the weeds at the gate and the garden on the way to the property', area: 'property', frequency: 'EVERY_TWO_WEEKS', estimatedMinutes: 45, weekParity: 'odd' },
  { id: 'bw-003', code: 'PROP-BIWEEK-003', description: 'Mow the weeds in the vineyard (do not wait until it is overgrown)', area: 'property', frequency: 'EVERY_TWO_WEEKS', estimatedMinutes: 60, weekParity: 'even' },
  { id: 'bw-004', code: 'PROP-BIWEEK-004', description: 'Attach the branches with the clips as the vines grow and slide them in between the wires', area: 'property', frequency: 'EVERY_TWO_WEEKS', estimatedMinutes: 90, weekParity: 'even' },
  { id: 'bw-005', code: 'PROP-BIWEEK-005', description: 'Cut the overgrowing branches of the vines (maximum 15cm above the top wire)', area: 'property', frequency: 'EVERY_TWO_WEEKS', estimatedMinutes: 60, weekParity: 'even' },

  // --- MONTHLY TASKS (3 Total) ---
  { id: 'mt-001', code: 'MNTHLY-001', description: 'Clean around the bike park house (parking, play area, other buildings)', area: 'property', frequency: 'MONTHLY', estimatedMinutes: 120, requiresTimeLogging: true },
  { id: 'mt-002', code: 'MNTHLY-002', description: 'Clear trails - assess the quality of the trails and plan works', area: 'property', frequency: 'MONTHLY', estimatedMinutes: 240, requiresTimeLogging: true },
  { id: 'mt-003', code: 'MNTHLY-003', description: 'Trim the bushes alongside the track 3 meters wide, cut the grass, and rake the trail (TCR)', area: 'property', frequency: 'MONTHLY', estimatedMinutes: 480, requiresTcrMethod: true, tcrWidthMeters: 3, requiresTimeLogging: true },

  // --- PERIODIC TASKS (7 Total) ---
  { id: 'pt-001', code: 'PERIOD-ZL-001', description: 'Cut the lawn', area: 'zebra_lodge', frequency: 'PERIODICALLY', estimatedMinutes: 60, triggerEvents: ['growth_reaches_threshold', 'supervisor_inspection'] },
  { id: 'pt-002', code: 'PERIOD-ZL-002', description: 'Trim the trees on the driveway from the gate to the lodge', area: 'zebra_lodge', frequency: 'PERIODICALLY', estimatedMinutes: 120, triggerEvents: ['supervisor_regularly_inspects_and_plans'] },
  { id: 'pt-003', code: 'PERIOD-PROP-001', description: 'Clean the fence around the property', area: 'property', frequency: 'PERIODICALLY', estimatedMinutes: 180, triggerEvents: ['as_needed'] },
  { id: 'pt-004', code: 'PERIOD-VINE-001', description: 'Fertilise the vineyard after the first leaves', area: 'property', frequency: 'PERIODICALLY', estimatedMinutes: 60, vineyardPhase: 'after_first_leaves' },
  { id: 'pt-005', code: 'PERIOD-VINE-002', description: 'Fertilise the vineyard after the harvest', area: 'property', frequency: 'PERIODICALLY', estimatedMinutes: 60, vineyardPhase: 'after_harvest' },
  { id: 'pt-006', code: 'PERIOD-VINE-005', description: 'Prune the vines (in springtime when instructed)', area: 'property', frequency: 'PERIODICALLY', estimatedMinutes: 240, vineyardPhase: 'spring', requiresManagementInstruction: true },
  { id: 'pt-007', code: 'PERIOD-VINE-007', description: 'Harvest the grapes (when instructed to do so)', area: 'property', frequency: 'PERIODICALLY', estimatedMinutes: 480, vineyardPhase: 'harvest', requiresManagementInstruction: true },

  // --- SUMMER VINEYARD TASKS (5 Total) ---
  { 
    id: 'sv-001', 
    code: 'SUMMER-VINE-001', 
    description: 'Remove in-between growth (shoots/leaves between main vines)', 
    area: 'property', 
    frequency: 'SUMMER_SEASONAL', 
    estimatedMinutes: 510, // 8.5 hours
    category: 'vineyard',
    ppeRequired: ['gloves', 'long_sleeves', 'hat'],
    vineyardPhase: 'summer'
  },
  { 
    id: 'sv-002', 
    code: 'SUMMER-VINE-002', 
    description: 'Put shoots in between trellis wires (guide growth)', 
    area: 'property', 
    frequency: 'SUMMER_SEASONAL', 
    estimatedMinutes: 720, // 12 hours
    category: 'vineyard',
    ppeRequired: ['gloves', 'long_sleeves'],
    vineyardPhase: 'summer'
  },
  { 
    id: 'sv-003', 
    code: 'SUMMER-VINE-003', 
    description: 'Trim shoots at pole height (max 15cm above top wire)', 
    area: 'property', 
    frequency: 'SUMMER_SEASONAL', 
    estimatedMinutes: 390, // 6.5 hours
    category: 'vineyard',
    ppeRequired: ['gloves', 'safety_glasses'],
    measurementsRequired: ['shoot_length'],
    vineyardPhase: 'summer'
  },
  { 
    id: 'sv-004', 
    code: 'SUMMER-VINE-004', 
    description: 'Mow grass between vine rows (when >15cm)', 
    area: 'property', 
    frequency: 'SUMMER_SEASONAL', 
    estimatedMinutes: 240, // 4 hours
    category: 'vineyard',
    ppeRequired: ['hearing_protection', 'safety_glasses', 'sturdy_boots'],
    measurementsRequired: ['grass_height'],
    vineyardPhase: 'summer'
  },
  { 
    id: 'sv-005', 
    code: 'SUMMER-VINE-005', 
    description: 'Spray grapes (Fungicides/Pesticides per schedule)', 
    area: 'property', 
    frequency: 'SUMMER_SEASONAL', 
    estimatedMinutes: 600, // 10 hours
    category: 'vineyard',
    ppeRequired: ['chemical_suit', 'gloves', 'goggles', 'respirator', 'rubber_boots'],
    weatherConstraints: { maxWindSpeed: 15, maxTemp: 30, noRain: true },
    requiresPhoto: true,
    vineyardPhase: 'summer'
  }
];
