
// src/app/(app)/admin/products/[id]/page.tsx

/*
Chỉ chạy với:
    api/admin/products/${id}/full/route.ts
*/

import { headers } from "next/headers";
import Link from "next/link";

interface Product {
  id: string;
  name: string;
  slug: string;
  status: string;
  description?: string;
  short_description?: string;
}

interface AttributeValue {
  id: string;
  value: string;
}

interface Attribute {
  id: string;
  name: string;
  values: AttributeValue[];
}

interface Variant {
  id: string;
  sku: string;
  price: number;
  stock: number;
  attributes: Record<string, string>;
}

interface Image {
  id: string;
  url: string;
  is_thumbnail: boolean;
}

interface ProductFullResponse {
  product: Product;
  attributes: Attribute[];
  variants: Variant[];
  images: Image[];
}

async function getProductFull(id: string): Promise<ProductFullResponse> {
  const host = (await headers()).get("host");

  const res = await fetch(
    `http://${host}/api/admin/products/${id}/full`,
    { cache: "no-store" }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch product");
  }

  return res.json();
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const data = await getProductFull(id);

  const { product, attributes, variants, images } = data;

  const attributeNames = attributes.map((a) => a.name);

  return (
    <div className="p-8 space-y-10">

      <Link
        href="/admin/products"
        className="text-sm text-blue-600 hover:underline"
      >
        ← Back to products
      </Link>

      {/* PRODUCT INFO */}
      <section>
        <h1 className="text-2xl font-bold">{product.name}</h1>

        <div className="mt-2 text-sm text-gray-600 space-y-1">
          <p>Slug: {product.slug}</p>
          <p>Status: {product.status}</p>
        </div>

        {product.short_description && (
          <p className="mt-4 text-gray-700">
            {product.short_description}
          </p>
        )}
      </section>

      {/* IMAGES */}
      <section>
        <h2 className="text-xl font-semibold mb-3">Images</h2>

        <div className="flex gap-4 flex-wrap">
          {images.map((img) => (
            <div key={img.id} className="w-32">

              <img
                src={img.url}
                alt=""
                className="rounded border"
              />

              {img.is_thumbnail && (
                <p className="text-xs text-green-600 mt-1">
                  Thumbnail
                </p>
              )}

            </div>
          ))}
        </div>
      </section>

      {/* ATTRIBUTES */}
      <section>
        <h2 className="text-xl font-semibold mb-3">Attributes</h2>

        <div className="space-y-4">
          {attributes.map((attr) => (
            <div key={attr.id}>

              <p className="font-medium">{attr.name}</p>

              <div className="flex gap-2 mt-1 flex-wrap">
                {attr.values.map((v) => (
                  <span
                    key={v.id}
                    className="px-2 py-1 text-sm bg-gray-100 rounded"
                  >
                    {v.value}
                  </span>
                ))}
              </div>

            </div>
          ))}
        </div>
      </section>

      {/* VARIANTS TABLE */}
      <section>
        <h2 className="text-xl font-semibold mb-3">Variants</h2>

        <div className="overflow-x-auto border rounded">

          <table className="w-full text-sm">

            <thead className="bg-gray-100">
              <tr>

                {attributeNames.map((name) => (
                  <th key={name} className="p-2 text-left">
                    {name}
                  </th>
                ))}

                <th className="p-2 text-left">SKU</th>
                <th className="p-2 text-left">Price</th>
                <th className="p-2 text-left">Stock</th>

              </tr>
            </thead>

            <tbody>

              {variants.map((v) => (
                <tr key={v.id} className="border-t">

                  {attributeNames.map((attr) => (
                    <td key={attr} className="p-2">
                      {v.attributes[attr] ?? "-"}
                    </td>
                  ))}

                  <td className="p-2">{v.sku}</td>

                  <td className="p-2">
                    {v.price.toLocaleString()}
                  </td>

                  <td className="p-2">{v.stock}</td>

                </tr>
              ))}

            </tbody>

          </table>

        </div>
      </section>

    </div>
  );
}