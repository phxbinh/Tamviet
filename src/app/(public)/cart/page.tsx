"use client";

import { useState } from 'react';
import { useCart } from "@/components/cart/CartProvider";
import { ShoppingBag } from "lucide-react";
import { CartItem } from "./componentsCart/CartItem"; // Import component vừa tạo
import { AnimatePresence, motion } from "framer-motion";

export default function CartPage() {
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const { cart, setCart, fetchCart, loading } = useCart();

  if (loading || !cart) {
    return <div className="p-6 text-foreground animate-pulse">Đang tải giỏ hàng...</div>;
  }

  const total = cart.items.reduce<number>(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const updateQty = async (variantId: string, quantity: number) => {
    if (quantity < 1) return;
    setCart((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        items: prev.items.map((i) => i.variant_id === variantId ? { ...i, quantity } : i),
      };
    });
    try {
      await fetch("/api/cart", { method: "PATCH", body: JSON.stringify({ variantId, quantity }) });
      fetchCart();
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

  const handleCheckout = async () => {
    if (isCheckingOut) return;
    setIsCheckingOut(true);
    try {
      const res = await fetch("/api/cart/checkout", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      window.location.href = `/orders/${data.orderId}`;
    } catch (err: any) {
      alert(err.message || "Lỗi thanh toán");
    } finally { setIsCheckingOut(false); }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8 min-h-screen text-foreground">
      <header className="flex items-center gap-2 border-b border-border pb-4">
        <ShoppingBag className="text-primary" />
        <h1 className="text-3xl font-bold tracking-tight">Giỏ hàng</h1>
      </header>

      {cart.items.length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20 bg-card rounded-3xl border border-border">
          <p className="text-muted-foreground italic">Giỏ hàng trống</p>
        </motion.div>
      ) : (
        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {cart.items.map((item) => (
              <motion.div
                key={item.variant_id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, x: -100 }}
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

          <div className="mt-10 p-6 bg-card border border-border rounded-3xl space-y-6 shadow-sm">
            <div className="flex justify-between items-center">
              <span className="text-lg font-medium opacity-80">Tổng cộng</span>
              <span className="text-3xl font-black text-primary">
                {total.toLocaleString()}đ
              </span>
            </div>

            <button
              onClick={handleCheckout}
              disabled={cart.items.length === 0 || isCheckingOut}
              className={`w-full py-4 rounded-2xl font-bold text-white transition-all 
                ${isCheckingOut ? "bg-primary/50 animate-pulse" : "bg-primary shadow-lg shadow-primary/20 hover:brightness-110"}`}
            >
              {isCheckingOut ? "Đang xử lý..." : "Thanh toán ngay"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
