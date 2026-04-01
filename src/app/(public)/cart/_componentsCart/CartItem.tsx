"use client";

import { Minus, Plus, Trash2 } from "lucide-react";
import { motion, useMotionValue, useTransform } from "framer-motion";

interface ItemProps {
  item: any;
  onUpdateQty: (id: string, qty: number) => void;
  onRemove: (id: string) => void;
}

export function CartItem({ item, onUpdateQty, onRemove }: ItemProps) {
  const x = useMotionValue(0);
  // Khi vuốt sang trái (x < 0), màu nền phía sau sẽ dần hiện rõ
  const opacity = useTransform(x, [-100, -50, 0], [1, 0.5, 0]);

  return (
    <div className="relative overflow-hidden rounded-2xl bg-red-500">
      {/* Nút Delete ẩn phía dưới */}
      <div className="absolute inset-0 flex justify-end items-center pr-6">
        <motion.button
          style={{ opacity }}
          onClick={() => onRemove(item.variant_id)}
          className="flex flex-col items-center text-white"
        >
          <Trash2 size={24} />
          <span className="text-xs font-bold">Xóa</span>
        </motion.button>
      </div>

      {/* Nội dung sản phẩm - Có thể kéo */}
      <motion.div
        drag="x"
        dragConstraints={{ left: -100, right: 0 }}
        dragElastic={0.1}
        style={{ x }}
        className="relative flex items-center justify-between bg-card border border-border p-5 rounded-2xl transition-shadow hover:shadow-md group z-10 touch-pan-y"
      >
        <div className="flex-1">
          <h2 className="font-bold text-lg group-hover:text-primary transition-colors line-clamp-1">
            {item.name}
          </h2>
          <p className="text-sm opacity-70">
            {item.price.toLocaleString()}đ
          </p>
        </div>

        <div className="flex items-center gap-3 px-4">
          <div className="flex items-center border border-border rounded-lg bg-background/50">
            <button
              onClick={() => onUpdateQty(item.variant_id, item.quantity - 1)}
              className="p-2 hover:text-primary disabled:opacity-30"
              disabled={item.quantity <= 1}
            >
              <Minus size={14} />
            </button>
            <span className="w-8 text-center font-medium">{item.quantity}</span>
            <button
              onClick={() => onUpdateQty(item.variant_id, item.quantity + 1)}
              className="p-2 hover:text-primary"
            >
              <Plus size={14} />
            </button>
          </div>
        </div>

        <div className="w-24 text-right font-bold text-primary">
          {(item.price * item.quantity).toLocaleString()}đ
        </div>
      </motion.div>
    </div>
  );
}
