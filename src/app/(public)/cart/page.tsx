"use client";

import { useState } from 'react';
import { useCart } from "@/components/cart/CartProvider";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";

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

  // Logic update/remove giữ nguyên nhưng tối ưu fetchCart()
  async function updateQty(variantId: string, quantity: number) {
    if (quantity < 1) return;
    setCart((prev) => {
      if (!prev) return prev;
      return { ...prev, items: prev.items.map((i) => i.variant_id === variantId ? { ...i, quantity } : i) };
    });
    try {
      await fetch("/api/cart", { method: "PATCH", body: JSON.stringify({ variantId, quantity }) });
      fetchCart();
    } catch (err) { console.error(err); }
  }

  async function removeItem(variantId: string) {
    setCart((prev) => {
      if (!prev) return prev;
      return { ...prev, items: prev.items.filter((i) => i.variant_id !== variantId) };
    });
    try {
      await fetch("/api/cart", { method: "DELETE", body: JSON.stringify({ variantId }) });
      fetchCart();
    } catch (err) { console.error(err); }
  }

  return (
    <div className="w-full max-w-md md:max-w-2xl mx-auto min-h-screen bg-background flex flex-col border-x border-border/40">
      {/* Header - Nhỏ gọn, sticky */}
      <header className="p-4 flex items-center justify-between sticky top-0 bg-background/80 backdrop-blur-md z-20 border-b border-border/50">
        <div className="flex items-center gap-2">
          <ShoppingBag size={18} className="text-primary" />
          <h1 className="text-base font-black uppercase tracking-tight">Giỏ hàng</h1>
        </div>
        <span className="text-[10px] font-bold px-2 py-0.5 bg-secondary rounded-full">
          {cart.items.length} món
        </span>
      </header>

      <div className="flex-1 p-4 space-y-3">
        {cart.items.length === 0 ? (
          <div className="py-20 text-center opacity-40 text-xs italic">Giỏ hàng trống</div>
        ) : (
          cart.items.map((item) => (
            <div
              key={item.variant_id}
              className="flex items-center gap-3 bg-card border border-border p-3 rounded-xl transition-all"
            >
              {/* Info - Text nhỏ lại */}
              <div className="flex-1 min-w-0">
                <h2 className="font-bold text-sm truncate uppercase tracking-tight leading-tight">
                  {item.name}
                </h2>
                <p className="text-[11px] font-semibold text-primary/80 mt-0.5">
                  {item.price.toLocaleString()}đ
                </p>
              </div>

              {/* Quantity Control - Co lại cực khít */}
              <div className="flex items-center border border-border/60 rounded-md bg-background/50 h-8">
                <button
                  onClick={() => updateQty(item.variant_id, item.quantity - 1)}
                  className="w-7 h-full flex items-center justify-center hover:bg-secondary disabled:opacity-20"
                  disabled={item.quantity <= 1}
                >
                  <Minus size={12} />
                </button>
                <span className="w-5 text-center text-[11px] font-bold">{item.quantity}</span>
                <button
                  onClick={() => updateQty(item.variant_id, item.quantity + 1)}
                  className="w-7 h-full flex items-center justify-center hover:bg-secondary"
                >
                  <Plus size={12} />
                </button>
              </div>

              {/* Remove */}
              <button
                onClick={() => removeItem(item.variant_id)}
                className="p-1.5 text-muted-foreground hover:text-red-500 transition-colors"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))
        )}
      </div>

      {/* Checkout Section - Gọn gàng ở đáy */}
      <footer className="p-4 border-t border-border bg-card/30 mt-auto">
        <div className="flex justify-between items-center mb-4 px-1">
          <span className="text-[10px] font-bold opacity-50 uppercase tracking-widest">Tổng cộng</span>
          <span className="text-xl font-black text-primary">
            {total.toLocaleString()}đ
          </span>
        </div>

        <button
          onClick={() => !isCheckingOut && cart.items.length > 0 && alert("Checkout!")}
          disabled={cart.items.length === 0 || isCheckingOut}
          className="w-full h-12 bg-primary text-primary-foreground rounded-xl font-bold uppercase text-[11px] tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-primary/10 active:scale-[0.98] transition-all disabled:opacity-50"
        >
          {isCheckingOut ? "Đang xử lý..." : "Thanh toán ngay"}
          {!isCheckingOut && <ArrowRight size={14} />}
        </button>
      </footer>
    </div>
  );
}
