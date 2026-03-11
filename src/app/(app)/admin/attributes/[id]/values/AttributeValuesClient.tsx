"use client";

import { useEffect, useState } from "react";

type AttributeValue = {
  id: string;
  value: string;
  sort_order: number;
};

export default function AttributeValuesClient({
  attributeId,
}: {
  attributeId: string;
}) {
  const [values, setValues] = useState<AttributeValue[]>([]);
  const [newValue, setNewValue] = useState("");
  const [newSortOrder, setNewSortOrder] = useState(0);
  const [loading, setLoading] = useState(true);

  async function fetchValues() {
    setLoading(true);
    const res = await fetch(
      `/api/admin/attribute-values?attributeId=${attributeId}`
    );
    const data = await res.json();
    setValues(data);
    setLoading(false);
  }

  useEffect(() => {
    fetchValues();
  }, [attributeId]);

  async function handleCreate() {
    if (!newValue.trim()) return;

    const res = await fetch("/api/admin/attribute-values", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        attribute_id: attributeId,
        value: newValue,
        sort_order: newSortOrder,
      }),
    });

    if (res.ok) {
      setNewValue("");
      setNewSortOrder(0);
      fetchValues();
    } else {
      alert("Error creating value");
    }
  }

  async function handleUpdate(id: string, value: string, sort: number) {
    await fetch(`/api/admin/attribute-values/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ value, sort_order: sort }),
    });

    fetchValues();
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this value?")) return;

    await fetch(`/api/admin/attribute-values/${id}`, {
      method: "DELETE",
    });

    fetchValues();
  }

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Attribute Values</h1>

      {/* Create */}
      <div className="flex gap-2">
        <input
          className="border px-3 py-2"
          placeholder="Value"
          value={newValue}
          onChange={(e) => setNewValue(e.target.value)}
        />
        <input
          type="number"
          className="border px-3 py-2 w-24"
          value={newSortOrder}
          onChange={(e) => setNewSortOrder(Number(e.target.value))}
        />
        <button
          onClick={handleCreate}
          className="bg-black text-white px-4 py-2"
        >
          Add
        </button>
      </div>

      {/* List */}
      <table className="w-full border-collapse border">
        <thead>
          <tr>
            <th className="border p-2 text-left">Value</th>
            <th className="border p-2 text-left">Sort</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {values.map((v) => (
            <Row
              key={v.id}
              item={v}
              onUpdate={handleUpdate}
              onDelete={handleDelete}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Row({
  item,
  onUpdate,
  onDelete,
}: {
  item: AttributeValue;
  onUpdate: (id: string, value: string, sort: number) => void;
  onDelete: (id: string) => void;
}) {
  const [value, setValue] = useState(item.value);
  const [sort, setSort] = useState(item.sort_order);

  return (
    <tr>
      <td className="border p-2">
        <input
          className="border px-2 py-1 w-full"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      </td>
      <td className="border p-2">
        <input
          type="number"
          className="border px-2 py-1 w-20"
          value={sort}
          onChange={(e) => setSort(Number(e.target.value))}
        />
      </td>
      <td className="border p-2 text-center space-x-2">
        <button
          onClick={() => onUpdate(item.id, value, sort)}
          className="px-3 py-1 bg-blue-600 text-white"
        >
          Save
        </button>
        <button
          onClick={() => onDelete(item.id)}
          className="px-3 py-1 bg-red-600 text-white"
        >
          Delete
        </button>
      </td>
    </tr>
  );
}