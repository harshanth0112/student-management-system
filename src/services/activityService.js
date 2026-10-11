import { storageService } from './storageService';
import { STORAGE_KEYS } from '../constants/storageKeys';
import { generateId } from '../utils/idGenerator';

const delay = (ms = 120) => new Promise((resolve) => setTimeout(resolve, ms));

export const activityService = {
  /**
   * Retrieves activity events (most recent first)
   */
  async getActivity(limit = 50) {
    await delay(100);
    const activities = storageService.get(STORAGE_KEYS.ACTIVITY, []);
    return activities.slice(0, limit);
  },

  /**
   * Appends an event to the activity audit trail
   */
  async logActivity({ type, title, description, studentId = null, actor = 'Teacher' }) {
    const activities = storageService.get(STORAGE_KEYS.ACTIVITY, []);
    const newEntry = {
      id: generateId('act'),
      type,
      title,
      description,
      actor,
      studentId,
      timestamp: new Date().toISOString(),
    };

    activities.unshift(newEntry);
    storageService.set(STORAGE_KEYS.ACTIVITY, activities);
    return newEntry;
  },

  /**
   * Resets all demo data back to default mock state
   */
  async resetDemoData() {
    await delay(300);
    storageService.resetAll();
    return true;
  },
};
