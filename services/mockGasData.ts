
import { GasLocation, GasTank } from '../types';

export const MOCK_GAS_LOCATIONS: GasLocation[] = [
  // ===== KITCHEN & PRIVATE AREAS (Always Active - TOP PRIORITY) =====
  {
    id: 'gas-kitchen-main',
    code: 'GAS-KITCHEN',
    name: 'Main Kitchen',
    department: 'kitchen',
    tankSize: 19,
    priority: 1,
    isAlwaysActive: true,
    checkFrequency: 'weekly',
    lastChecked: '2024-12-16T08:00:00Z',
    nextCheckDue: '2024-12-23T08:00:00Z',
    currentTankId: 'tnk-001'
  },
  {
    id: 'gas-private-main',
    code: 'GAS-PRIVATE',
    name: 'Private Area',
    department: 'private_areas',
    tankSize: 19,
    priority: 2,
    isAlwaysActive: true,
    checkFrequency: 'weekly',
    lastChecked: '2024-12-12T10:00:00Z',
    nextCheckDue: '2024-12-19T10:00:00Z',
    currentTankId: 'tnk-002'
  },

  // ===== ROOMS & PRIVATE AREAS GEYSERS (Always Active) =====
  {
    id: 'gas-private-geyser-1',
    code: 'GAS-PRIVATE',
    name: 'Private Area Geyser',
    department: 'private_areas',
    tankSize: 19,
    priority: 3,
    isAlwaysActive: true,
    checkFrequency: 'weekly',
    lastChecked: '2024-12-12T10:00:00Z',
    nextCheckDue: '2024-12-19T10:00:00Z',
    currentTankId: 'tnk-003'
  },
  {
    id: 'gas-kitchen-geyser',
    code: 'GAS-KITCHEN',
    name: 'Main Kitchen Geyser',
    department: 'kitchen',
    tankSize: 19,
    priority: 4,
    isAlwaysActive: true,
    checkFrequency: 'weekly',
    lastChecked: '2024-12-16T08:00:00Z',
    nextCheckDue: '2024-12-23T08:00:00Z',
    currentTankId: 'tnk-004'
  },

  // ===== GUEST ROOM CYLINDERS =====
  {
    id: 'gas-colonial',
    code: 'GAS-COLONIAL',
    name: 'Colonial Room',
    department: 'guest_rooms',
    tankSize: 19,
    priority: 5,
    isAlwaysActive: false,
    checkFrequency: 'weekly',
    lastChecked: '2024-12-10T09:00:00Z',
    nextCheckDue: '2024-12-17T09:00:00Z',
    currentTankId: 'tnk-005'
  },
  {
    id: 'gas-country',
    code: 'GAS-COUNTRY',
    name: 'Country Room',
    department: 'guest_rooms',
    tankSize: 19,
    priority: 6,
    isAlwaysActive: false,
    checkFrequency: 'weekly',
    lastChecked: '2024-12-11T09:00:00Z',
    nextCheckDue: '2024-12-18T09:00:00Z',
    currentTankId: 'tnk-006'
  },
  {
    id: 'gas-suites-leopard',
    code: 'GAS-SUITES',
    name: 'Suites & Leopard Room',
    department: 'guest_rooms',
    tankSize: 48,
    priority: 7,
    isAlwaysActive: false,
    checkFrequency: 'weekly',
    lastChecked: '2024-12-09T14:00:00Z',
    nextCheckDue: '2024-12-16T14:00:00Z',
    currentTankId: 'tnk-007'
  },

  // ===== 9KG TANK (BACKUP) =====
  {
    id: 'gas-9kg-backup',
    code: 'GAS-KITCHEN',
    name: '9kg Backup Tank',
    department: 'kitchen',
    tankSize: 9,
    priority: 8,
    isAlwaysActive: false,
    checkFrequency: 'monthly',
    lastChecked: '2024-12-01T10:00:00Z',
    nextCheckDue: '2024-12-15T10:00:00Z',
    currentTankId: 'tnk-008'
  }
];

export const MOCK_GAS_TANKS: GasTank[] = [
  { id: 'tnk-001', serialNumber: 'ZT-19KG-001', size: 19, tareWeight: 18.5, fullWeight: 37.5, currentWeight: 25.0, status: 'in_use', currentLocationId: 'gas-kitchen-main' },
  { id: 'tnk-002', serialNumber: 'ZT-19KG-002', size: 19, tareWeight: 18.3, fullWeight: 37.3, currentWeight: 30.0, status: 'in_use', currentLocationId: 'gas-private-main' },
  { id: 'tnk-003', serialNumber: 'ZT-19KG-003', size: 19, tareWeight: 18.4, fullWeight: 37.4, currentWeight: 32.0, status: 'in_use', currentLocationId: 'gas-private-geyser-1' },
  { id: 'tnk-004', serialNumber: 'ZT-19KG-004', size: 19, tareWeight: 18.2, fullWeight: 37.2, currentWeight: 28.0, status: 'in_use', currentLocationId: 'gas-kitchen-geyser' },
  { id: 'tnk-005', serialNumber: 'ZT-19KG-005', size: 19, tareWeight: 18.5, fullWeight: 37.5, currentWeight: 35.0, status: 'in_use', currentLocationId: 'gas-colonial' },
  { id: 'tnk-006', serialNumber: 'ZT-19KG-006', size: 19, tareWeight: 18.3, fullWeight: 37.3, currentWeight: 34.0, status: 'in_use', currentLocationId: 'gas-country' },
  { id: 'tnk-007', serialNumber: 'ZT-48KG-001', size: 48, tareWeight: 47.2, fullWeight: 95.2, currentWeight: 65.0, status: 'in_use', currentLocationId: 'gas-suites-leopard' },
  { id: 'tnk-008', serialNumber: 'ZT-9KG-001', size: 9, tareWeight: 8.2, fullWeight: 17.2, currentWeight: 17.2, status: 'reserved', currentLocationId: 'gas-9kg-backup' }
];