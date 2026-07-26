import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

interface OrderItemProps {
  item: {
    productId: string;
    name: string;
    nameAr: string;
    price: number;
    quantity: number;
    imageUrl?: string;
    color?: string;
    size?: string;
    code?: string;
  };
}

export default function OrderItem({ item }: OrderItemProps) {
  const generatePlaceholderUrl = (name: string) => {
    const seed = name.replace(/\s+/g, '').toLowerCase();
    return `https://picsum.photos/seed/${seed}/100/100.jpg`;
  };

  // Resolve storage ID to URL
  const imageUrl = useQuery(
    api.files.getFileUrl,
    item.imageUrl && !item.imageUrl.startsWith('http') ? { storageId: item.imageUrl } : "skip"
  );

  const src = item.imageUrl?.startsWith('http')
    ? item.imageUrl
    : (imageUrl || generatePlaceholderUrl(item.name));

  return (
    <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
      {/* Product Image */}
      <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
        <img
          src={src}
          alt={item.nameAr}
          className="w-full h-full object-cover"
          onError={(e) => {
            const target = e.currentTarget;
            target.src = 'https://picsum.photos/seed/product/100/100.jpg';
          }}
        />
      </div>

      {/* Product Details */}
      <div className="flex-1 text-right">
        <div className="flex items-center justify-between gap-2 mb-1">
          <h4 className="font-semibold text-gray-900 text-sm">{item.nameAr}</h4>
          {item.code && (
            <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded-md font-mono">
              {item.code}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-gray-600 text-xs">الكمية: {item.quantity}</span>
          {item.size && (
            <span className="text-gray-600 text-xs">• المقاس: {item.size}</span>
          )}
          {item.color && (
            <span className="text-gray-600 text-xs">• اللون: {item.color}</span>
          )}
        </div>
        <div className="flex items-center justify-between mt-2">
          <span className="text-orange-600 font-bold text-sm">
            {item.price} ج.م × {item.quantity}
          </span>
          <span className="text-gray-900 font-bold text-sm">
            {(item.price * item.quantity).toFixed(2)} ج.م
          </span>
        </div>
      </div>
    </div>
  );
}
