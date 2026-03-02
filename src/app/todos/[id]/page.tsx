// src/app/todos/[id]/page.tsx
import { getTodoById } from '@/server/todos/db';
import { updateTodoAction, deleteTodoFromDetail } from '@/actions/todos/actions';
import { notFound } from 'next/navigation';
import { ConfirmDeleteModal } from '@/components/modals/ConfirmDeleteModal';
import { ChevronLeft, Save, Info } from 'lucide-react';
import Link from 'next/link';

export default async function TodoDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const todo = await getTodoById(Number(id));

  if (!todo) notFound();

  return (
    <div className="max-w-2xl mx-auto mt-12 px-4 pb-20">
      {/* Nút quay lại tinh tế */}
      <Link 
        href="/todos" 
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-neon-cyan transition-colors mb-8 group"
      >
        <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
        Quay lại danh sách
      </Link>

      <div className="relative p-8 rounded-3xl bg-card/50 backdrop-blur-xl border border-border shadow-2xl">
        {/* Decor: Ánh sáng mờ ở góc card (chỉ hiện ở Dark Mode) */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-neon-cyan/10 blur-[50px] rounded-full pointer-events-none" />

        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-3">
            <Info className="text-neon-cyan" size={24} />
            Chi tiết nhiệm vụ
          </h1>
          
          {/* Badge trạng thái */}
          <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
            todo.completed 
            ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-500' 
            : 'bg-amber-500/10 border-amber-500/50 text-amber-500'
          }`}>
            {todo.completed ? 'Hoàn thành' : 'Đang xử lý'}
          </span>
        </div>

        {/* Form cập nhật */}
        <form action={updateTodoAction} className="space-y-6">
          <input type="hidden" name="id" value={todo.id} />
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground ml-1">
              Tiêu đề nhiệm vụ
            </label>
            <input
              name="title"
              defaultValue={todo.title}
              placeholder="Tên nhiệm vụ..."
              className="w-full px-5 py-4 rounded-2xl bg-background border border-border text-foreground outline-none focus:border-neon-cyan/50 focus:ring-4 focus:ring-neon-cyan/5 transition-all text-lg"
            />
          </div>

          <div className="flex items-center justify-between pt-4 gap-4">
            {/* Nút Delete (ConfirmDeleteModal) */}
            <div className="shrink-0">
              <ConfirmDeleteModal
                action={deleteTodoFromDetail}
                todoId={todo.id}
              />
            </div>

            {/* Nút Cập nhật Neon */}
            <button
              type="submit"
              className="flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-neon-cyan text-black font-bold hover:shadow-[0_0_20px_rgba(34,211,238,0.4)] hover:scale-[1.01] active:scale-95 transition-all"
            >
              <Save size={18} />
              Lưu thay đổi
            </button>
          </div>
        </form>
      </div>

      {/* Thông tin bổ sung nhỏ bên dưới Card */}
      <p className="text-center mt-6 text-xs text-muted-foreground italic">
        ID nhiệm vụ: #{todo.id} • Cập nhật lần cuối: {new Date().toLocaleDateString('vi-VN')}
      </p>
    </div>
  );
}
