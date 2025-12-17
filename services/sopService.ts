
import { SOP, SOPAttempt } from '../types';

export const SOPService = {
  // Check if an employee is eligible to take a test (4-week rule)
  checkEligibility: (sop: SOP, lastAttempt?: SOPAttempt): { eligible: boolean; daysRemaining: number } => {
    if (!lastAttempt) return { eligible: true, daysRemaining: 0 };

    const nextEligible = new Date(lastAttempt.nextEligibleDate);
    const now = new Date();
    
    if (now >= nextEligible) return { eligible: true, daysRemaining: 0 };
    
    const diffTime = Math.abs(nextEligible.getTime() - now.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    
    return { eligible: false, daysRemaining: diffDays };
  },

  // Calculate next eligible date (28 days from now)
  calculateNextEligibleDate: (): string => {
    const nextDate = new Date();
    nextDate.setDate(nextDate.getDate() + 28);
    return nextDate.toISOString();
  },

  // Calculate validity (12 months from now)
  calculateValidityDate: (): string => {
    const validUntil = new Date();
    validUntil.setFullYear(validUntil.getFullYear() + 1);
    return validUntil.toISOString();
  },

  // Grade a test
  gradeTest: (sop: SOP, answers: Record<number, number>): { passed: boolean; score: number } => {
    if (!sop.questions || sop.questions.length === 0) return { passed: true, score: 100 }; // Auto-pass if no questions (for demo)

    let correctCount = 0;
    sop.questions.forEach((q, index) => {
        if (answers[index] === q.correctIndex) {
            correctCount++;
        }
    });

    const score = Math.round((correctCount / sop.questions.length) * 100);
    const passed = score >= sop.passingScore;

    return { passed, score };
  }
};
