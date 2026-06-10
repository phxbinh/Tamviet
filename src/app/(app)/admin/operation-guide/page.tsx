
/*
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
*/


/* 
"use client";

import { useState } from "react";

export default function ImportDocumentPage() {
  const [assetId, setAssetId] =
    useState("");

  const [documentType, setDocumentType] =
    useState("operation");

  const [version, setVersion] =
    useState("1.0");

  const [markdown, setMarkdown] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [result, setResult] =
    useState<any>(null);

  async function handleImport() {
    try {
      setLoading(true);

      const response =
        await fetch(
          "/api/import_document_om",
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              assetId,
              documentType,
              version,
              markdown,
            }),
          }
        );

      const data =
        await response.json();

      setResult(data);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold">
        Import Markdown Document
      </h1>

      <input
        className="w-full border p-2"
        placeholder="Asset ID"
        value={assetId}
        onChange={(e) =>
          setAssetId(
            e.target.value
          )
        }
      />

      <input
        className="w-full border p-2"
        placeholder="Document Type"
        value={documentType}
        onChange={(e) =>
          setDocumentType(
            e.target.value
          )
        }
      />

      <input
        className="w-full border p-2"
        placeholder="Version"
        value={version}
        onChange={(e) =>
          setVersion(
            e.target.value
          )
        }
      />

      <textarea
        className="w-full border p-3 h-[500px]"
        value={markdown}
        onChange={(e) =>
          setMarkdown(
            e.target.value
          )
        }
      />

      <button
        onClick={handleImport}
        disabled={loading}
        className="px-4 py-2 border"
      >
        {loading
          ? "Importing..."
          : "Import"}
      </button>

      {result && (
        <pre className="border p-4 overflow-auto">
          {JSON.stringify(
            result,
            null,
            2
          )}
        </pre>
      )}
    </div>
  );
}
*/


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
  description: string | null;
};

export default function AssetsPage() {
  const [loading, setLoading] =
    useState(false);

  const [assets, setAssets] =
    useState<Asset[]>([]);

  const [form, setForm] =
    useState({
      assetType: "process",
      code: "",
      name: "",
      description: "",
    });

  async function loadAssets() {
    const response =
      await fetch(
        "/api/admin/assets"
      );

    const data =
      await response.json();

    setAssets(data);
  }

  useEffect(() => {
    loadAssets();
  }, []);

  async function handleSubmit(
    e: React.FormEvent
  ) {
    e.preventDefault();

    try {
      setLoading(true);

      const response =
        await fetch(
          "/api/admin/assets",
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

      setForm({
        assetType:
          "process",

        code: "",

        name: "",

        description:
          "",
      });

      await loadAssets();
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "Create failed"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">
        Assets
      </h1>

      <form
        onSubmit={
          handleSubmit
        }
        className="space-y-4 border p-4 rounded"
      >
        <div>
          <label>
            Asset Type
          </label>

          <select
            className="w-full border p-2"
            value={
              form.assetType
            }
            onChange={(e) =>
              setForm({
                ...form,
                assetType:
                  e.target
                    .value,
              })
            }
          >
            <option value="process">
              process
            </option>

            <option value="equipment">
              equipment
            </option>

            <option value="chemical">
              chemical
            </option>

            <option value="instrument">
              instrument
            </option>

            <option value="safety">
              safety
            </option>

            <option value="maintenance">
              maintenance
            </option>
          </select>
        </div>

        <div>
          <label>Code</label>

          <input
            className="w-full border p-2"
            value={form.code}
            onChange={(e) =>
              setForm({
                ...form,
                code: e.target.value,
              })
            }
          />
        </div>

        <div>
          <label>Name</label>

          <input
            className="w-full border p-2"
            required
            value={form.name}
            onChange={(e) =>
              setForm({
                ...form,
                name: e.target.value,
              })
            }
          />
        </div>

        <div>
          <label>
            Description
          </label>

          <textarea
            className="w-full border p-2"
            value={
              form.description
            }
            onChange={(e) =>
              setForm({
                ...form,
                description:
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
            ? "Creating..."
            : "Create Asset"}
        </button>
      </form>

      <div className="mt-8">
        <h2 className="font-bold mb-3">
          Asset List
        </h2>

        <table className="w-full border">
          <thead>
            <tr>
              <th className="border p-2">
                Type
              </th>

              <th className="border p-2">
                Code
              </th>

              <th className="border p-2">
                Name
              </th>

              <th className="border p-2">
                Description
              </th>
            </tr>
          </thead>

          <tbody>
            {assets.map(
              (asset) => (
                <tr
                  key={
                    asset.id
                  }
                >
                  <td className="border p-2">
                    {
                      asset.assetType
                    }
                  </td>

                  <td className="border p-2">
                    {
                      asset.code
                    }
                  </td>

                  <td className="border p-2">
                    {
                      asset.name
                    }
                  </td>

                  <td className="border p-2">
                    {
                      asset.description
                    }
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}






