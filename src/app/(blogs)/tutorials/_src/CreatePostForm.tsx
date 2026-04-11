'use client';

import { useState } from "react";
import { createPost } from "@/lib/createPost";
import { Document } from "@/lib/blocks";
import BlockEditor from "./BlockEditor";

export default function CreatePostForm() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState<Document>({
    type: "doc",
    blocks: [],
  });

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", JSON.stringify(content));

    await createPost(formData);
    alert("Done");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title..."
        className="text-3xl w-full border-b"
      />

      <BlockEditor content={content} onChange={setContent} />

      <button type="submit" className="bg-black text-white px-4 py-2">
        Publish
      </button>
    </form>
  );
}