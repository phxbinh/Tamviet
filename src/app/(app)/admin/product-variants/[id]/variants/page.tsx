
// src/app/(app)/admin/product-variants/[id]/variants/page.tsx
import React from "react";
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from "next/link";
import DeleteButton from "@/components/product-variants/DeleteButton";

async function getVariants(id: string) {
  const h = await headers();

  const host = h.get('host')!;
  const protocol =
    process.env.NODE_ENV === 'development' ? 'http' : 'https';

/*
  const res = await fetch(`${protocol}://${host}/api/admin/product-variants?${id}`, {
    cache: 'no-store',
    headers: {
      cookie: h.get('cookie') ?? '',
    },
  });
*/
const res = await fetch(
  `${protocol}://${host}/api/admin/product-variants?productId=${id}`,
  {
    cache: "no-store",
    headers: {
      cookie: h.get("cookie") ?? "",
    },
  }
);





  if (res.status === 401) redirect('/login');
  if (res.status === 403) redirect('/403');
  if (!res.ok) throw new Error('Failed to fetch users');

  return res.json()

}


export default async function VariantsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const variants = await getVariants(id);

  return (
    <div className="p-6">
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">Product Variants</h1>

        <Link
          href={`/admin/product-variants/${id}/variants/new`}
          className="px-4 py-2 bg-green-600 text-white rounded"
        >
          + Add Variant
        </Link>
      </div>

      <table className="w-full border">
        <thead>
          <tr className="font-bold">
            <th className="p-2 border">SKU</th>
            <th className="p-2 border">Price</th>
            <th className="p-2 border">Stock</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {variants.map((v: any) => (
            <tr key={v.id}>
              <td className="p-2 border">{v.sku}</td>
              <td className="p-2 border">{v.price}</td>
              <td className="p-2 border">{v.stock}</td>
              <td className="p-2 border space-x-2">
                <Link
                  href={`/admin/product-variants/${id}/variants/${v.id}`}
                  className="text-blue-600"
                >
                  Edit
                </Link>

                <DeleteButton variantId={v.id} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}