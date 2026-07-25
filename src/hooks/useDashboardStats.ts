import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { PlatformStats } from "../types/admin";
import { useAuth } from "../contexts/AuthContextNew";

export function useDashboardStats(): PlatformStats | null {
  const { sessionToken, isAuthenticated } = useAuth();
  return useQuery(api.admin.getPlatformStats, isAuthenticated && sessionToken ? { sessionToken } : "skip");
}
