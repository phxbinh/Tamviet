"use client";

import { useState } from 'react';
import { useCart } from "@/components/cart/CartProvider";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import CheckoutForm from "@/lib/cart/checkoutAction_Add_Form"; 

/*
"use client";

import { useCart } from "@/components/cart/CartProvider";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import CheckoutForm from "@/lib/cart/checkoutAction_Add_Form"; 
*/


export default function CartPage() {
  const { cart, setCart, fetchCart, loading } = useCart();

  if (loading || !cart) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background text-foreground animate-pulse">
        <p className="tracking-widest uppercase text-sm">Đang tải giỏ hàng...</p>
      </div>
    );
  }

  const total = cart.items.reduce<number>((sum, item) => sum + item.price * item.quantity, 0);

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
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-10 min-h-screen animate-in fade-in">
      {/* Header với phong cách tối giản */}
      <header className="flex items-center gap-4 border-b border-border pb-6">
        <div className="p-3 bg-neon-cyan/10 rounded-2xl">
          <ShoppingBag className="text-neon-cyan w-8 h-8" />
        </div>
        <div>
          <h1 className="text-4xl font-black tracking-tighter uppercase italic">Giỏ hàng</h1>
          <p className="text-muted-foreground text-xs tracking-[0.3em] uppercase">Tâm Việt / Store</p>
        </div>
      </header>

      {cart.items.length === 0 ? (
        <div className="text-center py-32 bg-card border border-border rounded-[2rem] shadow-2xl">
          <p className="text-muted-foreground italic tracking-widest uppercase text-sm">Giỏ hàng của bạn đang trống</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* DANH SÁCH SẢN PHẨM (Lấy tone dark/light từ theme) */}
          <div className="lg:col-span-7 space-y-6">
            {cart.items.map((item) => (
              <div
                key={item.variant_id}
                className="flex flex-col md:flex-row items-center justify-between bg-card border border-border p-6 rounded-[1.5rem] transition-all hover:border-neon-cyan/40 group relative overflow-hidden"
              >
                {/* Background trang trí ẩn */}
                <div className="absolute -right-4 -bottom-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                   <ShoppingBag size={120} />
                </div>

                <div className="flex-1 space-y-1 z-10">
                  <h2 className="font-bold text-xl group-hover:text-neon-cyan transition-colors tracking-tight">
                    {item.name}
                  </h2>
                  <p className="text-sm font-mono opacity-60 italic">
                    {item.price.toLocaleString()}đ
                  </p>
                </div>

                <div className="flex items-center gap-8 mt-4 md:mt-0 z-10">
                  {/* Quantity Control */}
                  <div className="flex items-center border border-border rounded-xl bg-background overflow-hidden h-11">
                    <button
                      onClick={() => updateQty(item.variant_id, item.quantity - 1)}
                      className="px-4 hover:bg-neon-cyan/10 hover:text-neon-cyan transition-all disabled:opacity-20"
                      disabled={item.quantity <= 1}
                    >
                      <Minus size={14} />
                    </button>
                    <span className="w-10 text-center font-bold text-sm">{item.quantity}</span>
                    <button
                      onClick={() => updateQty(item.variant_id, item.quantity + 1)}
                      className="px-4 hover:bg-neon-cyan/10 hover:text-neon-cyan transition-all"
                    >
                      <Plus size={14} />
                    </button>
                  </div>

                  {/* Subtotal */}
                  <div className="w-28 text-right font-black text-lg text-neon-cyan">
                    {(item.price * item.quantity).toLocaleString()}đ
                  </div>

                  {/* Remove */}
                  <button
                    onClick={() => removeItem(item.variant_id)}
                    className="p-3 text-red-500/40 hover:text-red-500 hover:bg-red-500/10 rounded-full transition-all"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* CHECKOUT FORM (Sử dụng Glassmorphism từ biến màu của bạn) */}
          <div className="lg:col-span-5 sticky top-8">
            <div className="p-8 bg-card border border-border rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] space-y-8 relative overflow-hidden">
              {/* Ánh sáng neon trang trí phía sau */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-neon-cyan/10 blur-[60px] -z-10" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-neon-purple/10 blur-[60px] -z-10" />

              <div className="space-y-4">
                <div className="flex justify-between items-end">
                  <span className="text-muted-foreground uppercase tracking-[0.2em] text-[10px] font-bold">Tổng thanh toán</span>
                  <span className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan to-neon-purple italic">
                    {total.toLocaleString()}đ
                  </span>
                </div>
                <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-border to-transparent" />
              </div>

              {/* Tích hợp Form */}
              <div className="animate-in fade-in slide-in-from-right-full duration-700">
                 <CheckoutForm /> 
              </div>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}






//export default 
function CartPage__() {
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
                    {item.price.toLocaleString()}đ
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
                  {(item.price * item.quantity).toLocaleString()}đ
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


