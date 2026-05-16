'use client';

import { MessageCircle } from 'lucide-react';
import { useChatbotStore } from './stores/chatbot-store';

export function ChatbotLauncher() {
  const open = useChatbotStore((s) => s.open);

  return (
    <button
      onClick={open}
      className="
        fixed bottom-6 right-6 z-[9999]
        h-16 w-16 rounded-full
        bg-black text-white
        shadow-2xl
        flex items-center justify-center
        hover:scale-105
        transition
      "
    >
      <MessageCircle className="h-7 w-7" />
    </button>
  );
}