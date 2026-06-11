"use client";

import {
  useEffect,
  useState,
} from "react";

type Asset = {
  id: string;
  assetType: string;
  code: string | null;
  name: string;
};

export default function DocumentsPage() {
  const [assets, setAssets] =
    useState<Asset[]>([]);

  const [loading, setLoading] =
    useState(false);

  const [result, setResult] =
    useState<any>(null);

  const [form, setForm] =
    useState({
      assetId: "",
      documentType:
        "operation",
      version: "1.0",
      markdown: "",
    });

  //----------------------------------
  // Load assets
  //----------------------------------

  useEffect(() => {
    loadAssets();
  }, []);

  async function loadAssets() {
    const response =
      await fetch(
        "/api/admin/assets_om"
      );

    const data =
      await response.json();

    setAssets(data);

    if (
      data.length > 0
    ) {
      setForm((prev) => ({
        ...prev,
        assetId:
          data[0].id,
      }));
    }
  }

  //----------------------------------
  // Submit
  //----------------------------------

  async function handleSubmit(
    e: React.FormEvent
  ) {
    e.preventDefault();

    try {
      setLoading(true);

      const response =
        await fetch(
          "/api/admin/import_documents",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify(
              form
            ),
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.error
        );
      }

      setResult(data);
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "Insert failed"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">
        Import Document
      </h1>

      <form
        onSubmit={
          handleSubmit
        }
        className="space-y-4"
      >
        {/* Asset */}

        <div>
          <label>
            Asset
          </label>

          <select
            className="w-full border p-2"
            value={
              form.assetId
            }
            onChange={(e) =>
              setForm({
                ...form,
                assetId:
                  e.target
                    .value,
              })
            }
          >
            {assets.map(
              (
                asset
              ) => (
                <option
                  key={
                    asset.id
                  }
                  value={
                    asset.id
                  }
                >
                  {
                    asset.code
                  }
                  {" - "}
                  {
                    asset.name
                  }
                </option>
              )
            )}
          </select>
        </div>

        {/* Document Type */}

        <div>
          <label>
            Document Type
          </label>

          <input
            className="w-full border p-2"
            value={
              form.documentType
            }
            onChange={(e) =>
              setForm({
                ...form,
                documentType:
                  e.target
                    .value,
              })
            }
          />
        </div>

        {/* Version */}

        <div>
          <label>
            Version
          </label>

          <input
            className="w-full border p-2"
            value={
              form.version
            }
            onChange={(e) =>
              setForm({
                ...form,
                version:
                  e.target
                    .value,
              })
            }
          />
        </div>

        {/* Markdown */}

        <div>
          <label>
            Markdown
          </label>

          <textarea
            rows={25}
            className="w-full border p-2 font-mono"
            value={
              form.markdown
            }
            onChange={(e) =>
              setForm({
                ...form,
                markdown:
                  e.target
                    .value,
              })
            }
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="border px-4 py-2"
        >
          {loading
            ? "Importing..."
            : "Import"}
        </button>
      </form>

      {/* Result */}

      {result && (
        <div className="mt-8 border p-4">
          <h2 className="font-bold">
            Result
          </h2>

          <pre>
            {JSON.stringify(
              result,
              null,
              2
            )}
          </pre>
        </div>
      )}
    </div>
  );
}