// src/app/(public)/page.tsx
/*
import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import Link  from "next/link";
export default function PublicPage() {
  return (
    <div className="relative flex flex-col gap-10 min-h-screen">
      <Hero />
      <Features />
    </div>
  );
}
*/


// app/page.tsx

import RelatedProductsSection from "./_homepage/RelatedProductsSection";
import { getProductsByType } from "./_homepage/getProductsByType";
import { getProductTypes } from "./_homepage/getProductTypes";

export default async function HomePage() {

  const productTypes = await getProductTypes();

  // 🔥 fetch song song
  const sections = await Promise.all(
    productTypes.map(async (type: any) => {
      const products = await getProductsByType(type.code, 8);
      return {
        type,
        products
      };
    })
  );

  return (
    <div className="space-y-16">
      {sections.map(({ type, products }) => (
        <h1> {type.name} </h1>
        <RelatedProductsSection
          relatedProducts={products}
        />
      ))}
    </div>
  );
}