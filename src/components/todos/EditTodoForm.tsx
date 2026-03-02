"use client";

import { useToastStore } from "@/store/useToastStore";
import { updateTodoAction, deleteTodoFromDetail } from '@/actions/todos/actions';
import { ConfirmDeleteModal } from '@/components/modals/ConfirmDeleteModal';
import { Save, Info } from 'lucide-react';
import { useTransition } from "react";

export function EditTodoForm({ todo }: { todo: any }) {
  const showToast = useToastStore((state) => state.showToast);
  const [isPending, startTransition] = useTransition();

  // Hàm xử lý submit phía Client
  async function handleSubmit(formData: FormData) {
    startTransition(async () => {
      try {
        await updateTodoAction(formData);
        showToast("Đã cập nhật nhiệm vụ thành công! ✨", "success");
      } catch (error) {
        showToast("Có lỗi xảy ra, vui lòng thử lại!", "error");
      }
    });
  }

  return (
    <div className="relative p-8 rounded-3xl bg-card/50 backdrop-blur-xl border border-border shadow-2xl">
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-neon-cyan/10 blur-[50px] rounded-full pointer-events-none" />

      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-3 text-foreground">
          <Info className="text-neon-cyan" size={24} />
          Chi tiết nhiệm vụ
        </h1>
        
        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
          todo.completed 
          ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-500' 
          : 'bg-amber-500/10 border-amber-500/50 text-amber-500'
        }`}>
          {todo.completed ? 'Hoàn thành' : 'Đang xử lý'}
        </span>
      </div>

      <form action={handleSubmit} className="space-y-6">
        <input type="hidden" name="id" value={todo.id} />
        
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground ml-1">
            Tiêu đề nhiệm vụ
          </label>
          <input
            name="title"
            defaultValue={todo.title}
            required
            className="w-full px-5 py-4 rounded-2xl bg-background border border-border text-foreground outline-none focus:border-neon-cyan/50 focus:ring-4 focus:ring-neon-cyan/5 transition-all text-lg"
          />
        </div>

        <div className="flex items-center justify-between pt-4 gap-4">
          <div className="shrink-0">
            <ConfirmDeleteModal
              action={deleteTodoFromDetail}
              todoId={todo.id}
            />
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-neon-cyan text-black font-bold hover:shadow-[0_0_20px_rgba(34,211,238,0.4)] hover:scale-[1.01] active:scale-95 transition-all disabled:opacity-50"
          >
            <Save size={18} />
            {isPending ? "Đang lưu..." : "Lưu thay đổi"}
          </button>
        </div>
      </form>
    </div>
  );
}
