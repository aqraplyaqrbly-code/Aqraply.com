import { Package } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export function ProductImage({ 
  product, 
  className = "w-full h-full object-cover",
  imageIndex = 0
}: { 
  product: any
  className?: string 
  imageIndex?: number
}) {
  const imageKey = product?.images?.[imageIndex] || product?.images?.[0] || product?.imageUrl;
  const isDirectUrl = typeof imageKey === "string" && (imageKey.startsWith("http://") || imageKey.startsWith("https://"));
  const resolvedImageUrl = useQuery(
    api.files.getFileUrl,
    imageKey && !isDirectUrl ? { storageId: imageKey } : "skip"
  );
  const imageUrl = isDirectUrl ? imageKey : resolvedImageUrl;

  if (!imageUrl) {
    return (
      <div className={`${className} bg-gray-100 flex items-center justify-center`}>
        <Package className="w-1/3 h-1/3 text-gray-400" />
      </div>
    );
  }

  return (
    <img 
      src={imageUrl} 
      alt={product?.nameAr || "منتج"} 
      className={className} 
    />
  );
}
