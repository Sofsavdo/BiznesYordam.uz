import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

interface User {
  id: string;
  username: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  role: 'admin' | 'partner' | 'customer';
  isActive?: boolean;
}

interface Partner {
  id: string;
  userId: string;
  businessName?: string;
  businessCategory: string;
  pricingTier: string;
  isApproved: boolean;
}

interface AuthResponse {
  user: User;
  partner?: Partner;
  permissions?: Record<string, boolean> | null;
}

interface AuthContextType {
  user: User | null;
  partner: Partner | null;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<AuthResponse>;
  logout: () => Promise<void>;
  refetch: () => void;
  permissions: Record<string, boolean> | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [partner, setPartner] = useState<Partner | null>(null);
  const [permissions, setPermissions] = useState<Record<string, boolean> | null>(null);
  const queryClient = useQueryClient();

  const { data: authData, isLoading, refetch, error } = useQuery<AuthResponse | null>({
    queryKey: ['/api/auth/me'],
    queryFn: async () => {
      try {
        const response = await apiRequest('GET', '/api/auth/me');
        const data = await response.json() as AuthResponse;
        console.log('✅ Auth data received:', data);
        return data;
      } catch (error: any) {
        console.log('🔍 Auth check error:', error.message);
        // 401 errors are expected when user is not authenticated
        if (error.message?.includes('401') || error.message?.includes('Avtorizatsiya')) {
          return null;
        }
        // Don't throw other errors, just return null for now
        console.warn('Auth error (returning null):', error.message);
        return null;
      }
    },
    retry: (failureCount, error: any) => {
      // Don't retry on auth errors
      if (error?.message?.includes('401') || error?.message?.includes('Avtorizatsiya')) {
        return false;
      }
      return failureCount < 2; // Retry up to 2 times for other errors
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false, // Prevent unnecessary refetches
    refetchOnMount: true,
    refetchOnReconnect: true,
    gcTime: 15 * 60 * 1000, // Keep in cache for 15 minutes
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
  });

  const loginMutation = useMutation({
    mutationFn: async ({ username, password }: { username: string; password: string }) => {
      const response = await apiRequest('POST', '/api/auth/login', { username, password });
      return response.json() as Promise<AuthResponse>;
    },
    onSuccess: (data) => {
      console.log('✅ Login successful:', data);
      setUser(data.user);
      setPartner(data.partner || null);
      setPermissions((data as any).permissions || null);
      // Invalidate and refetch auth data
      queryClient.invalidateQueries({ queryKey: ['/api/auth/me'] });
      queryClient.setQueryData(['/api/auth/me'], data);
    },
    onError: (error) => {
      console.error('❌ Login failed:', error);
      // Don't clear user data on login error
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await apiRequest('POST', '/api/auth/logout');
    },
    onSuccess: () => {
      console.log('✅ Logout successful');
      setUser(null);
      setPartner(null);
      setPermissions(null);
      queryClient.clear();
    },
    onError: (error) => {
      console.error('❌ Logout failed:', error);
      // Even if logout fails, clear local state
      setUser(null);
      setPartner(null);
      setPermissions(null);
      queryClient.clear();
    },
  });

  const login = async (username: string, password: string): Promise<AuthResponse> => {
    const data = await loginMutation.mutateAsync({ username, password });
    return data as AuthResponse;
  };

  const logout = async () => {
    await logoutMutation.mutateAsync();
  };

  // Handle auth data changes - ONLY set user data, don't clear it unnecessarily
  useEffect(() => {
    if (authData?.user) {
      console.log('🔄 Setting user data:', authData.user);
      setUser(authData.user);
      setPartner(authData.partner || null);
      setPermissions((authData as any).permissions || null);
    }
    // NEVER clear user data when authData is null - let it persist
    // This prevents unnecessary logouts
  }, [authData]);

  // Handle authentication errors - only clear on actual auth errors
  useEffect(() => {
    if (error && !isLoading) {
      console.error('❌ Authentication error:', error);
      // Only clear user data on actual auth errors, not network errors
      if (error instanceof Error && (
        error.message.includes('401') || 
        error.message.includes('Avtorizatsiya')
      )) {
        console.log('🔄 Clearing user data due to auth error');
        setUser(null);
        setPartner(null);
        setPermissions(null);
      }
    }
  }, [error, isLoading]);

  const contextValue: AuthContextType = {
    user,
    partner,
    isLoading,
    login,
    logout,
    refetch,
    permissions,
  };

  return React.createElement(
    AuthContext.Provider,
    { value: contextValue },
    children
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}