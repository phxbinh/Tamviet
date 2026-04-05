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
  UndoRedo,
  BoldItalicUnderlineToggles,
  InsertTable,
  ListsToggle,
  Separator
} from '@mdxeditor/editor';
import '@mdxeditor/editor/style.css';
import { ForwardedRef } from 'react';

interface EditorProps {
  markdown: string;
  editorRef: ForwardedRef<MDXEditorMethods> | null;
  onChange: (markdown: string) => void;
}

export default function ForwardRefEditor({ markdown, editorRef, onChange }: EditorProps) {
  return (
    <MDXEditor
      ref={editorRef}
      markdown={markdown}
      onChange={onChange}
      className="dark-theme dark-editor luxury-prose"
      plugins={[
        headingsPlugin(),
        listsPlugin(),
        quotePlugin(),
        tablePlugin(),
        thematicBreakPlugin(),
        toolbarPlugin({
          toolbarContents: () => (
            <>
              <UndoRedo />
              <Separator />
              <BoldItalicUnderlineToggles />
              <Separator />
              <ListsToggle />
              <Separator />
              <InsertTable />
            </>
          )
        })
      ]}
    />
  );
}
