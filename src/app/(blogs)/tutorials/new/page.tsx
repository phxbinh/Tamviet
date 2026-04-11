"use client";

import { useState } from "react";
import BlockEditorContainer from "../_src/BlockEditorContainer";
import { createPost } from "../_src/createPost";

export default function NewPostPage() {
  const [title, setTitle] = useState("");

  const [doc, setDoc] = useState({
    type: "doc",
    blocks: [
      {
        id: crypto.randomUUID(),
        type: "paragraph",
        content: [
          {
            type: "text",
            id: crypto.randomUUID(),
            text: "",
          },
        ],
      },
    ],
  });

  async function handlePublish() {
    await createPost({
      title,
      content: doc,
    });

    alert("Published!");
  }

  return (
    <div className="p-6 space-y-4">
      {/* TITLE */}
      <input
        className="w-full border p-2 text-lg"
        placeholder="Post title..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      {/* EDITOR */}
      <BlockEditorContainer initial={doc} onChange={setDoc} />

      {/* PUBLISH */}
      <button
        onClick={handlePublish}
        className="bg-green-600 text-white px-4 py-2 rounded"
      >
        Publish
      </button>
    </div>
  );
}