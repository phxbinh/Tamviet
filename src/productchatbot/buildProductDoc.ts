// productchatbot/buildProductDoc.ts

type Variant = {
  price: number;
  stock: number;
  attributes: { name: string; value: string }[];
};

type ProductRow = {
  id: string;
  name: string;
  slug: string;
  description: string;
  category_id?: string;
  variants: Variant[];
};

export function buildProductDocument(product: ProductRow) {
  const variants = product.variants || [];

  let totalStock = 0;
  const prices: number[] = [];
  const attributeSet = new Set<string>();

  const variantText = variants
    .map((v) => {
      totalStock += v.stock || 0;
      prices.push(v.price);

      const attrs = (v.attributes || []).map((a) => {
        const str = `${a.name}: ${a.value}`;
        attributeSet.add(str);
        return str;
      });

      return `- ${attrs.join(", ")}, giá: ${v.price}, tồn: ${v.stock}`;
    })
    .join("\n");

  const minPrice = prices.length ? Math.min(...prices) : 0;
  const maxPrice = prices.length ? Math.max(...prices) : 0;

  const content = `
Tên sản phẩm: ${product.name}
Mô tả: ${product.description || ""}

Biến thể:
${variantText}

Khoảng giá: ${minPrice} - ${maxPrice}
Tổng tồn kho: ${totalStock}
`
    .replace(/\s+/g, " ")
    .trim();

  return {
    productId: product.id,
    title: product.name,
    slug: product.slug,
    content,
    metadata: {
      minPrice,
      maxPrice,
      totalStock,
      category: product.category_id,
      attributes: Array.from(attributeSet),
    },
  };
}