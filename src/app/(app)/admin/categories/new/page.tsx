
/*"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewCategoryPage() {

  const router = useRouter();

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");

  async function handleSubmit(e: any) {
    e.preventDefault();

    await fetch("/api/admin/categories", {
      method: "POST",
      body: JSON.stringify({
        name,
        slug
      })
    });

    router.push("/admin/categories");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="p-6 max-w-xl space-y-4"
    >
      <h1 className="text-xl font-bold">Create Category</h1>

      <input
        placeholder="Name"
        className="border p-2 w-full"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <input
        placeholder="Slug"
        className="border p-2 w-full"
        value={slug}
        onChange={(e) => setSlug(e.target.value)}
      />

      <button
        className="bg-black text-white px-4 py-2 rounded"
      >
        Create
      </button>
    </form>
  );
}
*/



"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import slugify from "slugify";

export default function NewCategoryPage() {

  const router = useRouter();

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [slugEdited, setSlugEdited] = useState(false);

  function handleNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;

    setName(value);

    // chỉ auto slug khi user chưa chỉnh slug
    if (!slugEdited) {
      setSlug(
        slugify(value, {
          lower: true,
          strict: true,
          locale: "vi"
        })
      );
    }
  }

  function handleSlugChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSlugEdited(true);
    setSlug(e.target.value);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    await fetch("/api/admin/categories", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name,
        slug
      })
    });

    router.push("/admin/categories");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="p-6 max-w-xl space-y-4"
    >
      <h1 className="text-xl font-bold">Create Category</h1>

      <input
        placeholder="Name"
        className="border p-2 w-full"
        value={name}
        onChange={handleNameChange}
      />

      <input
        placeholder="Slug"
        className="border p-2 w-full"
        value={slug}
        onChange={handleSlugChange}
      />

      <button
        className="bg-black text-white px-4 py-2 rounded"
      >
        Create
      </button>
    </form>
  );
}






