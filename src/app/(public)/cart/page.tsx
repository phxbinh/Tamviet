/*
"use client";

import { useState, useRef } from 'react';
import { useCart } from "@/components/cart/CartProvider";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import CheckoutForm from "@/lib/cart/checkoutAction_Add_Form"; 
import { formatCurrency } from "@/utils/formatNumber";
import { getPublicImageUrl } from '@/lib/supabase/publicUrl';
import Image from "next/image";
import { QuantityController } from "./QuantityController";
import { ConfirmDeleteModal } from "./ConfirmDeleteModal";
//import { useRef } from 'react';
*/


"use client";

import { useState, useRef } from 'react';
import { useCart } from "@/components/cart/CartProvider";
import { ShoppingBag } from "lucide-react";
import CheckoutForm from "@/lib/cart/checkoutAction_Add_Form"; 
import { formatCurrency } from "@/utils/formatNumber";
import { getPublicImageUrl } from '@/lib/supabase/publicUrl';
import Image from "next/image";
import { QuantityController } from "./QuantityController";
import { ConfirmDeleteModal } from "./ConfirmDeleteModal";
import { updateCartAction, removeCartItemAction } from "./actionServer";


export default function CartPage() {
  const { cart, setCart, fetchCart, loading } = useCart();

  if (loading || !cart) {
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

const timerRef = useRef<NodeJS.Timeout | null>(null);

/*
async function updateQty(variantId: string, quantity: number) {
  if (quantity < 1) return;

  // 1. Cập nhật UI ngay lập tức (Optimistic Update)
  setCart((prev) => {
    if (!prev) return prev;
    return {
      ...prev,
      items: prev.items.map((i) =>
        i.variant_id === variantId ? { ...i, quantity } : i
      ),
    };
  });

  // 2. Debounce API: Xóa hẹn giờ cũ, đặt hẹn giờ mới
  if (timerRef.current) clearTimeout(timerRef.current);

  timerRef.current = setTimeout(async () => {
    try {
      await fetch("/api/cart", {
        method: "PATCH",
        body: JSON.stringify({ variantId, quantity }),
      });
      fetchCart(); // Đồng bộ lại dữ liệu chuẩn từ server
    } catch (err) {
      console.error(err);
    }
  }, 500); // Chỉ gửi API nếu người dùng ngừng thao tác 0.5 giây
}
*/


 // Hàm cập nhật số lượng dùng Server Action + FormData
  async function updateQty(variantId: string, quantity: number) {
    if (quantity < 1) return;

    // 1. Cập nhật UI ngay lập tức (Optimistic)
    
      // 2. Debounce Server Action để tránh spam Database
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(async () => {
        const formData = new FormData();
        formData.append("variantId", variantId);
        formData.append("quantity", quantity.toString());
        await updateCartAction(formData);
      }, 500);
    
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
    <div className="max-w-7xl mx-auto p-1 md:p-6 space-y-8 min-h-screen bg-background text-foreground transition-colors duration-300">
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
          
          {/* DANH SÁCH SẢN PHẨM (BẢNG) */}
          <div className="lg:col-span-8 overflow-hidden">
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto border border-border rounded-2xl bg-card">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="p-4 font-semibold text-sm">Sản phẩm</th>
                    <th className="p-4 font-semibold text-sm">Giá</th>
                    <th className="p-4 font-semibold text-sm">Số lượng</th>
                    <th className="p-4 font-semibold text-sm text-right">Tổng</th>
                    <th className="p-4"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {cart.items.map((item) => (
                    <tr key={item.variant_id} className="hover:bg-muted/10 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          {/* Image Placeholder */}
                          <div className="w-12 h-12 relative bg-muted rounded-md flex-shrink-0 border border-border overflow-hidden">
                            {item.image_item ? (
                              <Image
                                src={getPublicImageUrl(item.image_item)}
                                alt={item.name}
                                fill
                                sizes="48px"
                                className="object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">
                                No image
                              </div>
                            )}
                          </div>
                          <span className="font-medium line-clamp-1">{item.name}</span>
                        </div>
                      </td>
                      <td className="p-4 text-sm opacity-80">{formatCurrency(item.price)}</td>
                      <td className="p-4"> 
                          <QuantityController 
                            initialQuantity={item.quantity}
                            onUpdate={(newQty) => updateQty(item.variant_id, newQty)}
                          />

                      </td>
                      <td className="p-4 text-right font-bold text-primary">
                        {formatCurrency(item.price * item.quantity)}
                      </td>
                      <td className="p-4 text-right">
                        <ConfirmDeleteModal 
                          itemId={item.variant_id} // Bạn có thể sửa interface PropsModel để nhận string/number
                          action={() => removeItem(item.variant_id)}
                          title="Gỡ sản phẩm?"
                          description={`Bỏ ${item.name} khỏi giỏ hàng?`}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View (Dành cho màn hình nhỏ) */}
            <div className="md:hidden space-y-4">
              {cart.items.map((item) => (
                <div
                  key={item.variant_id}
                  className="p-4 bg-card border border-border rounded-2xl flex gap-4"
                >
                  {/* 👇 IMAGE LEFT */}
                  <div className="w-12 h-12 relative bg-muted rounded-md flex-shrink-0 border border-border overflow-hidden">
                    {item.image_item ? (
                      <Image
                        src={getPublicImageUrl(item.image_item)}
                        alt={item.name}
                        fill
                        sizes="48px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">
                        No image
                      </div>
                    )}
                  </div>
              
                  {/* 👇 CONTENT RIGHT */}
                  <div className="flex-1 space-y-3">
                    <div className="flex justify-between items-start">
                      <h3 className="font-bold line-clamp-2">{item.name}</h3>
                        <ConfirmDeleteModal 
                          itemId={item.variant_id} // Bạn có thể sửa interface PropsModel để nhận string/number
                          action={() => removeItem(item.variant_id)}
                          title="Gỡ sản phẩm?"
                          description={`Bỏ ${item.name} khỏi giỏ hàng?`}
                        />
                    </div>
              
                    <div className="flex justify-between items-center">
                       <QuantityController 
                          initialQuantity={item.quantity}
                          onUpdate={(newQty) => updateQty(item.variant_id, newQty)}
                        />
              
                      <span className="font-bold text-primary">
                        {formatCurrency(item.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* FORM THANH TOÁN (STICKY) */}
          <div className="lg:col-span-4">
            <div className="sticky top-6 p-6 bg-card border border-border rounded-3xl space-y-6 shadow-sm">
              <div className="flex justify-between items-center border-b border-border pb-4">
                <span className="text-lg opacity-70">Tổng cộng</span>
                <span className="text-3xl font-black text-primary">
                  {formatCurrency(total)}
                </span>
              </div>
              <CheckoutForm /> 
            </div>
          </div>

        </div>
      )}
    </div>
  );
}





