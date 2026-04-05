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
import { createClient } from '@/utils/supabase/client';

// Logic Upload ảnh trực tiếp lên Supabase Storage
async function imageUploadHandler(image: File) {
  const supabase = createClient();
  const fileExt = image.name.split('.').pop();
  const fileName = `${Math.random()}-${Date.now()}.${fileExt}`;
  
  const { data, error } = await supabase.storage
    .from('blog-content') // Đảm bảo bucket này tồn tại và là Public
    .upload(fileName, image);

  if (error) throw error;

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
    <MDXEditor
      ref={editorRef}
      markdown={markdown}
      onChange={onChange}
      className="luxury-editor prose prose-invert max-w-none"
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
            <div className="flex flex-wrap items-center gap-1">
              <UndoRedo />
              <Separator />
              <BoldItalicUnderlineToggles />
              <CreateLink />
              <Separator />
              <ListsToggle />
              <Separator />
              <InsertTable />
              <InsertImage />
            </div>
          )
        })
      ]}
    />
  );
}
