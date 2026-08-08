import React, { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "react-hot-toast";
import ProductsManagement from "./AdminProductsManagement";
import NotificationsManagement from "./AdminNotificationsManagement";
import ActivityLog from "./AdminActivityLog";
import SystemSettings from "./AdminSystemSettings";
import AdminSuperStoreManagement from "./AdminSuperStoreManagement";
import AdminDataExport from "./AdminDataExport";
import AdminManagement from "./AdminManagement";
import ProtectedAdminRoute from "./ProtectedAdminRoute";
import {
  Users,
  UserCheck,
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
  Search,
  Lock,
  Phone,
  XCircle,
  Shield,
  Menu,
  X,
} from "lucide-react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { Id } from "../../convex/_generated/dataModel";
import { useAuth } from "../contexts/AuthContextNew";
import { useTranslation } from "react-i18next";

import { NavigationBar } from "./NavigationBar";
import ChangePasswordModal from "./ChangePasswordModal";
import AdminAuth from "./AdminAuth";
import { DashboardHeader } from "./admin/DashboardHeader";
import { OrdersTable } from "./admin/OrdersTable";
import { UsersTable } from "./admin/UsersTable";
import { KpiCard } from "./admin/StatisticsCards";

export default function AdminDashboard() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [showChangePassword, setShowChangePassword] = useState(false);

  // إذا لم يكن المستخدم مسجل دخول أو لا يوجد ملف شخصي
  if (!isAuthenticated || !user || !user.profile) {
    return <AdminAuth />;
  }

  // التحقق من أن المستخدم مدير
  if (user.profile.role !== "admin" && user.profile.role !== "owner") {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50" dir="rtl">
      <div className="text-center p-8 bg-white rounded-2xl shadow-sm border">
        <h2 className="text-2xl font-bold text-red-600 mb-4">{t('admin.unauthorized')}</h2>
        <p className="mb-6 text-gray-600">{t('admin.adminOnly')}</p>
        <button
          onClick={() => navigate("/")}
          className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          {t('admin.backToHome')}
        </button>
      </div>
    </div>
  );
}

  return (
    <>
      <NavigationBar />
      <div className="min-h-screen bg-gray-50" dir="rtl">
        <Routes>
          <Route path="/" element={<AdminLayout showChangePassword={showChangePassword} setShowChangePassword={setShowChangePassword}><DashboardHeader /></AdminLayout>} />
          <Route path="/users" element={<AdminLayout showChangePassword={showChangePassword} setShowChangePassword={setShowChangePassword}><ProtectedAdminRoute requiredPermission="manage_users"><UsersTable /></ProtectedAdminRoute></AdminLayout>} />
          <Route path="/orders" element={<AdminLayout showChangePassword={showChangePassword} setShowChangePassword={setShowChangePassword}><ProtectedAdminRoute requiredPermission="manage_orders"><OrdersTable /></ProtectedAdminRoute></AdminLayout>} />
          <Route path="/stores" element={<AdminLayout showChangePassword={showChangePassword} setShowChangePassword={setShowChangePassword}><ProtectedAdminRoute requiredPermission="manage_stores"><StoresManagement /></ProtectedAdminRoute></AdminLayout>} />
          <Route path="/products" element={<AdminLayout showChangePassword={showChangePassword} setShowChangePassword={setShowChangePassword}><ProtectedAdminRoute requiredPermission="manage_products"><ProductsManagement /></ProtectedAdminRoute></AdminLayout>} />
          <Route path="/captains" element={<AdminLayout showChangePassword={showChangePassword} setShowChangePassword={setShowChangePassword}><ProtectedAdminRoute requiredPermission="manage_captains"><CaptainsManagement /></ProtectedAdminRoute></AdminLayout>} />
          <Route path="/notifications" element={<AdminLayout showChangePassword={showChangePassword} setShowChangePassword={setShowChangePassword}><ProtectedAdminRoute requiredPermission="manage_notifications"><NotificationsManagement /></ProtectedAdminRoute></AdminLayout>} />
          <Route path="/activity" element={<AdminLayout showChangePassword={showChangePassword} setShowChangePassword={setShowChangePassword}><ProtectedAdminRoute requiredPermission="view_activity_logs"><ActivityLog /></ProtectedAdminRoute></AdminLayout>} />
          <Route path="/analytics" element={<AdminLayout showChangePassword={showChangePassword} setShowChangePassword={setShowChangePassword}><ProtectedAdminRoute requiredPermission="view_reports"><AnalyticsPage /></ProtectedAdminRoute></AdminLayout>} />
          <Route path="/settings" element={<AdminLayout showChangePassword={showChangePassword} setShowChangePassword={setShowChangePassword}><ProtectedAdminRoute requiredPermission="manage_settings"><SystemSettings /></ProtectedAdminRoute></AdminLayout>} />
          <Route path="/super-stores" element={<AdminLayout showChangePassword={showChangePassword} setShowChangePassword={setShowChangePassword}><ProtectedAdminRoute requiredPermission="manage_stores"><AdminSuperStoreManagement /></ProtectedAdminRoute></AdminLayout>} />
          <Route path="/export" element={<AdminLayout showChangePassword={showChangePassword} setShowChangePassword={setShowChangePassword}><ProtectedAdminRoute requiredPermission="view_reports"><AdminDataExport /></ProtectedAdminRoute></AdminLayout>} />
          <Route path="/admin-management" element={<AdminLayout showChangePassword={showChangePassword} setShowChangePassword={setShowChangePassword}><ProtectedAdminRoute requiredPermission="manage_settings"><AdminManagement /></ProtectedAdminRoute></AdminLayout>} />
        </Routes>
      </div>
    </>
  );
}

