import 'server-only'
import { sql } from "@/lib/neon/sql";

export async function getCategoriesTree() {
  const rows = await sql`
    select
      id,
      name,
      slug,
      parent_id,
      category_path,
      category_depth
    from categories
    where is_active = true
    order by display_order asc, name asc
  `;

  return rows;
}