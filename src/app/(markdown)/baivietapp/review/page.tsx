import { sql } from "@/lib/neon/sql";
import Renderer from "../_src/Renderer";
import type { Document } from "../_src/blocks";

export default async function Page() {
  const result = await sql(
    `
    SELECT id, title, content_json
    FROM posts
    ORDER BY created_at DESC
    `
  );

  const posts = result.rows;

  return (
    <div>
      {posts.map((post: any) => {
        /**
         * 🔥 QUAN TRỌNG: parse nếu là string
         */
        const content: Document =
          typeof post.content_json === "string"
            ? JSON.parse(post.content_json)
            : post.content_json;

        return (
          <div key={post.id}>
            <h2>{post.title}</h2>

            {/* 👉 GỌI RENDERER */}
            <Renderer content={content} />
          </div>
        );
      })}
    </div>
  );
}