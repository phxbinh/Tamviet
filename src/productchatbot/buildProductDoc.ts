// productchatbot/buildProductDoc.ts

type Attribute = {
  name: string;
  value: string;
};

type Variant = {
  price: number;
  stock: number;
  attributes: Attribute[];
};

type Category = {
  id: string;
  name: string;
  slug: string;
};

type ProductRow = {
  id: string;
  name: string;
  slug: string;
  description: string;

  categories?: Category[];
  product_type?: string;

  variants: Variant[];
};

export function buildProductDocument(product: ProductRow) {
  const variants = product.variants || [];
  const categories = product.categories || [];

  let totalStock = 0;
  const prices: number[] = [];

  // 👉 group attributes theo name
  const attributeMap = new Map<string, Set<string>>();

  const variantText = variants
    .map((v) => {
      totalStock += v.stock || 0;
      prices.push(Number(v.price) || 0);

      const attrs = (v.attributes || []).map((a) => {
        if (!attributeMap.has(a.name)) {
          attributeMap.set(a.name, new Set());
        }
        attributeMap.get(a.name)!.add(a.value);

        return `${a.name}: ${a.value}`;
      });

      return `- ${attrs.join(", ")}, giá: ${v.price}, tồn: ${v.stock}`;
    })
    .join("\n");

  const minPrice = prices.length ? Math.min(...prices) : 0;
  const maxPrice = prices.length ? Math.max(...prices) : 0;

  // 👉 category text
  const categoryText = categories.map((c) => c.name).join(", ");

  // 👉 attribute summary (quan trọng cho AI hiểu)
  const attributeSummary = Array.from(attributeMap.entries())
    .map(([name, values]) => `${name}: ${Array.from(values).join(", ")}`)
    .join("\n");

  const content = `
Tên sản phẩm: ${product.name}

Danh mục: ${categoryText}
Loại sản phẩm: ${product.product_type || ""}

Mô tả:
${product.description || ""}

Thuộc tính:
${attributeSummary}

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

      categories: categories.map((c) => c.name),
      attributes: Array.from(attributeMap.entries()).flatMap(
        ([name, values]) =>
          Array.from(values).map((v) => `${name}: ${v}`)
      ),
    },
  };
}