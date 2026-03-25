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
  sku: string | null;
  price: number;
  stock: number;
  variant_image: string | null;
  attributes: Record<string, string>;
}

export interface ProductImage {
  id: string;
  url: string;
  is_thumbnail: boolean;
  variant_id: string | null;
  display_order: number;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  short_description: string | null;
  thumbnail_url: string | null;
  price_min: number | null;
  category_id: string;
}

export interface ProductFull {
  product: Product;
  attributes: Attribute[];
  variants: Variant[];
  images: ProductImage[];
}


/*
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
  sku: string;
  price: number;
  stock: number;
  attributes: Record<string, string>;
}

interface ProductImage {
  id: string;
  url: string;
  is_thumbnail: boolean;
}


interface Product {
  id: string;
  name: string;
  thumbnail_url?: string;
  price_min?: number;
  short_description?: string;
  description?: string;
  category_id: string; // Thêm dòng này
}



interface ProductFull {
  product: Product;
  attributes: Attribute[];
  variants: Variant[];
  images: ProductImage[];
}

*/




