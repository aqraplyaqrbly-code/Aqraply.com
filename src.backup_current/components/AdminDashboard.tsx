import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import ProductsManagement from "./AdminProductsManagement";
import NotificationsManagement from "./AdminNotificationsManagement";
import ActivityLog from "./AdminActivityLog";
import SystemSettings from "./AdminSystemSettings";
import AdminSuperStoreManagement from "./AdminSuperStoreManagement";
import AdminDataExport from "./AdminDataExport";
import {
  Users,
  UserCheck,
  XCircle,
  Search,
  Phone,
  Package,
  Store,
  Truck,
  BarChart3,
  LayoutDashboard,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Star,
  MapPin,
  Clock,
  CheckCircle,
  AlertCircle,
  Ban,
  Edit,
  Trash2,
  Eye,
  Filter,
  Download,
  Calendar,
  ArrowUp,
  ArrowDown,
  ArrowUpRight,
  ArrowDownRight,
  MoreVertical,
  ShoppingBag,
  Tag,
  Bell,
  Activity,
  Settings,
  Power,
  Database,
  LogOut,
} from "lucide-react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { Id } from "../../convex/_generated/dataModel";

import { NavigationBar } from "./NavigationBar";
import AdminAuth from "./AdminAuth";

export default function AdminDashboard() {
  const loggedInUser = useQuery(api.auth.loggedInUser);
  const currentProfile = useQuery(api.profiles.getCurrentProfile);

  // إذا لم يكن المستخدم مسجل دخول أو لا يوجد ملف شخصي
  if (!loggedInUser || !currentProfile) {
    return <AdminAuth />;
  }

  // التحقق من أن المستخدم مدير
  if (currentProfile.role !== "admin") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 flex items-center justify-center p-4" dir="rtl">
        <div className="max-w-md w-full text-center">
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-red-200">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">⚠️</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">غير مصرح</h2>
            <p className="text-gray-600 mb-6">
              هذه الصفحة مخصصة للمديرين فقط. حسابك مسجل كـ {currentProfile.role === "customer" ? "عميل" : currentProfile.role === "merchant" ? "تاجر" : "كابتن"}.
            </p>
            <button
              onClick={() => window.location.href = "/"}
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all"
            >
              العودة للصفحة الرئيسية
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <NavigationBar />
      <div className="min-h-screen bg-gray-50" dir="rtl">
        <Routes>
          <Route path="/" element={<AdminLayout><DashboardHome /></AdminLayout>} />
          <Route path="/users" element={<AdminLayout><UsersManagement /></AdminLayout>} />
          <Route path="/orders" element={<AdminLayout><OrdersManagement /></AdminLayout>} />
          <Route path="/stores" element={<AdminLayout><StoresManagement /></AdminLayout>} />
          <Route path="/products" element={<AdminLayout><ProductsManagement /></AdminLayout>} />
          <Route path="/captains" element={<AdminLayout><CaptainsManagement /></AdminLayout>} />
          <Route path="/notifications" element={<AdminLayout><NotificationsManagement /></AdminLayout>} />
          <Route path="/activity" element={<AdminLayout><ActivityLog /></AdminLayout>} />
          <Route path="/analytics" element={<AdminLayout><AnalyticsPage /></AdminLayout>} />
          <Route path="/settings" element={<AdminLayout><SystemSettings /></AdminLayout>} />
          <Route path="/super-stores" element={<AdminLayout><AdminSuperStoreManagement /></AdminLayout>} />
          <Route path="/export" element={<AdminLayout><AdminDataExport /></AdminLayout>} />
        </Routes>
      </div>
    </>
  );
}

// ─── Layout Wrapper ───────────────────────────────────────────────────────────
function AdminLayout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const signOutMutation = useMutation(api.auth.signOut);

  const navItems = [
    { path: "/admin", label: "الرئيسية", icon: LayoutDashboard },
    { path: "/admin/users", label: "إدارة المستخدمين", icon: Users },
    { path: "/admin/orders", label: "الطلبات", icon: Package },
    { path: "/admin/stores", label: "المتاجر", icon: Store },
    { path: "/admin/products", label: "المنتجات", icon: ShoppingBag },
    { path: "/admin/captains", label: "الكباتن", icon: Truck },
    { path: "/admin/notifications", label: "الإشعارات", icon: Bell },
    { path: "/admin/activity", label: "سجل النشاط", icon: Activity },
    { path: "/admin/analytics", label: "التقارير", icon: BarChart3 },
    { path: "/admin/settings", label: "الإعدادات", icon: Settings },
    { path: "/admin/super-stores", label: "الإدارة الشاملة", icon: Store },
    { path: "/admin/export", label: "تصدير البيانات", icon: Database },
  ];

  const isActive = (path: string) => {
    if (path === "/admin") return location.pathname === "/admin";
    return location.pathname.startsWith(path);
  };

  const handleSignOut = async () => {
    try {
      const sessionToken = localStorage.getItem("sessionToken");
      if (sessionToken) {
        await signOutMutation({ sessionToken });
      }
      localStorage.removeItem("sessionToken");
      window.location.href = "/";
    } catch (error) {
      console.error("Sign out error:", error);
      localStorage.removeItem("sessionToken");
      window.location.href = "/";
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 flex-row-reverse">
      {/* Sidebar */}
      <aside className="w-64 bg-gradient-to-b from-purple-900 to-purple-800 text-white flex flex-col h-full">
        {/* Logo */}
        <div className="p-6 border-b border-purple-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <LayoutDashboard className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold">لوحة الإدارة</h1>
              <p className="text-xs text-purple-300">Aqraply Admin</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                isActive(item.path)
                  ? "bg-white/20 text-white shadow-lg"
                  : "text-purple-200 hover:bg-white/10 hover:text-white"
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </button>
          ))}
        </nav>

        {/* Sign Out */}
        <div className="p-4 border-t border-purple-700">
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-purple-200 hover:bg-white/10 hover:text-white transition-all"
          >
            <LogOut className="w-5 h-5" />
            تسجيل الخروج
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-h-screen overflow-y-auto">
        <div className="p-4 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}

