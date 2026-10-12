import { ShieldCheck, Home, Building2, FileText } from "lucide-react";

interface RealEstateBadgeProps {
  noBroker?: boolean;
  listingType?: "sale" | "rent" | "contract_exit";
  size?: "sm" | "md" | "lg";
}

export default function RealEstateBadge({
  noBroker = true,
  listingType,
  size = "md",
}: RealEstateBadgeProps) {
  const sizeClasses = {
    sm: "text-xs px-2 py-1 gap-1",
    md: "text-sm px-3 py-1.5 gap-1.5",
    lg: "text-base px-4 py-2 gap-2",
  };

  const iconSize = {
    sm: 12,
    md: 14,
    lg: 16,
  };

  // Direct from Owner - No Broker Badge
  if (noBroker) {
    return (
      <div
        className={`inline-flex items-center bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-full font-medium ${sizeClasses[size]}`}
      >
        <ShieldCheck size={iconSize[size]} />
        <span>مباشر من المالك - بدون سمسار</span>
      </div>
    );
  }

  // Listing Type Badges
  if (listingType === "sale") {
    return (
      <div
        className={`inline-flex items-center bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full font-medium ${sizeClasses[size]}`}
      >
        <Building2 size={iconSize[size]} />
        <span>للبيع</span>
      </div>
    );
  }

  if (listingType === "rent") {
    return (
      <div
        className={`inline-flex items-center bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-full font-medium ${sizeClasses[size]}`}
      >
        <Home size={iconSize[size]} />
        <span>للإيجار</span>
      </div>
    );
  }

  if (listingType === "contract_exit") {
    return (
      <div
        className={`inline-flex items-center bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-full font-medium ${sizeClasses[size]}`}
      >
        <FileText size={iconSize[size]} />
        <span>تنازل وتخارج</span>
      </div>
    );
  }

  return null;
}
