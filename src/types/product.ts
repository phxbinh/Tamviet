// src/types/product.ts

export interface AttributeValue {
  id: string;
  value: string;
}

export interface Attribute {
  id: string;
  name: string;
  values: AttributeValue[];
}

export interface Variant {
  id: string;
  sku: string;
  price: number;
  stock: number;
  // Metadata attributes cho việc tìm kiếm logic (e.g., { "Màu sắc": "Đỏ", "Size": "L" })
  attributes: Record<string, string>;
}

export interface ProductImage {
  id: string;
  url: string;
  is_thumbnail: boolean;
  sort_order: number;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description?: string;
  short_description?: string;
  status: 'active' | 'draft' | 'archived';
  created_at: string;
  updated_at: string;
}

// Interface "Trùm" cho trang Detail
export interface ProductFullDetail {
  product: Product;
  attributes: Attribute[];
  variants: Variant[];
  images: ProductImage[];
  summary?: {
    total_stock: number;
    min_price: number;
    max_price: number;
    variant_count: number;
  };
}
