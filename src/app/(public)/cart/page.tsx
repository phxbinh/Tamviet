

"use client";

import { useState } from 'react';
import { useCart } from "@/components/cart/CartProvider";
import { Minus, Plus, Trash2 } from "lucide-react";

export default function CartPage() {
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const { cart, setCart, fetchCart, loading } = useCart();

  if (loading || !cart) {
    return <div className="p-6">Loading...</div>;
  }

  const total = cart.items.reduce<number>(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  async function updateQty(variantId: string, quantity: number) {
    if (quantity < 1) return; // ❗ chặn số âm / 0

    // optimistic UI (safe)
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

    fetchCart(); // sync lại
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

  async function handleCheckout() {
    if (isCheckingOut) return;
  
    setIsCheckingOut(true);
  
    try {
      const res = await fetch("/api/cart/checkout", {
        method: "POST",
      });
  
      const data = await res.json();
  
      if (!res.ok) {
        alert(data.error || "Checkout failed");
        return;
      }
  
      await fetchCart();
  
      //window.location.href = `/order/${data.orderId}`;
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    } finally {
      setIsCheckingOut(false);
    }
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

      {/* Checkout */} {/*
      <button className="w-full bg-black text-white py-3 rounded-xl">
        Checkout
      </button> */}
      <button
        onClick={handleCheckout}
        disabled={cart.items.length === 0 || isCheckingOut}
        className="w-full bg-black text-white py-3 rounded-xl disabled:opacity-50"
      >
        {isCheckingOut ? "Processing..." : "Checkout"}
      </button>

    </div>
  );
}

