"use client";

import { Calendar, ShoppingBag } from "lucide-react";

export default function SkeletonOrders() {
  // Tạo mảng giả lập 5 dòng skeleton
  const skeletonRows = Array.from({ length: 5 });

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-8 min-h-screen bg-background text-foreground">
      {/* Header Skeleton */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-6 animate-breathe-slow">
        <div className="space-y-2">
          <div className="h-9 w-64 bg-muted rounded-lg" />
          <div className="h-4 w-48 bg-muted/60 rounded" />
        </div>
        <div className="h-10 w-24 bg-card border border-border rounded-2xl shadow-sm" />
      </header>

      <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
        {/* DESKTOP SKELETON */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F6C636]/50"> {/* Màu vàng nhạt hơn khi đang load */}
                <th className="p-5 h-14 font-bold text-xs uppercase tracking-widest text-black/20">Mã đơn</th>
                <th className="p-5 h-14 font-bold text-xs uppercase tracking-widest text-black/20">Ngày đặt</th>
                <th className="p-5 h-14 font-bold text-xs uppercase tracking-widest text-black/20">Trạng thái</th>
                <th className="p-5 h-14 font-bold text-xs uppercase tracking-widest text-right text-black/20">Tổng tiền</th>
                <th className="p-5 h-14"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {skeletonRows.map((_, i) => (
                <tr key={i} className="animate-breathe-slow" style={{ animationDelay: `${i * 150}ms` }}>
                  <td className="p-5">
                    <div className="h-5 w-24 bg-muted rounded animate-pulse" />
                  </td>
                  <td className="p-5">
                    <div className="flex items-center gap-2">
                      <Calendar size={14} className="opacity-20" />
                      <div className="h-4 w-20 bg-muted/70 rounded" />
                    </div>
                  </td>
                  <td className="p-5">
                    <div className="h-6 w-20 bg-muted/50 rounded-full" />
                  </td>
                  <td className="p-5">
                    <div className="flex justify-end">
                      <div className="h-6 w-28 bg-primary/20 rounded" />
                    </div>
                  </td>
                  <td className="p-5">
                    <div className="flex justify-end">
                      <div className="h-9 w-24 bg-foreground/10 rounded-xl" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* MOBILE SKELETON */}
        <div className="md:hidden divide-y divide-border">
          {skeletonRows.map((_, i) => (
            <div key={i} className="p-5 space-y-4 animate-breathe-slow">
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <div className="h-5 w-20 bg-primary/20 rounded" />
                  <div className="h-3 w-24 bg-muted rounded" />
                </div>
                <div className="text-right space-y-2">
                  <div className="h-6 w-24 bg-muted rounded" />
                  <div className="h-3 w-12 bg-muted/50 rounded ml-auto" />
                </div>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-border/50">
                <div className="h-3 w-32 bg-muted/30 rounded italic" />
                <div className="h-4 w-4 bg-muted rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