// ─── Dashboard Home ───────────────────────────────────────────────────────────
function DashboardHome() {
  const stats = useQuery(api.admin.getPlatformStats);
  const orders = useQuery(api.orders.getAllOrders);

  const recentOrders = orders?.slice(0, 8) || [];

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">مرحباً بك 👋</h1>
        <p className="text-gray-500 mt-1">إليك نظرة عامة على أداء المنصة اليوم</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={<Package className="w-6 h-6" />}
          title="إجمالي الطلبات"
          value={stats?.totalOrders ?? "—"}
          sub={`${stats?.pendingOrders ?? 0} قيد الانتظار`}
          color="purple"
          trend="up"
        />
        <StatCard
          icon={<span className="text-sm font-bold text-green-700 bg-green-100 px-2 py-1 rounded">EGP</span>}
          title="إجمالي الإيرادات"
          value={stats ? `${stats.totalRevenue.toLocaleString()} EGP` : "—"}
          sub={`عمولة: ${stats?.totalCommission?.toLocaleString() ?? 0} EGP`}
          color="green"
          trend="up"
        />
        <StatCard
          icon={<Store className="w-6 h-6" />}
          title="المتاجر"
          value={stats?.totalStores ?? "—"}
          sub={`${stats?.activeStores ?? 0} نشط`}
          color="blue"
          trend="up"
        />
        <StatCard
          icon={<Truck className="w-6 h-6" />}
          title="الكباتن"
          value={stats?.totalCaptains ?? "—"}
          sub={`${stats?.onlineCaptains ?? 0} متصل الآن`}
          color="orange"
          trend="up"
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-gray-500">العملاء المسجلون</span>
            <Users className="w-5 h-5 text-gray-400" />
          </div>
          <p className="text-3xl font-bold text-gray-900">{stats?.totalCustomers ?? "—"}</p>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-gray-500">طلبات آخر 7 أيام</span>
            <TrendingUp className="w-5 h-5 text-gray-400" />
          </div>
          <p className="text-3xl font-bold text-gray-900">{stats?.recentOrders ?? "—"}</p>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-gray-500">إيرادات آخر 7 أيام</span>
            <span className="text-lg font-bold text-gray-500">EGP</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {stats ? `${stats.recentRevenue.toLocaleString()} EGP` : "—"}
          </p>
        </div>
      </div>

      {/* Order Status Distribution */}
      {stats?.statusCounts && (
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm mb-8">
          <h3 className="text-lg font-bold text-gray-900 mb-6">توزيع الطلبات حسب الحالة</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { key: "pending", label: "قيد الانتظار", color: "bg-yellow-100 text-yellow-700" },
              { key: "confirmed", label: "مؤكد", color: "bg-blue-100 text-blue-700" },
              { key: "preparing", label: "قيد التحضير", color: "bg-purple-100 text-purple-700" },
              { key: "delivering", label: "قيد التوصيل", color: "bg-orange-100 text-orange-700" },
              { key: "delivered", label: "تم التوصيل", color: "bg-green-100 text-green-700" },
              { key: "cancelled", label: "ملغي", color: "bg-red-100 text-red-700" },
              { key: "assigned", label: "تم التعيين", color: "bg-indigo-100 text-indigo-700" },
              { key: "ready", label: "جاهز", color: "bg-teal-100 text-teal-700" },
            ].map(({ key, label, color }) => (
              <div key={key} className={`rounded-xl p-4 ${color}`}>
                <p className="text-2xl font-bold">{stats.statusCounts[key] || 0}</p>
                <p className="text-sm font-medium mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Orders */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-900">آخر الطلبات</h3>
          <button
            onClick={() => window.location.href = "/admin/orders"}
            className="text-sm text-purple-600 hover:text-purple-700 font-medium"
          >
            عرض الكل
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-start text-xs font-semibold text-gray-600">رقم الطلب</th>
                <th className="px-6 py-3 text-start text-xs font-semibold text-gray-600">العميل</th>
                <th className="px-6 py-3 text-start text-xs font-semibold text-gray-600">بيانات المتجر</th>
                <th className="px-6 py-3 text-start text-xs font-semibold text-gray-600">المبلغ</th>
                <th className="px-6 py-3 text-start text-xs font-semibold text-gray-600">الحالة</th>
                <th className="px-6 py-3 text-start text-xs font-semibold text-gray-600">التاريخ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recentOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-400">
                    لا توجد طلبات بعد
                  </td>
                </tr>
              ) : (
                recentOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-mono font-medium text-gray-900">
                      {order.orderNumber}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {order.customerInfo?.fullName || "—"}
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="text-sm font-medium text-gray-900">
                          {order.storeInfo?.name || "—"}
                        </div>
                        {order.storeInfo?.address && (
                          <div className="text-xs text-gray-500 flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {order.storeInfo?.address}
                          </div>
                        )}
                        {order.storeInfo?.phone && (
                          <div className="text-xs text-gray-500 flex items-center gap-1">
                            <Phone className="w-3 h-3" />
                            {order.storeInfo?.phone}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-gray-900">
                      {order.total} EGP
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(order._creationTime).toLocaleDateString("ar-EG")}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── Orders Management ────────────────────────────────────────────────────────
function OrdersManagement() {
  const orders = useQuery(api.orders.getAllOrders);
  const captains = useQuery(api.captains.getAllCaptains);
  const assignCaptain = useMutation(api.admin.assignCaptainToOrder);
  const cancelOrder = useMutation(api.admin.cancelOrder);

  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [assigningCaptain, setAssigningCaptain] = useState<string | null>(null);

  const filteredOrders = (orders || [])
    .filter((o) => !selectedStatus || o.status === selectedStatus)
    .filter(
      (o) =>
        !searchTerm ||
        o.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.customerInfo?.fullName?.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const handleAssignCaptain = async (orderId: string, captainId: string) => {
    try {
      await assignCaptain({
        orderId: orderId as Id<"orders">,
        captainId: captainId as Id<"users">,
      });
      toast.success("تم تعيين الكابتن بنجاح");
      setAssigningCaptain(null);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "فشل تعيين الكابتن");
    }
  };

  const handleCancelOrder = async (orderId: string) => {
    try {
      await cancelOrder({ orderId: orderId as Id<"orders"> });
      toast.success("تم إلغاء الطلب");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "فشل إلغاء الطلب");
    }
  };

  const statuses = [
    { key: null, label: "الكل" },
    { key: "pending", label: "قيد الانتظار" },
    { key: "confirmed", label: "مؤكد" },
    { key: "assigned", label: "تم التعيين" },
    { key: "preparing", label: "قيد التحضير" },
    { key: "ready", label: "جاهز" },
    { key: "delivering", label: "قيد التوصيل" },
    { key: "delivered", label: "تم التوصيل" },
    { key: "cancelled", label: "ملغي" },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">إدارة الطلبات</h1>
        <p className="text-gray-500 mt-1">
          {orders ? `${orders.length} طلب إجمالاً` : "جاري التحميل..."}
        </p>
      </div>

      {/* Search & Filters */}
      <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute top-1/2 -translate-y-1/2 right-3 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="ابحث برقم الطلب أو اسم العميل..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pr-10 pl-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-purple-400"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto">
            {statuses.map(({ key, label }) => (
              <button
                key={String(key)}
                onClick={() => setSelectedStatus(key)}
                className={`px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedStatus === key
                    ? "bg-purple-600 text-white shadow-md"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-b from-gray-50 to-gray-100 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-start text-xs font-semibold text-gray-600 uppercase">رقم الطلب</th>
                <th className="px-6 py-4 text-start text-xs font-semibold text-gray-600 uppercase">العميل</th>
                <th className="px-6 py-4 text-start text-xs font-semibold text-gray-600 uppercase">بيانات المتجر</th>
                <th className="px-6 py-4 text-start text-xs font-semibold text-gray-600 uppercase">المنتجات</th>
                <th className="px-6 py-4 text-start text-xs font-semibold text-gray-600 uppercase">المبلغ</th>
                <th className="px-6 py-4 text-start text-xs font-semibold text-gray-600 uppercase">الحالة</th>
                <th className="px-6 py-4 text-start text-xs font-semibold text-gray-600 uppercase">الكابتن</th>
                <th className="px-6 py-4 text-start text-xs font-semibold text-gray-600 uppercase">التاريخ</th>
                <th className="px-6 py-4 text-start text-xs font-semibold text-gray-600 uppercase">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {!orders ? (
                <tr>
                  <td colSpan={9} className="px-6 py-12 text-center">
                    <RefreshCw className="w-6 h-6 text-gray-400 animate-spin mx-auto mb-2" />
                    <p className="text-gray-400">جاري التحميل...</p>
                  </td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-6 py-12 text-center">
                    <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-400 font-medium">لا توجد طلبات</p>
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-mono font-bold text-purple-700">
                      {order.orderNumber}
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          {order.customerInfo?.fullName || "—"}
                        </p>
                        <p className="text-xs text-gray-500">{order.customerInfo?.phone || ""}</p>
                        <p className="text-xs text-gray-600 mt-1 flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {order.deliveryLocation.addressAr || "—"}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="text-sm font-medium text-gray-900">
                          {order.storeInfo?.name || "—"}
                        </div>
                        {order.storeInfo?.address && (
                          <div className="text-xs text-gray-500 flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {order.storeInfo?.address}
                          </div>
                        )}
                        {order.storeInfo?.phone && (
                          <div className="text-xs text-gray-500 flex items-center gap-1">
                            <Phone className="w-3 h-3" />
                            {order.storeInfo?.phone}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      <div className="space-y-1">
                        <p className="font-semibold text-gray-900">{order.items.length} منتج</p>
                        {order.items.map((item, idx) => (
                          <div key={idx} className="text-xs text-gray-600 border-t pt-1 mt-1">
                            <p>• {item.nameAr} × {item.quantity}</p>
                            {(item.color || item.selectedSize) && (
                              <div className="flex gap-1 mt-1">
                                {item.color && (
                                  <span className="inline-block bg-purple-100 text-purple-700 px-2 py-0.5 rounded text-2xs">
                                    اللون: {item.color}
                                  </span>
                                )}
                                {item.selectedSize && (
                                  <span className="inline-block bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-2xs">
                                    المقاس: {item.selectedSize}
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-gray-900">
                      {order.total} EGP
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="px-6 py-4">
                      {order.captainId ? (
                        <span className="text-xs text-green-600 font-medium flex items-center gap-1">
                          <UserCheck className="w-3 h-3" /> معين
                        </span>
                      ) : order.status === "pending" || order.status === "confirmed" ? (
                        <div className="relative">
                          {assigningCaptain === order._id ? (
                            <select
                              className="text-xs border border-purple-300 rounded-lg px-2 py-1 focus:outline-none focus:border-purple-500"
                              onChange={(e) => {
                                if (e.target.value) handleAssignCaptain(order._id, e.target.value);
                              }}
                              defaultValue=""
                            >
                              <option value="">اختر كابتن</option>
                              {captains
                                ?.filter((c) => c.isActive && c.isOnline)
                                .map((c) => (
                                  <option key={c._id} value={c.userId}>
                                    {c.fullName}
                                  </option>
                                ))}
                            </select>
                          ) : (
                            <button
                              onClick={() => setAssigningCaptain(order._id)}
                              className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-lg hover:bg-purple-200 transition-colors"
                            >
                              تعيين كابتن
                            </button>
                          )}
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-500">
                      {new Date(order._creationTime).toLocaleDateString("ar-EG")}
                    </td>
                    <td className="px-6 py-4">
                      {order.status !== "cancelled" && order.status !== "delivered" && (
                        <button
                          onClick={() => handleCancelOrder(order._id)}
                          className="text-xs text-red-600 hover:text-red-700 font-medium"
                        >
                          إلغاء
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── Stores Management ────────────────────────────────────────────────────────
function StoresManagement() {
  const stores = useQuery(api.admin.getAllStores);
  const toggleStore = useMutation(api.admin.toggleStoreActive);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterActive, setFilterActive] = useState<boolean | null>(null);

  const filteredStores = (stores || [])
    .filter((s) => filterActive === null || s.isActive === filterActive)
    .filter(
      (s) =>
        !searchTerm ||
        s.nameAr.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const handleToggle = async (storeId: string, currentActive: boolean) => {
    try {
      await toggleStore({
        storeId: storeId as Id<"stores">,
        isActive: !currentActive,
      });
      toast.success(!currentActive ? "تم تفعيل المتجر" : "تم تعطيل المتجر");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "فشل تحديث حالة المتجر");
    }
  };

  const categoryLabels: Record<string, string> = {
    restaurant: "مطعم",
    grocery: "بقالة",
    pharmacy: "صيدلية",
    electronics: "إلكترونيات",
    clothing: "ملابس",
    other: "أخرى",
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">إدارة المتاجر</h1>
        <p className="text-gray-500 mt-1">
          {stores ? `${stores.length} متجر إجمالاً` : "جاري التحميل..."}
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <Store className="w-5 h-5 text-blue-600" />
            </div>
            <span className="text-sm text-gray-500">إجمالي المتاجر</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">{stores?.length ?? "—"}</p>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <span className="text-sm text-gray-500">متاجر نشطة</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {stores?.filter((s) => s.isActive).length ?? "—"}
          </p>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
              <XCircle className="w-5 h-5 text-red-600" />
            </div>
            <span className="text-sm text-gray-500">متاجر معطلة</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {stores?.filter((s) => !s.isActive).length ?? "—"}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm mb-6 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute top-1/2 -translate-y-1/2 right-3 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="ابحث باسم المتجر..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pr-10 pl-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-purple-400"
          />
        </div>
        <div className="flex gap-2">
          {[
            { val: null, label: "الكل" },
            { val: true, label: "نشط" },
            { val: false, label: "معطل" },
          ].map(({ val, label }) => (
            <button
              key={String(val)}
              onClick={() => setFilterActive(val)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                filterActive === val
                  ? "bg-purple-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Stores Grid */}
      {!stores ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white rounded-2xl p-6 border border-gray-100 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-3" />
              <div className="h-3 bg-gray-200 rounded w-1/2 mb-6" />
              <div className="h-8 bg-gray-200 rounded" />
            </div>
          ))}
        </div>
      ) : filteredStores.length === 0 ? (
        <div className="bg-white rounded-2xl p-16 text-center border border-gray-100">
          <Store className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-400 font-medium text-lg">لا توجد متاجر</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStores.map((store) => (
            <div
              key={store._id}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all overflow-hidden"
            >
              {/* Store Image */}
              <div className="h-32 bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center relative">
                {store.imageUrl ? (
                  <img
                    src={store.imageUrl}
                    alt={store.nameAr}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Store className="w-12 h-12 text-purple-300" />
                )}
                <div className="absolute top-3 left-3">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-bold ${
                      store.isActive
                        ? "bg-green-500 text-white"
                        : "bg-red-500 text-white"
                    }`}
                  >
                    {store.isActive ? "نشط" : "معطل"}
                  </span>
                </div>
              </div>

              <div className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">{store.nameAr}</h3>
                    <p className="text-sm text-gray-500">{store.name}</p>
                  </div>
                  <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-lg font-medium">
                    {categoryLabels[store.category] || store.category}
                  </span>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span className="truncate">{store.location.addressAr}</span>
                  </div>
                  {store.phone && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span dir="ltr">{store.phone}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Star className="w-4 h-4 text-yellow-400" />
                    <span>{store.rating.toFixed(1)} • {store.totalOrders} طلب</span>
                  </div>
                  {store.ownerProfile && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Users className="w-4 h-4 text-gray-400" />
                      <span>{store.ownerProfile.fullName}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <div className="text-sm">
                    <span className="text-gray-500">العمولة: </span>
                    <span className="font-bold text-gray-900">{store.commissionRate}%</span>
                  </div>
                  <button
                    onClick={() => handleToggle(store._id, store.isActive)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                      store.isActive
                        ? "bg-red-100 text-red-700 hover:bg-red-200"
                        : "bg-green-100 text-green-700 hover:bg-green-200"
                    }`}
                  >
                    <Power className="w-4 h-4" />
                    {store.isActive ? "تعطيل" : "تفعيل"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Captains Management ──────────────────────────────────────────────────────
function CaptainsManagement() {
  const captains = useQuery(api.captains.getAllCaptains);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterOnline, setFilterOnline] = useState<boolean | null>(null);

  const filteredCaptains = (captains || [])
    .filter((c) => filterOnline === null || c.isOnline === filterOnline)
    .filter(
      (c) =>
        !searchTerm ||
        c.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.phone?.toLowerCase().includes(searchTerm.toLowerCase())
    );

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">إدارة الكباتن</h1>
        <p className="text-gray-500 mt-1">
          {captains ? `${captains.length} كابتن مسجل` : "جاري التحميل..."}
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
              <Truck className="w-5 h-5 text-purple-600" />
            </div>
            <span className="text-sm text-gray-500">إجمالي الكباتن</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">{captains?.length ?? "—"}</p>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
              <div className="w-3 h-3 bg-green-500 rounded-full" />
            </div>
            <span className="text-sm text-gray-500">متصلون الآن</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {captains?.filter((c) => c.isOnline).length ?? "—"}
          </p>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <UserCheck className="w-5 h-5 text-blue-600" />
            </div>
            <span className="text-sm text-gray-500">كباتن نشطون</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {captains?.filter((c) => c.isActive).length ?? "—"}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm mb-6 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute top-1/2 -translate-y-1/2 right-3 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="ابحث باسم الكابتن أو رقم الهاتف..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pr-10 pl-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-purple-400"
          />
        </div>
        <div className="flex gap-2">
          {[
            { val: null, label: "الكل" },
            { val: true, label: "متصل" },
            { val: false, label: "غير متصل" },
          ].map(({ val, label }) => (
            <button
              key={String(val)}
              onClick={() => setFilterOnline(val)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                filterOnline === val
                  ? "bg-purple-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Captains Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-b from-gray-50 to-gray-100 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-start text-xs font-semibold text-gray-600 uppercase">الكابتن</th>
                <th className="px-6 py-4 text-start text-xs font-semibold text-gray-600 uppercase">رقم الهاتف</th>
                <th className="px-6 py-4 text-start text-xs font-semibold text-gray-600 uppercase">الحالة</th>
                <th className="px-6 py-4 text-start text-xs font-semibold text-gray-600 uppercase">آخر ظهور</th>
                <th className="px-6 py-4 text-start text-xs font-semibold text-gray-600 uppercase">تاريخ التسجيل</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {!captains ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <RefreshCw className="w-6 h-6 text-gray-400 animate-spin mx-auto mb-2" />
                    <p className="text-gray-400">جاري التحميل...</p>
                  </td>
                </tr>
              ) : filteredCaptains.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <Truck className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-400 font-medium">لا يوجد كباتن</p>
                  </td>
                </tr>
              ) : (
                filteredCaptains.map((captain) => (
                  <tr key={captain._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                          {captain.fullName?.charAt(0) || "K"}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{captain.fullName}</p>
                          <p className="text-xs text-gray-500">كابتن توصيل</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <Phone className="w-4 h-4 text-gray-400" />
                        {captain.phone || "—"}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span
                          className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                            captain.isOnline
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          <span
                            className={`w-2 h-2 rounded-full ${
                              captain.isOnline ? "bg-green-500" : "bg-gray-400"
                            }`}
                          />
                          {captain.isOnline ? "متصل" : "غير متصل"}
                        </span>
                        {!captain.isActive && (
                          <span className="px-2 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700">
                            معطل
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {captain.lastSeen
                        ? new Date(captain.lastSeen).toLocaleString("ar-EG")
                        : "—"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(captain._creationTime).toLocaleDateString("ar-EG")}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── Analytics Page ───────────────────────────────────────────────────────────
function AnalyticsPage() {
  const stats = useQuery(api.admin.getPlatformStats);
  const orders = useQuery(api.orders.getAllOrders);
  const stores = useQuery(api.admin.getAllStores);

  const dailyRevenue = (() => {
    if (!orders) return [];
    const days: { label: string; revenue: number; count: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
      const dayEnd = dayStart + 24 * 60 * 60 * 1000;
      const dayOrders = orders.filter(
        (o) => o._creationTime >= dayStart && o._creationTime < dayEnd
      );
      days.push({
        label: date.toLocaleDateString("ar-EG", { weekday: "short" }),
        revenue: dayOrders.reduce((sum, o) => sum + o.total, 0),
        count: dayOrders.length,
      });
    }
    return days;
  })();

  const maxRevenue = Math.max(...dailyRevenue.map((d) => d.revenue), 1);

  const topStores = stores
    ? [...stores].sort((a, b) => b.totalOrders - a.totalOrders).slice(0, 5)
    : [];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">التقارير والتحليلات</h1>
        <p className="text-gray-500 mt-1">نظرة شاملة على أداء المنصة</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <KpiCard
          title="إجمالي الإيرادات"
          value={stats ? `${stats.totalRevenue.toLocaleString()} EGP` : "—"}
          icon={<span className="text-sm font-bold text-amber-700 bg-amber-100 px-2 py-1 rounded">EGP</span>}
          color="green"
        />
        <KpiCard
          title="إجمالي العمولات"
          value={stats ? `${stats.totalCommission.toLocaleString()} EGP` : "—"}
          icon={<TrendingUp className="w-5 h-5" />}
          color="purple"
        />
        <KpiCard
          title="معدل الإتمام"
          value={
            stats && stats.totalOrders > 0
              ? `${Math.round(((stats.statusCounts?.delivered || 0) / stats.totalOrders) * 100)}%`
              : "—"
          }
          icon={<CheckCircle className="w-5 h-5" />}
          color="blue"
        />
        <KpiCard
          title="معدل الإلغاء"
          value={
            stats && stats.totalOrders > 0
              ? `${Math.round(((stats.statusCounts?.cancelled || 0) / stats.totalOrders) * 100)}%`
              : "—"
          }
          icon={<XCircle className="w-5 h-5" />}
          color="red"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Daily Revenue Chart */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-6">الإيرادات اليومية (آخر 7 أيام)</h3>
          <div className="flex items-end gap-3 h-48">
            {dailyRevenue.map((day, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <span className="text-xs text-gray-500 font-medium">
                  {day.revenue > 0 ? `${day.revenue}` : ""}
                </span>
                <div className="w-full relative flex items-end" style={{ height: "140px" }}>
                  <div
                    className="w-full bg-gradient-to-t from-purple-600 to-purple-400 rounded-t-lg transition-all duration-500"
                    style={{
                      height: `${Math.max((day.revenue / maxRevenue) * 100, day.revenue > 0 ? 5 : 0)}%`,
                    }}
                  />
                </div>
                <span className="text-xs text-gray-500">{day.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Order Status */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-6">توزيع حالات الطلبات</h3>
          {stats?.statusCounts ? (
            <div className="space-y-3">
              {[
                { key: "delivered", label: "تم التوصيل", color: "bg-green-500" },
                { key: "pending", label: "قيد الانتظار", color: "bg-yellow-500" },
                { key: "preparing", label: "قيد التحضير", color: "bg-purple-500" },
                { key: "delivering", label: "قيد التوصيل", color: "bg-orange-500" },
                { key: "cancelled", label: "ملغي", color: "bg-red-500" },
                { key: "confirmed", label: "مؤكد", color: "bg-blue-500" },
              ].map(({ key, label, color }) => {
                const count = stats.statusCounts[key] || 0;
                const pct = stats.totalOrders > 0 ? (count / stats.totalOrders) * 100 : 0;
                return (
                  <div key={key}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${color}`} />
                        <span className="text-sm text-gray-700">{label}</span>
                      </div>
                      <span className="text-sm font-bold text-gray-900">
                        {count} ({pct.toFixed(1)}%)
                      </span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${color} transition-all duration-500`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex items-center justify-center h-40">
              <RefreshCw className="w-6 h-6 text-gray-400 animate-spin" />
            </div>
          )}
        </div>
      </div>

      {/* Top Stores */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
        <h3 className="text-lg font-bold text-gray-900 mb-6">أفضل المتاجر أداءً</h3>
        {topStores.length === 0 ? (
          <p className="text-gray-400 text-center py-8">لا توجد بيانات</p>
        ) : (
          <div className="space-y-4">
            {topStores.map((store, i) => (
              <div key={store._id} className="flex items-center gap-4">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white ${
                    i === 0
                      ? "bg-yellow-500"
                      : i === 1
                      ? "bg-gray-400"
                      : i === 2
                      ? "bg-orange-400"
                      : "bg-purple-200 text-purple-700"
                  }`}
                >
                  {i + 1}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-gray-900">{store.nameAr}</span>
                    <span className="text-sm text-gray-500">{store.totalOrders} طلب</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div
                      className="h-2 rounded-full bg-gradient-to-r from-purple-500 to-purple-400 transition-all duration-500"
                      style={{
                        width: `${topStores[0].totalOrders > 0 ? (store.totalOrders / topStores[0].totalOrders) * 100 : 0}%`,
                      }}
                    />
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 text-yellow-400" />
                    <span className="text-sm font-medium text-gray-700">{store.rating.toFixed(1)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Shared Components ────────────────────────────────────────────────────────
function StatCard({
  icon, title, value, sub, color, trend,
}: {
  icon: React.ReactNode;
  title: string;
  value: string | number;
  sub: string;
  color: "purple" | "green" | "blue" | "orange";
  trend: "up" | "down";
}) {
  const colors = {
    purple: "bg-purple-100 text-purple-600",
    green: "bg-green-100 text-green-600",
    blue: "bg-blue-100 text-blue-600",
    orange: "bg-orange-100 text-orange-600",
  };
  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl ${colors[color]} flex items-center justify-center`}>
          {icon}
        </div>
        {trend === "up" ? (
          <ArrowUpRight className="w-5 h-5 text-green-500" />
        ) : (
          <ArrowDownRight className="w-5 h-5 text-red-500" />
        )}
      </div>
      <p className="text-sm text-gray-500 mb-1">{title}</p>
      <p className="text-2xl font-bold text-gray-900 mb-1">{value}</p>
      <p className="text-xs text-gray-400">{sub}</p>
    </div>
  );
}

function KpiCard({
  title, value, icon, color,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
  color: "green" | "purple" | "blue" | "red";
}) {
  const colors = {
    green: "bg-green-100 text-green-600",
    purple: "bg-purple-100 text-purple-600",
    blue: "bg-blue-100 text-blue-600",
    red: "bg-red-100 text-red-600",
  };
  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
      <div className={`w-10 h-10 rounded-xl ${colors[color]} flex items-center justify-center mb-4`}>
        {icon}
      </div>
      <p className="text-sm text-gray-500 mb-1">{title}</p>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; cls: string }> = {
    pending: { label: "قيد الانتظار", cls: "bg-yellow-100 text-yellow-800" },
    confirmed: { label: "مؤكد", cls: "bg-blue-100 text-blue-800" },
    assigned: { label: "تم التعيين", cls: "bg-indigo-100 text-indigo-800" },
    preparing: { label: "قيد التحضير", cls: "bg-purple-100 text-purple-800" },
    ready: { label: "جاهز", cls: "bg-teal-100 text-teal-800" },
    picked_up: { label: "تم الاستلام", cls: "bg-cyan-100 text-cyan-800" },
    delivering: { label: "قيد التوصيل", cls: "bg-orange-100 text-orange-800" },
    delivered: { label: "تم التوصيل", cls: "bg-green-100 text-green-800" },
    cancelled: { label: "ملغي", cls: "bg-red-100 text-red-800" },
  };
  const s = map[status] || { label: status, cls: "bg-gray-100 text-gray-800" };
  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${s.cls}`}>
      {s.label}
    </span>
  );
}

// ─── Users Management ───────────────────────────────────────────────────────────
function UsersManagement() {
  const users = useQuery(api.admin.getAllUsers);
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

  const handleSuspendUser = async (userId: string, currentStatus: boolean) => {
    try {
      await suspendUser({
        userId: userId as Id<"users">,
        isSuspended: !currentStatus,
      });
      toast.success(!currentStatus ? "تم إيقاف المستخدم" : "تم تفعيل المستخدم");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "فشل تحديث حالة المستخدم");
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا المستخدم؟ هذا الإجراء لا يمكن التراجع عنه.")) {
      return;
    }
    try {
      await deleteUser({ userId: userId as Id<"users"> });
      toast.success("تم حذف المستخدم");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "فشل حذف المستخدم");
    }
  };

  const roles = [
    { key: null, label: "الكل" },
    { key: "customer", label: "عملاء" },
    { key: "merchant", label: "تجار" },
    { key: "captain", label: "كباتن" },
    { key: "admin", label: "مديرون" },
  ];

  const statuses = [
    { key: null, label: "الكل" },
    { key: "active", label: "نشط" },
    { key: "suspended", label: "موقوف" },
  ];

  const roleLabels: Record<string, string> = {
    customer: "عميل",
    merchant: "تاجر",
    captain: "كابتن",
    admin: "مدير",
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">إدارة المستخدمين</h1>
        <p className="text-gray-500 mt-1">
          {users ? `${users.length} مستخدم إجمالاً` : "جاري التحميل..."}
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <span className="text-sm text-gray-500">إجمالي المستخدمين</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">{users?.length ?? "—"}</p>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
              <UserCheck className="w-5 h-5 text-green-600" />
            </div>
            <span className="text-sm text-gray-500">العملاء</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {users?.filter((u) => u.role === "customer").length ?? "—"}
          </p>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
              <Store className="w-5 h-5 text-orange-600" />
            </div>
            <span className="text-sm text-gray-500">التجار</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {users?.filter((u) => u.role === "merchant").length ?? "—"}
          </p>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
              <XCircle className="w-5 h-5 text-red-600" />
            </div>
            <span className="text-sm text-gray-500">الموقوفون</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {users?.filter((u) => u.isSuspended).length ?? "—"}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute top-1/2 -translate-y-1/2 right-3 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="ابحث بالاسم أو البريد أو الهاتف..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pr-10 pl-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-purple-400"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto">
            {roles.map(({ key, label }) => (
              <button
                key={String(key)}
                onClick={() => setFilterRole(key)}
                className={`px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  filterRole === key
                    ? "bg-purple-600 text-white shadow-md"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          <div className="flex gap-2 overflow-x-auto">
            {statuses.map(({ key, label }) => (
              <button
                key={String(key)}
                onClick={() => setFilterStatus(key)}
                className={`px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  filterStatus === key
                    ? "bg-purple-600 text-white shadow-md"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-b from-gray-50 to-gray-100 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-start text-xs font-semibold text-gray-600 uppercase">المستخدم</th>
                <th className="px-6 py-4 text-start text-xs font-semibold text-gray-600 uppercase">الموبايل</th>
                <th className="px-6 py-4 text-start text-xs font-semibold text-gray-600 uppercase">الدور</th>
                <th className="px-6 py-4 text-start text-xs font-semibold text-gray-600 uppercase">الحالة</th>
                <th className="px-6 py-4 text-start text-xs font-semibold text-gray-600 uppercase">التسجيل</th>
                <th className="px-6 py-4 text-start text-xs font-semibold text-gray-600 uppercase">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {!users ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <RefreshCw className="w-6 h-6 text-gray-400 animate-spin mx-auto mb-2" />
                    <p className="text-gray-400">جاري التحميل...</p>
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-400 font-medium">لا توجد مستخدمين</p>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-bold text-purple-700">
                            {user.fullName?.charAt(0)?.toUpperCase() || "U"}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">{user.fullName || "—"}</p>
                          <p className="text-xs text-gray-500">{user.email || "—"}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {user.phone ? (
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-blue-500" />
                          <span className="text-sm font-medium text-gray-900">{user.phone}</span>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-lg text-xs font-semibold ${
                        user.role === "admin" ? "bg-purple-100 text-purple-700" :
                        user.role === "merchant" ? "bg-orange-100 text-orange-700" :
                        user.role === "captain" ? "bg-blue-100 text-blue-700" :
                        "bg-gray-100 text-gray-700"
                      }`}>
                        {roleLabels[user.role] || user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        user.isSuspended 
                          ? "bg-red-100 text-red-700" 
                          : "bg-green-100 text-green-700"
                      }`}>
                        {user.isSuspended ? "موقوف" : "نشط"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-500">
                      {new Date(user._creationTime).toLocaleDateString("ar-EG")}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleSuspendUser(user._id, user.isSuspended || false)}
                          className={`text-xs px-2 py-1 rounded-lg font-medium transition-colors ${
                            user.isSuspended
                              ? "bg-green-100 text-green-700 hover:bg-green-200"
                              : "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                          }`}
                        >
                          {user.isSuspended ? "تفعيل" : "إيقاف"}
                        </button>
                        {user.role !== "admin" && (
                          <button
                            onClick={() => handleDeleteUser(user._id)}
                            className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-lg hover:bg-red-200 transition-colors"
                          >
                            حذف
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
