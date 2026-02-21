import { useState, useEffect } from 'react';
import { Screen } from '../types';
import { localStorageUtils, STORAGE_KEYS } from './useLocalStorage';

export function useNavigation() {
  // Load initial screen from localStorage or default to 'auth'
  const getInitialScreen = (): Screen => {
    const savedUser = localStorageUtils.getItem(STORAGE_KEYS.USER, null);
    const savedScreen = localStorageUtils.getItem<Screen>('skinpai_current_screen', 'auth');
    
    // If user is logged in, use saved screen or default to camera
    if (savedUser) {
      return savedScreen !== 'auth' && savedScreen !== 'create-account' ? savedScreen : 'camera';
    }
    
    // If no user, always start at auth
    return 'auth';
  };

  const [currentScreen, setCurrentScreen] = useState<Screen>(getInitialScreen());
  const [navigationHistory, setNavigationHistory] = useState<Screen[]>([getInitialScreen()]);

  // Initialize browser history on mount
  useEffect(() => {
    // Replace initial state
    window.history.replaceState({ screen: currentScreen }, '', '');

    // Listen for browser back/forward button
    const handlePopState = (event: PopStateEvent) => {
      if (event.state && event.state.screen) {
        setCurrentScreen(event.state.screen);
        // Save to localStorage
        localStorageUtils.setItem('skinpai_current_screen', event.state.screen);
        // Update navigation history when using browser back
        setNavigationHistory(prev => {
          const lastScreen = prev[prev.length - 1];
          if (lastScreen !== event.state.screen) {
            return [...prev, event.state.screen];
          }
          return prev;
        });
      } else {
        // If no state, check if user is logged in
        const savedUser = localStorageUtils.getItem(STORAGE_KEYS.USER, null);
        const nextScreen = savedUser ? 'camera' : 'auth';
        setCurrentScreen(nextScreen);
        localStorageUtils.setItem('skinpai_current_screen', nextScreen);
      }
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [currentScreen]);

  // Update browser history when screen changes
  const navigateToScreen = (screen: Screen) => {
    setCurrentScreen(screen);
    setNavigationHistory(prev => [...prev, screen]);
    // Save to localStorage
    localStorageUtils.setItem('skinpai_current_screen', screen);
    window.history.pushState({ screen }, '', '');
  };

  const handleBack = () => {
    // Use browser's back functionality
    if (navigationHistory.length > 1) {
      window.history.back();
    } else {
      // Fallback to default navigation logic
      const savedUser = localStorageUtils.getItem(STORAGE_KEYS.USER, null);
      
      switch (currentScreen) {
        case 'results':
          navigateToScreen('camera');
          break;
        case 'products':
          navigateToScreen('results');
          break;
        case 'shop':
          navigateToScreen('camera');
          break;
        case 'dashboard':
        case 'community':
        case 'pro-dashboard':
          navigateToScreen('camera');
          break;
        case 'create-account':
          navigateToScreen('auth');
          break;
        default:
          navigateToScreen(savedUser ? 'camera' : 'auth');
      }
    }
  };

  return {
    currentScreen,
    setCurrentScreen: navigateToScreen,
    handleBack
  };
}