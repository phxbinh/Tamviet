interface Category {
  id: string;
  name: string;
  parent_id: string | null;
  category_path: string;
  category_depth: number;
  children?: Category[];
}

export function buildCategoryTree(categories: Category[]) {
  const map = new Map<string, Category>();
  const roots: Category[] = [];

  // clone + init children
  categories.forEach(cat => {
    map.set(cat.id, { ...cat, children: [] });
  });

  categories.forEach(cat => {
    const node = map.get(cat.id)!;

    if (!cat.parent_id) {
      roots.push(node);
    } else {
      const parent = map.get(cat.parent_id);
      if (parent) {
        parent.children!.push(node);
      }
    }
  });

  return roots;
}