
/*
"use client";

import { useChat } from "@ai-sdk/react";

export default function ChatPage() {
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
  } = useChat({
    api: "/api/langchain-ai",
  });

  return (
    <main className="max-w-2xl mx-auto p-6">
      <div className="space-y-4 mb-6">
        {messages.map((message) => (
          <div key={message.id}>
            <b>{message.role}:</b>{" "}
            {message.content}
          </div>
        ))}
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex gap-2"
      >
        <input
          value={input}
          onChange={handleInputChange}
          placeholder="Nhập..."
          className="border p-2 flex-1"
        />

        <button
          type="submit"
          disabled={isLoading}
          className="border px-4"
        >
          Send
        </button>
      </form>
    </main>
  );
}
*/

"use client";

import { useChat } from "@ai-sdk/react";

export default function ChatPage() {
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
  } = useChat({
    api: "/api/langchain-ai",
  });

  return (
    <main className="max-w-2xl mx-auto p-6">
      {/* Khung chứa hội thoại */}
      <div className="space-y-4 mb-6 min-h-[300px] border p-4 rounded-lg bg-slate-50/50">
        {messages.length === 0 && (
          <p className="text-gray-400 text-center py-12">Bắt đầu cuộc trò chuyện với Gemini...</p>
        )}
        
        {messages.map((message) => (
          <div key={message.id} className="whitespace-pre-wrap">
            <span className="font-bold capitalize">{message.role}:</span>{" "}
            {/* Nếu content trống (do đang gọi tool), hiển thị trạng thái chờ */}
            {message.content || <span className="text-gray-400 italic"> đang xử lý công cụ...</span>}
          </div>
        ))}

        {/* Hiển thị hiệu ứng ba chấm khi AI đang suy nghĩ câu đầu tiên */}
        {isLoading && messages[messages.length - 1]?.role === "user" && (
          <div className="text-gray-400 italic animate-pulse">Gemini đang suy nghĩ...</div>
        )}
      </div>

      {/* Form nhập liệu */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          value={input}
          onChange={handleInputChange}
          placeholder="Nhập tin nhắn..."
          className="border p-2 flex-1 rounded"
        />

        <button
          type="submit"
          disabled={isLoading}
          className="border px-4 rounded bg-blue-500 text-white disabled:bg-gray-300 disabled:text-gray-500 transition-colors"
        >
          {isLoading ? "..." : "Send"}
        </button>
      </form>
    </main>
  );
}





