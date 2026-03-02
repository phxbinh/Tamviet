// src/components/todos/ToggleTodo.tsx
'use client';

import { useTransition } from 'react';
import { toggleTodoAction } from './actions/todos/actions'; // adjust path

export function ToggleTodo({ id, completed }: { id: number; completed: boolean }) {
  const [isPending, startTransition] = useTransition();

  const handleToggle = () => {
    startTransition(async () => {
      const formData = new FormData();
      formData.append('id', id.toString());

      try {
        await toggleTodoAction(formData);
      } catch (err) {
        console.error('Toggle failed, retrying once...', err);
        // Optional: retry 1 lần
        await toggleTodoAction(formData);
      }
    });
  };

  return (
    <button
      onClick={handleToggle}
      disabled={isPending}
      className="flex items-center gap-2 cursor-pointer hover:opacity-80 disabled:opacity-50"
      aria-label="Toggle todo completed"
    >
      <input
        type="checkbox"
        checked={completed}
        readOnly
        className="w-5 h-5 pointer-events-none accent-blue-600"
      />
    </button>
  );
}