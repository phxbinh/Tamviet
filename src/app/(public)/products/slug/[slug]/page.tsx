import ProductDetailClient from "@/features/products/components/ProductDetailClient";
import { headers } from "next/headers";
import { getProductDetail_slug } from "@/lib/server/products/getProductDetail_slug";
import { notFound } from "next/navigation";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const data = await getProductDetail_slug(slug);

if (!data) {
    notFound();
  }


  return <ProductDetailClient data={data} />;
}