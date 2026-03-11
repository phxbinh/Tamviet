import Link from "next/link";
import { headers } from "next/headers";

interface Product {
  id: string;
  name: string;
  slug: string;
  thumbnail_url?: string;
  price_min?: number;
}

async function getProducts(): Promise<Product[]> {
  const host = (await headers()).get("host");

  const res = await fetch(`http://${host}/api/products`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch products");
  }

  return res.json();
}

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <div className="max-w-6xl mx-auto p-6">

      <h1 className="text-2xl font-bold mb-6">
        Danh sách sản phẩm
      </h1>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

        {products.map((p) => (
          <Link
            key={p.id}
            href={`/products/${p.id}`}
            className="border rounded-lg overflow-hidden hover:shadow transition"
          >

            {/* IMAGE */}
            {p.thumbnail_url && (
              <img
                src={p.thumbnail_url}
                alt={p.name}
                className="w-full h-40 object-cover"
              />
            )}

            {/* INFO */}
            <div className="p-3 space-y-1">

              <p className="font-medium text-sm">
                {p.name}
              </p>

              {p.price_min && (
                <p className="text-sm text-gray-600">
                  {p.price_min.toLocaleString()} đ
                </p>
              )}

            </div>

          </Link>
        ))}

      </div>

    </div>
  );
}