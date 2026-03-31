
/*
'use client'
import React from 'react';
import { ShoppingBag, X, Plus, Minus, Trash2 } from 'lucide-react';
import Image from 'next/image'


const CartComponent = () => {
  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-md bg-card border-l border-border h-full shadow-2xl flex flex-col animate-in slide-in-from-right-full">
        

        <div className="p-4 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-primary animate-breathe-slow" />
            <h2 className="font-semibold text-lg uppercase tracking-wider">Giỏ hàng</h2>
          </div>
          <button className="p-2 hover:bg-foreground/5 rounded-full transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        
        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-6">
          {[1, 2].map((item) => (
            <div key={item} className="flex gap-4 group">
              <div className="relative w-24 h-24 bg-foreground/5 rounded-xl overflow-hidden border border-border">
                <Image 
                  src="https://defkqhylqphoqiikvbii.supabase.co/storage/v1/object/public/products/cafe.webp" 
                  alt="Sản phẩm"
                  className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-500"
                  width={400} 
                  height={400} 
                  priority
                />
              </div>
              <div className="flex-1 flex flex-col justify-between py-1">
                <div>
                  <h3 className="font-medium text-sm line-clamp-1">Cà phê Arabica Cầu Đất</h3>
                  <p className="text-xs text-foreground/60 mt-1">250g | Rang vừa</p>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center border border-border rounded-lg bg-background">
                    <button className="p-1.5 hover:text-primary"><Minus className="w-3.5 h-3.5" /></button>
                    <span className="px-3 text-sm font-medium">1</span>
                    <button className="p-1.5 hover:text-primary"><Plus className="w-3.5 h-3.5" /></button>
                  </div>
                  <span className="font-semibold text-sm text-neon-cyan">250.000đ</span>
                </div>
              </div>
            </div>
          ))}
        </div>

   
        <div className="p-6 border-t border-border bg-background/50 backdrop-blur-md">
          <div className="flex justify-between mb-4">
            <span className="text-foreground/60">Tổng cộng</span>
            <span className="font-bold text-xl text-primary">500.000đ</span>
          </div>
          <button className="w-full py-4 bg-primary text-white rounded-2xl font-bold uppercase tracking-widest hover:shadow-[0_0_20px_rgba(var(--primary),0.4)] transition-all active:scale-95">
            Thanh toán ngay
          </button>
          <p className="text-[10px] text-center mt-4 text-foreground/40 uppercase tracking-tighter">
            Miễn phí vận chuyển cho đơn hàng từ 1.000.000đ
          </p>
        </div>
      </div>
    </div>
  );
};

export default function Cart() {
  return (
   <CartComponent />
  );
}
*/

"use client";

import { useCart } from "@/components/CartProvider";
import { Minus, Plus, Trash2 } from "lucide-react";

export default function CartPage() {
  const { cart, setCart, fetchCart } = useCart();

  if (!cart) return <div className="p-6">Loading...</div>;

  const total = cart.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  async function updateQty(variantId: string, quantity: number) {
    // optimistic UI
    setCart((prev) => ({
      ...prev,
      items: prev.items.map((i) =>
        i.variant_id === variantId ? { ...i, quantity } : i
      ),
    }));

    await fetch("/api/cart", {
      method: "PATCH",
      body: JSON.stringify({ variantId, quantity }),
    });

    fetchCart(); // sync lại
  }

  async function removeItem(variantId: string) {
    setCart((prev) => ({
      ...prev,
      items: prev.items.filter((i) => i.variant_id !== variantId),
    }));

    await fetch("/api/cart", {
      method: "DELETE",
      body: JSON.stringify({ variantId }),
    });

    fetchCart();
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Cart</h1>

      {cart.items.length === 0 && <p>Cart is empty</p>}

      {cart.items.map((item) => (
        <div
          key={item.variant_id}
          className="flex items-center justify-between border p-4 rounded-xl"
        >
          {/* Info */}
          <div>
            <h2 className="font-semibold">{item.name}</h2>
            <p className="text-sm text-gray-500">
              {item.price.toLocaleString()}đ
            </p>
          </div>

          {/* Quantity */}
          <div className="flex items-center gap-2">
            <button
              onClick={() =>
                updateQty(item.variant_id, item.quantity - 1)
              }
              className="p-2 border rounded"
            >
              <Minus size={16} />
            </button>

            <span>{item.quantity}</span>

            <button
              onClick={() =>
                updateQty(item.variant_id, item.quantity + 1)
              }
              className="p-2 border rounded"
            >
              <Plus size={16} />
            </button>
          </div>

          {/* Price */}
          <div className="w-24 text-right font-semibold">
            {(item.price * item.quantity).toLocaleString()}đ
          </div>

          {/* Remove */}
          <button
            onClick={() => removeItem(item.variant_id)}
            className="text-red-500"
          >
            <Trash2 size={18} />
          </button>
        </div>
      ))}

      {/* Total */}
      <div className="flex justify-between items-center border-t pt-4">
        <span className="font-semibold">Total</span>
        <span className="text-xl font-bold">
          {total.toLocaleString()}đ
        </span>
      </div>

      {/* Checkout */}
      <button className="w-full bg-black text-white py-3 rounded-xl">
        Checkout
      </button>
    </div>
  );
}



