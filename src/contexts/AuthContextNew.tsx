import React, { createContext, useContext, useEffect, useState, useRef, useMemo } from 'react';
import { useQuery, useMutation, useAction } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { Id } from '../../convex/_generated/dataModel';

export type UserRole = 'customer' | 'merchant' | 'captain' | 'admin' | 'owner';

export interface User {
  _id: Id<"users">;
  email?: string;
  name?: string;
  profile: {
    _id: Id<"profiles">;
    role: UserRole;
    fullName: string;
    phone: string;
    phoneVerified: boolean;
    avatar?: string;
    isActive: boolean;
    isSuspended: boolean;
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
    connectedAt?: number;
    email?: string;
    suspensionReason?: string;
    suspensionDate?: number;
    isOwner?: boolean;
    imageUrl?: string;
    address?: string;
    totalEarnings?: number;
  } | null;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  role: UserRole | null;
  sessionToken: string | null;
  hasRole: (role: UserRole) => boolean;
  hasAnyRole: (roles: UserRole[]) => boolean;
  canAccessMerchant: () => boolean;
  canAccessCaptain: () => boolean;
  canAccessAdmin: () => boolean;
  canAccessCustomer: () => boolean;
  login: (sessionToken: string, userId: string, userRole: UserRole) => void;
  logout: () => void;
  signIn: (email: string, password: string) => Promise<any>;
  signUp: (email: string, password: string) => Promise<any>;
  createProfile: (data: any) => Promise<any>;
  updateProfile: (data: any) => Promise<any>;
  updateCaptainStatus: (isOnline: boolean) => Promise<any>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const [error, setError] = useState<Error | null>(null);

  // Get session token from localStorage on mount
  useEffect(() => {
    try {
      const token = localStorage.getItem("sessionToken");
      if (token) {
        setSessionToken(token);
      } else {
        setIsLoading(false);
      }
    } catch (err) {
      console.error("Error reading session token:", err);
      setIsLoading(false);
    }

    // Force loading to false after 5 seconds to prevent infinite loading
    const timeout = setTimeout(() => {
      setIsLoading(false);
    }, 5000);

    return () => clearTimeout(timeout);
  }, []);

  const userData = useQuery(api.auth.getCurrentUser, { sessionToken: sessionToken || undefined });
  const signInAction = useAction(api.auth.signIn);
  const signUpAction = useAction(api.auth.signUp);
  const signOutMutation = useMutation(api.auth.signOut);
  const createProfileMutation = useMutation(api.profiles.createProfile);
  const updateProfileMutation = useMutation(api.profiles.updateProfile);
  const updateCaptainStatusMutation = useMutation(api.profiles.updateOnlineStatus);

  // Ref to track previous user data and prevent unnecessary state updates
  const previousUserData = useRef<User | null>(null);
  // Ref to track if loading has been set to false
  const hasLoadedData = useRef(false);

  useEffect(() => {
    try {
      // تحديث المستخدم عند تغيير البيانات - FIXED: Only if data actually changed
      if (userData !== undefined) {
        // Shallow comparison to prevent unnecessary re-renders
        const hasChanged = !previousUserData.current ||
          !userData ||
          previousUserData.current._id !== userData._id ||
          previousUserData.current.email !== userData.email ||
          previousUserData.current.profile?.role !== userData.profile?.role;

        if (hasChanged) {
          setUser(userData);
          previousUserData.current = userData;
        }
        // Only set loading to false once when data is loaded
        if (!hasLoadedData.current) {
          setIsLoading(false);
          hasLoadedData.current = true;
        }
      }
    } catch (err) {
      console.error("Error updating user data:", err);
      setError(err as Error);
      setIsLoading(false);
    }
  }, [userData]);

  const login = (newSessionToken: string, userId: string, userRole: UserRole) => {
    setSessionToken(newSessionToken);
    localStorage.setItem("sessionToken", newSessionToken);
  };

  const logout = async () => {
    if (sessionToken) {
      await signOutMutation({ sessionToken });
    }
    setSessionToken(null);
    setUser(null);
    localStorage.removeItem("sessionToken");
  };

  const signIn = async (email: string, password: string) => {
    const result = await signInAction({ email, password });
    if (result.success) {
      setSessionToken(result.sessionToken);
      localStorage.setItem("sessionToken", result.sessionToken);
    }
    return result;
  };

  const signUp = async (email: string, password: string) => {
    const result = await signUpAction({ email, password });
    if (result.success) {
      setSessionToken(result.sessionToken);
      localStorage.setItem("sessionToken", result.sessionToken);
    }
    return result;
  };

  const createProfile = async (data: any) => {
    return await createProfileMutation(data);
  };

  const updateProfile = async (data: any) => {
    return await updateProfileMutation(data);
  };

  const updateCaptainStatus = async (isOnline: boolean) => {
    return await updateCaptainStatusMutation({ isOnline });
  };

  const isAuthenticated = !!user;
  const role = user?.profile?.role || null;

  // Debug logging
  console.log("AuthContextNew state:", {
    isAuthenticated,
    sessionToken,
    user: user ? { _id: user._id, email: user.email, role: user?.profile?.role } : null,
    isLoading
  });

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

  // Memoize context value to prevent unnecessary re-renders
  const value: AuthContextType = useMemo(() => ({
    user,
    isLoading,
    isAuthenticated,
    role,
    sessionToken,
    hasRole,
    hasAnyRole,
    canAccessMerchant,
    canAccessCaptain,
    canAccessAdmin,
    canAccessCustomer,
    login,
    logout,
    signIn,
    signUp,
    createProfile,
    updateProfile,
    updateCaptainStatus,
  }), [user, isLoading, isAuthenticated, role, sessionToken, signInAction, signUpAction, signOutMutation, createProfileMutation, updateProfileMutation, updateCaptainStatusMutation]);

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
