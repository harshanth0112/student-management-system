import { storageService } from './storageService';
import { STORAGE_KEYS } from '../constants/storageKeys';

const delay = (ms = 120) => new Promise((resolve) => setTimeout(resolve, ms));

export const landingService = {
  /**
   * Reads true counts directly from the prototype demo data
   */
  async getMetrics() {
    await delay(100);
    const students = storageService.get(STORAGE_KEYS.STUDENTS, []);
    
    // Distinct departments count
    const departments = new Set(students.map((s) => s.department).filter(Boolean));

    return {
      studentCount: students.length,
      departmentCount: departments.size,
      roleCount: 2, // Strictly Teacher & Student
    };
  },
};
