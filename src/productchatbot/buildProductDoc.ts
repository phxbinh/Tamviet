export const function buildProductDoc(product) {
  const variants = product.variants || [];

  let totalStock = 0;
  let prices: number[] = [];
  const attributeSet = new Set<string>();

  const variantText = variants.map(v => {
    totalStock += v.stock || 0;
    prices.push(v.price);

    const attrs = (v.attributes || []).map(a => {
      const str = `${a.name}: ${a.value}`;
      attributeSet.add(str);
      return str;
    });

    return `- ${attrs.join(", ")}, giá: ${v.price}, tồn: ${v.stock}`;
  }).join("\n");

  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);

  const content = `
Tên sản phẩm: ${product.name}
Danh mục: ${product.category || ""}

Mô tả:
${product.description || ""}

Biến thể:
${variantText}

Khoảng giá: ${minPrice} - ${maxPrice}
Tổng tồn kho: ${totalStock}
`
    .replace(/\s+/g, " ")
    .trim();

  return {
    title: product.name,
    slug: product.slug,
    content,
    metadata: {
      minPrice,
      maxPrice,
      totalStock,
      categories: product.category,
      attributes: Array.from(attributeSet),
    }
  };
}