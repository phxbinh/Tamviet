"use client";

import { useRouter } from "next/navigation";

export default function DeleteButton({
  variantId,
}: {
  variantId: string;
}) {
  const router = useRouter();

  async function handleDelete() {
    if (!confirm("Are you sure?")) return;

    const res = await fetch(
      `/api/admin/product-variants/${variantId}`,
      { method: "DELETE" }
    );

    if (res.ok) {
      router.refresh();
    } else {
      alert("Delete failed");
    }
  }

  return (
    <button
      onClick={handleDelete}
      className="text-red-600"
    >
      Delete
    </button>
  );
}