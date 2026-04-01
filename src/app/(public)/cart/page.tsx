"use client";

import { useState } from 'react';
import { useCart } from "@/components/cart/CartProvider";
import { ShoppingBag, ArrowRight } from "lucide-react";
import { CartItem } from "./_componentsCart/CartItem_";
import { AnimatePresence, motion } from "framer-motion";

export default function CartPage() {
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const { cart, setCart, fetchCart, loading } = useCart();

  if (loading || !cart) {
    return (
      <div className="max-w-md mx-auto p-6 space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-20 w-full bg-muted animate-pulse rounded-2xl" />
        ))}
      </div>
    );
  }

  const total = cart.items.reduce<number>((sum, item) => sum + item.price * item.quantity, 0);

  const updateQty = async (variantId: string, quantity: number) => {
    if (quantity < 1) return;
    setCart((prev) => {
      if (!prev) return prev;
      return { ...prev, items: prev.items.map((i) => i.variant_id === variantId ? { ...i, quantity } : i) };
    });
    try {
      await fetch("/api/cart", { method: "PATCH", body: JSON.stringify({ variantId, quantity }) });
    } catch (err) { console.error(err); }
  };

  const removeItem = async (variantId: string) => {
    setCart((prev) => {
      if (!prev) return prev;
      return { ...prev, items: prev.items.filter((i) => i.variant_id !== variantId) };
    });
    try {
      await fetch("/api/cart", { method: "DELETE", body: JSON.stringify({ variantId }) });
      fetchCart();
    } catch (err) { console.error(err); }
  };

  return (
    <div className="max-w-2xl mx-auto min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="p-6 flex items-center justify-between sticky top-0 bg-background/80 backdrop-blur-md z-20">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <ShoppingBag className="text-primary" size={24} />
          </div>
          <h1 className="text-xl font-black tracking-tight uppercase">Giỏ hàng</h1>
        </div>
        <span className="text-xs font-bold px-3 py-1 bg-secondary rounded-full">
          {cart.items.length} món
        </span>
      </header>

      {/* List Items */}
      <div className="flex-1 px-6 space-y-3 custom-scrollbar">
        <AnimatePresence mode="popLayout">
          {cart.items.map((item) => (
            <motion.div
              key={item.variant_id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, x: -50 }}
              transition={{ duration: 0.2 }}
            >
              <CartItem 
                item={item} 
                onUpdateQty={updateQty} 
                onRemove={removeItem} 
              />
            </motion.div>
          ))}
        </AnimatePresence>

        {cart.items.length === 0 && (
          <div className="py-20 text-center opacity-40 italic">Giỏ hàng đang trống...</div>
        )}
      </div>

      {/* Sticky Footer - Tránh lỗi tràn */}
      <footer className="p-6 border-t border-border bg-card/50 mt-auto">
        <div className="flex justify-between items-end mb-4">
          <span className="text-sm font-bold opacity-50 uppercase tracking-widest">Tổng cộng</span>
          <span className="text-2xl font-black text-primary">
            {total.toLocaleString()}đ
          </span>
        </div>

        <button
          onClick={() => !isCheckingOut && cart.items.length > 0 && alert("Checkout!")}
          disabled={cart.items.length === 0 || isCheckingOut}
          className="w-full h-14 bg-primary text-primary-foreground rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl shadow-primary/20 active:scale-95 transition-all disabled:opacity-50 disabled:grayscale"
        >
          {isCheckingOut ? "Đang xử lý..." : "Thanh toán"}
          {!isCheckingOut && <ArrowRight size={18} />}
        </button>
      </footer>
    </div>
  );
}