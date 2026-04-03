"use client";

import { Package, Calendar, Tag, ChevronLeft } from "lucide-react";

export default function SkeletonOrderDetail() {
  const skeletonItems = Array.from({ length: 3 });
  const steps = ["pending", "paid", "shipped", "completed"];

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-8 min-h-screen bg-background">
      
      {/* NÚT QUAY LẠI & HEADER SKELETON */}
      <div className="space-y-4 animate-breathe-slow">
        <div className="flex items-center gap-2 opacity-20">
          <ChevronLeft size={16} />
          <div className="h-4 w-32 bg-muted rounded" />
        </div>
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-6">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Package className="text-muted" size={28} />
              <div className="h-9 w-64 bg-muted rounded-lg" />
            </div>
            <div className="flex items-center gap-4">
              <div className="h-4 w-40 bg-muted/40 rounded" />
            </div>
          </div>
          <div className="bg-card border border-border px-6 py-3 rounded-2xl w-44 h-20 shadow-sm flex flex-col justify-center gap-2">
            <div className="h-3 w-1/2 bg-muted/30 rounded" />
            <div className="h-7 w-full bg-primary/10 rounded" />
          </div>
        </div>
      </div>

      {/* TIMELINE SKELETON (FLAT STYLE) */}
      <div className="bg-card border border-border rounded-3xl p-8 md:p-10 animate-breathe-slow">
        <div className="relative flex justify-between items-center max-w-4xl mx-auto px-2">
          {/* Thanh nối nền mỏng 1px */}
          <div className="absolute top-4 left-0 w-full h-[1px] bg-border -translate-y-1/2 z-0" />
          
          {steps.map((_, index) => (
            <div key={index} className="relative z-10 flex flex-col items-center gap-3">
              {/* Dot nhỏ khớp với bản đẹp bạn vừa chọn */}
              <div className="w-8 h-8 rounded-full border border-border bg-card flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-muted/30" />
              </div>
              <div className="h-3 w-12 bg-muted/40 rounded mt-1" />
            </div>
          ))}
        </div>
      </div>

      {/* BẢNG SẢN PHẨM SKELETON */}
      <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm animate-breathe-slow">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F6C636]/40"> {/* Màu vàng nhạt khi loading */}
                <th className="p-5 h-12 w-1/2"><div className="h-3 w-20 bg-black/5 rounded" /></th>
                <th className="p-5 h-12 text-center"><div className="h-3 w-16 bg-black/5 rounded mx-auto" /></th>
                <th className="p-5 h-12 text-center"><div className="h-3 w-10 bg-black/5 rounded mx-auto" /></th>
                <th className="p-5 h-12 text-right"><div className="h-3 w-20 bg-black/5 rounded ml-auto" /></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {skeletonItems.map((_, i) => (
                <tr key={i}>
                  <td className="p-5">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-muted/60 rounded-xl flex-shrink-0 animate-pulse" />
                      <div className="space-y-2">
                        <div className="h-4 w-48 bg-muted/80 rounded" />
                        <div className="h-3 w-24 bg-muted/30 rounded" />
                      </div>
                    </div>
                  </td>
                  <td className="p-5"><div className="h-4 w-20 bg-muted/50 rounded mx-auto" /></td>
                  <td className="p-5"><div className="h-4 w-8 bg-muted/50 rounded mx-auto" /></td>
                  <td className="p-5"><div className="h-5 w-24 bg-primary/5 rounded ml-auto" /></td>
                </tr>
              ))}
            </tbody>
            <tfoot>
               <tr className="bg-muted/10">
                  <td colSpan={3} className="p-8 text-right"><div className="h-4 w-40 bg-muted/30 rounded ml-auto" /></td>
                  <td className="p-8 text-right"><div className="h-8 w-36 bg-primary/10 rounded ml-auto" /></td>
               </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* FOOTER SKELETON */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-breathe-slow">
          <div className="p-6 bg-card border border-border rounded-3xl h-32 space-y-4">
             <div className="h-3 w-24 bg-muted/50 rounded" />
             <div className="h-4 w-full bg-muted/20 rounded" />
             <div className="h-4 w-2/3 bg-muted/20 rounded" />
          </div>
          <div className="p-6 bg-card border border-border rounded-3xl h-32 space-y-4">
             <div className="h-3 w-32 bg-muted/50 rounded" />
             <div className="h-4 w-full bg-muted/20 rounded" />
             <div className="h-4 w-1/2 bg-muted/20 rounded" />
          </div>
      </div>
    </div>
  );
}

