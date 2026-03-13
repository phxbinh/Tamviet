import Link from "next/link";

async function getCategories() {
  const res = await fetch(
    `/api/admin/categories`,
    { cache: "no-store" }
  );

  return res.json();
}

export default async function CategoriesPage() {

  const { data } = await getCategories();

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

          {data.map((c: any) => (
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