// src/app/todos/page.tsx
import { getTodos, addTodo } from '@/server/todos/db';
import { createTodo, toggleTodoAction, deleteTodoAction } from '@/actions/todos/actions';
import { revalidatePath } from 'next/cache';
import { ToggleTodo } from '@/components/todos/ToggleTodo';
import { ConfirmDeleteModal } from '@/components/modals/ConfirmDeleteModal';

import Link from 'next/link';

export default async function Todos() {
  const todos = await getTodos();  // Fetch data server-side

async function handleAdd(formData: FormData) {
  'use server';

  const title = formData.get('title')?.toString().trim();
  if (!title) return;

  await addTodo({ title });
  revalidatePath('/');
}


  return (
 
    <div className="max-w-2xl mx-auto px-0 sm:px-0">
      <h1 className="text-5xl md:text-6xl font-extrabold mb-10 text-center tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 drop-shadow-lg">
        Todo App Neon JS
      </h1>

      {/* Form thêm todo - glassmorphism + neon glow */}
      <form
        action={handleAdd}
        className="mb-10 relative flex gap-3 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl shadow-indigo-500/20 p-2 focus-within:ring-2 focus-within:ring-cyan-400/50 transition-all duration-300"
      >
        <input
          name="title"
          type="text"
          placeholder="Nhập nhiệm vụ mới... ✨"
          className="flex-1 bg-transparent text-white placeholder-gray-400 outline-none px-5 py-4 rounded-xl text-lg font-medium"
          required
        />
        <button
          type="submit"
          className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-xl hover:from-cyan-400 hover:to-blue-500 shadow-lg shadow-cyan-500/30 hover:shadow-cyan-400/50 transform hover:scale-105 transition-all duration-300"
        >
          Thêm
        </button>
      </form>

      <ul className="space-y-4">
        {todos.map((todo) => (
          <li
            key={todo.id}
            className="group flex items-center justify-between p-5 rounded-2xl bg-white/5 backdrop-blur-lg border border-white/10 hover:border-white/20 shadow-xl shadow-black/30 hover:shadow-indigo-500/20 transition-all duration-300"
          >
            <div className="flex items-center gap-4 flex-1">
              <ToggleTodo id={todo.id} completed={todo.completed} />

              <span
                className={`text-lg font-medium transition-all duration-300 ${
                  todo.completed
                    ? 'line-through text-gray-500 opacity-70'
                    : 'text-white'
                }`}
              >
                <Link
                  href={`/todos/${todo.id}`}
                  className="text-lg font-medium text-white hover:underline"
                >
                  {todo.title}
                </Link>
              </span>
            </div>

            <ConfirmDeleteModal
              action={deleteTodoAction}
              todoId={todo.id}
            />
          </li>
        ))}
      </ul>

      {todos.length === 0 && (
        <div className="text-center mt-16 py-10">
          <p className="text-2xl text-gray-400 font-medium">
            Chưa có nhiệm vụ nào... Thêm đi nào! 🚀
          </p>
          <p className="text-gray-500 mt-2">Nhập todo mới ở trên nhé ✨</p>
        </div>
      )}
    </div>

);
  }

  