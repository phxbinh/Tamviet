// app/admin/posts/new/page.tsx
import Editor from "/_components/editor/Editor";

export default function NewPostPage() {
  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Tạo bài viết</h1>
      <Editor />
    </div>
  );
}


/*
/src
  /app
    /admin/posts/new/page.tsx
    /blog/[slug]/page.tsx

  /components/editor
    Editor.tsx
    BlockEditor.tsx
    Renderer.tsx

  /lib
    blocks.ts
    actions.ts

======
/admin/posts/new  → viết bài (Editor)
/blog/[slug]      → hiển thị bài (Renderer)
DB (Neon)         → lưu JSON
*/