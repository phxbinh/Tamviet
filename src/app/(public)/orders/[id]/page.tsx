// src/app/(public)/orders/[id]/page.tsx
/*
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import OrderDetailSkeleton from "@/components/order/OrderDetailSkeleton";

export default function OrderDetailPage() {
  const params = useParams();
  const id = params?.id as string;

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    let isMounted = true;

    fetch(`/api/order/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (isMounted) setOrder(data);
      })
      .catch((err) => {
        console.error(err);
        if (isMounted) setOrder(null);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [id]);

  if (loading) return <div className="p-6">Loading...</div>;

  if (!order || order.error) {
    return <div className="p-6">Order not found</div>;
  }

  const statusColor: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-700",
    paid: "bg-green-100 text-green-700",
    shipped: "bg-blue-100 text-blue-700",
    completed: "bg-gray-200 text-gray-700",
  };

  const steps = ["pending", "paid", "shipped", "completed"];

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold">
            Order #{order.id.slice(0, 8)}
          </h1>
          <p className="text-sm text-gray-500">
            {new Date(order.created_at).toLocaleString()}
          </p>
        </div>

        <span
          className={`px-3 py-1 rounded-full text-sm font-medium ${
            statusColor[order.status] || "bg-gray-100"
          }`}
        >
          {order.status}
        </span>
      </div>

  
      <div className="border rounded-xl p-4">
        <p className="font-semibold mb-3">Order Status</p>

        <div className="flex justify-between text-sm">
          {steps.map((step) => {
            const isActive = step === order.status;

            return (
              <div
                key={step}
                className={`flex flex-col items-center flex-1 ${
                  isActive ? "text-black font-semibold" : "text-gray-400"
                }`}
              >
                <div
                  className={`w-3 h-3 rounded-full mb-1 ${
                    isActive ? "bg-black" : "bg-gray-300"
                  }`}
                />
                {step}
              </div>
            );
          })}
        </div>
      </div>


      <div className="border rounded-xl p-4 space-y-4">
        <p className="font-semibold">Items</p>

        {order.items?.map((item: any) => (
          <div
            key={item.variant_id}
            className="flex justify-between border p-3 rounded-lg"
          >
            <div>
              <p className="font-medium">{item.name}</p>
              <p className="text-sm text-gray-500">
                x{item.quantity}
              </p>
            </div>

            <div className="text-right">
              <p>
                {Number(item.price_at_time).toLocaleString()}đ
              </p>
              <p className="font-semibold">
                {(
                  Number(item.price_at_time) * item.quantity
                ).toLocaleString()}
                đ
              </p>
            </div>
          </div>
        ))}
      </div>


      <div className="border rounded-xl p-4 space-y-2">
        <div className="flex justify-between">
          <span>Total</span>
          <span className="font-bold text-lg">
            {Number(order.total_price).toLocaleString()}đ
          </span>
        </div>
      </div>
    </div>
  );
}

*/



"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ChevronLeft, Package, Calendar, Tag, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { formatCurrency } from "@/utils/formatNumber";
import SkeletonOrderDetail from "./SkeletonOrderDetail";
import { getPublicImageUrl } from '@/lib/supabase/publicUrl';
import Image from "next/image";