// ─── Layout Wrapper ───────────────────────────────────────────────────────────
function AdminLayout({ children, showChangePassword, setShowChangePassword }: { children: React.ReactNode; showChangePassword: boolean; setShowChangePassword: (value: boolean) => void }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, isAuthenticated, sessionToken } = useAuth();
  const { t } = useTranslation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const myPermissions = useQuery(
    api.adminPermissions.getMyPermissions,
    isAuthenticated && sessionToken ? { sessionToken } : "skip"
  );

  const navItems = [
    { path: "/admin", label: "الرئيسية", icon: LayoutDashboard, permission: null },
    { path: "/admin/users", label: "إدارة المستخدمين", icon: Users, permission: "manage_users" },
    { path: "/admin/orders", label: "الطلبات", icon: Package, permission: "manage_orders" },
    { path: "/admin/stores", label: "المتاجر", icon: Store, permission: "manage_stores" },
    { path: "/admin/products", label: "المنتجات", icon: ShoppingBag, permission: "manage_products" },
    { path: "/admin/captains", label: "الكباتن", icon: Truck, permission: "manage_captains" },
    { path: "/admin/notifications", label: "الإشعارات", icon: Bell, permission: "manage_notifications" },
    { path: "/admin/activity", label: "سجل النشاط", icon: Activity, permission: "view_activity_logs" },
    { path: "/admin/analytics", label: "التقارير", icon: BarChart3, permission: "view_reports" },
    { path: "/admin/settings", label: "الإعدادات", icon: Settings, permission: "manage_settings" },
    { path: "/admin/super-stores", label: "الإدارة الشاملة", icon: Store, permission: "manage_stores" },
    { path: "/admin/export", label: "تصدير البيانات", icon: Database, permission: "view_reports" },
    { path: "/admin/admin-management", label: "إدارة الإداريين", icon: Shield, permission: "manage_settings" },
  ];

  // Filter nav items based on permissions
  const filteredNavItems = navItems.filter((item) => {
    if (!item.permission) return true; // Always show items without permission requirement
    if (!myPermissions) return false; // Hide if permissions not loaded
    if (myPermissions.isOwner) return true; // Owner sees everything
    return myPermissions[item.permission as keyof typeof myPermissions] === true;
  });

  const isActive = (path: string) => {
    if (path === "/admin") return location.pathname === "/admin";
    return location.pathname.startsWith(path);
  };

  const handleSignOut = async () => {
  try {
    await logout();
    navigate("/"); // هذا يمنع إعادة تحميل الصفحة بالكامل
  } catch (error) {
    toast.error("حدث خطأ أثناء تسجيل الخروج");
  }
};

  return (
    <div className="flex min-h-screen bg-gray-50 flex-row-reverse">
      {/* Mobile Menu Toggle Button */}
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="lg:hidden fixed top-4 right-4 z-50 p-2 bg-purple-600 text-white rounded-xl shadow-lg"
      >
        {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 right-0 z-50 w-64 bg-gradient-to-b from-purple-900 to-purple-800 text-white flex flex-col h-full transform transition-transform duration-300 ease-in-out ${
        mobileMenuOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'
      } ${mobileMenuOpen ? 'lg:hidden' : 'hidden lg:flex'}`}>
        {/* Logo */}
        <div className="p-4 sm:p-6 border-b border-purple-700">
          <div className="flex items-center gap-2 sm:gap-3">
            <img src="/logo.png" alt="Aqraply Logo" className="h-24 w-auto" />
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 sm:p-4 space-y-1 overflow-y-auto">
          {filteredNavItems.map((item) => (
            <button
              key={item.path}
              onClick={() => {
                navigate(item.path);
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                isActive(item.path)
                  ? "bg-white/20 text-white shadow-lg"
                  : "text-purple-200 hover:bg-white/10 hover:text-white"
              }`}
            >
              <item.icon className="w-4 h-4 sm:w-5 sm:h-5" />
              {item.label}
            </button>
          ))}
        </nav>

        {/* Sign Out */}
        <div className="p-3 sm:p-4 border-t border-purple-700 space-y-2">
          <button
            onClick={() => {
              setShowChangePassword(true);
              setMobileMenuOpen(false);
            }}
            className="w-full flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3 rounded-xl text-xs sm:text-sm font-medium text-purple-200 hover:bg-white/10 hover:text-white transition-all"
          >
            <Lock className="w-4 h-4 sm:w-5 sm:h-5" />
            تغيير كلمة المرور
          </button>
          <button
            onClick={() => {
              handleSignOut();
              setMobileMenuOpen(false);
            }}
            className="w-full flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3 rounded-xl text-xs sm:text-sm font-medium text-purple-200 hover:bg-white/10 hover:text-white transition-all"
          >
            <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
            تسجيل الخروج
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-h-screen overflow-y-auto">
        <div className="p-3 sm:p-4 lg:p-8 pt-16 lg:pt-8">
          {children}
        </div>
      </main>

      <ChangePasswordModal 
        isOpen={showChangePassword} 
        onClose={() => setShowChangePassword(false)} 
      />
    </div>
  );
}


