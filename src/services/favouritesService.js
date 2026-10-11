import { storageService } from './storageService';
import { STORAGE_KEYS } from '../constants/storageKeys';
import { activityService } from './activityService';

const delay = (ms = 120) => new Promise((resolve) => setTimeout(resolve, ms));

export const favouritesService = {
  /**
   * Retrieves array of favourite student IDs
   */
  async getFavourites() {
    await delay(100);
    return storageService.get(STORAGE_KEYS.FAVOURITES, []);
  },

  /**
   * Toggles a student's favourite status (stores IDs only)
   */
  async toggleFavourite(studentId) {
    await delay(150);
    const favourites = storageService.get(STORAGE_KEYS.FAVOURITES, []);
    const isFavourited = favourites.includes(studentId);

    let updatedFavourites;
    if (isFavourited) {
      updatedFavourites = favourites.filter((id) => id !== studentId);
      await activityService.logActivity({
        type: 'FAVOURITE_REMOVED',
        title: 'Removed from Favourites',
        description: `Unmarked student ${studentId} from instructor favourites.`,
        studentId,
      });
    } else {
      // Prevent duplicates
      updatedFavourites = [...new Set([...favourites, studentId])];
      await activityService.logActivity({
        type: 'FAVOURITE_ADDED',
        title: 'Added to Favourites',
        description: `Marked student ${studentId} as favourite.`,
        studentId,
      });
    }

    storageService.set(STORAGE_KEYS.FAVOURITES, updatedFavourites);
    return updatedFavourites;
  },

  /**
   * Explicitly removes a student from favourites (e.g., when student is deleted)
   */
  async removeFavourite(studentId) {
    const favourites = storageService.get(STORAGE_KEYS.FAVOURITES, []);
    if (favourites.includes(studentId)) {
      const updated = favourites.filter((id) => id !== studentId);
      storageService.set(STORAGE_KEYS.FAVOURITES, updated);
      return updated;
    }
    return favourites;
  },

  /**
   * Clears all favourites (requires confirmation dialog)
   */
  async clearAllFavourites() {
    await delay(180);
    storageService.set(STORAGE_KEYS.FAVOURITES, []);
    await activityService.logActivity({
      type: 'FAVOURITES_CLEARED',
      title: 'Cleared Favourites',
      description: 'Reset all instructor student bookmarks.',
    });
    return [];
  },
};
