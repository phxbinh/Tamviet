"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  useParams,
} from "next/navigation";

interface DocumentData {
  id: string;

  assetId: string;

  title: string;

  documentType: string;

  version: string | null;

  rawMarkdown: string;

  metadata: Record<
    string,
    unknown
  >;
}

export default function DocumentDetailPage() {
  const params =
    useParams();

  const documentId =
    params.id as string;

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    saving,
    setSaving,
  ] = useState(false);

  const [
    document,
    setDocument,
  ] =
    useState<DocumentData | null>(
      null
    );

  const [title, setTitle] =
    useState("");

  const [
    documentType,
    setDocumentType,
  ] = useState("");

  const [
    version,
    setVersion,
  ] = useState("");

  const [
    markdown,
    setMarkdown,
  ] = useState("");

  //-----------------------------------
  // Load document
  //-----------------------------------

  useEffect(() => {
    loadDocument();
  }, []);

  async function loadDocument() {
    try {
      const response =
        await fetch(
          `/api/import_documents/${documentId}`
        );

      const json =
        await response.json();

      if (!json.success) {
        throw new Error(
          json.error
        );
      }

      const doc =
        json.data;

      setDocument(doc);

      setTitle(doc.title);

      setDocumentType(
        doc.documentType
      );

      setVersion(
        doc.version ?? ""
      );

      setMarkdown(
        doc.rawMarkdown
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

  //-----------------------------------
  // Save
  //-----------------------------------

  async function saveDocument() {
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

      if (!json.success) {
        throw new Error(
          json.error
        );
      }

      alert(
        "Document updated"
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
      <h1 className="text-2xl font-bold">
        Edit Document
      </h1>

      {/* Asset */}

      <div>
        <label className="block mb-1">
          Asset ID
        </label>

        <input
          value={
            document.assetId
          }
          disabled
          className="w-full border p-2 bg-gray-100"
        />
      </div>

      {/* Title */}

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

      {/* Type */}

      <div>
        <label className="block mb-1">
          Document Type
        </label>

        <input
          value={
            documentType
          }
          onChange={(e) =>
            setDocumentType(
              e.target.value
            )
          }
          className="w-full border p-2"
        />
      </div>

      {/* Version */}

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

      {/* Markdown */}

      <div>
        <label className="block mb-1">
          Markdown
        </label>

        <textarea
          value={markdown}
          onChange={(e) =>
            setMarkdown(
              e.target.value
            )
          }
          rows={30}
          className="w-full border p-3 font-mono"
        />
      </div>

      <button
        onClick={
          saveDocument
        }
        disabled={saving}
        className="px-4 py-2 border"
      >
        {saving
          ? "Saving..."
          : "Save"}
      </button>
    </div>
  );
}