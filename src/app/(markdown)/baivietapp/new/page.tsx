// /baivietapp/new/page.tsx
import Editor from "@/lib/postLib/Editor_link";

export default function NewPostPage() {
  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Tạo bài viết</h1>
      <Editor />
    </div>
  );
}