"use client";

import { useState } from 'react';
import { Minus, Plus, Trash2, ChevronLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ItemProps {
  item: any;
  onUpdateQty: (id: string, qty: number) => void;
  onRemove: (id: string) => void;
}

export function CartItem({ item, onUpdateQty, onRemove }: ItemProps) {
  const [showDelete, setShowDelete] = useState(false);

  return (
    <div className="relative overflow-hidden rounded-2xl bg-background group select-none">
      {/* Lớp nền đỏ và nút xóa nằm cố định bên dưới */}
      <div 
        className="absolute inset-0 bg-red-500 flex justify-end items-center px-6 cursor-pointer"
        onClick={() => onRemove(item.variant_id)}
      >
        <div className="flex flex-col items-center text-white gap-1">
          <Trash2 size={20} className="animate-bounce" />
          <span className="text-[10px] font-bold uppercase tracking-wider">Xóa</span>
        </div>
      </div>

      {/* Nội dung sản phẩm trượt lên trên */}
      <motion.div
        animate={{ x: showDelete ? -80 : 0 }}
        transition={{ type: "spring", stiffness: 400, damping: 35 }}
        onClick={() => setShowDelete(!showDelete)}
        className="relative z-10 flex items-center gap-4 bg-card border border-border p-4 rounded-2xl cursor-pointer"
      >
        {/* Info */}
        <div className="flex-1 min-w-0">
          <h2 className="font-bold text-base text-foreground truncate uppercase tracking-tight">
            {item.name}
          </h2>
          <p className="text-sm font-medium text-primary">
            {item.price.toLocaleString()}đ
          </p>
        </div>

        {/* Quantity - Ngăn chặn sụ kiện click lan ra ngoài để không bị đóng/mở nút xóa vô ý */}
        <div 
          className="flex items-center border border-border rounded-lg bg-background"
          onClick={(e) => e.stopPropagation()} 
        >
          <button
            onClick={() => onUpdateQty(item.variant_id, item.quantity - 1)}
            className="p-1.5 hover:bg-secondary transition-colors disabled:opacity-20"
            disabled={item.quantity <= 1}
          >
            <Minus size={14} />
          </button>
          <span className="w-6 text-center text-xs font-bold">{item.quantity}</span>
          <button
            onClick={() => onUpdateQty(item.variant_id, item.quantity + 1)}
            className="p-1.5 hover:bg-secondary transition-colors"
          >
            <Plus size={14} />
          </button>
        </div>

        {/* Indicator cho người dùng biết có thể vuốt/bấm */}
        <div className="text-muted-foreground/30">
          <ChevronLeft size={16} className={showDelete ? "rotate-180 transition-transform" : ""} />
        </div>
      </motion.div>
    </div>
  );
}
