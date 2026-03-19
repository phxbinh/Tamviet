import "server-only";
import { sql } from "@/lib/neon/sql";

export async function getProductsByCategory({
  path,
  search,
  minPrice,
  maxPrice,
  attributes = {},
  sort = "newest",
  page = 1,
  limit = 8
}) {
  const offset = (page - 1) * limit;

  const colors = attributes.color?.length ? attributes.color : null;
  const sizes = attributes.size?.length ? attributes.size : null;

  const hasAttrFilter = colors || sizes;

  let orderBy = `p.created_at desc`;
  if (sort === "price_asc") orderBy = `price_min asc`;
  if (sort === "price_desc") orderBy = `price_min desc`;

  const rows = await sql`
    with category_products as (
      select pc.product_id
      from product_categories pc
      join categories c on c.id = pc.category_id
      where c.category_path like ${path + "%"}
    ),

    filtered_variants as (
      select v.id, v.product_id, v.price, v.stock
      from product_variants v
      where v.is_active = true
        and (${minPrice ?? null}::numeric is null or v.price >= ${minPrice ?? 0})
        and (${maxPrice ?? null}::numeric is null or v.price <= ${maxPrice ?? 999999999})
    )

    ${hasAttrFilter ? sql`
    , variant_attr_match as (
      select v.id
      from filtered_variants v
      join variant_attribute_values vav on vav.variant_id = v.id
      join attribute_values av on av.id = vav.attribute_value_id
      join attributes a on a.id = av.attribute_id

      where
        (
          ${colors}::text[] is null
          or (a.code = 'color' and av.value = any(${colors}))
        )
        or
        (
          ${sizes}::text[] is null
          or (a.code = 'size' and av.value = any(${sizes}))
        )

      group by v.id

      having count(distinct a.code) =
        (case when ${colors} is not null then 1 else 0 end) +
        (case when ${sizes} is not null then 1 else 0 end)
    )
    ` : sql``}

    select
      p.id,
      p.name,
      p.slug,
      p.thumbnail_url,

      min(v.price) as price_min,
      sum(v.stock) as total_stock,

      count(*) over() as total_count

    from products p

    join category_products cp on cp.product_id = p.id
    join filtered_variants v on v.product_id = p.id

    ${hasAttrFilter
      ? sql`join variant_attr_match vam on vam.id = v.id`
      : sql``}

    where
      (${search ?? null}::text is null or p.name ilike '%' || ${search ?? ""} || '%')

    group by p.id

    order by ${sql.raw(orderBy)}

    limit ${limit}
    offset ${offset}
  `;

  return {
    data: rows,
    total: rows.length ? Number(rows[0].total_count) : 0,
    page,
    limit
  };
}