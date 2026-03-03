// src/app/todos/[id]/page.tsx
import { getTodoById } from '@/server/todos/db';
import { notFound } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { EditTodoForm } from '@/components/todos/EditTodoForm';

export default async function TodoDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const todo = await getTodoById(Number(id));

  if (!todo) notFound();

  return (
    <div className="max-w-2xl mx-auto mt-12 px-1 pb-20">
      <Link 
        href="/todos" 
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-neon-cyan transition-colors mb-8 group"
      >
        <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
        Quay lại danh sách
      </Link>

      {/* Render Client Component */}
      <EditTodoForm todo={todo} />

      <p className="text-center mt-6 text-xs text-muted-foreground italic">
        ID nhiệm vụ: #{todo.id} • Cập nhật lần cuối: {new Date().toLocaleDateString('vi-VN')}
      </p>
    </div>
  );
}


