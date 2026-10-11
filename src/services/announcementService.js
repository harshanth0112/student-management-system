import { storageService } from './storageService';
import { STORAGE_KEYS } from '../constants/storageKeys';

const delay = (ms = 120) => new Promise((resolve) => setTimeout(resolve, ms));

export const announcementService = {
  /**
   * Retrieves department and institution announcements
   */
  async getAnnouncements() {
    await delay(120);
    return storageService.get(STORAGE_KEYS.ANNOUNCEMENTS, []);
  },
};
