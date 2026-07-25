import React from "react";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

export function StatCard({
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
    <div className="bg-white rounded-2xl p-4 sm:p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all">
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl ${colors[color]} flex items-center justify-center`}>
          {icon}
        </div>
        {trend === "up" ? (
          <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
        ) : (
          <ArrowDownRight className="w-4 h-4 sm:w-5 sm:h-5 text-red-500" />
        )}
      </div>
      <p className="text-xs sm:text-sm text-gray-500 mb-1">{title}</p>
      <p className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">{value}</p>
      <p className="text-[10px] sm:text-xs text-gray-400">{sub}</p>
    </div>
  );
}

export function KpiCard({
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

export function StatusBadge({ status }: { status: string }) {
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
    <span className={`px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-semibold ${s.cls}`}>
      {s.label}
    </span>
  );
}
