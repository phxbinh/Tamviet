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
      <div className="max-w-md mx-auto p-4 space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-16 w-full bg-muted animate-pulse rounded-xl" />
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
    <div className="max-w-2xl mx-auto min-h-screen bg-background flex flex-col relative border-x border-border/50">
      {/* Header - p-4 thay vì p-6, font-size hạ xuống lg */}
      <header className="p-4 flex items-center justify-between sticky top-0 bg-background/80 backdrop-blur-xl z-30 border-b border-border/40">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-primary/10 rounded-lg">
            <ShoppingBag className="text-primary" size={18} />
          </div>
          <h1 className="text-lg font-black tracking-tight uppercase">Giỏ hàng</h1>
        </div>
        <span className="text-[10px] font-bold px-2.5 py-0.5 bg-secondary text-secondary-foreground rounded-full border border-border/50">
          {cart.items.length} món
        </span>
      </header>

      {/* List Items - px-4, space-y-2 giúp layout khít hơn, giảm rời rạc */}
      <div className="flex-1 px-4 py-2 space-y-2 overflow-y-auto pb-40 custom-scrollbar">
        <AnimatePresence mode="popLayout">
          {cart.items.map((item) => (
            <motion.div
              key={item.variant_id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, x: -20 }}
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
          <div className="py-20 text-center text-xs opacity-40 font-medium italic">Giỏ hàng đang trống...</div>
        )}
      </div>

      {/* Sticky Footer - Cố định dưới đáy màn hình */}
      <footer className="fixed bottom-0 left-0 right-0 max-w-2xl mx-auto p-4 md:p-6 border-t border-border bg-background/95 backdrop-blur-md z-30 shadow-[0_-10px_30px_-15px_rgba(0,0,0,0.1)]">
        <div className="flex justify-between items-center mb-4 px-1">
          <span className="text-[10px] font-bold opacity-60 uppercase tracking-[0.2em]">Tổng tiền thanh toán</span>
          <span className="text-xl font-black text-primary tracking-tighter">
            {total.toLocaleString()}đ
          </span>
        </div>

        <button
          onClick={() => !isCheckingOut && cart.items.length > 0 && alert("Checkout!")}
          disabled={cart.items.length === 0 || isCheckingOut}
          className="w-full h-12 bg-primary text-primary-foreground rounded-xl font-bold uppercase text-[11px] tracking-[0.15em] flex items-center justify-center gap-2 shadow-lg shadow-primary/20 active:scale-[0.98] transition-all disabled:opacity-50 disabled:grayscale"
        >
          {isCheckingOut ? "Đang xử lý..." : "Thanh toán ngay"}
          {!isCheckingOut && <ArrowRight size={14} />}
        </button>
        
        {/* Safe Area cho iPhone (nếu cần) */}
        <div className="h-[safe-area-inset-bottom] w-full" />
      </footer>
    </div>
  );
}
