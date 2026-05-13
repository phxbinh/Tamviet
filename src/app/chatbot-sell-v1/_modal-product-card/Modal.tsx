// _modal-product-card/Modal.tsx
'use client';

import { ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  maxWidth?: string;
}

export function Modal({
  open,
  onClose,
  children,
  maxWidth = 'max-w-4xl',
}: ModalProps) {
  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-background/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Content */}
      <div
        className={`
          relative w-full ${maxWidth}
          max-h-[90vh]
          overflow-y-auto
          rounded-3xl
          bg-card
          border border-border
          shadow-2xl
        `}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 text-muted-foreground hover:text-foreground"
        >
          <X size={18} />
        </button>

        {children}
      </div>
    </div>,
    document.body
  );
}