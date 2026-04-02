"use client";

import { useState } from 'react';
import { useCart } from "@/components/cart/CartProvider";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { checkoutAction } from "@/lib/cart/checkoutAction";
import CheckoutForm from "@/lib/cart/checkoutAction_Add_Form"; 



/*
"use client";

import { useState } from 'react';
import { useCart } from "@/components/cart/CartProvider";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
// Import cái Form bạn đã có
import CheckoutForm from "@/components/checkout/CheckoutForm"; 
*/




//export default 
function CartPage//() {
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const { cart, setCart, fetchCart, loading } = useCart();

  if (loading || !cart) {
    return <div className="p-6 text-foreground animate-pulse">Loading...</div>;
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

/*
  async function handleCheckout() {
    if (isCheckingOut) return;
    setIsCheckingOut(true);
    try {
      const res = await fetch("/api/cart/checkout", { method: "POST" });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Checkout failed");
        return;
      }
      await fetchCart();
      window.location.href = `/orders/${data.orderId}`;
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    } finally {
      setIsCheckingOut(false);
    }
  }
*/

  async function handleCheckout() {
    if (isCheckingOut) return;
    setIsCheckingOut(true);

    try {
      // GỌI TRỰC TIẾP HÀM SERVER ACTION Ở ĐÂY
      const result = await checkoutAction();

      if (!result.success) {
        alert(result.error);
        return;
      }

      // Nếu thành công, xóa giỏ hàng ở client và chuyển trang
      await fetchCart(); 
      window.location.href = `/orders/${result.orderId}`;
    } catch (err) {
      console.error(err);
      alert("Đã xảy ra lỗi kết nối");
    } finally {
      setIsCheckingOut(false);
    }
  }













  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8 min-h-screen text-foreground">
      <header className="flex items-center gap-2 border-b border-border pb-4">
        <ShoppingBag className="text-primary" />
        <h1 className="text-3xl font-bold tracking-tight">Giỏ hàng</h1>
      </header>

      {cart.items.length === 0 ? (
        <div className="text-center py-20 bg-card rounded-3xl border border-border">
          <p className="text-muted-foreground italic">Giỏ hàng của bạn đang trống</p>
        </div>
      ) : (
        <div className="space-y-4">
          {cart.items.map((item) => (
            <div
              key={item.variant_id}
              className="flex items-center justify-between bg-card border border-border p-5 rounded-2xl transition-all hover:shadow-md hover:border-primary/30 group animate-in fade-in"
            >
              {/* Info */}
              <div className="flex-1">
                <h2 className="font-bold text-lg group-hover:text-primary transition-colors">
                  {item.name}
                </h2>
                <p className="text-sm opacity-70">
                  {item.price.toLocaleString()}đ
                </p>
              </div>

              {/* Quantity Control */}
              <div className="flex items-center gap-4 px-4">
                <div className="flex items-center border border-border rounded-lg bg-background/50">
                  <button
                    onClick={() => updateQty(item.variant_id, item.quantity - 1)}
                    className="p-2 hover:text-primary transition-colors disabled:opacity-30"
                    disabled={item.quantity <= 1}
                  >
                    <Minus size={14} />
                  </button>
                  <span className="w-8 text-center font-medium">{item.quantity}</span>
                  <button
                    onClick={() => updateQty(item.variant_id, item.quantity + 1)}
                    className="p-2 hover:text-primary transition-colors"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>

              {/* Subtotal */}
              <div className="w-32 text-right font-bold text-primary">
                {(item.price * item.quantity).toLocaleString()}đ
              </div>

              {/* Remove Action */}
              <button
                onClick={() => removeItem(item.variant_id)}
                className="ml-4 p-2 text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-full transition-all"
                title="Xóa khỏi giỏ hàng"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}

          {/* Checkout Section */}
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
                ${isCheckingOut 
                  ? "bg-primary/50 cursor-not-allowed animate-breathe-slow" 
                  : "bg-primary hover:scale-[1.01] active:scale-[0.98] shadow-lg shadow-primary/20"
                } disabled:opacity-50`}
            >
              {isCheckingOut ? (
                <span className="flex items-center justify-center gap-2">
                   Đang xử lý...
                </span>
              ) : (
                "Thanh toán ngay"
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}









// @/app/cart/page.tsx
/*
"use client";

import { useState } from 'react';
import { useCart } from "@/components/cart/CartProvider";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
// Import cái Form bạn đã có
import CheckoutForm from "@/components/checkout/CheckoutForm"; 
*/



export default function CartPage() {
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const { cart, setCart, fetchCart, loading } = useCart();

  if (loading || !cart) {
    return <div className="p-6 text-foreground animate-pulse">Loading...</div>;
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
    <div className="max-w-4xl mx-auto p-6 space-y-8 min-h-screen text-white bg-[#0a0a0a]">
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
          
          {/* PHẦN DANH SÁCH SẢN PHẨM (Bên trái) */}
          <div className="lg:col-span-7 space-y-4">
            {cart.items.map((item) => (
              <div key={item.variant_id} className="flex items-center justify-between bg-white/5 border border-white/10 p-4 rounded-2xl">
                 <div className="flex-1">
                    <h2 className="font-bold">{item.name}</h2>
                    <p className="text-sm text-gray-400">{item.price.toLocaleString()}đ</p>
                 </div>
                 {/* Quantity controls ... */}
                 <button onClick={() => removeItem(item.variant_id)} className="text-red-500/50 hover:text-red-500 ml-4">
                    <Trash2 size={18} />
                 </button>
              </div>
            ))}
          </div>

          {/* PHẦN FORM NHẬP TIN & THANH TOÁN (Bên phải) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 bg-white/5 border border-white/10 rounded-3xl">
              <div className="flex justify-between items-center mb-6">
                <span className="text-gray-400">Tổng cộng</span>
                <span className="text-2xl font-black text-forest-green">{total.toLocaleString()}đ</span>
              </div>

              {/* DÙNG LUÔN CÁI FORM BẠN ĐÃ VIẾT Ở ĐÂY */}
              <CheckoutForm /> 
              
            </div>
          </div>

        </div>
      )}
    </div>
  );
}







