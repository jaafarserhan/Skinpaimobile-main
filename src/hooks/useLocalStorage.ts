import { useState, useEffect } from 'react';

/**
 * Custom hook for managing localStorage with type safety
 * Automatically syncs state with localStorage
 */
export function useLocalStorage<T>(key: string, initialValue: T) {
  // Get stored value from localStorage or use initial value
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error loading ${key} from localStorage:`, error);
      return initialValue;
    }
  });

  // Update localStorage whenever the value changes
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // Allow value to be a function for same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error saving ${key} to localStorage:`, error);
    }
  };

  return [storedValue, setValue] as const;
}

/**
 * Utility functions for localStorage management
 */
export const localStorageUtils = {
  // Get item from localStorage
  getItem: <T,>(key: string, defaultValue: T): T => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error(`Error reading ${key}:`, error);
      return defaultValue;
    }
  },

  // Set item in localStorage
  setItem: <T,>(key: string, value: T): void => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error saving ${key}:`, error);
    }
  },

  // Remove item from localStorage
  removeItem: (key: string): void => {
    try {
      window.localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing ${key}:`, error);
    }
  },

  // Clear all localStorage
  clear: (): void => {
    try {
      window.localStorage.clear();
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  },

  // Check if key exists
  hasItem: (key: string): boolean => {
    return window.localStorage.getItem(key) !== null;
  }
};

// Storage keys used throughout the app
export const STORAGE_KEYS = {
  USER: 'skinpai_user',
  SCAN_HISTORY: 'skinpai_scan_history',
  CURRENT_SCAN: 'skinpai_current_scan',
  THEME_PREFERENCE: 'skinpai_theme',
  NOTIFICATIONS_ENABLED: 'skinpai_notifications',
  ONBOARDING_COMPLETED: 'skinpai_onboarding',
  COMMUNITY_POSTS: 'skinpai_community_posts',
  USER_POSTS: 'skinpai_user_posts',
  SAVED_PRODUCTS: 'skinpai_saved_products',
  SKIN_ROUTINE: 'skinpai_skin_routine',
  QUESTIONNAIRE_ANSWERS: 'skinpai_questionnaire',
  APP_SETTINGS: 'skinpai_settings',
};
