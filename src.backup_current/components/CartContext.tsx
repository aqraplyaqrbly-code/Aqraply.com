import { createContext, useState, useEffect, ReactNode, useContext } from "react";
import { Id } from "../../convex/_generated/dataModel";
import { toast } from "sonner";

// سلة التسوق المحلية
interface CartItem {
  productId: Id<"products">;
  name: string;
  nameAr: string;
  price: number;
  quantity: number;
  imageUrl?: string;
  color?: string; // لون المنتج المختار
  selectedSize?: string; // المقاس المختار
}

interface CartStore {
  storeId: Id<"stores">;
  storeName: string;
  storeNameAr: string;
  deliveryFee: number;
  minOrderAmount: number;
  freeDeliveryThreshold?: number;
  customerAddressAr?: string;
  items: CartItem[];
}

interface CartContextType {
  cart: CartStore | null;
  addToCart: (storeInfo: { storeId: Id<"stores">; storeName: string; storeNameAr: string; deliveryFee: number; minOrderAmount: number }, item: CartItem) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  getTotal: () => { subtotal: number; deliveryFee: number; total: number };
  getItemCount: () => number;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const [cart, setCart] = useState<CartStore | null>(() => {
    const saved = localStorage.getItem('aqraply_cart');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    if (cart) {
      localStorage.setItem('aqraply_cart', JSON.stringify(cart));
    } else {
      localStorage.removeItem('aqraply_cart');
    }
  }, [cart]);

  const addToCart = (storeInfo: { storeId: Id<"stores">; storeName: string; storeNameAr: string; deliveryFee: number; minOrderAmount: number }, item: CartItem) => {
    setCart(prev => {
      // إذا كانت السلة فارغة أو من متجر مختلف
      if (!prev || prev.storeId !== storeInfo.storeId) {
        return {
          ...storeInfo,
          items: [item]
        };
      }
      
      // إذا كان المنتج موجود بالفعل
      const existingIndex = prev.items.findIndex(i => i.productId === item.productId);
      if (existingIndex >= 0) {
        const newItems = [...prev.items];
        newItems[existingIndex].quantity += item.quantity;
        return { ...prev, items: newItems };
      }
      
      // إضافة منتج جديد
      return { ...prev, items: [...prev.items, item] };
    });
    toast.success('تمت إضافة المنتج إلى السلة');
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (!cart) return;
    
    const updatedItems = cart.items.map((item: any) =>
      item.productId === productId ? { ...item, quantity } : item
    );
    
    const newCart = { ...cart, items: updatedItems };
    setCart(newCart);
    localStorage.setItem('aqraply_cart', JSON.stringify(newCart));
  };

  const removeFromCart = (productId: string) => {
    if (!cart) return;
    
    const updatedItems = cart.items.filter((item: any) => item.productId !== productId);
    const newCart = { ...cart, items: updatedItems };
    setCart(newCart);
    localStorage.setItem('aqraply_cart', JSON.stringify(newCart));
  };

  const getTotal = () => {
    if (!cart) return { subtotal: 0, deliveryFee: 0, total: 0 };
    const subtotal = cart.items.reduce((total: number, item: any) => total + (item.price * item.quantity), 0);
    const deliveryFee = cart.deliveryFee || 0;
    const total = subtotal + deliveryFee;
    return { subtotal, deliveryFee, total };
  };

  const getItemCount = () => {
    if (!cart) return 0;
    return cart.items.reduce((total: number, item: any) => total + item.quantity, 0);
  };

  const clearCart = () => {
    setCart(null);
    localStorage.removeItem('aqraply_cart');
    toast.success('تم إفراغ السلة');
  };

  return {
    cart,
    addToCart,
    updateQuantity,
    removeFromCart,
    getTotal,
    getItemCount,
    clearCart
  };
};

// CartProvider component
export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartStore | null>(() => {
    const saved = localStorage.getItem('aqraply_cart');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    if (cart) {
      localStorage.setItem('aqraply_cart', JSON.stringify(cart));
    } else {
      localStorage.removeItem('aqraply_cart');
    }
  }, [cart]);

  const addToCart = (storeInfo: { storeId: Id<"stores">; storeName: string; storeNameAr: string; deliveryFee: number; minOrderAmount: number }, item: CartItem) => {
    setCart(prev => {
      if (!prev || prev.storeId !== storeInfo.storeId) {
        return {
          ...storeInfo,
          items: [item]
        };
      }
      
      const existingIndex = prev.items.findIndex(i => i.productId === item.productId);
      if (existingIndex >= 0) {
        const newItems = [...prev.items];
        newItems[existingIndex].quantity += item.quantity;
        return { ...prev, items: newItems };
      }
      
      return { ...prev, items: [...prev.items, item] };
    });
    toast.success('تمت إضافة المنتج إلى السلة');
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (!cart) return;
    
    const updatedItems = cart.items.map((item: any) =>
      item.productId === productId ? { ...item, quantity } : item
    );
    
    const newCart = { ...cart, items: updatedItems };
    setCart(newCart);
  };

  const removeFromCart = (productId: string) => {
    if (!cart) return;
    
    const updatedItems = cart.items.filter((item: any) => item.productId !== productId);
    const newCart = { ...cart, items: updatedItems };
    setCart(newCart);
  };

  const getTotal = () => {
    if (!cart) return { subtotal: 0, deliveryFee: 0, total: 0 };
    const subtotal = cart.items.reduce((total: number, item: any) => total + (item.price * item.quantity), 0);
    const deliveryFee = cart.deliveryFee || 0;
    const total = subtotal + deliveryFee;
    return { subtotal, deliveryFee, total };
  };

  const getItemCount = () => {
    if (!cart) return 0;
    return cart.items.reduce((total: number, item: any) => total + item.quantity, 0);
  };

  const clearCart = () => {
    setCart(null);
    localStorage.removeItem('aqraply_cart');
    toast.success('تم إفراغ السلة');
  };

  const value: CartContextType = {
    cart,
    addToCart,
    updateQuantity,
    removeFromCart,
    getTotal,
    getItemCount,
    clearCart
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

// Hook to use cart context
export const useCartContext = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCartContext must be used within a CartProvider');
  }
  return context;
};
