"use client";

import { useState } from "react";

export default function RebuildEmbeddingsPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleRebuild = async () => {
    if (loading) return;

    const confirmRun = confirm(
      "Chạy rebuild embeddings sẽ tốn thời gian và API cost. Tiếp tục?"
    );

    if (!confirmRun) return;

    try {
      setLoading(true);
      setError(null);
      setResult(null);

      const res = await fetch("/api/productchatbot/add-ambed", {
        method: "POST",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      setResult(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <h1 style={{ fontSize: 24, fontWeight: 600 }}>
        Rebuild Product Embeddings
      </h1>

      <button
        onClick={handleRebuild}
        disabled={loading}
        style={{
          marginTop: 16,
          padding: "10px 16px",
          background: loading ? "#ccc" : "#000",
          color: "#fff",
          border: "none",
          cursor: loading ? "not-allowed" : "pointer",
        }}
      >
        {loading ? "Đang chạy..." : "Chạy rebuild"}
      </button>

      {/* Result */}
      {result && (
        <pre
          style={{
            marginTop: 20,
            padding: 16,
            background: "#f5f5f5",
            borderRadius: 8,
          }}
        >
          {JSON.stringify(result, null, 2)}
        </pre>
      )}

      {/* Error */}
      {error && (
        <div
          style={{
            marginTop: 20,
            padding: 16,
            background: "#ffe5e5",
            color: "#d00",
            borderRadius: 8,
          }}
        >
          {error}
        </div>
      )}
    </div>
  );
}