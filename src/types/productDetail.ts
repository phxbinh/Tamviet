export interface AttributeValue {
  id: string
  value: string
}

export interface Attribute {
  id: string
  name: string
  values: AttributeValue[]
}

export interface Variant {
  id: string
  sku: string
  price: number
  stock: number
  attributes: Record<string, string>
}

export interface ProductImage {
  id: string
  url: string
  is_thumbnail: boolean
}

export interface Product {
  id: string
  name: string
  description?: string
}

export interface ProductFull {
  product: Product
  attributes: Attribute[]
  variants: Variant[]
  images: ProductImage[]
}