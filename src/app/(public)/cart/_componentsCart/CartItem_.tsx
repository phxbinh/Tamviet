"use client";

import { useState } from 'react';
import { Minus, Plus, Trash2, ChevronLeft } from "lucide-react";
import { motion } from "framer-motion";

interface ItemProps {
  item: any;
  onUpdateQty: (id: string, qty: number) => void;
  onRemove: (id: string) => void;
}

export function CartItem({ item, onUpdateQty, onRemove }: ItemProps) {
  const [showDelete, setShowDelete] = useState(false);

  return (
    <div className="relative overflow-hidden rounded-xl bg-red-500 group select-none">
      {/* Lớp nền xóa nằm dưới */}
      <button 
        onClick={() => onRemove(item.variant_id)}
        className="absolute inset-0 flex justify-end items-center px-5 text-white gap-1"
      >
        <div className="flex flex-col items-center">
          <Trash2 size={18} />
          <span className="text-[9px] font-black uppercase">Xóa</span>
        </div>
      </button>

      {/* Nội dung sản phẩm - p-3 thay vì p-4 */}
      <motion.div
        animate={{ x: showDelete ? -70 : 0 }}
        transition={{ type: "spring", stiffness: 400, damping: 40 }}
        onClick={() => setShowDelete(!showDelete)}
        className="relative z-10 flex items-center gap-3 bg-card border border-border p-3 rounded-xl cursor-pointer"
      >
        {/* Info - Font chữ nhỏ lại */}
        <div className="flex-1 min-w-0">
          <h2 className="font-bold text-sm text-foreground truncate leading-tight uppercase tracking-tight">
            {item.name}
          </h2>
          <p className="text-xs font-semibold text-primary/80 mt-0.5">
            {item.price.toLocaleString()}đ
          </p>
        </div>

        {/* Quantity Controls - Compact hơn */}
        <div 
          className="flex items-center border border-border/60 rounded-md bg-background/50 h-8"
          onClick={(e) => e.stopPropagation()} 
        >
          <button
            onClick={() => onUpdateQty(item.variant_id, item.quantity - 1)}
            className="w-7 h-full flex items-center justify-center hover:bg-secondary disabled:opacity-20"
            disabled={item.quantity <= 1}
          >
            <Minus size={12} />
          </button>
          <span className="w-5 text-center text-[11px] font-bold">{item.quantity}</span>
          <button
            onClick={() => onUpdateQty(item.variant_id, item.quantity + 1)}
            className="w-7 h-full flex items-center justify-center hover:bg-secondary"
          >
            <Plus size={12} />
          </button>
        </div>

        {/* Indicator */}
        <div className="text-muted-foreground/20">
          <ChevronLeft size={14} className={showDelete ? "rotate-180 transition-transform" : ""} />
        </div>
      </motion.div>
    </div>
  );
}
