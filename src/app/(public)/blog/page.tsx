// app/blog/page.tsx
import { sql } from "@/lib/neon/sql";
import Link from "next/link";

export default async function BlogListPage() {

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Blog</h1>
    </div>
  );
}