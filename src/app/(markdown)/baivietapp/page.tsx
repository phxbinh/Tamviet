'use client';

import { useState } from "react";
import { useActionState } from "react"; // 👈 QUAN TRỌNG
import PostEditor from "./_src/PostEditor";
import { createPostAction } from "./_src/creatrPostAction";
import type { Document } from "./_src/blocks";

export default function Page() {
  const [doc, setDoc] = useState<Document>({
    type: "doc",
    blocks: [],
  });

  /**
   * 👇 bind server action
   */
  const [state, formAction, isPending] = useActionState(
    createPostAction,
    null
  );

  return (
    <form action={formAction} className="p-6 max-w-2xl mx-auto">
      <input
        name="title"
        placeholder="Title"
        className="w-full border p-2 mb-4"
      />

      <PostEditor value={doc} onChange={setDoc} />

      {/* 👇 QUAN TRỌNG */}
      <input
        type="hidden"
        name="content"
        value={JSON.stringify(doc)}
      />

      <button
        disabled={isPending}
        className="mt-4 bg-black text-white px-4 py-2"
      >
        {isPending ? "Saving..." : "Save"}
      </button>

      {/* 👇 show result */}
      {state && !state.success && (
        <p className="text-red-600 mt-2">
          {state.error}
        </p>
      )}
      
      {state && state.success && (
        <p className="text-green-600 mt-2">
          Saved
        </p>
      )}
    </form>
  );
}