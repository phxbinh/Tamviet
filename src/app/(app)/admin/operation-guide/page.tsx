"use client";

import { useState } from "react";

export default function ImportOperationGuidePage() {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [version, setVersion] = useState("1.0");
  const [markdown, setMarkdown] = useState("");

  const [loading, setLoading] = useState(false);

  async function handleImport() {
    try {
      setLoading(true);

      const res = await fetch(
        "/api/import-operation-guide",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            title,
            category,
            version,
            markdown,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(
          data.error ||
            "Import thất bại"
        );
        return;
      }

      alert("Import thành công");

      setMarkdown("");
    } catch (error) {
      console.error(error);

      alert("Có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">
        Import Operation Guide
      </h1>

      <div className="space-y-4">
        <input
          className="w-full border p-3 rounded"
          placeholder="Title"
          value={title}
          onChange={(e) =>
            setTitle(e.target.value)
          }
        />

        <input
          className="w-full border p-3 rounded"
          placeholder="Category"
          value={category}
          onChange={(e) =>
            setCategory(
              e.target.value
            )
          }
        />

        <input
          className="w-full border p-3 rounded"
          placeholder="Version"
          value={version}
          onChange={(e) =>
            setVersion(e.target.value)
          }
        />

        <textarea
          className="w-full border p-3 rounded min-h-[500px]"
          placeholder="Paste markdown..."
          value={markdown}
          onChange={(e) =>
            setMarkdown(
              e.target.value
            )
          }
        />

        <button
          onClick={handleImport}
          disabled={
            loading || !markdown
          }
          className="px-6 py-3 border rounded"
        >
          {loading
            ? "Đang import..."
            : "Import"}
        </button>
      </div>
    </div>
  );
}