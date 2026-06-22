// app/chat/page.tsx
'use client';

import { useChat } from 'ai/react';

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: '/api/test-tools',
  });

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">AI Agent Chat (Gemini + Tools)</h1>
      
      <div className="h-[60vh] overflow-y-auto border p-4 mb-4 rounded">
        {messages.map(m => (
          <div key={m.id} className={`mb-4 ${m.role === 'user' ? 'text-right' : ''}`}>
            <strong>{m.role === 'user' ? 'Bạn' : 'AI'}:</strong>
            <div className="mt-1">{m.content}</div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          className="flex-1 border p-3 rounded"
          value={input}
          onChange={handleInputChange}
          placeholder="Ví dụ: Thời tiết Hà Nội hôm nay? Hay mấy giờ rồi?"
        />
        <button type="submit" disabled={isLoading} className="bg-blue-600 text-white px-6 py-3 rounded">
          Gửi
        </button>
      </form>

      <p className="text-sm text-gray-500 mt-4">
        Thử hỏi: "Mấy giờ rồi?", "Thời tiết TP.HCM?", "Tìm thông tin về AI"
      </p>
    </div>
  );
}