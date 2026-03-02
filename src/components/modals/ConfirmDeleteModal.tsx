// src/components/modals/ConfirmDeleteModal.tsx
'use client';

import { useState } from 'react';
import { createPortal } from 'react-dom';
import { Trash2, AlertTriangle, X } from 'lucide-react';

interface ConfirmDeleteModalProps {
  action: (formData: FormData) => void | Promise<void>;
  todoId: number;
}

export function ConfirmDeleteModal({
  action,
  todoId,
}: ConfirmDeleteModalProps) {
  const [open, setOpen] = useState(false);

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="p-2.5 rounded-xl text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-all duration-300 group"
        title="Xóa nhiệm vụ"
      >
        <Trash2 size={18} className="group-hover:scale-110 transition-transform" />
      </button>
    );
  }

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Overlay mờ phía sau */}
      <div 
        className="absolute inset-0 bg-background/40 backdrop-blur-sm transition-opacity" 
        onClick={() => setOpen(false)} 
      />

      {/* Nội dung Modal */}
      <div className="relative bg-card border border-border rounded-3xl p-6 w-full max-w-[340px] shadow-[0_20px_50px_rgba(0,0,0,0.3)] dark:shadow-[0_20px_50px_rgba(239,68,68,0.1)] overflow-hidden">
        
        {/* Decor: Ánh đỏ mờ ở góc modal */}
        <div className="absolute -top-10 -left-10 w-24 h-24 bg-red-500/10 blur-3xl rounded-full" />

        <div className="flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-500 mb-4">
            <AlertTriangle size={24} />
          </div>

          <h3 className="text-lg font-bold text-foreground mb-2">
            Xác nhận xóa?
          </h3>
          
          <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
            Nhiệm vụ này sẽ biến mất vĩnh viễn khỏi hệ thống Neon.
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <form action={action} onSubmit={() => setOpen(false)}>
            <input type="hidden" name="id" value={todoId} />
            <button
              type="submit"
              className="w-full py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-2xl shadow-[0_0_15px_rgba(239,68,68,0.3)] transition-all active:scale-95"
            >
              Vâng, xóa nó đi
            </button>
          </form>

          <button
            onClick={() => setOpen(false)}
            className="w-full py-3 bg-secondary text-foreground font-medium rounded-2xl hover:bg-muted transition-colors"
          >
            Hủy bỏ
          </button>
        </div>

        {/* Nút đóng góc trên */}
        <button 
          onClick={() => setOpen(false)}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X size={16} />
        </button>
      </div>
    </div>,
    document.body
  );
}
