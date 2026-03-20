import { getCategoriesTree } from '@/lib/db/categories_droplist';
import { CategoryItem } from './CategoryItem';

export default async function CategoriesMenu({ path }: { path: string }) {
  const categories = await getCategoriesTree();

  return (
    <div className="flex gap-2">
      {categories.map((cat) => (
        <CategoryItem key={cat.id} cat={cat} path={path} />
      ))}
    </div>
  );
}