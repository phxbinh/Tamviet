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