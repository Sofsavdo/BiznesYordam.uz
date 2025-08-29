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

  const { data: authData, isLoading, refetch } = useQuery<AuthResponse | null>({
    queryKey: ['/api/auth/me'],
    queryFn: async () => {
      try {
        const response = await apiRequest('GET', '/api/auth/me');
        return await response.json() as AuthResponse;
      } catch (error: any) {
        // 401 errors are expected when user is not authenticated
        if (error.message?.includes('401')) {
          return null;
        }
        throw error;
      }
    },
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const loginMutation = useMutation({
    mutationFn: async ({ username, password }: { username: string; password: string }) => {
      const response = await apiRequest('POST', '/api/auth/login', { username, password });
      return response.json() as Promise<AuthResponse>;
    },
    onSuccess: (data) => {
      setUser(data.user);
      setPartner(data.partner || null);
      setPermissions((data as any).permissions || null);
      queryClient.invalidateQueries({ queryKey: ['/api/auth/me'] });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await apiRequest('POST', '/api/auth/logout');
    },
    onSuccess: () => {
      setUser(null);
      setPartner(null);
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

  useEffect(() => {
    if (authData?.user) {
      setUser(authData.user);
      setPartner(authData.partner || null);
      setPermissions((authData as any).permissions || null);
    } else {
      setUser(null);
      setPartner(null);
      setPermissions(null);
    }
  }, [authData]);

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