import ProductDetailClient from "@/features/products/components/ProductDetailClient";
import { headers } from "next/headers";
//import { getProductFull } from "@/lib/server/products/getProductFull";
import { notFound } from "next/navigation";

async function getProduct(id: string) {
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

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const data = await getProduct(id);
  //const data = await getProductFull(id);

if (!data) {
    notFound();
  }


  return <ProductDetailClient data={data} />;
}