import ProductDetailClient from "@/features/products/components/ProductDetailClient";
import { headers } from "next/headers";
import { getProductDetail_slug } from "@/lib/server/products/getProductDetail_slug";
import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/ui/Breadcrumb";

// Trong trang [slug]/page.tsx
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Trang chủ",
      "item": "https://tamviet.vercel.app"
    },
    ...breadcrumbs.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 2,
      "name": item.label,
      "item": item.href ? `https://tamviet.vercel.app${item.href}` : undefined,
    })),
  ],
};



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

return (
  <>
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
    <Breadcrumb items={breadcrumbs} />
    <ProductDetailClient data={data} />
  </>
);

}