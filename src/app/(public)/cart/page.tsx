"use client";

import { useState } from 'react';
import { useCart } from "@/components/cart/CartProvider";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import CheckoutForm from "@/lib/cart/checkoutAction_Add_Form"; 
import { formatCurrency } from "@/utils/formatNumber";

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
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#050505] text-white/20 uppercase tracking-[0.5em] text-xs">
        <div className="animate-breathe-slow mb-4">Loading Digital Cart</div>
        <div className="w-48 h-[1px] bg-white/5 overflow-hidden">
          <div className="w-full h-full bg-neon-cyan animate-slide-in-from-right-full" />
        </div>
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
    <div className="max-w-[1400px] mx-auto p-6 md:p-12 min-h-screen bg-[#050505] text-white selection:bg-neon-cyan/30">
      
      {/* Minimal Header */}
      <header className="mb-16 flex justify-between items-end">
        <div className="space-y-2">
          <h1 className="text-5xl font-extralight tracking-tighter italic flex items-center gap-4">
            Shopping <span className="text-neon-cyan font-black not-italic">Cart</span>
          </h1>
          <p className="text-[10px] tracking-[0.6em] text-white/30 uppercase pl-1">Selected Essentials / {cart.items.length} Items</p>
        </div>
        <ShoppingBag className="text-white/10 w-12 h-12 mb-2" />
      </header>

      {cart.items.length === 0 ? (
        <div className="h-[40vh] flex flex-col items-center justify-center border border-white/5 rounded-[3rem] bg-white/[0.02]">
          <p className="text-white/20 uppercase tracking-[0.4em] text-sm italic">Empty Repository</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          
          {/* LIST ITEMS - REFINED DESIGN */}
          <div className="lg:col-span-7 space-y-8">
            {cart.items.map((item) => (
              <div
                key={item.variant_id}
                className="group relative flex items-center justify-between pb-8 border-b border-white/5 hover:border-white/20 transition-all duration-700"
              >
                {/* Info Section */}
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-mono text-neon-cyan/50 tracking-tighter">#ID-{item.variant_id.slice(-4)}</span>
                    <h2 className="text-xl font-light tracking-tight group-hover:tracking-wide transition-all duration-500">
                      {item.name}
                    </h2>
                  </div>
                  <p className="text-xs text-white/40 font-light tracking-widest uppercase">
                    {formatCurrency(item.price)}
                  </p>
{/* {item.price.toLocaleString()} VND */}
                </div>

                {/* Interaction Section */}
                <div className="flex items-center gap-12">
                  {/* Quantity - Ultra Slim */}
                  <div className="flex w-[55px] items-center gap-6 group/qty">
                    <button
                      onClick={() => updateQty(item.variant_id, item.quantity - 1)}
                      className="text-white/20 hover:text-neon-cyan transition-colors disabled:opacity-0"
                      disabled={item.quantity <= 1}
                    >
                      <Minus size={12} strokeWidth={1} />
                    </button>
                    <span className="text-sm font-light w-4 text-center tabular-nums">{item.quantity}</span>
                    <button
                      onClick={() => updateQty(item.variant_id, item.quantity + 1)}
                      className="text-white/20 hover:text-neon-cyan transition-colors"
                    >
                      <Plus size={12} strokeWidth={1} />
                    </button>
                  </div>

                  {/* Subtotal - Elegant Bold */}
                  <div className="w-32 text-right">
                    <span className="text-lg font-medium tracking-tighter">
                      {formatCurrency(item.price * item.quantity)}
                    </span>
                    <span className="text-[10px] ml-1 text-white/30 italic">VND</span>
                  </div>

                  {/* Remove - Ghost Style */}
                  <button
                    onClick={() => removeItem(item.variant_id)}
                    className="opacity-0 group-hover:opacity-100 p-2 text-white/20 hover:text-red-500 transition-all duration-500 translate-x-4 group-hover:translate-x-0"
                  >
                    <Trash2 size={16} strokeWidth={1.5} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* CHECKOUT SIDEBAR - GLASSMOPRHISM */}
          <div className="lg:col-span-5 relative">
            <div className="sticky top-12 p-10 rounded-[3rem] bg-white/[0.03] border border-white/10 backdrop-blur-3xl shadow-2xl overflow-hidden group/card">
              {/* Decorative Glow */}
              <div className="absolute -top-24 -right-24 w-64 h-64 bg-neon-cyan/10 blur-[100px] rounded-full group-hover/card:bg-neon-cyan/20 transition-all duration-1000" />
              
              <div className="relative z-10 space-y-10">
                <div className="space-y-4">
                  <p className="text-[10px] tracking-[0.5em] text-white/30 uppercase">Order Summary</p>
                  <div className="flex justify-between items-baseline">
                    <h3 className="text-sm font-light text-white/60">Total Amount</h3>
                    <div className="text-right">
                      <span className="text-4xl font-black italic tracking-tighter text-white">
                        {total.toLocaleString()}
                      </span>
                      <span className="text-xs text-neon-cyan ml-2 tracking-widest">VND</span>
                    </div>
                  </div>
                </div>

                <div className="h-[1px] bg-gradient-to-r from-white/10 via-white/5 to-transparent" />

                {/* Form Integration */}
                <div className="animate-in fade-in slide-in-from-bottom-4">
                   <CheckoutForm /> 
                </div>
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


