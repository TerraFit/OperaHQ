
import { GasCheckAssessment } from "../types";

export const GasService = {
  // CALCULATE REMAINING GAS (Current - Tare)
  calculateRemainingGas: (currentWeight: number, tareWeight: number): number => {
    const remaining = currentWeight - tareWeight;
    // Allow negative for display/debug, but clamp for percentage logic usually
    return Number(remaining.toFixed(2));
  },

  // CALCULATE PERCENTAGE
  calculatePercentage: (currentWeight: number, tareWeight: number, fullWeight: number): number => {
    const capacity = fullWeight - tareWeight;
    const remaining = Math.max(0, currentWeight - tareWeight);
    
    if (capacity <= 0) return 0;
    
    return Number(((remaining / capacity) * 100).toFixed(1));
  },

  // NEW ASSESSMENT LOGIC: Empty(<=0), Low(<=25%), Adequate(<=50%), Full(>50%)
  getAssessment: (percentage: number, gasWeight: number): GasCheckAssessment => {
    if (gasWeight <= 0) return 'empty';
    if (percentage <= 25) return 'low';
    if (percentage <= 50) return 'adequate';
    return 'full';
  },

  getActionRequired: (assessment: GasCheckAssessment): string => {
    switch (assessment) {
      case 'empty': return 'REFILL IMMEDIATELY';
      case 'low': return 'Schedule Refill';
      case 'adequate': return 'Monitor';
      default: return 'None';
    }
  },

  // Mock Email Alert
  sendLowGasAlert: async (locationName: string, percentage: number) => {
    console.log(`[MOCK EMAIL] To: info@jbayzebralodge.co.za | Subject: LOW GAS ALERT - ${locationName} (${percentage}%)`);
    return new Promise(resolve => setTimeout(resolve, 500));
  }
};
