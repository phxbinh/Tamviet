import Link from "next/link";
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';


export interface Category {
  id: string;
  parent_id: string | null;

  name: string;
  slug: string;

  is_active: boolean;
  display_order: number;

  created_at: string;
  updated_at: string;
}

interface CategoriesResponse {
  success: boolean;
  data: Category[];
}

async function getCategories(): Promise<Category[]> {
  const h = await headers();
  const host = h.get('host')!;
  const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';

  const res = await fetch(`${protocol}://${host}/api/admin/categories`, {
    cache: 'no-store',
    headers: {
      cookie: h.get('cookie') ?? '',
    },
  });

  if (res.status === 401) redirect('/login');
  if (res.status === 403) redirect('/403');
  if (!res.ok) throw new Error('Failed to fetch categories');

  const json: CategoriesResponse = await res.json();

  return json.data; // 👈 quan trọng
}



export default async function CategoriesPage() {

  const data  = await getCategories();

  return (
    <div className="p-6">

      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold">Categories</h1>

        <Link
          href="/admin/categories/new"
          className="bg-black text-white px-4 py-2 rounded"
        >
          New Category
        </Link>
      </div>

      <table className="w-full border">

        <thead>
          <tr>
            <th>Name</th>
            <th>Slug</th>
            <th>Status</th>
            <th></th>
          </tr>
        </thead>

        <tbody>

          {data.map((c: Category) => (
            <tr key={c.id} className="border-t">

              <td>{c.name}</td>
              <td>{c.slug}</td>
              <td>{c.is_active ? "Active" : "Inactive"}</td>

              <td>
                <Link
                  href={`/admin/categories/${c.id}`}
                  className="text-blue-600"
                >
                  Edit
                </Link>
              </td>

            </tr>
          ))}

        </tbody>
      </table>
    </div>
  );
}