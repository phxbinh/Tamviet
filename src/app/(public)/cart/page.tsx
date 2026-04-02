"use client";

import { useState } from 'react';
import { useCart } from "@/components/cart/CartProvider";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import CheckoutForm from "@/lib/cart/checkoutAction_Add_Form"; 
import { formatCurrency } from "@/utils/formatNumber";

export default function CartPage() {
  const { cart, setCart, fetchCart, loading } = useCart();

  if (loading || !cart) {
    return <div className="p-6 text-foreground animate-pulse text-white">Loading...</div>;
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
    <div className="max-w-6xl mx-auto p-6 space-y-8 min-h-screen text-white bg-[#0a0a0a]">
      <header className="flex items-center gap-2 border-b border-white/10 pb-4">
        <ShoppingBag className="text-forest-green" />
        <h1 className="text-3xl font-bold tracking-tight">Giỏ hàng của bạn</h1>
      </header>

      {cart.items.length === 0 ? (
        <div className="text-center py-20 bg-white/5 rounded-3xl border border-white/10">
          <p className="text-gray-500 italic">Giỏ hàng đang trống</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* PHẦN DANH SÁCH SẢN PHẨM (Bên trái - Chiếm 7 cột) */}
          <div className="lg:col-span-7 space-y-4">
            {cart.items.map((item) => (
              <div
                key={item.variant_id}
                className="flex items-center justify-between bg-[#111] border border-white/10 p-5 rounded-2xl transition-all hover:border-forest-green/50 group"
              >
                {/* Info */}
                <div className="flex-1">
                  <h2 className="font-bold text-lg group-hover:text-forest-green transition-colors">
                    {item.name}
                  </h2>
                  <p className="text-sm opacity-70">
                    {formatCurrency(item.price)}
                  </p>
                </div>

                {/* Quantity Control */}
                <div className="flex items-center gap-4 px-4">
                  <div className="flex items-center border border-white/10 rounded-lg bg-black/50">
                    <button
                      onClick={() => updateQty(item.variant_id, item.quantity - 1)}
                      className="p-2 hover:text-forest-green disabled:opacity-30"
                      disabled={item.quantity <= 1}
                    >
                      <Minus size={14} />
                    </button>
                    <span className="w-8 text-center font-medium">{item.quantity}</span>
                    <button
                      onClick={() => updateQty(item.variant_id, item.quantity + 1)}
                      className="p-2 hover:text-forest-green"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>

                {/* Subtotal */}
                <div className="w-32 text-right font-bold text-forest-green">
                  {formatCurrency(item.price * item.quantity)}
                </div>

                {/* Remove Action */}
                <button
                  onClick={() => removeItem(item.variant_id)}
                  className="ml-4 p-2 text-red-500/50 hover:text-red-500 transition-all"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div> {/* ĐÓNG lg:col-span-7 */}

          {/* PHẦN FORM NHẬP TIN & THANH TOÁN (Bên phải - Chiếm 5 cột) */}
          <div className="lg:col-span-5">
            <div className="sticky top-6 p-6 bg-white/5 border border-white/10 rounded-3xl space-y-6">
              <div className="flex justify-between items-center border-b border-white/5 pb-4">
                <span className="text-gray-400">Tổng cộng</span>
                <span className="text-3xl font-black text-forest-green">
                  {total.toLocaleString()}đ
                </span>
              </div>

              {/* Form nhập liệu và nút bấm nằm trong này */}
              <CheckoutForm /> 
            </div>
          </div> {/* ĐÓNG lg:col-span-5 */}

        </div> /* ĐÓNG grid */
      )}
    </div> /* ĐÓNG container chính */
  );
}


