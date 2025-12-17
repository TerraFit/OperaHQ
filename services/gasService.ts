
import { GasCheckAssessment } from "../types";

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
  }
};