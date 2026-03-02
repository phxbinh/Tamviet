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
      className={`relative flex items-center justify-center w-6 h-6 rounded-full border-2 transition-all duration-300 ${
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










