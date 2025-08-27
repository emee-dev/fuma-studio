"use client";

import { EditorKit } from "@/components/editor/editor-kit";
import { Editor, EditorContainer } from "@/components/editor/ui/editor";
import { MarkdownPlugin } from "@platejs/markdown";
import { Plate, usePlateEditor } from "platejs/react";

const initialMarkdown = ``;

export default function Demo() {
  const editor = usePlateEditor({
    plugins: EditorKit,
    value: (editor) =>
      editor.getApi(MarkdownPlugin).markdown.deserialize(initialMarkdown),
  });

  return (
    <Plate editor={editor}>
      <EditorContainer variant="demo">
        <Editor />
      </EditorContainer>
    </Plate>
  );
}
