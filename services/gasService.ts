
import { GasCheckAssessment } from "../types";

export interface CheckProcedure {
  steps: string[];
  frequency: string;
  safetyLevel: 'low' | 'medium' | 'high' | 'critical';
  requiresTwoPersonCheck?: boolean;
  requiresSupervisor?: boolean;
  note?: string;
}

export const GasService = {
  // CALCULATE REMAINING GAS (EXACT FORMULA AS SPECIFIED)
  calculateRemainingGas: (currentWeight: number, tareWeight: number): number => {
    if (currentWeight < tareWeight) return 0;
    return Number((currentWeight - tareWeight).toFixed(2));
  },

  calculatePercentage: (currentWeight: number, tareWeight: number, fullWeight: number): number => {
    const capacity = fullWeight - tareWeight;
    const remaining = currentWeight - tareWeight;
    
    if (capacity <= 0) return 0;
    if (remaining <= 0) return 0;
    
    return Number(((remaining / capacity) * 100).toFixed(1));
  },

  getAssessment: (percentage: number): GasCheckAssessment => {
    if (percentage >= 75) return 'full';
    if (percentage >= 30) return 'adequate';
    if (percentage >= 15) return 'low';
    if (percentage > 0) return 'critical';
    return 'empty';
  },

  getActionRequired: (percentage: number): string => {
    if (percentage < 15) return 'REFILL NOW';
    if (percentage < 30) return 'Monitor';
    return 'None';
  },

  // Mock Email Alert
  sendLowGasAlert: async (locationName: string, percentage: number) => {
    console.log(`[MOCK EMAIL] To: info@jbayzebralodge.co.za | Subject: LOW GAS ALERT - ${locationName} (${percentage}%)`);
    return new Promise(resolve => setTimeout(resolve, 500));
  },

  getCheckProcedure: (code: string, capacity: number): CheckProcedure => {
    // Special procedure for 9kg backup
    if (capacity === 9) {
      return {
        steps: [
          'Visual inspection for damage',
          'Check storage conditions',
          'Verify seal integrity',
          'Record storage location'
        ],
        frequency: 'monthly',
        safetyLevel: 'low',
        note: 'Emergency backup only - minimal checking required'
      };
    }

    const procedures: Record<string, CheckProcedure> = {
      'GAS-KITCHEN': {
        steps: [
          'Check pressure gauge reading',
          'Inspect for leaks with soap solution',
          'Check regulator connection',
          'Verify valve operation',
          'Record pressure reading'
        ],
        frequency: 'weekly',
        safetyLevel: 'high'
      },
      'GAS-PRIVATE': {
        steps: [
          'Check pressure gauge reading',
          'Inspect for leaks with soap solution',
          'Check regulator connection',
          'Verify valve operation',
          'Record pressure reading'
        ],
        frequency: 'weekly',
        safetyLevel: 'high'
      },
      'GAS-COLONIAL': {
        steps: [
          'Check pressure gauge reading',
          'Inspect for leaks with soap solution',
          'Check kitchenette connections',
          'Verify ventilation in suite',
          'Record pressure reading'
        ],
        frequency: 'weekly',
        safetyLevel: 'medium'
      },
      'GAS-COUNTRY': {
        steps: [
          'Check pressure gauge reading',
          'Inspect for leaks with soap solution',
          'Check kitchenette connections',
          'Verify ventilation in suite',
          'Record pressure reading'
        ],
        frequency: 'weekly',
        safetyLevel: 'medium'
      },
      'GAS-SUITES': {
        steps: [
          'Check pressure gauge reading',
          'Complete leak detection survey',
          'Inspect all connection points',
          'Verify emergency shut-off valve',
          'Check ventilation system',
          'Verify fire extinguisher access',
          'Record detailed readings'
        ],
        frequency: 'weekly',
        safetyLevel: 'critical',
        requiresTwoPersonCheck: true,
        requiresSupervisor: true
      }
    };

    return procedures[code] || procedures['GAS-KITCHEN'];
  }
};
