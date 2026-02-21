/**
 * Auth Context - Manages authentication state globally
 */
import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import api, { AuthResponse, GuestLoginResponse, UserDto, RegisterRequest } from '../services/api';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  apiUser: UserDto | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (request: RegisterRequest) => Promise<{ success: boolean; error?: string }>;
  guestLogin: () => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  updateUser: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper to convert flat AuthResponse to UserDto
function authResponseToUserDto(response: AuthResponse): UserDto {
  return {
    userId: response.userId,
    email: response.email,
    firstName: response.firstName,
    lastName: response.lastName,
    membershipType: response.membershipType,
    membershipStatus: 'active',
    profileImageUrl: undefined,
    isCreator: false,
    isVerified: false,
    walletBalance: 0,
    totalScansUsed: 0,
    questionnaireCompleted: response.questionnaireCompleted,
  };
}

// Helper to convert GuestLoginResponse to UserDto
function guestResponseToUserDto(response: GuestLoginResponse): UserDto {
  return {
    userId: response.userId,
    email: '',
    firstName: 'Guest',
    lastName: '',
    membershipType: response.membershipType,
    membershipStatus: 'active',
    profileImageUrl: undefined,
    isCreator: false,
    isVerified: false,
    walletBalance: 0,
    totalScansUsed: 0,
    questionnaireCompleted: false,
  };
}

// Helper to convert API user to local User type
function apiUserToLocalUser(apiUser: UserDto, scansToday: number = 0, maxScans?: number): User {
  const membershipType = apiUser.membershipType.toLowerCase() as 'guest' | 'member' | 'pro';
  const defaultMaxScans = membershipType === 'pro' ? 9999 : membershipType === 'member' ? 3 : 1;
  
  return {
    id: apiUser.userId,
    type: membershipType,
    membershipType: membershipType,
    scansToday: scansToday,
    maxScans: maxScans ?? defaultMaxScans,
    name: `${apiUser.firstName} ${apiUser.lastName}`.trim(),
    email: apiUser.email,
    profileImage: apiUser.profileImageUrl,
    hasStation: apiUser.isCreator,
    walletBalance: apiUser.walletBalance,
    subscriptionStatus: apiUser.membershipStatus.toLowerCase() === 'active' ? 'active' : 'expired',
    questionnaireCompleted: apiUser.questionnaireCompleted,
    skinProfile: apiUser.skinProfile ? {
      skinType: apiUser.skinProfile.skinType,
      skinConcerns: apiUser.skinProfile.skinConcerns,
      currentRoutine: apiUser.skinProfile.currentRoutine,
      sunExposure: apiUser.skinProfile.sunExposure,
      lifestyle: apiUser.skinProfile.lifestyle,
    } : undefined,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [apiUser, setApiUser] = useState<UserDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const initAuth = async () => {
      if (api.isAuthenticated()) {
        try {
          const { data, error } = await api.getCurrentUser();
          if (data) {
            setApiUser(data);
            
            // Get daily usage first, then set user with correct values
            const usageResponse = await api.getDailyUsage();
            const scansToday = usageResponse.data?.scanCount ?? 0;
            const maxScans = usageResponse.data?.maxScans;
            
            setUser(apiUserToLocalUser(data, scansToday, maxScans));
          } else {
            // Token invalid, clear it
            api.clearTokens();
          }
        } catch (error) {
          console.error('Failed to restore session:', error);
          api.clearTokens();
        }
      }
      setIsLoading(false);
    };

    initAuth();

    // Listen for logout events
    const handleLogout = () => {
      setUser(null);
      setApiUser(null);
    };
    window.addEventListener('auth:logout', handleLogout);
    return () => window.removeEventListener('auth:logout', handleLogout);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await api.login(email, password);
      
      if (error || !data) {
        setIsLoading(false);
        return { success: false, error: error || 'Login failed' };
      }

      // Fetch full user profile from backend (includes profile image, questionnaire, skin profile)
      const { data: fullUserData } = await api.getCurrentUser();
      if (fullUserData) {
        setApiUser(fullUserData);
        
        // Get daily usage to get correct scan count
        const usageResponse = await api.getDailyUsage();
        const scansToday = usageResponse.data?.scanCount ?? 0;
        const maxScans = usageResponse.data?.maxScans;
        
        setUser(apiUserToLocalUser(fullUserData, scansToday, maxScans));
      } else {
        // Fallback to basic auth response data
        const userDto = authResponseToUserDto(data);
        setApiUser(userDto);
        
        const usageResponse = await api.getDailyUsage();
        const scansToday = usageResponse.data?.scanCount ?? 0;
        const maxScans = usageResponse.data?.maxScans;
        
        setUser(apiUserToLocalUser(userDto, scansToday, maxScans));
      }

      setIsLoading(false);
      return { success: true };
    } catch (error) {
      setIsLoading(false);
      return { success: false, error: 'An unexpected error occurred' };
    }
  }, []);

  const register = useCallback(async (request: RegisterRequest) => {
    setIsLoading(true);
    try {
      const { data, error } = await api.register(request);
      
      if (error || !data) {
        setIsLoading(false);
        return { success: false, error: error || 'Registration failed' };
      }

      const userDto = authResponseToUserDto(data);
      setApiUser(userDto);
      setUser(apiUserToLocalUser(userDto));
      setIsLoading(false);
      return { success: true };
    } catch (error) {
      setIsLoading(false);
      return { success: false, error: 'An unexpected error occurred' };
    }
  }, []);

  const guestLogin = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data, error } = await api.guestLogin();
      
      if (error || !data) {
        setIsLoading(false);
        return { success: false, error: error || 'Guest login failed' };
      }

      const userDto = guestResponseToUserDto(data);
      setApiUser(userDto);
      setUser(apiUserToLocalUser(userDto));
      setIsLoading(false);
      return { success: true };
    } catch (error) {
      setIsLoading(false);
      return { success: false, error: 'An unexpected error occurred' };
    }
  }, []);

  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      await api.logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
    setUser(null);
    setApiUser(null);
    setIsLoading(false);
  }, []);

  const refreshUser = useCallback(async () => {
    if (!api.isAuthenticated()) return;
    
    try {
      const { data } = await api.getCurrentUser();
      if (data) {
        setApiUser(data);
        setUser(prev => ({
          ...apiUserToLocalUser(data),
          // Preserve local-only state
          scansToday: prev?.scansToday || 0,
          questionnaireCompleted: prev?.questionnaireCompleted,
          skinProfile: prev?.skinProfile,
          stationData: prev?.stationData,
        }));
      }
    } catch (error) {
      console.error('Failed to refresh user:', error);
    }
  }, []);

  const updateUser = useCallback((updates: Partial<User>) => {
    setUser(prev => prev ? { ...prev, ...updates } : null);
  }, []);

  const value: AuthContextType = {
    user,
    apiUser,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    guestLogin,
    logout,
    refreshUser,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
