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



/*
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

// Import CSS mặc định của thư viện trước, sau đó custom đè lên bằng Tailwind
import '@mdxeditor/editor/style.css';
import { ForwardedRef } from 'react';
import { supabase } from '@/lib/supabase/clientSupabase';
*/







// Logic Upload ảnh trực tiếp lên Supabase Storage
/*
async function imageUploadHandler_(image: File) {
  //const supabase = createClient();
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
*/

interface EditorProps_ {
  markdown: string;
  editorRef: ForwardedRef<MDXEditorMethods> | null;
  onChange: (markdown: string) => void;
}

//export default 
function MdxEditor_({ markdown, editorRef, onChange }: EditorProps_) {
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





/**
 * LOGIC: Upload ảnh trực tiếp lên Supabase Storage
 * Giữ nguyên logic gốc của bạn, đảm bảo Bucket 'blog-content' đã được cấu hình Public.
 */
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

/**
 * COMPONENT: MdxEditor Luxury Version
 * Đã tích hợp các class từ Layer Utilities của Số 2 (animate-in, fade-in, custom-scrollbar)
 */
//export default 
function MdxEditor__({ markdown, editorRef, onChange }: EditorProps) {
  return (
    <div className="dark w-full rounded-xl overflow-hidden border border-white/10 bg-card/30 backdrop-blur-md">
      <MDXEditor
        ref={editorRef}
        markdown={markdown}
        onChange={onChange}
        /* - luxury-editor: Class định danh để viết CSS thủ công.
          - prose prose-invert: Typography của Tailwind cho Dark mode.
          - animate-in fade-in: Utility animation từ file số 2.
          - custom-scrollbar: Scrollbar tinh tế từ layer utilities của bạn.
        */
        className="luxury-editor prose prose-invert max-w-none animate-in fade-in custom-scrollbar min-h-[500px]"
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
              <div className="flex flex-wrap items-center gap-1 bg-transparent p-1">
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
      
      {/* Inline Style bổ trợ để đảm bảo các nút bấm MDX Editor khớp với mã màu Primary HSL của bạn */}
      <style jsx global>{`
        .luxury-editor .mdxeditor-toolbar {
          background-color: transparent !important;
          border-bottom: 1px solid hsl(var(--border) / 0.5) !important;
        }
        .luxury-editor [button][data-state="on"] {
          color: hsl(var(--primary)) !important;
          background-color: hsl(var(--primary) / 0.1) !important;
        }
        .luxury-editor svg {
          color: hsl(var(--foreground) / 0.8);
          width: 18px;
          height: 18px;
        }
        .luxury-editor .mdxeditor-root-content {
          outline: none !important;
        }
      `}</style>
    </div>
  );
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















