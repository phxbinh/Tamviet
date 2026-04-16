
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


/*
const { addItemOptimistic, fetchCart } = useCart();

  // Cập nhật ui cho cart (quantity)
  //const { addItemOptimistic, fetchCart } = useCart(); 

  // Khai báo để sử dụng tròn hàm
  const { showToast } = useToastStore();
  
  const selectedVariant = useMemo(() => {
    if (Object.keys(selected).length < attributes.length) return null;
    
    // Thêm "|| null" ở cuối để biến undefined thành null
    return variants.find((v) =>
      Object.entries(selected).every(([key, value]) => v.attributes[key] === value)
    ) || null; 
  }, [selected, variants, attributes.length]);
  
  async function handleAddToCart() {
    if (!selectedVariant) return;
    // 1. Cập nhật UI ngay lập tức (Mất ~0ms)
    const optimisticItem = {
      variant_id: selectedVariant.id,
      name: product.name,
      price: selectedVariant.price,
      quantity: 1
      //image_item: selectedVariant.variant_image || data.images[0]?.image_url
    };
    
    addItemOptimistic(optimisticItem);
    setIsAdding(true); // Hiệu ứng loading trên nút vẫn giữ để tạo cảm giác chắc chắn
    // Gọi ở handlerClick trong CTA
    showToast(`Đã thêm sản phẩm thành công!`, "success");

    // 2. Gọi Server Action chạy ngầm
    const result = await addToCartAction(selectedVariant.id, 1);
    await fetchCart();
    if (!result.success) {
      // 3. Nếu lỗi thì fetch lại bản chuẩn từ DB để sửa sai cho UI
      await fetchCart();
      alert("Không thể thêm vào giỏ hàng, vui lòng thử lại!");
    }

    setTimeout(() => setIsAdding(false), 500);
  }
*/



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

/*
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
*/


const timerRef = useRef<NodeJS.Timeout | null>(null);

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
                      <td className="p-4"> {/*
                        <div className="flex items-center border border-border rounded-lg w-fit bg-background">
                          <button
                            onClick={() => updateQty(item.variant_id, item.quantity - 1)}
                            className="p-2 hover:text-primary disabled:opacity-30"
                            disabled={item.quantity <= 1}
                          >
                            <Minus size={14} />
                          </button>
                          <span className="w-8 text-center text-sm font-bold">{item.quantity}</span>
                          <button
                            onClick={() => updateQty(item.variant_id, item.quantity + 1)}
                            className="p-2 hover:text-primary"
                          >
                            <Plus size={14} />
                          </button>
                        </div> */}

                          <QuantityController 
                            initialQuantity={item.quantity}
                            onUpdate={(newQty) => updateQty(item.variant_id, newQty)}
                          />

                      </td>
                      <td className="p-4 text-right font-bold text-primary">
                        {formatCurrency(item.price * item.quantity)}
                      </td>
                      <td className="p-4 text-right"> {/*
                        <button
                          onClick={() => removeItem(item.variant_id)}
                          className="p-2 text-red-500/50 hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>*/}
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
{/*
                      <button
                        onClick={() => removeItem(item.variant_id)}
                        className="text-red-500/50"
                      >
                        <Trash2 size={18} />
                      </button>
*/}

                        <ConfirmDeleteModal 
                          itemId={item.variant_id} // Bạn có thể sửa interface PropsModel để nhận string/number
                          action={() => removeItem(item.variant_id)}
                          title="Gỡ sản phẩm?"
                          description={`Bỏ ${item.name} khỏi giỏ hàng?`}
                        />



                    </div>
              
                    <div className="flex justify-between items-center"> {/*
                      <div className="flex items-center border border-border rounded-lg bg-background">
                        <button
                          onClick={() =>
                            updateQty(item.variant_id, item.quantity - 1)
                          }
                          className="p-2"
                          disabled={item.quantity <= 1}
                        >
                          <Minus size={12} />
                        </button>
              
                        <span className="px-2 text-sm">{item.quantity}</span>
              
                        <button
                          onClick={() =>
                            updateQty(item.variant_id, item.quantity + 1)
                          }
                          className="p-2"
                        >
                          <Plus size={12} />
                        </button>
                      </div> */}
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




