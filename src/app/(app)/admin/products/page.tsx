// src/app/(app)/admin/products/page.tsx
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

import Link from "next/link";

async function getProducts() {
  const h = await headers();

  const host = h.get('host')!;
  const protocol =
    process.env.NODE_ENV === 'development' ? 'http' : 'https';

  const res = await fetch(`${protocol}://${host}/api/admin/products`, {
    cache: 'no-store',
    headers: {
      cookie: h.get('cookie') ?? '',
    },
  });

  if (res.status === 401) redirect('/login');
  if (res.status === 403) redirect('/403');
  if (!res.ok) throw new Error('Failed to fetch users');

  return res.json()

}


/*
interface Product {
  id: string
  name: string
  slug: string
  status: "draft" | "active" | "archived"
  product_type: string
  created_at: string
}

async function getProducts(): Promise<Product[]> {

  const h = await headers();

  const host = h.get('host')!;
  const protocol =
    process.env.NODE_ENV === 'development' ? 'http' : 'https';

  const res = await fetch(`${protocol}://${host}/api/admin/products`, {
    cache: 'no-store',
    headers: {
      cookie: h.get('cookie') ?? '',
    },
  });

  if (res.status === 401) redirect('/login');
  if (res.status === 403) redirect('/403');
  if (!res.ok) throw new Error('Failed to fetch users');

  return res.json()
}

*/





export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <div className="p-0 space-y-6">

      <h1 className="text-2xl font-bold">
        Admin Products
      </h1>

      <div className="border rounded overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white">
            <tr className="text-left">
              <th className="p-3">Name</th>
              <th className="p-3">Slug</th>
              <th className="p-3">Stock</th>
              <th className="p-3">Price Range</th>
              <th className="p-3">Variants</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>

          <tbody>
            {products.map((product: any) => (
              <tr
                key={product.id}
                className="border-t hover:bg-gray-50"
              >
                <td className="p-3 font-medium">
                  <Link
                    href={`/admin/products-full/${product.id}/variants`}
                    className="text-blue-600 hover:underline"
                  >
                    {product.name}
                  </Link>
                </td>

                <td className="p-3">
                  {product.slug}
                </td>

                <td className="p-3">
                  {product.total_stock}
                </td>

                <td className="p-3">
                  {product.min_price} – {product.max_price}
                </td>

                <td className="p-3">
                  {product.variant_count}
                </td>

                <td className="p-3">
                  {product.is_active ? "Active" : "Draft"}
                </td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>

    </div>
  );
}