export default function OrderDetailPage() {
  const params = useParams();
  const id = params?.id as string;

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    let isMounted = true;
    fetch(`/api/order/${id}`)
      .then((res) => res.json())
      .then((data) => { if (isMounted) setOrder(data); })
      .catch(() => { if (isMounted) setOrder(null); })
      .finally(() => { if (isMounted) setLoading(false); });
    return () => { isMounted = false; };
  }, [id]);

  if (loading) return (
    <SkeletonOrderDetail/>
  );

  if (!order || order.error) return (
    <div className="max-w-4xl mx-auto p-20 text-center border border-border rounded-3xl mt-10">
      <p className="text-muted-foreground">Không tìm thấy đơn hàng.</p>
      <Link href="/orders" className="text-primary font-bold mt-4 inline-block underline">Quay lại danh sách</Link>
    </div>
  );

  const steps = ["pending", "paid", "shipped", "completed"];
  const currentStepIndex = steps.indexOf(order.status);

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-8 min-h-screen bg-background text-foreground transition-colors duration-300">
      
      {/* NÚT QUAY LẠI & HEADER */}
      <div className="space-y-4">
        <Link href="/orders" className="inline-flex items-center gap-2 text-sm font-bold opacity-60 hover:opacity-100 transition-opacity">
          <ChevronLeft size={16} /> Quay lại danh sách
        </Link>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-6">
          <div className="space-y-1">
            {/*<h1 className="text-3xl font-black tracking-tight uppercase flex items-center gap-3">
              <Package className="text-primary" /> Đơn hàng #{order.id.slice(0, 8).toUpperCase()}
            </h1>*/}
            <h1 className="text-xl font-black tracking-tight uppercase flex items-center gap-3">
              <Package className="text-primary" /> Đơn hàng #{order.order_id.toUpperCase()}
            </h1>
            <div className="flex items-center gap-4 text-sm opacity-60 font-medium">
              <span className="flex items-center gap-1"><Calendar size={14} /> {new Date(order.created_at).toLocaleString('vi-VN')}</span>
              <span className="flex items-center gap-1 uppercase tracking-tighter"><Tag size={14} /> {order.status}</span>
            </div>
          </div>
          <div className="bg-card border border-border px-6 py-3 rounded-2xl shadow-sm self-start">
             <p className="text-xs opacity-50 font-bold uppercase tracking-widest mb-1">Tổng thanh toán</p>
             <p className="text-2xl font-black text-primary">{Number(order.total_price).toLocaleString()}đ</p>
          </div>
        </div>
      </div>

      {/* TIMELINE TRẠNG THÁI */}
      <div className="bg-card border border-border rounded-3xl p-8 md:p-10 animate-in fade-in">
        <div className="relative flex justify-between items-center max-w-4xl mx-auto px-2">
          
          {/* Thanh nối nền */}
          <div className="absolute top-4 left-0 w-full h-[1px] bg-border -translate-y-1/2 z-0" />
          
          {/* Thanh nối active */}
          <div 
            className="absolute top-4 left-0 h-[1px] bg-primary -translate-y-1/2 z-0 transition-all duration-700" 
            style={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
          />

          {steps.map((step, index) => {
            const isCompleted = index <= currentStepIndex;

            return (
              <div key={step} className="relative z-10 flex flex-col items-center gap-3">
                {/* Dot/Icon */}
                <div 
                  className={`
                    w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-300
                    border bg-card
                    ${isCompleted 
                      ? 'border-primary text-primary' 
                      : 'border-border text-muted-foreground/30'
                    }
                  `}
                >
                  {isCompleted ? (
                    <CheckCircle2 size={16} />
                  ) : (
                    <div className="w-1.5 h-1.5 rounded-full bg-current" />
                  )}
                </div>

                {/* Text Label */}
                <span className={`
                  text-[10px] font-bold uppercase tracking-wider
                  ${isCompleted ? 'text-foreground' : 'text-muted-foreground opacity-40'}
                `}>
                  {step}
                </span>
              </div>
            );
          })}
        </div>
      </div>



      {/* BẢNG SẢN PHẨM */}
      <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm animate-in fade-in">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F6C636] text-black">
                <th className="p-5 font-bold text-xs uppercase tracking-widest">Sản phẩm</th>
                <th className="p-5 font-bold text-xs uppercase tracking-widest text-center">Đơn giá</th>
                <th className="p-5 font-bold text-xs uppercase tracking-widest text-center">Số lượng</th>
                <th className="p-5 font-bold text-xs uppercase tracking-widest text-right">Thành tiền</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {order.items?.map((item: any) => (
                <tr key={item.variant_id} className="hover:bg-background/50 transition-colors">
                  <td className="p-5">
                    <div className="flex items-center gap-4">
                      
<div className="w-14 h-14 relative bg-muted rounded-xl flex-shrink-0 border border-border overflow-hidden">
  {item.image_item ? (
    <Image
      src={getPublicImageUrl(item.image_item)}
      alt={item.name}
      fill
      sizes="56px"
      className="object-cover"
    />
  ) : (
    <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">
      No image
    </div>
  )}
</div>
                      <div>
                        <p className="font-bold text-gray-800 dark:text-gray-200 leading-tight">{item.name}</p>
                        <p className="text-[10px] opacity-50 uppercase mt-1 font-bold">Variant: {item.variant_id.slice(0, 5)}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-5 text-center font-medium opacity-70">
                    {Number(item.price_at_time).toLocaleString()}đ
                  </td>
                  <td className="p-5 text-center font-black">
                    x{item.quantity}
                  </td>
                  <td className="p-5 text-right font-black text-primary text-lg">
                    {(Number(item.price_at_time) * item.quantity).toLocaleString()}đ
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
               <tr className="bg-muted/30">
                  <td colSpan={3} className="p-5 text-right font-bold uppercase text-xs opacity-60">Thành tiền đơn hàng</td>
                  <td className="p-5 text-right font-black text-2xl text-primary">
                    {Number(order.total_price).toLocaleString()}đ
                  </td>
               </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* FOOTER ĐƠN HÀNG */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 bg-card border border-border rounded-3xl">
             <h3 className="font-black uppercase text-xs tracking-widest mb-4 opacity-50">Ghi chú đơn hàng</h3>
             <p className="text-sm italic opacity-70">Không có ghi chú nào cho đơn hàng này.</p>
          </div>
          <div className="p-6 bg-[#F6C636]/10 border border-[#F6C636]/20 rounded-3xl">
             <h3 className="font-black uppercase text-xs tracking-widest mb-4 text-[#F6C636]">Hỗ trợ khách hàng</h3>
             <p className="text-sm font-medium">Nếu có bất kỳ thắc mắc nào về đơn hàng, vui lòng liên hệ hotline 1900-XXXX để được hỗ trợ nhanh nhất.</p>
          </div>
      </div>
    </div>
  );
}










