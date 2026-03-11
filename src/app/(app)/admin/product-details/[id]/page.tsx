//src/app/(app)/admin/product-details/[id]/page.tsx
import React from "react";
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';



async function getProductFull(id: string) {
  const h = await headers();

  const host = h.get('host')!;
  const protocol =
    process.env.NODE_ENV === 'development' ? 'http' : 'https';

  const res = await fetch(`${protocol}://${host}/api/admin/products/${id}/full`, {
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


export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const data = await getProductFull(id);

  return (

    <div className="p-6 space-y-8">
      <><pre>{JSON.stringify(data, null, 2)}</pre></>
      <h1 className="text-2xl font-bold">
        Product Detail Debug
      </h1>

   
      <section className="border p-4 rounded">
        <h2 className="font-semibold mb-2">Product Info</h2>
        <pre className="text-sm p-4 rounded overflow-auto">
          {JSON.stringify(data.product, null, 2)}
        </pre>
      </section>

 
      <section className="border p-4 rounded">
        <h2 className="font-semibold mb-2">Summary</h2>
        <pre className="text-sm p-4 rounded overflow-auto">
          {JSON.stringify(data.summary, null, 2)}
        </pre>
      </section>


      <section className="border p-4 rounded">
        <h2 className="font-semibold mb-2">Attributes</h2>
        <pre className="text-sm p-4 rounded overflow-auto">
          {JSON.stringify(data.attributes, null, 2)}
        </pre>
      </section>

     
      <section className="border p-4 rounded">
        <h2 className="font-semibold mb-2">Variants</h2>
        <pre className="text-sm p-4 rounded overflow-auto">
          {JSON.stringify(data.variants, null, 2)}
        </pre>
      </section>

    
      <section className="border p-4 rounded">
        <h2 className="font-semibold mb-2">Images</h2>
        <pre className="text-sm p-4 rounded overflow-auto">
          {JSON.stringify(data.images, null, 2)}
        </pre>
      </section>

    </div>
  );
}