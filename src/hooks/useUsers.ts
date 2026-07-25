import { useState, useCallback } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "react-hot-toast";
import { Id } from "../../convex/_generated/dataModel";
import { User } from "../types/admin";
import { useAuth } from "../contexts/AuthContextNew";

export function useUsers() {
  const { sessionToken, isAuthenticated } = useAuth();
  const users = useQuery(api.admin.getAllUsers, isAuthenticated && sessionToken ? { sessionToken } : "skip");
  const suspendUser = useMutation(api.admin.suspendUser);
  const deleteUser = useMutation(api.admin.deleteUser);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string | null>(null);

  const filteredUsers = (users || [])
    .filter((u) => filterRole === null || u.role === filterRole)
    .filter((u) => filterStatus === null || 
      (filterStatus === "active" && !u.isSuspended) || 
      (filterStatus === "suspended" && u.isSuspended))
    .filter((u) => 
      !searchTerm || 
      u.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.phone?.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const handleSuspendUser = useCallback(async (userId: string, currentStatus: boolean) => {
    try {
      await suspendUser({
        sessionToken,
        userId: userId as Id<"users">,
        isSuspended: !currentStatus,
      });
      toast.success(!currentStatus ? "تم إيقاف المستخدم" : "تم تفعيل المستخدم");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "فشل تحديث حالة المستخدم");
    }
  }, [suspendUser, sessionToken]);

  const handleDeleteUser = useCallback(async (userId: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا المستخدم؟ هذا الإجراء لا يمكن التراجع عنه.")) {
      return;
    }
    try {
      await deleteUser({ sessionToken, userId: userId as Id<"users"> });
      toast.success("تم حذف المستخدم");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "فشل حذف المستخدم");
    }
  }, [deleteUser, sessionToken]);

  return {
    users,
    filteredUsers,
    searchTerm,
    filterRole,
    filterStatus,
    setSearchTerm,
    setFilterRole,
    setFilterStatus,
    handleSuspendUser,
    handleDeleteUser,
  };
}
