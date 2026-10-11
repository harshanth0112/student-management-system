import { STORAGE_KEYS } from '../constants/storageKeys';
import { mockTeachers } from '../data/mockTeachers';
import { mockStudents } from '../data/mockStudents';
import { mockFavourites } from '../data/mockFavourites';
import { mockInvitations } from '../data/mockInvitations';
import { mockActivity } from '../data/mockActivity';
import { mockAnnouncements } from '../data/mockAnnouncements';
import { mockAccessRequests } from '../data/mockAccessRequests';

/**
 * StorageService
 * Manages atomic localStorage operations and acts as the centralized reactive
 * data store for the application across all components and windows.
 */
class StorageService {
  constructor() {
    this.listeners = new Set();
    this.init();

    // Listen to cross-tab/cross-window updates
    if (typeof window !== 'undefined') {
      window.addEventListener('storage', (event) => {
        if (event.key) {
          this.notifyListeners(event.key, this.get(event.key));
        }
      });
    }
  }

  /**
   * Initializes and seeds localStorage if missing
   */
  init(forceReset = false) {
    if (typeof window === 'undefined') return;

    if (forceReset || !localStorage.getItem(STORAGE_KEYS.TEACHERS)) {
      localStorage.setItem(STORAGE_KEYS.TEACHERS, JSON.stringify(mockTeachers));
    }

    if (forceReset || !localStorage.getItem(STORAGE_KEYS.STUDENTS)) {
      localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(mockStudents));
    }

    if (forceReset || !localStorage.getItem(STORAGE_KEYS.FAVOURITES)) {
      localStorage.setItem(STORAGE_KEYS.FAVOURITES, JSON.stringify(mockFavourites));
    }

    if (forceReset || !localStorage.getItem(STORAGE_KEYS.INVITATIONS)) {
      localStorage.setItem(STORAGE_KEYS.INVITATIONS, JSON.stringify(mockInvitations));
    }

    if (forceReset || !localStorage.getItem(STORAGE_KEYS.ACTIVITY)) {
      localStorage.setItem(STORAGE_KEYS.ACTIVITY, JSON.stringify(mockActivity));
    }

    if (forceReset || !localStorage.getItem(STORAGE_KEYS.ANNOUNCEMENTS)) {
      localStorage.setItem(STORAGE_KEYS.ANNOUNCEMENTS, JSON.stringify(mockAnnouncements));
    }

    if (forceReset || !localStorage.getItem(STORAGE_KEYS.ACCESS_REQUESTS)) {
      localStorage.setItem(STORAGE_KEYS.ACCESS_REQUESTS, JSON.stringify(mockAccessRequests));
    }

    if (forceReset) {
      this.notifyListeners('*', null);
    }
  }

  get(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (e) {
      console.error(`Failed to retrieve storage key ${key}:`, e);
      return defaultValue;
    }
  }

  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      this.notifyListeners(key, value);
    } catch (e) {
      console.error(`Failed to set storage key ${key}:`, e);
    }
  }

  remove(key) {
    try {
      localStorage.removeItem(key);
      this.notifyListeners(key, null);
    } catch (e) {
      console.error(`Failed to remove storage key ${key}:`, e);
    }
  }

  /**
   * Subscribe to centralized data changes.
   * Whenever data is added, edited, or removed anywhere in the app,
   * all subscribed contexts and views re-render with the latest centralized data.
   */
  subscribe(callback) {
    this.listeners.add(callback);
    return () => {
      this.listeners.delete(callback);
    };
  }

  notifyListeners(key, value) {
    this.listeners.forEach((callback) => {
      try {
        callback(key, value);
      } catch (err) {
        console.error('Error in storage listener callback:', err);
      }
    });
  }

  resetAll() {
    this.init(true);
  }
}

export const storageService = new StorageService();
