
"use client";

import { useState } from 'react';
import { useCart } from "@/components/cart/CartProvider";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import CheckoutForm from "@/lib/cart/checkoutAction_Add_Form"; 
import { formatCurrency } from "@/utils/formatNumber";

export default function CartPage() {
  const { cart, setCart, fetchCart, loading } = useCart();

  if (loading || !cart) {
    // Sử dụng text-foreground và animate-breathe-slow từ cấu hình Số 2
    return (
      <div className="p-6 text-foreground animate-breathe-slow flex items-center justify-center min-h-screen">
        Đang tải giỏ hàng...
      </div>
    );
  }

  const total = cart.items.reduce<number>(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  async function updateQty(variantId: string, quantity: number) {
    if (quantity < 1) return;
    setCart((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        items: prev.items.map((i) =>
          i.variant_id === variantId ? { ...i, quantity } : i
        ),
      };
    });

    try {
      await fetch("/api/cart", {
        method: "PATCH",
        body: JSON.stringify({ variantId, quantity }),
      });
    } catch (err) {
      console.error(err);
    }
    fetchCart();
  }

  async function removeItem(variantId: string) {
    setCart((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        items: prev.items.filter((i) => i.variant_id !== variantId),
      };
    });

    try {
      await fetch("/api/cart", {
        method: "DELETE",
        body: JSON.stringify({ variantId }),
      });
    } catch (err) {
      console.error(err);
    }
    fetchCart();
  }

  return (
    // bg-background và text-foreground lấy từ định nghĩa :root/dark của Số 2
    <div className="max-w-6xl mx-auto p-6 space-y-8 min-h-screen bg-background text-foreground transition-colors duration-300">
      <header className="flex items-center gap-2 border-b border-border pb-4">
        <ShoppingBag className="text-primary" />
        <h1 className="text-3xl font-bold tracking-tight">Giỏ hàng của bạn</h1>
      </header>

      {cart.items.length === 0 ? (
        <div className="text-center py-20 bg-card rounded-3xl border border-border animate-in fade-in">
          <p className="text-muted-foreground italic">Giỏ hàng đang trống</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* DANH SÁCH SẢN PHẨM */}
          <div className="lg:col-span-7 space-y-4">
            {cart.items.map((item) => (
<div
  key={item.variant_id}
  className="flex flex-col gap-4 bg-card border border-border p-5 rounded-2xl transition-all hover:border-primary/50 group"
>
  {/* HÀNG TRÊN: Info */}
  <div className="flex justify-between items-start">
    <div className="flex-1">
      <h2 className="font-bold text-lg group-hover:text-primary transition-colors line-clamp-1">
        {item.name}
      </h2>
      <p className="text-sm opacity-70">
        Đơn giá: {formatCurrency(item.price)}
      </p>
    </div>
    
    {/* Nút xóa được đưa lên góc trên hoặc để dưới tùy ý, ở đây tôi để ở góc để hàng dưới thoáng hơn */}
    <button
      onClick={() => removeItem(item.variant_id)}
      className="p-2 text-red-500/50 hover:text-red-500 transition-all hover:animate-shake"
    >
      <Trash2 size={18} />
    </button>
  </div>

  {/* HÀNG DƯỚI: Phần còn lại (Quantity, Subtotal) */}
  <div className="flex items-center justify-between pt-4 border-t border-border/50">
    {/* Quantity Control */}
    <div className="flex items-center border border-border rounded-lg bg-background/50 scale-90 origin-left">
      <button
        onClick={() => updateQty(item.variant_id, item.quantity - 1)}
        className="p-2 hover:text-primary disabled:opacity-30 disabled:hover:text-foreground"
        disabled={item.quantity <= 1}
      >
        <Minus size={14} />
      </button>
      <span className="w-8 text-center font-medium">{item.quantity}</span>
      <button
        onClick={() => updateQty(item.variant_id, item.quantity + 1)}
        className="p-2 hover:text-primary"
      >
        <Plus size={14} />
      </button>
    </div>

    {/* Subtotal */}
    <div className="text-right">
      <span className="text-xs opacity-50 block">Thành tiền</span>
      <span className="font-bold text-primary text-lg">
        {formatCurrency(item.price * item.quantity)}
      </span>
    </div>
  </div>
</div>

            ))}
          </div>

          {/* FORM THANH TOÁN */}
          <div className="lg:col-span-5">
            <div className="sticky top-6 p-6 bg-card border border-border rounded-3xl space-y-6 shadow-sm">
              <div className="flex justify-between items-center border-b border-border pb-4">
                <span className="opacity-70">Tổng cộng</span>
                <span className="text-3xl font-black text-primary">
                  {total.toLocaleString()}đ
                </span>
              </div>

              {/* Form nhập liệu */}
              <div className="animate-in fade-in">
                <CheckoutForm /> 
              </div>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}



