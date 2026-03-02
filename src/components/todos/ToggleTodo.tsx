// src/components/todos/ToggleTodo.tsx
'use client';

import { Check, Loader2 } from "lucide-react";
import { useTransition } from 'react';
import { toggleTodoAction } from '@/actions/todos/actions';

export function ToggleTodo({ id, completed }: { id: number; completed: boolean }) {
  const [isPending, startTransition] = useTransition();

  const handleToggle = () => {
    startTransition(async () => {
      const formData = new FormData();
      formData.append('id', id.toString());
      try {
        await toggleTodoAction(formData);
      } catch (err) {
        console.error('Toggle failed', err);
      }
    });
  };

  return (
    <button
      onClick={handleToggle}
      disabled={isPending}
      /* QUAN TRỌNG: 
        1. shrink-0: Ngăn không cho flexbox bóp nghẹt hoặc kéo giãn nút.
        2. aspect-square: Đảm bảo tỉ lệ 1:1 (luôn luôn tròn).
        3. self-start: (Tùy chọn) Giúp nút luôn nằm ở đầu dòng thay vì nhảy vào giữa khi text quá dài.
      */
      className={`relative flex items-center justify-center w-6 h-6 shrink-0 aspect-square rounded-full border-2 transition-all duration-300 self-start mt-1 ${
        completed 
        ? 'border-neon-cyan bg-neon-cyan/20 shadow-[0_0_10px_#22d3ee]' 
        : 'border-muted-foreground/30 hover:border-neon-cyan'
      }`}
    >
      {isPending ? (
        <Loader2 size={14} className="animate-spin text-neon-purple" />
      ) : (
        completed && <Check size={14} className="text-neon-cyan stroke-[3px]" />
      )}
    </button>
  );
}










