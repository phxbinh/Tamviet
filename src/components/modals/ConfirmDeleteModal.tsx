
'use client';

import { useState } from 'react';
import { createPortal } from 'react-dom';

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
        className="text-red-400 hover:text-red-300"
      >
        Xóa
      </button>
    );
  }

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-zinc-900 rounded-2xl p-6 w-full max-w-sm">
        <p className="text-white mb-6">
          Todo này sẽ bị xóa vĩnh viễn. Chắc chưa?
        </p>

        <div className="flex justify-end gap-3">
          <button
            onClick={() => setOpen(false)}
            className="px-4 py-2 bg-white/10 text-white rounded-lg"
          >
            Hủy
          </button>

          <form action={action}>
            <input type="hidden" name="id" value={todoId} />
            <button
              type="submit"
              className="px-4 py-2 bg-red-500 text-white rounded-lg"
            >
              Xóa
            </button>
          </form>
        </div>
      </div>
    </div>,
    document.body
  );
}
