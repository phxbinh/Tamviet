"use client";
import {
  MDXEditor,
  MDXEditorMethods,
  headingsPlugin,
  listsPlugin,
  quotePlugin,
  tablePlugin,
  thematicBreakPlugin,
  toolbarPlugin,
  imagePlugin,
  linkPlugin,
  linkDialogPlugin,
  UndoRedo,
  BoldItalicUnderlineToggles,
  InsertTable,
  ListsToggle,
  Separator,
  InsertImage,
  CreateLink
} from '@mdxeditor/editor';
import '@mdxeditor/editor/style.css';
import { ForwardedRef } from 'react';
import { supabase } from '@/lib/supabase/clientSupabase';

async function imageUploadHandler(image: File) {
  const fileExt = image.name.split('.').pop();
  const fileName = `${Math.random()}-${Date.now()}.${fileExt}`;
  
  const { data, error } = await supabase.storage
    .from('blog-content') 
    .upload(fileName, image);

  if (error) {
    console.error("Lỗi upload ảnh:", error.message);
    throw error;
  }

  const { data: { publicUrl } } = supabase.storage
    .from('blog-content')
    .getPublicUrl(data.path);

  return publicUrl;
}

interface EditorProps {
  markdown: string;
  editorRef: ForwardedRef<MDXEditorMethods> | null;
  onChange: (markdown: string) => void;
}


export default function MdxEditor({ markdown, editorRef, onChange }: EditorProps) {
  return (
    <div className="luxury-editor-container group rounded-2xl overflow-hidden border border-zinc-800/80 bg-zinc-950 shadow-2xl shadow-black/80 animate-in fade-in duration-300">
      {/* Toolbar wrapper - để dễ style riêng nếu cần */}
      <div className="border-b border-zinc-800 bg-zinc-900/80 backdrop-blur-md px-3 py-2 sticky top-0 z-10">
        <MDXEditor
          ref={editorRef}
          markdown={markdown}
          onChange={onChange}
          className="luxury-editor 
                     prose prose-invert 
                     prose-zinc max-w-none 
                     focus:outline-none
                     custom-scrollbar
                     dark-theme"   // Quan trọng cho MDXEditor dark mode
          plugins={[
            headingsPlugin(),
            listsPlugin(),
            quotePlugin(),
            linkPlugin(),
            linkDialogPlugin(),
            tablePlugin(),
            thematicBreakPlugin(),
            imagePlugin({ imageUploadHandler }),
            toolbarPlugin({
              toolbarContents: () => (
                <div className="flex flex-wrap items-center gap-1.5 p-1">
                  <UndoRedo />
                  <Separator className="bg-zinc-700" />
                  <BoldItalicUnderlineToggles />
                  <CreateLink />
                  <Separator className="bg-zinc-700" />
                  <ListsToggle />
                  <Separator className="bg-zinc-700" />
                  <InsertTable />
                  <InsertImage />
                </div>
              )
            })
          ]}
        />
      </div>
    </div>
  );
}















