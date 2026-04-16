'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useFormStatus } from 'react-dom';
import { Trash2, AlertTriangle, X, Loader2 } from 'lucide-react';

interface PropsModel {
  action: (formData: FormData) => void | Promise<void>;
  todoId: number;
  title?: string;
  description?: string;
}

/**
 * Component con để xử lý trạng thái Loading của Form
 */
function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full py-3 bg-red-500 hover:bg-red-600 disabled:bg-red-400 text-white font-bold rounded-2xl shadow-[0_0_15px_rgba(239,68,68,0.3)] transition-all active:scale-95 flex items-center justify-center gap-2"
    >
      {pending ? (
        <>
          <Loader2 size={18} className="animate-spin" />
          Đang xử lý...
        </>
      ) : (
        'Vâng, xóa nó đi'
      )}
    </button>
  );
}

export function ConfirmDeleteModal({
  action,
  todoId,
  title = "Xác nhận xóa?",
  description = "Nhiệm vụ này sẽ biến mất vĩnh viễn khỏi hệ thống."
}: PropsModel) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Tránh lỗi Hydration Mismatch khi dùng Portal
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!open || !mounted) {
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
      {/* Overlay: Click ra ngoài để đóng */}
      <div 
        className="absolute inset-0 bg-background/60 backdrop-blur-sm animate-in fade-in duration-300" 
        onClick={() => setOpen(false)} 
      />

      {/* Modal Content */}
      <div className="relative bg-card border border-border rounded-3xl p-6 w-full max-w-[340px] shadow-2xl animate-in zoom-in-95 duration-200">
        
        {/* Decor Light Effect */}
        <div className="absolute -top-10 -left-10 w-24 h-24 bg-red-500/10 blur-3xl rounded-full pointer-events-none" />

        <div className="flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-500 mb-4">
            <AlertTriangle size={24} />
          </div>

          <h3 className="text-lg font-bold text-foreground mb-2">
            {title}
          </h3>
          
          <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
            {description}
          </p>
        </div>

        <div className="flex flex-col gap-2">
          {/* Tận dụng Server Action qua Form */}
          <form 
            action={async (formData) => {
              await action(formData);
              setOpen(false); // Chỉ đóng modal sau khi action thực thi xong
            }}
          >
            <input type="hidden" name="id" value={todoId} />
            <SubmitButton />
          </form>

          <button
            type="button"
            onClick={() => setOpen(false)}
            className="w-full py-3 bg-secondary text-foreground font-medium rounded-2xl hover:bg-muted transition-colors"
          >
            Hủy bỏ
          </button>
        </div>

        {/* Nút đóng góc trên */}
        <button 
          onClick={() => setOpen(false)}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors p-1"
        >
          <X size={18} />
        </button>
      </div>
    </div>,
    document.body
  );
}
