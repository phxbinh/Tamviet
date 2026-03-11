
// src/app/(app)/admin/products/[id]/page.tsx
import { headers } from "next/headers";
import Link from "next/link";

interface Product {
  id: string;
  name: string;
  slug: string;
  status: string;
}

interface Attribute {
  id: string;
  name: string;
}

interface AttributeValues {
  attribute_id: string;
  attribute_name: string;
  values: {
    id: string;
    value: string;
  }[];
}

interface Variant {
  variant_id: string;
  sku: string;
  price: number;
  stock: number;
  attributes: Record<string, string>;
}




/*
import { headers } from 'next/headers';

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


*/





async function getProduct(id: string): Promise<Product> {

  const h = await headers();
  const host = h.get('host')!;

  //const host = (await headers()).get("host")!;
  const protocol =
    process.env.NODE_ENV === 'development' ? 'http' : 'https';

  const res = await fetch(`${protocol}://${host}/api/admin/products/${id}`, {
    cache: "no-store",
    headers: {
      cookie: h.get('cookie') ?? '',
    },
  });

  if (!res.ok) throw new Error("Failed to fetch product");

  return res.json();
}

async function getAttributes(id: string): Promise<Attribute[]> {
  //const host = (await headers()).get("host");
  const h = await headers();
  const host = h.get('host')!;
  const protocol =
    process.env.NODE_ENV === 'development' ? 'http' : 'https';

  const res = await fetch(`${protocol}://${host}/api/admin/products/${id}/attributes`,
    { cache: "no-store", 
      headers: {
        cookie: h.get('cookie') ?? '',
      },
    }
  );

  return res.json();
}

async function getAttributeValues(id: string): Promise<AttributeValues[]> {
  //const host = (await headers()).get("host");
  const h = await headers();
  const host = h.get('host')!;
  const protocol =
    process.env.NODE_ENV === 'development' ? 'http' : 'https';

  const res = await fetch(`${protocol}://${host}/api/admin/products/${id}/attribute-values`,
    { cache: "no-store", 
      headers: {
        cookie: h.get('cookie') ?? '',
      },
    }
  );

  return res.json();
}

async function getVariantMatrix(id: string): Promise<Variant[]> {
  //const host = (await headers()).get("host");
  const h = await headers();
  const host = h.get('host')!;
  const protocol =
    process.env.NODE_ENV === 'development' ? 'http' : 'https';

  const res = await fetch(`${protocol}://${host}/api/admin/products/${id}/variant-matrix`,
    { cache: "no-store", 
      headers: {
        cookie: h.get('cookie') ?? '',
      },
    }
  );

  return res.json();
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [product, attributes, attributeValues, variants] =
    await Promise.all([
      getProduct(id),
      getAttributes(id),
      getAttributeValues(id),
      getVariantMatrix(id),
    ]);

  const attributeNames = attributes.map((a) => a.name);

  return (
    <div className="p-8 space-y-10">

      <Link
        href="/admin/products"
        className="text-sm text-blue-600 hover:underline"
      >
        ← Back to products
      </Link>

      {/* Product Info */}
      <section>
        <h1 className="text-2xl font-bold">{product.name}</h1>

        <div className="mt-3 text-sm text-gray-600 space-y-1">
          <p>Slug: {product.slug}</p>
          <p>Status: {product.status}</p>
        </div>
      </section>

      {/* Attributes */}
      <section>
        <h2 className="text-xl font-semibold mb-3">Attributes used</h2>

        <div className="flex gap-3">
          {attributes.map((attr) => (
            <span
              key={attr.id}
              className="px-3 py-1 rounded bg-gray-200 text-sm"
            >
              {attr.name}
            </span>
          ))}
        </div>
      </section>

      {/* Attribute values */}
      <section>
        <h2 className="text-xl font-semibold mb-3">Attribute values</h2>

        <div className="space-y-4">
          {attributeValues.map((attr) => (
            <div key={attr.attribute_id}>
              <p className="font-medium">{attr.attribute_name}</p>

              <div className="flex gap-2 mt-1">
                {attr.values.map((v) => (
                  <span
                    key={v.id}
                    className="px-2 py-1 text-sm rounded bg-gray-100"
                  >
                    {v.value}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Variants table */}
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
                <tr key={v.variant_id} className="border-t">

                  {attributeNames.map((attr) => (
                    <td key={attr} className="p-2">
                      {v.attributes[attr]}
                    </td>
                  ))}

                  <td className="p-2">{v.sku}</td>
                  <td className="p-2">{v.price}</td>
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