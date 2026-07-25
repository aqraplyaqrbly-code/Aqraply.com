import React from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContextNew";

interface ProtectedAdminRouteProps {
  children: React.ReactNode;
  requiredPermission?: string;
}

export default function ProtectedAdminRoute({ children, requiredPermission }: ProtectedAdminRouteProps) {
  const navigate = useNavigate();
  const { isAuthenticated, sessionToken } = useAuth();
  
  // Skip query if not authenticated
  const myPermissions = useQuery(
    api.adminPermissions.getMyPermissions,
    isAuthenticated && sessionToken ? { sessionToken } : "skip"
  );

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    navigate("/admin-login");
    return null;
  }

  // If permissions not loaded yet, show loading
  if (myPermissions === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  // If no permission required, allow access
  if (!requiredPermission) {
    return <>{children}</>;
  }

  // Owner has all permissions
  if (myPermissions.isOwner) {
    return <>{children}</>;
  }

  // Check if user has the required permission
  const hasPermission = myPermissions[requiredPermission as keyof typeof myPermissions] === true;

  if (!hasPermission) {
    // Redirect to admin dashboard
    navigate("/admin");
    return null;
  }

  return <>{children}</>;
}
