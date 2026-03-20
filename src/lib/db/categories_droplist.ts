import 'server-only';
import { sql } from "@/lib/neon/sql";

// =========================
// TYPES
// =========================
export interface Category {
  id: string;
  name: string;
  slug: string;
  parent_id: string | null;
  category_path: string;
  category_depth: number;
  children: Category[];
}

// =========================
// BUILD TREE (O(n))
// =========================
function buildCategoryTree(categories: Category[]): Category[] {
  const map = new Map<string, Category>();
  const roots: Category[] = [];

  // init map + children
  for (const cat of categories) {
    map.set(cat.id, {
      ...cat,
      children: [],
    });
  }

  // build relations
  for (const cat of categories) {
    const node = map.get(cat.id)!;

    if (!cat.parent_id) {
      roots.push(node);
    } else {
      const parent = map.get(cat.parent_id);
      if (parent) {
        parent.children.push(node);
      }
    }
  }

  return roots;
}

// =========================
// SORT TREE (stable)
// =========================
function sortTree(nodes: Category[]) {
  nodes.sort((a, b) => a.name.localeCompare(b.name));

  for (const node of nodes) {
    if (node.children.length > 0) {
      sortTree(node.children);
    }
  }
}

// =========================
// MAIN FUNCTION
// =========================
export async function getCategoriesTree(): Promise<Category[]> {
  const rows = await sql`
    SELECT
      id,
      name,
      slug,
      parent_id,
      category_path,
      category_depth
    FROM categories
    WHERE is_active = true
    ORDER BY display_order ASC, name ASC
  `;

  const tree = buildCategoryTree(rows as Category[]);

  // optional nhưng nên có để tránh lỗi order con
  sortTree(tree);

  return tree;
}