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
}

export interface ProductFull {
  product: Product;
  attributes: Attribute[];
  variants: Variant[];
  images: ProductImage[];
}
