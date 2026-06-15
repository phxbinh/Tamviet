
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
        "/api/admin/assets_om"
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
          "/api/admin/assets_om",
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






