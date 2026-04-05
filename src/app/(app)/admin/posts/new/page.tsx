"use client";
import dynamic from 'next/dynamic';
import { useState, useRef } from 'react';
import { MDXEditorMethods } from '@mdxeditor/editor';
import { savePostAction } from './actions'; // File Server Action bên dưới

const Editor = dynamic(() => import('@/components/editor/MdxEditor'), { ssr: false });

export default function NewPostPage() {
  const [title, setTitle] = useState("");
  const editorRef = useRef<MDXEditorMethods>(null);

  const handlePublish = async () => {
    const content = editorRef.current?.getMarkdown();
    if (!title || !content) return alert("Vui lòng nhập đủ tiêu đề và nội dung");

    const result = await savePostAction({ title, content });
    if (result.success) alert("Đã lưu bài viết thành công!");
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <input 
          type="text" 
          placeholder="Tiêu đề bài viết Stoic..."
          className="w-full bg-transparent text-4xl font-serif italic outline-none border-b border-white/10 pb-4 focus:border-white/30 transition-all"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        
        <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 overflow-hidden min-h-[500px]">
          <Editor markdown="" editorRef={editorRef} onChange={() => {}} />
        </div>

        <button 
          onClick={handlePublish}
          className="bg-white text-black px-8 py-3 rounded-full font-bold hover:scale-105 transition-transform"
        >
          Xuất bản bài viết
        </button>
      </div>
    </div>
  );
}
