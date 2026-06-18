
/*
"use client";

import { useState } from "react";

interface ResolveDocumentResponse {
  success: boolean;
  documentId?: string;
}

export default function DocumentResolverPage() {
  const [query, setQuery] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [documentId, setDocumentId] =
    useState<string | null>(
      null
    );

  async function handleResolve() {
    try {
      setLoading(true);
      setDocumentId(null);

      const response =
        await fetch(
          "/api/product-chat-ui-post",
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              messages: [
                {
                  role: "user",
                  content: query,
                },
              ],
            }),
          }
        );

      const json:
        ResolveDocumentResponse =
        await response.json();

      if (!json.success) {
        throw new Error(
          "Document not found"
        );
      }

      if (json.documentId) {
        setDocumentId(
          json.documentId
        );
      }
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "Resolve failed"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">
        Document Resolver Test
      </h1>

      <textarea
        value={query}
        onChange={(e) =>
          setQuery(
            e.target.value
          )
        }
        rows={3}
        placeholder="Ví dụ: Cho tôi SOP thay màng UF"
        className="w-full border rounded p-3"
      />

      <button
        onClick={
          handleResolve
        }
        disabled={
          loading ||
          !query.trim()
        }
        className="border px-4 py-2 rounded"
      >
        {loading
          ? "Resolving..."
          : "Resolve"}
      </button>

      {documentId && (
        <div className="border rounded p-4 space-y-2">
          <h2 className="font-bold text-lg">
            Resolved Document
          </h2>

          <div>
            <strong>
              Document ID:
            </strong>{" "}
            {documentId}
          </div>
        </div>
      )}
    </div>
  );
}

*/


"use client";

import { useState } from "react";

interface ResolveDocumentResponse {
  success: boolean;
  documentId?: string;
  error?: string;
}

export default function DocumentResolverPage() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    documentId?: string;
    message?: string;
  } | null>(null);

  async function handleResolve() {
    if (!query.trim()) return;

    try {
      setLoading(true);
      setResult(null);

      const response = await fetch("/api/product-chat-ui-post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [
            {
              role: "user",
              content: query.trim(),
            },
          ],
        }),
      });

      const json: ResolveDocumentResponse = await response.json();

      if (json.success && json.documentId) {
        setResult({
          success: true,
          documentId: json.documentId,
          message: "✅ Tìm thấy tài liệu thành công!",
        });
      } else {
        setResult({
          success: false,
          message: json.error || "Không tìm thấy tài liệu phù hợp.",
        });
      }
    } catch (error) {
      setResult({
        success: false,
        message: "Lỗi kết nối. Vui lòng thử lại sau.",
      });
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900">
          Document Resolver Test
        </h1>
        <p className="text-gray-600 mt-2">
          Nhập câu hỏi để tìm SOP, Operation Manual, Maintenance Manual...
        </p>
      </div>

      <div className="space-y-4">
        <textarea
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          rows={4}
          placeholder="Ví dụ: Cho tôi SOP thay màng UF hoặc Hướng dẫn bảo dưỡng máy nén khí"
          className="w-full border border-gray-300 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y min-h-[100px]"
          disabled={loading}
        />

        <button
          onClick={handleResolve}
          disabled={loading || !query.trim()}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-3 px-6 rounded-xl transition disabled:cursor-not-allowed"
        >
          {loading ? "Đang tìm tài liệu..." : "Tìm Tài Liệu"}
        </button>
      </div>

      {/* Kết quả */}
      {result && (
        <div
          className={`border rounded-2xl p-6 ${
            result.success
              ? "bg-green-50 border-green-200"
              : "bg-red-50 border-red-200"
          }`}
        >
          <h2 className="font-bold text-xl mb-4">
            {result.success ? "✅ Thành công" : "❌ Không tìm thấy"}
          </h2>

          {result.message && (
            <p className="text-lg mb-4">{result.message}</p>
          )}

          {result.documentId && (
            <div className="bg-white border rounded-lg p-4">
              <strong className="block text-gray-700 mb-1">
                Document ID:
              </strong>
              <code className="text-blue-600 font-mono break-all">
                {result.documentId}
              </code>
            </div>
          )}
        </div>
      )}
    </div>
  );
}






