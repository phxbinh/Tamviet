"use client";

import { useState } from "react";

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
  price: number;
  stock: number;
  attributes: Record<string, string>;
}

interface Product {
  id: string;
  name: string;
  description?: string;
}

interface ProductFull {
  product: Product;
  attributes: Attribute[];
  variants: Variant[];
}

export default function ProductDetailClient({ data }: { data: ProductFull }) {
  const { product, attributes, variants } = data;

  const [selected, setSelected] = useState<Record<string, string>>({});

  function selectAttribute(attrName: string, value: string) {
    setSelected((prev) => ({
      ...prev,
      [attrName]: value,
    }));
  }

  function findVariant() {
    return variants.find((variant) =>
      Object.entries(selected).every(
        ([key, value]) => variant.attributes[key] === value
      )
    );
  }

  const selectedVariant = findVariant();

  const selectionText =
    Object.keys(selected).length > 0
      ? Object.entries(selected)
          .map(([k, v]) => `${k} ${v}`)
          .join(" - ")
      : null;

  return (
    <div className="max-w-3xl mx-auto space-y-6">

      {/* PRODUCT NAME */}
      <h1 className="text-2xl font-bold">{product.name}</h1>

      {/* DESCRIPTION */}
      {product.description && (
        <p className="text-gray-600">{product.description}</p>
      )}

      {/* ATTRIBUTES */}
      {attributes.map((attr) => (
        <div key={attr.id} className="space-y-2">
          <p className="font-medium">{attr.name}</p>

          <div className="flex gap-2 flex-wrap">
            {attr.values.map((v) => {
              const active = selected[attr.name] === v.value;

              return (
                <button
                  key={v.id}
                  onClick={() => selectAttribute(attr.name, v.value)}
                  className={`px-3 py-1 border rounded text-sm
                  ${
                    active
                      ? "bg-black text-white border-black"
                      : "bg-white"
                  }`}
                >
                  {v.value}
                </button>
              );
            })}
          </div>
        </div>
      ))}

      {/* SELECTED TEXT */}
      {selectionText && (
        <p className="text-sm text-gray-700">
          Bạn chọn: <b>{selectionText}</b>
        </p>
      )}

      {/* VARIANT INFO */}
      {selectedVariant && (
        <div className="border rounded p-4 space-y-1">

          <p>
            Giá:{" "}
            <b>
              {selectedVariant.price.toLocaleString()} đ
            </b>
          </p>

          <p>
            Kho: {selectedVariant.stock}
          </p>

        </div>
      )}

    </div>
  );
}