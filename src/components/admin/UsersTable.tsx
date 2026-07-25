import React from "react";
import { Users, UserCheck, Store, XCircle, Search, Phone, RefreshCw } from "lucide-react";
import { useUsers } from "../../hooks/useUsers";

export function UsersTable() {
  const {
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
  } = useUsers();

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
