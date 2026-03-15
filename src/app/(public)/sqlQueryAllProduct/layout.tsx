import Link from "next/link";
import { getCategoriesTree } from "@/lib/db/categories";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const categories = await getCategoriesTree();

  return (
    <div className="flex gap-6">
      
      {/* Sidebar */}
      <aside className="w-60">
        {categories.map((cat: any) => (
          <Link
            key={cat.id}
            href={`/testCategories/${cat.category_path}`}
            prefetch={false}
            className="block py-2"
          >
            {cat.name}
          </Link>
        ))}
      </aside>

      {/* Page content */}
      <main className="flex-1">{children}</main>

    </div>
  );
}