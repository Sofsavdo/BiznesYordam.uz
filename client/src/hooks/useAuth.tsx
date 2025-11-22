// client/src/hooks/useAuth.ts
import React, { createContext, useContext, useState, useEffect, useMemo, useCallback, ReactNode } from 'react';
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
        console.log('Auth data received:', data);
        return data;
      } catch (error: any) {
        console.log('Auth check error:', error.message);
        if (error.message?.includes('401') || error.message?.includes('Avtorizatsiya')) {
          return null;
        }
        return null;
      }
    },
    retry: false,
    staleTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    refetchOnReconnect: false,
    gcTime: 15 * 60 * 1000,
  });

  const loginMutation = useMutation({
    mutationFn: async ({ username, password }: { username: string; password: string }) => {
      const response = await apiRequest('POST', '/api/auth/login', { username, password });
      return response.json() as Promise<AuthResponse>;
    },
    onSuccess: (data) => {
      console.log('Login successful:', data);
      queryClient.setQueryData(['/api/auth/me'], data);
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await apiRequest('POST', '/api/auth/logout');
    },
    onSuccess: () => {
      console.log('Logout successful');
      queryClient.removeQueries({ queryKey: ['/api/auth/me'] });
      setUser(null);
      setPartner(null);
      setPermissions(null);
    },
    onError: () => {
      // Force clear even if API fails
      queryClient.removeQueries({ queryKey: ['/api/auth/me'] });
      setUser(null);
      setPartner(null);
      setPermissions(null);
    },
  });

  const login = useCallback(async (username: string, password: string): Promise<AuthResponse> => {
    const data = await loginMutation.mutateAsync({ username, password });
    return data as AuthResponse;
  }, [loginMutation]);

  const logout = useCallback(async () => {
    await logoutMutation.mutateAsync();
  }, [logoutMutation]);

  // MUHIM: Faqat authData o'zgarganda va user hali o'rnatilmagan bo'lsa set qil
  useEffect(() => {
    if (authData?.user && !user) {
      console.log('Setting initial user from authData');
      setUser(authData.user);
      setPartner(authData.partner || null);
      setPermissions((authData as any).permissions || null);
    }
  }, [authData, user]); // user qo'shildi — faqat bir marta ishlasin

  // Xatolik bo'lsa — faqat 401 da tozalash
  useEffect(() => {
    if (error && !isLoading) {
      const errMsg = (error as any)?.message || '';
      if (errMsg.includes('401') || errMsg.includes('Avtorizatsiya')) {
        console.log('Auth failed — clearing user');
        setUser(null);
        setPartner(null);
        setPermissions(null);
      }
    }
  }, [error, isLoading]);

  const contextValue: AuthContextType = useMemo(() => ({
    user,
    partner,
    isLoading: isLoading || loginMutation.isPending,
    login,
    logout,
    refetch,
    permissions,
  }), [user, partner, isLoading, loginMutation.isPending, login, logout, refetch, permissions]);

  return (
    <AuthContext.Provider value={contextValue}>
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
