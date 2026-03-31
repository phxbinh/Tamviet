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
};

export type Cart = {
  cartId: string;
  items: CartItem[];
};

type CartContextType = {
  cart: Cart | null;
  loading: boolean;
  setCart: React.Dispatch<React.SetStateAction<Cart | null>>;
  fetchCart: () => Promise<void>;
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

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        setCart,
        fetchCart,
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