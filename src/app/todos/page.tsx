// src/app/todos/page.tsx
import { getTodos, addTodo } from '@/server/todos/db';
import { createTodo, toggleTodoAction, deleteTodoAction } from '@/actions/todos/actions';
import { revalidatePath } from 'next/cache';
import { ToggleTodo } from '@/components/todos/ToggleTodo';
import { ConfirmDeleteModal } from '@/components/modals/ConfirmDeleteModal';

import Link from 'next/link';

export default async function Todos() {
  const todos = await getTodos();

  async function handleAdd(formData: FormData) {
    'use server';
    const title = formData.get('title')?.toString().trim();
    if (!title) return;
    await addTodo({ title });
    revalidatePath('/todos'); // Cập nhật đúng path của bạn
  }

  return (
    <div className="max-w-2xl mx-auto px-1 py-10">
      {/* Tiêu đề với Gradient Neon */}
      <h1 className="text-5xl md:text-6xl font-extrabold mb-12 text-center tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-neon-cyan via-blue-500 to-neon-purple drop-shadow-[0_0_15px_rgba(34,211,238,0.3)]">
        Todo Neon JS
      </h1>

      {/* Form thêm todo: Thích nghi theme + Focus Neon Glow */}
      <form
        action={handleAdd}
        className="mb-10 relative flex gap-3 rounded-2xl bg-card/50 backdrop-blur-xl border border-border shadow-xl focus-within:border-neon-cyan/50 focus-within:shadow-[0_0_20px_rgba(34,211,238,0.15)] transition-colors duration-300 p-2"
      >
        <input
          name="title"
          type="text"
          placeholder="Nhập nhiệm vụ mới... ✨"
          className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground outline-none px-5 py-3 rounded-xl text-lg font-medium"
          required
        />
        <button
          type="submit"
          className="px-8 py-3 bg-neon-cyan text-black font-bold rounded-xl hover:shadow-[0_0_15px_rgba(34,211,238,0.6)] transform hover:scale-[1.02] active:scale-95 transition-colors duration-300"
        >
          Thêm
        </button>
      </form>

      {/* Danh sách Todo */}
      <ul className="space-y-4">
        {todos.map((todo) => (
          <li
            key={todo.id}
            className="group flex items-center justify-between p-5 rounded-2xl bg-card border border-border hover:border-neon-purple/40 hover:shadow-[0_0_15px_rgba(168,85,247,0.1)] transition-colors duration-300"
          >
            <div className="flex items-center gap-4 flex-1">
              <ToggleTodo id={todo.id} completed={todo.completed} />

              <Link
                href={`/todos/${todo.id}`}
                className={`text-lg font-medium transition-colors duration-300 hover:text-neon-cyan ${
                  todo.completed
                    ? 'line-through text-muted-foreground opacity-60'
                    : 'text-foreground'
                }`}
              >
                {todo.title}
              </Link>
            </div>

            <div className="flex items-center gap-2">
               <ConfirmDeleteModal
                action={deleteTodoAction}
                todoId={todo.id}
              />
            </div>
          </li>
        ))}
      </ul>

      {/* Empty State */}
      {todos.length === 0 && (
        <div className="text-center mt-20 py-10 opacity-80">
          <p className="text-2xl text-muted-foreground font-medium">
            Chưa có nhiệm vụ nào... 🚀
          </p>
          <p className="text-neon-purple text-sm mt-2 animate-pulse">Nhập todo mới ở trên để bắt đầu!</p>
        </div>
      )}
    </div>
  );
}

  