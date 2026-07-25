import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react';
import { useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { Id } from '../../convex/_generated/dataModel';

export type UserRole = 'customer' | 'merchant' | 'captain' | 'admin';

export interface User {
  _id: Id<"users">;
  email?: string;
  name?: string;
  profile: {
    role: UserRole;
    fullName: string;
    phone: string;
    phoneVerified: boolean;
    avatarUrl?: string;
    isActive: boolean;
    isOnline: boolean;
    lastSeen: number;
    registrationDate: number;
    location?: {
      latitude: number;
      longitude: number;
      address: string;
      addressAr: string;
    };
    vehicleType?: string;
    vehicleNumber?: string;
    businessName?: string;
    businessNameAr?: string;
  } | null;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  role: UserRole | null;
  hasRole: (role: UserRole) => boolean;
  hasAnyRole: (roles: UserRole[]) => boolean;
  canAccessMerchant: () => boolean;
  canAccessCaptain: () => boolean;
  canAccessAdmin: () => boolean;
  canAccessCustomer: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const getCurrentUser = useMutation(api.auth.getCurrentUser);

  // Check session on mount and when component mounts
  useEffect(() => {
    const checkSession = async () => {
      try {
        const sessionToken = localStorage.getItem('sessionToken');
        if (sessionToken) {
          const userData = await getCurrentUser({ sessionToken });
          if (userData && userData.profile) {
            setUser({
              _id: userData.user._id,
              email: userData.user.email,
              profile: {
                role: userData.profile.role as UserRole,
                fullName: userData.profile.fullName,
                phone: userData.profile.phone,
                phoneVerified: userData.profile.phoneVerified,
                avatarUrl: userData.profile.imageUrl,
                isActive: userData.profile.isActive,
                isOnline: userData.profile.isOnline,
                lastSeen: userData.profile.lastSeen,
                registrationDate: userData.profile.registrationDate,
              },
            });
          } else {
            // Session expired or invalid
            localStorage.removeItem('sessionToken');
            setUser(null);
          }
        }
      } catch (error) {
        console.error('Error checking session:', error);
        localStorage.removeItem('sessionToken');
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();
  }, [getCurrentUser]);

  const isAuthenticated = !!user;
  const role = user?.profile?.role || null;

  const hasRole = (requiredRole: UserRole): boolean => {
    return role === requiredRole;
  };

  const hasAnyRole = (roles: UserRole[]): boolean => {
    return roles.includes(role as UserRole);
  };

  const canAccessMerchant = (): boolean => {
    return hasRole('merchant') || hasRole('admin');
  };

  const canAccessCaptain = (): boolean => {
    return hasRole('captain') || hasRole('admin');
  };

  const canAccessAdmin = (): boolean => {
    return hasRole('admin');
  };

  const canAccessCustomer = (): boolean => {
    return hasRole('customer') || hasRole('admin');
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    role,
    hasRole,
    hasAnyRole,
    canAccessMerchant,
    canAccessCaptain,
    canAccessAdmin,
    canAccessCustomer,
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

// Hook للتحقق من الصلاحيات
export function useRequireAuth(requiredRole?: UserRole) {
  const { isAuthenticated, role, isLoading } = useAuth();

  if (isLoading) {
    return { isLoading: true, hasAccess: false };
  }

  if (!isAuthenticated) {
    return { isLoading: false, hasAccess: false, reason: 'not_authenticated' };
  }

  if (requiredRole && role !== requiredRole) {
    return { isLoading: false, hasAccess: false, reason: 'insufficient_permissions' };
  }

  return { isLoading: false, hasAccess: true };
}