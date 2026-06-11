"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

interface DocumentData {
  id: string;
  assetId: string;
  title: string;
  documentType: string;
  version: string | null;
  rawMarkdown: string;
  metadata: Record<string, unknown>;
}

export default function DocumentDetailPage() {
  const params = useParams();
  const router = useRouter();

  const documentId =
    typeof params.id === "string"
      ? params.id
      : "";

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [document, setDocument] =
    useState<DocumentData | null>(null);

  const [title, setTitle] =
    useState("");

  const [documentType, setDocumentType] =
    useState("");

  const [version, setVersion] =
    useState("");

  const [markdown, setMarkdown] =
    useState("");

  //--------------------------------------
  // Load document
  //--------------------------------------

  useEffect(() => {
    if (!documentId) return;

    loadDocument(documentId);
  }, [documentId]);

  async function loadDocument(
    id: string
  ) {
    try {
      setLoading(true);

      const response =
        await fetch(
          `/api/import_documents/${id}`,
          {
            cache: "no-store",
          }
        );

      const json =
        await response.json();

      if (!response.ok) {
        throw new Error(
          json.error ??
            "Load failed"
        );
      }

      const doc =
        json.data;

      setDocument(doc);

      setTitle(doc.title ?? "");

      setDocumentType(
        doc.documentType ?? ""
      );

      setVersion(
        doc.version ?? ""
      );

      setMarkdown(
        doc.rawMarkdown ?? ""
      );
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "Load failed"
      );
    } finally {
      setLoading(false);
    }
  }

  //--------------------------------------
  // Save
  //--------------------------------------

  async function saveDocument() {
    if (!documentId) {
      alert(
        "Document ID missing"
      );
      return;
    }

    try {
      setSaving(true);

      const response =
        await fetch(
          `/api/import_documents/${documentId}`,
          {
            method: "PUT",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              title,
              documentType,
              version,
              markdown,
            }),
          }
        );

      const json =
        await response.json();

      if (!response.ok) {
        throw new Error(
          json.error ??
            "Update failed"
        );
      }

      setDocument(
        json.data
      );

      alert(
        "Document updated successfully"
      );
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "Save failed"
      );
    } finally {
      setSaving(false);
    }
  }

  //--------------------------------------
  // UI
  //--------------------------------------

  if (!documentId) {
    return (
      <div className="p-6">
        Invalid document id
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-6">
        Loading...
      </div>
    );
  }

  if (!document) {
    return (
      <div className="p-6">
        Document not found
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-4">

      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">
          Edit Document
        </h1>

        <button
          onClick={() =>
            router.push(
              "/admin/import_document_om/edit-doc"
            )
          }
          className="border px-3 py-2"
        >
          Back
        </button>
      </div>

      <div>
        <label className="block mb-1">
          Document ID
        </label>

        <input
          disabled
          value={document.id}
          className="w-full border p-2 bg-gray-100"
        />
      </div>

      <div>
        <label className="block mb-1">
          Asset ID
        </label>

        <input
          disabled
          value={document.assetId}
          className="w-full border p-2 bg-gray-100"
        />
      </div>

      <div>
        <label className="block mb-1">
          Title
        </label>

        <input
          value={title}
          onChange={(e) =>
            setTitle(
              e.target.value
            )
          }
          className="w-full border p-2"
        />
      </div>

      <div>
        <label className="block mb-1">
          Document Type
        </label>

        <input
          value={documentType}
          onChange={(e) =>
            setDocumentType(
              e.target.value
            )
          }
          className="w-full border p-2"
        />
      </div>

      <div>
        <label className="block mb-1">
          Version
        </label>

        <input
          value={version}
          onChange={(e) =>
            setVersion(
              e.target.value
            )
          }
          className="w-full border p-2"
        />
      </div>

      <div>
        <label className="block mb-1">
          Markdown
        </label>

        <textarea
          rows={30}
          value={markdown}
          onChange={(e) =>
            setMarkdown(
              e.target.value
            )
          }
          className="w-full border p-3 font-mono"
        />
      </div>

      <button
        onClick={saveDocument}
        disabled={saving}
        className="border px-4 py-2"
      >
        {saving
          ? "Saving..."
          : "Save"}
      </button>
    </div>
  );
}