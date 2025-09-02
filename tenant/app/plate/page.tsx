"use client";

import { EditorKit } from "@/components/editor/editor-kit";
import { Editor, EditorContainer } from "@/components/editor/ui/editor";
import { MarkdownPlugin } from "@platejs/markdown";
import { Plate, usePlateEditor } from "platejs/react";
import { Button } from "@/components/ui/button";

const initialMarkdown = `---
title: Framework Theme
layout: project
---
<fs_component name="emee" num={0} arr={[]} args={{}} />
`;

export default function Demo() {
  const editor = usePlateEditor({
    plugins: EditorKit,
    value: (editor) =>
      editor.getApi(MarkdownPlugin).markdown.deserialize(initialMarkdown),
  });

  return (
    <div className="max-w-[700px] bg-gray-200 h-screen">
      <div className="flex items-center gap-x-2">
        <Button
          onClick={async () => {
            const req = await fetch("/api", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ fileName: "test.md" }),
            });

            console.log(await req.json());
          }}
        >
          Load
        </Button>
        <Button
          onClick={async () => {
            const content = editor.getApi(MarkdownPlugin).markdown.serialize();
            // const req = await fetch("/api", {
            //   method: "PUT",
            //   headers: {
            //     "Content-Type": "application/json",
            //   },
            //   body: JSON.stringify({
            //     fileName: "test.md",
            //     content: content,
            //   }),
            // });
            // const res = await req.json()

            // console.log(res);
            console.log(content);
          }}
        >
          Save
        </Button>
      </div>

      <Plate editor={editor}>
        <EditorContainer>
          <Editor />
        </EditorContainer>
      </Plate>
    </div>
  );
}
