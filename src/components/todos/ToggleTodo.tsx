// src/components/todos/ToggleTodo.tsx
/*
'use client';

import { useTransition } from 'react';
import { toggleTodoAction } from '@/actions/todos/actions'; // adjust path

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
*/

// src/components/todos/ToggleTodo.tsx
'use client';

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
      className="relative flex items-center justify-center w-6 h-6 rounded-full border-2 border-neon-cyan/50 transition-all duration-300 hover:border-neon-cyan disabled:opacity-50"
      aria-label="Toggle todo completed"
    >
      {/* Custom Checkbox UI */}
      <div className={`w-3 h-3 rounded-full transition-all duration-300 ${
        completed ? 'bg-neon-cyan shadow-[0_0_10px_#22d3ee] scale-100' : 'scale-0'
      }`} />
      
      {/* Loading Spinner nhỏ khi pending */}
      {isPending && (
        <div className="absolute inset-0 border-2 border-t-transparent border-neon-purple rounded-full animate-spin" />
      )}
    </button>
  );
}










