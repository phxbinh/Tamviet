"use client";
import { useState, useMemo } from "react";
import { ProductFull } from "../types";
import { ProductGallery } from "./ProductGallery_x";
import { ProductInfo } from "./ProductInfo_x";

export default function ProductDetailClient({ data }: { data: ProductFull }) {
  const { product, attributes, variants, images } = data;
  const [selected, setSelected] = useState<Record<string, string>>({});
  const [activeImgIndex, setActiveImgIndex] = useState(0);
  const [isAdding, setIsAdding] = useState(false);
/*
  const selectedVariant = useMemo(() => {
    if (Object.keys(selected).length < attributes.length) return null;
    return variants.find((v) =>
      Object.entries(selected).every(([key, value]) => v.attributes[key] === value)
    );
  }, [selected, variants, attributes.length]);
*/

// File: ProductDetailClient.tsx

const selectedVariant = useMemo(() => {
  if (Object.keys(selected).length < attributes.length) return null;
  
  // Thêm "|| null" ở cuối để biến undefined thành null
  return variants.find((v) =>
    Object.entries(selected).every(([key, value]) => v.attributes[key] === value)
  ) || null; 
}, [selected, variants, attributes.length]);



  return (
    <div className="max-w-7xl mx-auto px-1 py-2 lg:py-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 xl:gap-20 items-start">
        <ProductGallery 
          images={images} 
          productName={product.name} 
          activeImgIndex={activeImgIndex}
          setActiveImgIndex={setActiveImgIndex}
          variantImage={selectedVariant?.variant_image}
        />
        <ProductInfo 
          product={product}
          attributes={attributes}
          selected={selected}
          setSelected={setSelected}
          selectedVariant={selectedVariant}
          variants={variants}
          isAdding={isAdding}
          onAdd={() => { setIsAdding(true); setTimeout(() => setIsAdding(false), 1500); }}
        />
      </div>
    </div>
  );
}
