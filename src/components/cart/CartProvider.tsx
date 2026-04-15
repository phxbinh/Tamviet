"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

/* =========================
   TYPES
========================= */

export type CartItem = {
  variant_id: string;
  name: string;
  price: number;
  quantity: number;
  image_item?: string;
};

export type Cart = {
  cartId: string;
  items: CartItem[];
  totalQuantity?: number;
};

type CartContextType = {
  cart: Cart | null;
  loading: boolean;
  setCart: React.Dispatch<React.SetStateAction<Cart | null>>;
  fetchCart: () => Promise<void>;
  addItemOptimistic?: (newItem: CartItem) => void; 
};

/* =========================
   CONTEXT
========================= */

const CartContext = createContext<CartContextType | null>(null);

/* =========================
   PROVIDER
========================= */

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);

  async function fetchCart() {
    try {
      const res = await fetch("/api/cart");

      if (!res.ok) {
        throw new Error("Failed to fetch cart");
      }

      const data: Cart = await res.json();
      setCart(data);
    } catch (err) {
      console.error("Cart fetch error:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchCart();
  }, []);

    // Hàm xử lý cập nhật UI tức thì
  const addItemOptimistic = (newItem: CartItem) => {
    setCart((prev) => {
      // Nếu chưa có giỏ hàng, tạo mới với item này
      if (!prev) {
        return {
          cartId: "optimistic-id",
          items: [newItem],
          totalQuantity: newItem.quantity,
        };
      }

      // Kiểm tra xem variant này đã có trong giỏ chưa
      const existingItemIndex = prev.items.findIndex(
        (item) => item.variant_id === newItem.variant_id
      );

      let newItems = [...prev.items];

      if (existingItemIndex > -1) {
        // Nếu có rồi thì tăng số lượng tại chỗ
        const existingItem = newItems[existingItemIndex];
        newItems[existingItemIndex] = {
          ...existingItem,
          quantity: existingItem.quantity + newItem.quantity,
        };
      } else {
        // Nếu chưa có thì thêm mới vào mảng
        newItems.push(newItem);
      }

      // Tính toán lại tổng số lượng hiển thị trên Badge Navbar
      const newTotalQuantity = newItems.reduce((sum, item) => sum + item.quantity, 0);

      return {
        ...prev,
        items: newItems,
        totalQuantity: newTotalQuantity,
      };
    });
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        setCart,
        fetchCart,
        addItemOptimistic,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

/* =========================
   HOOK
========================= */

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }

  return context;
}