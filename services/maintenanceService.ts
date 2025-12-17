
import { MOCK_MAINTENANCE_TASKS, MOCK_MACHINE_CERTS } from './mockMaintenanceData';
import { MaintenanceTask, MaintenanceLog, MachineType, WeatherData } from '../types';

export interface MachineValidationResult {
  allowed: boolean;
  level: 'certified' | 'conditional' | 'failed' | 'none';
  message: string;
  actions: string[];
}

export interface ValidationResult {
  valid: boolean;
  error?: string;
  warning?: string;
  action?: string;
}

export const MaintenanceService = {
  /**
   * Get week number to determine odd/even parity
   */
  getWeekNumber: (d: Date): number => {
    d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
    var yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    var weekNo = Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
    return weekNo;
  },

  /**
   * Get tasks for a specific date based on frequency rules
   */
  getTasksForDate: (date: Date): MaintenanceTask[] => {
    const dayOfWeek = date.getDay() || 7; // 1 (Mon) - 7 (Sun)
    const weekNum = MaintenanceService.getWeekNumber(date);
    const isOddWeek = weekNum % 2 !== 0;

    return MOCK_MAINTENANCE_TASKS.filter(task => {
      // 1. Daily: Always include
      if (task.frequency === 'DAILY') return true;

      // 2. Weekly: Check specific day
      if (task.frequency === 'WEEKLY') {
        return task.dayOfWeek === dayOfWeek;
      }

      // 3. Bi-Weekly: Check week parity
      if (task.frequency === 'EVERY_TWO_WEEKS') {
        if (task.weekParity === 'odd' && isOddWeek) return true;
        if (task.weekParity === 'even' && !isOddWeek) return true;
        if (task.weekParity === 'both') return true;
        return false;
      }

      // 4. Monthly: For demo, assume 1st of month (or show in separate list)
      if (task.frequency === 'MONTHLY') {
        return date.getDate() === 1; // Only show on 1st of month for "Today" view
      }

      // 5. Summer Seasonal: Manually managed in Vineyard tab, not "Today's Routine"
      return false;
    });
  },

  /**
   * Get tasks by frequency category (for list views)
   */
  getTasksByFrequency: (freq: string): MaintenanceTask[] => {
    return MOCK_MAINTENANCE_TASKS.filter(t => t.frequency === freq);
  },

  /**
   * Check if a task is completed for a date
   */
  isTaskCompleted: (taskId: string, dateStr: string, logs: MaintenanceLog[]): boolean => {
    return logs.some(log => log.taskId === taskId && log.date === dateStr && log.status === 'completed');
  },

  /**
   * Validate if an employee is certified to use a specific machine.
   */
  validateMachineAccess: (employeeId: string, machineType: MachineType): MachineValidationResult => {
    const cert = MOCK_MACHINE_CERTS.find(c => c.employeeId === employeeId && c.machineType === machineType);

    if (!cert) {
      return {
        allowed: false,
        level: 'none',
        message: `NO CERTIFICATION FOUND. You have not completed the mandatory SOP test for ${machineType}.`,
        actions: ['STOP', 'NOTIFY_SUPERVISOR', 'REQUIRE_TEST']
      };
    }

    if (cert.score < 80) {
      return {
        allowed: false,
        level: 'failed',
        message: `DO NOT USE THIS MACHINE. Score: ${cert.score}%. You failed the mandatory SOP test.`,
        actions: ['IMMEDIATE_STOP', 'ESCALATE_TO_SUPERVISOR', 'SCHEDULE_RETEST']
      };
    }

    if (cert.score >= 80 && cert.score < 90) {
      return {
        allowed: true,
        level: 'conditional',
        message: `CONDITIONAL APPROVAL. Score: ${cert.score}%. Supervisor must be present. Retest due by ${cert.requiresRetestBy}.`,
        actions: ['ALLOW_WITH_SUPERVISION', 'SCHEDULE_RETEST']
      };
    }

    return {
      allowed: true,
      level: 'certified',
      message: `APPROVED. Score: ${cert.score}%. Qualified to use this machine.`,
      actions: ['ALLOW', 'LOG_USAGE']
    };
  },

  // --- SUMMER VINEYARD RULES (SOP 9.9.1) ---
  SummerVineyardRules: {
    // RULE: Shoot trimming height (max 15cm above wire)
    validateShootTrimmingHeight: (trimmedHeightCm: number): ValidationResult => {
      const maxHeightAboveWire = 15; 
      
      if (trimmedHeightCm > maxHeightAboveWire) {
        return {
          valid: false,
          error: `Height ${trimmedHeightCm}cm exceeds max 15cm above top wire (SOP 9.9.1).`,
          action: 'retrim'
        };
      }
      return { valid: true };
    },

    // RULE: Spray weather conditions
    validateSprayWeatherConditions: (weather: WeatherData): ValidationResult => {
      if (weather.isRaining || weather.rainLast24Hours > 0) {
        return { valid: false, error: 'Cannot spray: Rain detected or within 24h of rain.' };
      }
      if (weather.windSpeed > 15) {
        return { valid: false, error: `Cannot spray: Wind ${weather.windSpeed}km/h exceeds 15km/h limit.` };
      }
      if (weather.temperature > 30) {
        return { valid: false, error: `Cannot spray: Temp ${weather.temperature}°C exceeds 30°C limit.` };
      }
      return { valid: true };
    },

    // RULE: Grass mowing height
    validateMowingHeight: (beforeHeight: number, afterHeight: number): ValidationResult => {
      const maxGrassHeight = 15; // Trigger
      const minCutHeight = 5; // Safety
      
      if (beforeHeight < maxGrassHeight) {
        return { valid: true, warning: `Grass at ${beforeHeight}cm is below trigger height (${maxGrassHeight}cm). Mowing optional.` };
      }
      if (afterHeight < minCutHeight) {
        return { valid: false, error: `Cut too short (${afterHeight}cm). Minimum is ${minCutHeight}cm.` };
      }
      return { valid: true };
    }
  }
};
