
"use client";

import { useState } from 'react';
import { useCart } from "@/components/cart/CartProvider";
//import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import CheckoutForm from "@/lib/cart/checkoutAction_Add_Form"; 
import { formatCurrency } from "@/utils/formatNumber";


//import { useState } from 'react';
//import { useCart } from "@/components/cart/CartProvider";
import { Minus, Plus, Trash2, ShoppingBag, X, Truck, CreditCard, Headphones } from "lucide-react";
//import { formatCurrency } from "@/utils/formatNumber";

export default function CartPage() {
  const { cart, setCart, fetchCart, loading } = useCart();

  if (loading || !cart) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse text-lg font-medium">Đang tải giỏ hàng...</div>
      </div>
    );
  }

  const subTotal = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discount = 10; // Giả định theo hình
  const total = subTotal - discount;

  async function updateQty(variantId: string, quantity: number) {
    if (quantity < 1) return;
    setCart((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        items: prev.items.map((i) => (i.variant_id === variantId ? { ...i, quantity } : i)),
      };
    });
    await fetch("/api/cart", { method: "PATCH", body: JSON.stringify({ variantId, quantity }) });
    fetchCart();
  }

  async function removeItem(variantId: string) {
    setCart((prev) => {
      if (!prev) return prev;
      return { ...prev, items: prev.items.filter((i) => i.variant_id !== variantId) };
    });
    await fetch("/api/cart", { method: "DELETE", body: JSON.stringify({ variantId }) });
    fetchCart();
  }

  return (
    <div className="bg-white min-h-screen font-sans">
      {/* Header Breadcrumb */}
      <div className="text-center py-10 bg-gray-50 border-b">
        <h1 className="text-4xl font-bold text-gray-800">Shopping Cart</h1>
        <p className="text-gray-500 mt-2 text-sm">Home / Shopping Cart</p>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT: PRODUCT TABLE */}
          <div className="lg:col-span-2 overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[600px] md:min-w-full">
              <thead>
                <tr className="bg-[#F6C636] text-gray-800">
                  <th className="p-4 rounded-tl-xl font-semibold">Product</th>
                  <th className="p-4 font-semibold">Price</th>
                  <th className="p-4 font-semibold">Quantity</th>
                  <th className="p-4 rounded-tr-xl font-semibold">Subtotal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {cart.items.map((item) => (
                  <tr key={item.variant_id} className="group border-b">
                    {/* Info */}
                    <td className="p-4 flex items-center gap-4">
                      <button onClick={() => removeItem(item.variant_id)} className="text-gray-400 hover:text-red-500">
                        <X size={18} />
                      </button>
                      <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                         <img src={item.image || "/placeholder-fruit.png"} alt={item.name} className="object-cover" />
                      </div>
                      <div>
                        <p className="font-bold text-gray-800 leading-tight">{item.name}</p>
                        <p className="text-xs text-gray-400 mt-1">500 g</p>
                      </div>
                    </td>
                    {/* Price */}
                    <td className="p-4 font-bold text-gray-700">{formatCurrency(item.price)}</td>
                    {/* Qty */}
                    <td className="p-4">
                      <div className="flex items-center border border-gray-200 rounded-full w-max px-2 py-1">
                        <button onClick={() => updateQty(item.variant_id, item.quantity - 1)} className="p-1 text-gray-400 hover:text-black">
                          <Minus size={14} />
                        </button>
                        <span className="w-8 text-center text-sm font-bold">{item.quantity}</span>
                        <button onClick={() => updateQty(item.variant_id, item.quantity + 1)} className="p-1 text-gray-400 hover:text-black">
                          <Plus size={14} />
                        </button>
                      </div>
                    </td>
                    {/* Subtotal */}
                    <td className="p-4 font-bold text-gray-800">{formatCurrency(item.price * item.quantity)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Coupon Section */}
            <div className="mt-8 flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex w-full md:w-auto border border-gray-200 rounded-full overflow-hidden">
                <input type="text" placeholder="Coupon Code" className="px-6 py-3 outline-none flex-1 text-sm" />
                <button className="bg-[#1D8252] text-white px-8 py-3 font-semibold text-sm hover:bg-[#166641] transition-colors">
                  Apply Coupon
                </button>
              </div>
              <button className="text-[#1D8252] font-semibold border-b-2 border-[#1D8252] pb-1">
                Clear Shopping Cart
              </button>
            </div>
          </div>

          {/* RIGHT: ORDER SUMMARY */}
          <div className="lg:col-span-1">
            <div className="border border-gray-100 rounded-2xl p-8 bg-white shadow-sm ring-1 ring-gray-900/5">
              <h2 className="text-xl font-bold mb-6 text-gray-800 border-b pb-4">Order Summary</h2>
              <div className="space-y-4 text-gray-500 font-medium">
                <div className="flex justify-between">
                  <span>Items</span>
                  <span className="text-gray-900 font-bold">{cart.items.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Sub Total</span>
                  <span className="text-gray-900 font-bold">{formatCurrency(subTotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="text-gray-900 font-bold">$00.00</span>
                </div>
                <div className="flex justify-between">
                  <span>Taxes</span>
                  <span className="text-gray-900 font-bold">$00.00</span>
                </div>
                <div className="flex justify-between text-red-500">
                  <span>Coupon Discount</span>
                  <span className="font-bold">-${discount}.00</span>
                </div>
                <div className="flex justify-between text-xl border-t pt-6 text-gray-900 font-black">
                  <span>Total</span>
                  <span className="text-[#1D8252]">{formatCurrency(total)}</span>
                </div>
              </div>
              <button className="w-full bg-[#1D8252] text-white rounded-full py-4 mt-8 font-bold hover:bg-[#166641] transition-all shadow-lg shadow-green-100">
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>

        {/* FOOTER INFO */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20 border-t pt-10">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-yellow-100 rounded-xl text-yellow-600"><Truck size={24} /></div>
            <div>
              <h4 className="font-bold text-gray-800">Free Shipping</h4>
              <p className="text-sm text-gray-500">Free shipping for orders above $50</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="p-4 bg-yellow-100 rounded-xl text-yellow-600"><CreditCard size={24} /></div>
            <div>
              <h4 className="font-bold text-gray-800">Flexible Payment</h4>
              <p className="text-sm text-gray-500">Multiple secure payment options</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="p-4 bg-yellow-100 rounded-xl text-yellow-600"><Headphones size={24} /></div>
            <div>
              <h4 className="font-bold text-gray-800">24x7 Support</h4>
              <p className="text-sm text-gray-500">We support online all days.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}




// File gốc
//export default 
function CartPage__() {
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
    <div className="max-w-6xl mx-auto p-1 md:p-6 space-y-8 min-h-screen bg-background text-foreground transition-colors duration-300">
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
  className="flex flex-col gap-2 md:gap-4 bg-card border border-border p-2 md:p-5 rounded-2xl transition-all hover:border-primary/50 group"
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
  <div className="flex items-center justify-between pt-2 border-t border-border/50">
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
            <div className="sticky top-6 p-2 bg-card border border-border rounded-3xl space-y-6 shadow-sm">
              <div className="flex justify-between items-center border-b border-border p-4">
                <span className="opacity-70">Tổng cộng</span>
                <span className="text-3xl font-black text-primary">
                  {formatCurrency(total)}
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



