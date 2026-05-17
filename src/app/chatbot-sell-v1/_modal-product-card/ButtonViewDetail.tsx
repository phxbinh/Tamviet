'use client';

import { Eye } from 'lucide-react';

type ViewDetailButtonProps = {
  slug: string;
  title: string;
  onOpen: (slug: string) => void;
};

export function ViewDetailButton({
  slug,
  title,
  onOpen,
}: ViewDetailButtonProps) {
  return (
    <button
      type="button"
      onClick={() => onOpen(slug)}
      aria-label={`Xem chi tiết ${title}`}
      className="
        inline-flex items-center gap-2
        rounded-md border px-3 py-2
        text-sm font-medium
        transition hover:bg-gray-100
      "
    >
      <Eye className="h-4 w-4" />
      Xem chi tiết: {title}
    </button>
  );
}