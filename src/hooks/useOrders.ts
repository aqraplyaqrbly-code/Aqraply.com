import { useState, useMemo, useCallback } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "react-hot-toast";
import { Id } from "../../convex/_generated/dataModel";
import { Order } from "../types/admin";
import { useAuth } from "../contexts/AuthContextNew";

export function useOrders() {
  const { sessionToken, isAuthenticated } = useAuth();
  const orders = useQuery(api.orders.getAllOrders, isAuthenticated && sessionToken ? { sessionToken } : "skip");
  const captains = useQuery(api.captains.getAllCaptains, isAuthenticated && sessionToken ? { sessionToken } : "skip");
  const assignCaptain = useMutation(api.admin.assignCaptainToOrder);
  const cancelOrder = useMutation(api.admin.cancelOrder);

  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [assigningCaptain, setAssigningCaptain] = useState<string | null>(null);
  const [selectedOrderForInvoice, setSelectedOrderForInvoice] = useState<Order | null>(null);

  const filteredOrders = useMemo(
    () =>
      (orders || [])
        .filter((o) => !selectedStatus || o.status === selectedStatus)
        .filter(
          (o) =>
            !searchTerm ||
            o.orderNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            o.customerInfo?.fullName?.toLowerCase().includes(searchTerm.toLowerCase())
        ),
    [orders, selectedStatus, searchTerm]
  );

  const captainOptions = useMemo(
    () => captains?.filter((c) => c.isActive && c.isOnline) ?? [],
    [captains]
  );

  const handleSearchTermChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  }, []);

  const handleSelectStatus = useCallback((key: string | null) => {
    setSelectedStatus(key);
  }, []);

  const handleStartAssign = useCallback((orderId: string) => {
    setAssigningCaptain(orderId);
  }, []);

  const handleSelectInvoice = useCallback((order: Order) => {
    setSelectedOrderForInvoice(order);
  }, []);

  const handleAssignCaptain = useCallback(async (orderId: string, captainId: string) => {
    try {
      await assignCaptain({
        sessionToken,
        orderId: orderId as Id<"orders">,
        captainId: captainId as Id<"users">,
      });
      toast.success("تم تعيين الكابتن بنجاح");
      setAssigningCaptain(null);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "فشل تعيين الكابتن");
    }
  }, [assignCaptain, sessionToken]);

  const handleCancelOrder = useCallback(async (orderId: string) => {
    try {
      await cancelOrder({ sessionToken, orderId: orderId as Id<"orders"> });
      toast.success("تم إلغاء الطلب");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "فشل إلغاء الطلب");
    }
  }, [cancelOrder, sessionToken]);

  return {
    orders,
    filteredOrders,
    captains,
    captainOptions,
    selectedStatus,
    searchTerm,
    assigningCaptain,
    selectedOrderForInvoice,
    handleSearchTermChange,
    handleSelectStatus,
    handleStartAssign,
    handleSelectInvoice,
    handleAssignCaptain,
    handleCancelOrder,
    setSelectedOrderForInvoice,
  };
}
