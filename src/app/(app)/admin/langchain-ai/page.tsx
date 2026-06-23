// app/page.tsx
'use client';

import { useChat } from 'ai/react';

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: '/api/langchain-ai',
  });

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="space-y-4 mb-8">
        {messages.map(m => (
          <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-4 rounded-lg ${m.role === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
              {m.content}
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          value={input}
          onChange={handleInputChange}
          placeholder="Nhập tin nhắn..."
          className="flex-1 border rounded-lg px-4 py-2"
        />
        <button type="submit" disabled={isLoading} className="bg-black text-white px-6 rounded-lg">
          Gửi
        </button>
      </form>
    </div>
  );
}