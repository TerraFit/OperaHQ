
import { Employee, RosterEntry, RosterShiftCode } from '../types';
import { SA_PUBLIC_HOLIDAYS } from '../constants';

export const AutoScheduleService = {
  /**
   * Generates a 4-month roster for permanent employees
   */
  generateRoster: (
    employees: Employee[], 
    startDate: Date, 
    monthsCount: number = 4
  ): RosterEntry[] => {
    const entries: RosterEntry[] = [];
    const endDate = new Date(startDate);
    endDate.setMonth(startDate.getMonth() + monthsCount);

    const permanentStaff = employees.filter(e => e.employmentType === 'permanent');

    for (let d = new Date(startDate); d < endDate; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split('T')[0];
      const dayOfWeek = d.getDay(); // 0=Sun, 1=Mon...
      const isPublicHoliday = SA_PUBLIC_HOLIDAYS.includes(dateStr);
      const weekNumber = getISOWeek(d);
      const isEvenWeek = weekNumber % 2 === 0;

      permanentStaff.forEach(staff => {
        let code: RosterShiftCode = 'O'; // Default to OFF

        // --- HOUSEKEEPING RULES ---
        if (staff.department.toLowerCase() === 'housekeeping') {
          // Room Attendants work daily, but usually have rotating weekends. 
          // Rule: Work all days except Sun.
          code = (dayOfWeek === 0) ? 'O' : 'D';
        }

        // --- KITCHEN RULES ---
        else if (staff.department.toLowerCase() === 'kitchen') {
          // Standard Kitchen: 5 days on, 2 days off (rotating)
          // Simplified for automation: OFF on Mon/Tue for some, Wed/Thu for others
          const staffIndex = parseInt(staff.id.split('-')[1]) || 0;
          const offDay1 = (staffIndex % 3) + 1; // 1, 2, or 3
          const offDay2 = offDay1 + 1;
          
          if (dayOfWeek === offDay1 || dayOfWeek === offDay2) {
            code = 'O';
          } else {
            code = 'D';
          }
        }

        // --- MAINTENANCE RULES (D1/D2/D Rotation) ---
        else if (staff.department.toLowerCase() === 'maintenance') {
          const mType = staff.jobTitle.includes('Lead') ? 'D' : (staff.id.endsWith('1') ? 'D1' : 'D2');
          
          if (mType === 'D1') {
            // Week 1 (Odd): Mon-Thu. Week 2 (Even): Mon-Thu. (Pattern remains same)
            code = (dayOfWeek >= 1 && dayOfWeek <= 4) ? 'D' : 'O';
          } else if (mType === 'D2') {
            // Alternating pattern: Mon-Sat
            code = (dayOfWeek >= 1 && dayOfWeek <= 6) ? 'D' : 'O';
          } else {
            // Standard D: Mon-Fri
            code = (dayOfWeek >= 1 && dayOfWeek <= 5) ? 'D' : 'O';
          }
        }

        // --- PUBLIC HOLIDAY OVERRIDE ---
        if (isPublicHoliday && code === 'D') {
          code = 'P';
        }

        entries.push({
          id: `auto-${staff.id}-${dateStr}`,
          staffId: staff.id,
          date: dateStr,
          code
        });
      });
    }

    return entries;
  }
};

/**
 * Helper to get ISO week number for rotations
 */
function getISOWeek(date: Date) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
}
