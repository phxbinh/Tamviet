

"use client";

import {
  useEffect,
  useState,
} from "react";

import Link from "next/link";

interface Document {
  id: string;

  assetId: string;

  title: string;

  documentType: string;

  version: string | null;

  createdAt: string;
}

export default function DocumentsPage() {
  const [
    documents,
    setDocuments,
  ] = useState<Document[]>(
    []
  );

  const [
    loading,
    setLoading,
  ] = useState(true);

  useEffect(() => {
    loadDocuments();
  }, []);

  async function loadDocuments() {
    try {
      const response =
        await fetch(
          "/api/import_documents"
        );

      const json =
        await response.json();

      if (!json.success) {
        throw new Error(
          json.error
        );
      }

      setDocuments(
        json.data
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

  if (loading) {
    return (
      <div className="p-6">
        Loading...
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">
        Documents
      </h1>

      <table className="w-full border">
        <thead>
          <tr>
            <th className="border p-2">
              Title
            </th>

            <th className="border p-2">
              Type
            </th>

            <th className="border p-2">
              Version
            </th>

            <th className="border p-2">
              Action
            </th>
          </tr>
        </thead>

        <tbody>
          {documents.map(
            (
              document
            ) => (
              <tr
                key={
                  document.id
                }
              >
                <td className="border p-2">
                  {
                    document.title
                  }
                </td>

                <td className="border p-2">
                  {
                    document.documentType
                  }
                </td>

                <td className="border p-2">
                  {
                    document.version
                  }
                </td>

                <td className="border p-2">
                  <Link
                    href={`/admin/import_document_om/edit-doc/${document.id}`}
                    className="underline"
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            )
          )}
        </tbody>
      </table>
    </div>
  );
}



