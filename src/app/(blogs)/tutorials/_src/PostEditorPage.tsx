"use client";

import { useState } from "react";
import BlockEditorContainer from "./BlockEditorContainer";
import { createPost } from "./createPost";

export default function PostEditorPage() {
  const [title, setTitle] = useState("");

  const [doc, setDoc] = useState({
    type: "doc",
    blocks: [],
  });

  async function handleSubmit() {
    await createPost({
      title,
      content: doc,
    });
  }

  return (
    <div className="p-4 space-y-4">
      <input
        className="w-full border p-2"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <BlockEditorContainer initial={doc} onChange={setDoc} />

      <button
        onClick={handleSubmit}
        className="bg-green-600 text-white px-4 py-2 rounded"
      >
        Publish
      </button>
    </div>
  );
}