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