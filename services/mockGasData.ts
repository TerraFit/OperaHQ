
import { GasLocation, GasTank } from '../types';

export const MOCK_GAS_LOCATIONS: GasLocation[] = [
  // SUMMER/WINTER ROOM HEATERS (9kg)
  {
    id: 'loc-001',
    code: 'GAS-LIVING',
    name: 'Living Room Heater',
    type: 'room',
    tankSize: 9,
    purpose: 'heater',
    hasWinterHeater: true,
    winterActive: true,
    currentTankId: 'tnk-001',
    lastChecked: new Date(Date.now() - 7 * 86400000).toISOString()
  },
  {
    id: 'loc-002',
    code: 'GAS-LEOPARD',
    name: 'Leopard Room Heater',
    type: 'room',
    tankSize: 9,
    purpose: 'heater',
    hasWinterHeater: true,
    winterActive: true,
    currentTankId: 'tnk-002',
    lastChecked: new Date(Date.now() - 14 * 86400000).toISOString()
  },
  {
    id: 'loc-003',
    code: 'GAS-STONE',
    name: 'Stone Room Heater',
    type: 'room',
    tankSize: 9,
    purpose: 'heater',
    hasWinterHeater: true,
    winterActive: true,
    currentTankId: 'tnk-003',
    lastChecked: new Date(Date.now() - 2 * 86400000).toISOString()
  },
  {
    id: 'loc-004',
    code: 'GAS-EARTH',
    name: 'Earth Room Heater',
    type: 'room',
    tankSize: 9,
    purpose: 'heater',
    hasWinterHeater: true,
    winterActive: true,
    currentTankId: undefined, // Missing tank example
    lastChecked: new Date(Date.now() - 30 * 86400000).toISOString()
  },
  {
    id: 'loc-005',
    code: 'GAS-COLONIAL-RM',
    name: 'Colonial Room Heater',
    type: 'room',
    tankSize: 9,
    purpose: 'heater',
    hasWinterHeater: true,
    winterActive: true,
    currentTankId: 'tnk-004',
    lastChecked: new Date(Date.now() - 6 * 86400000).toISOString()
  },
  
  // 19kg TANKS
  {
    id: 'loc-006',
    code: 'GAS-PRIVATE',
    name: 'Private Area',
    type: 'private',
    tankSize: 19,
    purpose: 'cooking',
    hasWinterHeater: false,
    winterActive: false,
    currentTankId: 'tnk-005',
    lastChecked: new Date(Date.now() - 5 * 86400000).toISOString()
  },
  {
    id: 'loc-007',
    code: 'GAS-KITCHEN',
    name: 'Main Kitchen',
    type: 'kitchen',
    tankSize: 19,
    purpose: 'cooking',
    hasWinterHeater: false,
    winterActive: false,
    currentTankId: 'tnk-006',
    lastChecked: new Date(Date.now() - 1 * 86400000).toISOString()
  },

  // 48kg SUITE TANKS
  {
    id: 'loc-008',
    code: 'GAS-SUITE-LEOPARD',
    name: 'Suite - Leopard Room',
    type: 'suite',
    tankSize: 48,
    purpose: 'heater',
    hasWinterHeater: true,
    winterActive: true,
    currentTankId: 'tnk-007',
    lastChecked: new Date(Date.now() - 10 * 86400000).toISOString()
  }
];

export const MOCK_GAS_TANKS: GasTank[] = [
  // 9kg TANKS
  { id: 'tnk-001', serialNumber: 'ZT-9KG-001', size: 9, tareWeight: 8.2, fullWeight: 17.2, currentWeight: 12.5, status: 'in_use', currentLocationId: 'loc-001' },
  { id: 'tnk-002', serialNumber: 'ZT-9KG-002', size: 9, tareWeight: 8.1, fullWeight: 17.1, currentWeight: 16.8, status: 'in_use', currentLocationId: 'loc-002' },
  { id: 'tnk-003', serialNumber: 'ZT-9KG-003', size: 9, tareWeight: 8.3, fullWeight: 17.3, currentWeight: 9.5, status: 'in_use', currentLocationId: 'loc-003' },
  { id: 'tnk-004', serialNumber: 'ZT-9KG-004', size: 9, tareWeight: 8.2, fullWeight: 17.2, currentWeight: 10.0, status: 'in_use', currentLocationId: 'loc-005' },
  
  // 19kg TANKS
  { id: 'tnk-005', serialNumber: 'ZT-19KG-001', size: 19, tareWeight: 18.5, fullWeight: 37.5, currentWeight: 25.0, status: 'in_use', currentLocationId: 'loc-006' },
  { id: 'tnk-006', serialNumber: 'ZT-19KG-002', size: 19, tareWeight: 18.3, fullWeight: 37.3, currentWeight: 37.0, status: 'in_use', currentLocationId: 'loc-007' },
  
  // 48kg TANKS
  { id: 'tnk-007', serialNumber: 'ZT-48KG-001', size: 48, tareWeight: 47.2, fullWeight: 95.2, currentWeight: 65.0, status: 'in_use', currentLocationId: 'loc-008' },
  { id: 'tnk-008', serialNumber: 'ZT-48KG-002', size: 48, tareWeight: 47.5, fullWeight: 95.5, currentWeight: 95.0, status: 'in_storage' }
];