// ─── Stores Management ────────────────────────────────────────────────────────
function StoresManagement() {
  const { t } = useTranslation();
  const { sessionToken, isAuthenticated } = useAuth();
  const stores = useQuery(api.admin.getAllStores, isAuthenticated && sessionToken ? { sessionToken } : "skip");
  const pendingStores = useQuery(api.stores.getPendingStores, isAuthenticated && sessionToken ? { sessionToken } : "skip");
  const toggleStore = useMutation(api.admin.toggleStoreActive);
  const approveStore = useMutation(api.stores.approveStore);
  const rejectStore = useMutation(api.stores.rejectStore);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterActive, setFilterActive] = useState<boolean | null>(null);
  const [showPending, setShowPending] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [rejectingStore, setRejectingStore] = useState<string | null>(null);

  const filteredStores = (stores || [])
    .filter((s) => filterActive === null || s.isActive === filterActive)
    .filter(
      (s) =>
        !searchTerm ||
        s.nameAr?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const handleToggle = async (storeId: string, currentActive: boolean) => {
    try {
      await toggleStore({
        sessionToken,
        storeId: storeId as Id<"stores">,
        isActive: !currentActive,
      });
      toast.success(!currentActive ? "تم تفعيل المتجر" : "تم تعطيل المتجر");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "فشل تحديث حالة المتجر");
    }
  };

  const handleApproveStore = async (storeId: string) => {
    try {
      await approveStore({
        sessionToken,
        storeId: storeId as Id<"stores">,
      });
      toast.success("تمت الموافقة على المتجر بنجاح");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "فشلت الموافقة على المتجر");
    }
  };

  const handleRejectStore = async (storeId: string) => {
    if (!rejectionReason.trim()) {
      toast.error("يرجى إدخال سبب الرفض");
      return;
    }
    try {
      await rejectStore({
        sessionToken,
        storeId: storeId as Id<"stores">,
        reason: rejectionReason,
      });
      toast.success("تم رفض المتجر بنجاح");
      setRejectionReason("");
      setRejectingStore(null);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "فشل رفض المتجر");
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
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
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-orange-600" />
            </div>
            <span className="text-sm text-gray-500">معلقة للموافقة</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {pendingStores?.length ?? "—"}
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
        <button
          onClick={() => setShowPending(!showPending)}
          className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
            showPending
              ? "bg-orange-600 text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          {showPending ? "عرض الكل" : "المعلقة فقط"}
        </button>
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
          {(showPending ? pendingStores : filteredStores).map((store) => (
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
                <div className="absolute top-3 left-3 flex gap-2">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-bold ${
                      store.isActive
                        ? "bg-green-500 text-white"
                        : "bg-red-500 text-white"
                    }`}
                  >
                    {store.isActive ? "نشط" : "معطل"}
                  </span>
                  {store.isApproved === false && (
                    <span className="px-2 py-1 rounded-full text-xs font-bold bg-orange-500 text-white">
                      معلقة
                    </span>
                  )}
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
                    <span className="truncate">{store.location?.addressAr || store.address || "—"}</span>
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
                  <div className="flex gap-2">
                    {store.isApproved === false && (
                      <>
                        <button
                          onClick={() => handleApproveStore(store._id)}
                          className="flex items-center gap-2 px-3 py-1.5 bg-green-100 text-green-700 rounded-lg text-sm font-semibold hover:bg-green-200 transition-all"
                        >
                          <CheckCircle className="w-4 h-4" />
                          موافقة
                        </button>
                        <button
                          onClick={() => setRejectingStore(store._id)}
                          className="flex items-center gap-2 px-3 py-1.5 bg-red-100 text-red-700 rounded-lg text-sm font-semibold hover:bg-red-200 transition-all"
                        >
                          <XCircle className="w-4 h-4" />
                          رفض
                        </button>
                      </>
                    )}
                    {store.isApproved !== false && (
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
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Store Rejection Reason Modal */}
      {rejectingStore && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-bold text-gray-900 mb-4">سبب الرفض</h3>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="أدخل سبب رفض المتجر..."
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-purple-400 resize-none"
              rows={4}
            />
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => {
                  setRejectionReason("");
                  setRejectingStore(null);
                }}
                className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
              >
                إلغاء
              </button>
              <button
                onClick={() => handleRejectStore(rejectingStore)}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-colors"
              >
                رفض
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Captains Management ──────────────────────────────────────────────────────
function CaptainsManagement() {
  const { t } = useTranslation();
  const { sessionToken, isAuthenticated } = useAuth();
  const captains = useQuery(api.captains.getAllCaptains, isAuthenticated && sessionToken ? { sessionToken } : "skip");
  const pendingCaptains = useQuery(api.captains.getPendingCaptains, isAuthenticated && sessionToken ? { sessionToken } : "skip");
  const approveCaptain = useMutation(api.captains.approveCaptain);
  const rejectCaptain = useMutation(api.captains.rejectCaptain);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterOnline, setFilterOnline] = useState<boolean | null>(null);
  const [showPending, setShowPending] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [rejectingCaptain, setRejectingCaptain] = useState<string | null>(null);

  const filteredCaptains = (captains || [])
    .filter((c) => filterOnline === null || c.isOnline === filterOnline)
    .filter(
      (c) =>
        !searchTerm ||
        c.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.phone?.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const handleApprove = async (captainId: string) => {
    try {
      await approveCaptain({
        sessionToken,
        captainId: captainId as any,
      });
      toast.success("تمت الموافقة على الكابتن بنجاح");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "فشلت الموافقة على الكابتن");
    }
  };

  const handleReject = async (captainId: string) => {
    if (!rejectionReason.trim()) {
      toast.error("يرجى إدخال سبب الرفض");
      return;
    }
    try {
      await rejectCaptain({
        sessionToken,
        captainId: captainId as any,
        reason: rejectionReason,
      });
      toast.success("تم رفض الكابتن بنجاح");
      setRejectionReason("");
      setRejectingCaptain(null);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "فشل رفض الكابتن");
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">إدارة الكباتن</h1>
        <p className="text-gray-500 mt-1">
          {captains ? `${captains.length} كابتن مسجل` : "جاري التحميل..."}
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
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
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-orange-600" />
            </div>
            <span className="text-sm text-gray-500">معلقة للموافقة</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {pendingCaptains?.length ?? "—"}
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
        <button
          onClick={() => setShowPending(!showPending)}
          className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
            showPending
              ? "bg-orange-600 text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          {showPending ? "عرض الكل" : "المعلقة فقط"}
        </button>
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
                <th className="px-6 py-4 text-start text-xs font-semibold text-gray-600 uppercase">الإجراءات</th>
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
                (showPending ? pendingCaptains : filteredCaptains).map((captain) => (
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
                        {captain.isApproved === false && (
                          <span className="px-2 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-700">
                            معلقة
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
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {captain.isApproved === false && (
                          <>
                            <button
                              onClick={() => handleApprove(captain._id)}
                              className="px-3 py-1.5 bg-green-100 text-green-700 rounded-lg text-xs font-semibold hover:bg-green-200 transition-colors"
                            >
                              موافقة
                            </button>
                            <button
                              onClick={() => setRejectingCaptain(captain._id)}
                              className="px-3 py-1.5 bg-red-100 text-red-700 rounded-lg text-xs font-semibold hover:bg-red-200 transition-colors"
                            >
                              رفض
                            </button>
                          </>
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

      {/* Rejection Reason Modal */}
      {rejectingCaptain && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-bold text-gray-900 mb-4">سبب الرفض</h3>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="أدخل سبب رفض الكابتن..."
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-purple-400 resize-none"
              rows={4}
            />
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => {
                  setRejectionReason("");
                  setRejectingCaptain(null);
                }}
                className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
              >
                إلغاء
              </button>
              <button
                onClick={() => handleReject(rejectingCaptain)}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-colors"
              >
                رفض
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Analytics Page ───────────────────────────────────────────────────────────
function AnalyticsPage() {
  const { t } = useTranslation();
  const { sessionToken, isAuthenticated } = useAuth();
  const stats = useQuery(api.admin.getPlatformStats, isAuthenticated && sessionToken ? { sessionToken } : "skip");
  const orders = useQuery(api.orders.getAllOrders, isAuthenticated && sessionToken ? { sessionToken } : "skip");
  const stores = useQuery(api.admin.getAllStores, isAuthenticated && sessionToken ? { sessionToken } : "skip");

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

