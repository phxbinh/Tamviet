"use client";

import { useState } from 'react';
import { useCart } from "@/components/cart/CartProvider";
import { ShoppingBag, ArrowRight } from "lucide-react";
import { CartItem } from "./_componentsCart/CartItem_";
import { AnimatePresence, motion } from "framer-motion";

export default function CartPage() {
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const { cart, setCart, fetchCart, loading } = useCart();

  // Skeleton thu gọn lại
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

  // ... (Logic updateQty, removeItem giữ nguyên)

  return (
    <div className="w-full max-w-md md:max-w-2xl mx-auto min-h-screen bg-background flex flex-col border-x border-border/50">
      {/* Header - p-4 thay vì p-6 */}
      <header className="p-4 flex items-center justify-between sticky top-0 bg-background/80 backdrop-blur-md z-20">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-primary/10 rounded-md">
            <ShoppingBag className="text-primary" size={18} />
          </div>
          <h1 className="text-lg font-black tracking-tight uppercase">Giỏ hàng</h1>
        </div>
        <span className="text-[10px] font-bold px-2 py-0.5 bg-secondary rounded-full">
          {cart.items.length} món
        </span>
      </header>

      {/* List Items - p-4 thay vì p-6, space-y-2 khít hơn */}
      <div className="flex-1 px-4 space-y-2 overflow-y-auto">
        <AnimatePresence mode="popLayout">
          {cart.items.map((item) => (
            <motion.div
              key={item.variant_id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.15 }}
            >
              <CartItem item={item} onUpdateQty={updateQty} onRemove={removeItem} />
            </motion.div>
          ))}
        </AnimatePresence>

        {cart.items.length === 0 && (
          <div className="py-12 text-center text-xs opacity-40 italic">Giỏ hàng trống</div>
        )}
      </div>

      {/* Footer - Siết lại padding và font */}
      <footer className="p-4 border-t border-border bg-card/30 mt-auto md:mb-4 md:rounded-2xl md:mx-4">
        <div className="flex justify-between items-center mb-3 px-1">
          <span className="text-[10px] font-bold opacity-50 uppercase tracking-widest">Tổng tiền</span>
          <span className="text-xl font-black text-primary">
            {total.toLocaleString()}đ
          </span>
        </div>

        <button
          onClick={() => !isCheckingOut && cart.items.length > 0 && alert("Checkout!")}
          disabled={cart.items.length === 0 || isCheckingOut}
          className="w-full h-12 bg-primary text-primary-foreground rounded-xl font-bold uppercase text-[11px] tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-primary/10 active:scale-[0.98] transition-all disabled:opacity-50"
        >
          {isCheckingOut ? "Xử lý..." : "Thanh toán ngay"}
          {!isCheckingOut && <ArrowRight size={14} />}
        </button>
      </footer>
    </div>
  );
}
