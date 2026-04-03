"use client";

import { Package, Calendar, Tag, ChevronLeft } from "lucide-react";

export default function SkeletonOrderDetail() {
  const skeletonItems = Array.from({ length: 3 });
  const steps = ["pending", "paid", "shipped", "completed"];

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-8 min-h-screen bg-background">
      
      {/* BACK BUTTON & HEADER SKELETON */}
      <div className="space-y-4 animate-breathe-slow">
        <div className="flex items-center gap-2 opacity-20">
          <ChevronLeft size={16} />
          <div className="h-4 w-32 bg-muted rounded" />
        </div>
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-6">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Package className="text-muted" size={28} />
              <div className="h-8 w-64 bg-muted rounded-lg" />
            </div>
            <div className="flex items-center gap-4">
              <div className="h-4 w-32 bg-muted/60 rounded" />
              <div className="h-4 w-20 bg-muted/60 rounded" />
            </div>
          </div>
          <div className="bg-card border border-border px-6 py-3 rounded-2xl w-40 h-20 shadow-sm flex flex-col justify-center gap-2">
            <div className="h-3 w-full bg-muted/40 rounded" />
            <div className="h-6 w-full bg-primary/20 rounded" />
          </div>
        </div>
      </div>

      {/* TIMELINE SKELETON */}
      <div className="bg-card border border-border rounded-3xl p-6 md:p-10 shadow-sm animate-breathe-slow">
        <div className="relative flex justify-between items-center max-w-4xl mx-auto">
          <div className="absolute top-1/2 left-0 w-full h-1 bg-muted -translate-y-1/2 z-0" />
          {steps.map((_, index) => (
            <div key={index} className="relative z-10 flex flex-col items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-muted border-4 border-background" />
              <div className="h-3 w-12 bg-muted/50 rounded" />
            </div>
          ))}
        </div>
      </div>

      {/* TABLE SKELETON */}
      <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm animate-breathe-slow">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F6C636]/30">
                <th className="p-5 h-12 w-1/2"><div className="h-3 w-20 bg-black/10 rounded" /></th>
                <th className="p-5 h-12 text-center"><div className="h-3 w-16 bg-black/10 rounded mx-auto" /></th>
                <th className="p-5 h-12 text-center"><div className="h-3 w-10 bg-black/10 rounded mx-auto" /></th>
                <th className="p-5 h-12 text-right"><div className="h-3 w-20 bg-black/10 rounded ml-auto" /></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {skeletonItems.map((_, i) => (
                <tr key={i}>
                  <td className="p-5">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-muted rounded-xl flex-shrink-0 animate-pulse" />
                      <div className="space-y-2">
                        <div className="h-4 w-40 bg-muted rounded" />
                        <div className="h-3 w-20 bg-muted/40 rounded" />
                      </div>
                    </div>
                  </td>
                  <td className="p-5"><div className="h-4 w-20 bg-muted rounded mx-auto" /></td>
                  <td className="p-5"><div className="h-4 w-8 bg-muted rounded mx-auto" /></td>
                  <td className="p-5"><div className="h-5 w-24 bg-primary/10 rounded ml-auto" /></td>
                </tr>
              ))}
            </tbody>
            <tfoot>
               <tr className="bg-muted/10">
                  <td colSpan={3} className="p-8 text-right"><div className="h-4 w-32 bg-muted/40 rounded ml-auto" /></td>
                  <td className="p-8 text-right"><div className="h-8 w-32 bg-primary/20 rounded ml-auto" /></td>
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
          </div>
          <div className="p-6 bg-card border border-border rounded-3xl h-32 space-y-4">
             <div className="h-3 w-32 bg-muted/50 rounded" />
             <div className="h-4 w-full bg-muted/20 rounded" />
             <div className="h-4 w-3/4 bg-muted/20 rounded" />
          </div>
      </div>
    </div>
  );
}
