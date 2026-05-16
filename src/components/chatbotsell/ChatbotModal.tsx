'use client';

import { X } from 'lucide-react';
import { useChatbotStore } from './stores/chatbot-store';
import { ChatWindow } from './ChatWindow';

export function ChatbotModal() {
  const { isOpen, close } = useChatbotStore();

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        onClick={close}
        className="
          fixed inset-0 z-[9998]
          bg-black/50 backdrop-blur-sm
        "
      />

      {/* Modal */}
      <div
        className="
          fixed z-[9999]
          bottom-24 right-6
          w-[380px]
          h-[700px]
          bg-white
          rounded-3xl
          shadow-2xl
          overflow-hidden
          border border-neutral-200
          flex flex-col
        "
      >
        {/* Header */}
        <div
          className="
            h-16 px-5
            border-b
            flex items-center justify-between
            shrink-0
          "
        >
          <div>
            <h2 className="font-semibold">
              AI Assistant
            </h2>

            <p className="text-sm text-neutral-500">
              Ask anything
            </p>
          </div>

          <button
            onClick={close}
            className="
              h-10 w-10 rounded-full
              hover:bg-neutral-100
              flex items-center justify-center
            "
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <ChatWindow />
      </div>
    </>
  );
}