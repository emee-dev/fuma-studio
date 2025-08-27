"use client";

import { AIToolbarButton } from "@/components/editor/ui/ai-toolbar-button";
import { AlignToolbarButton } from "@/components/editor/ui/align-toolbar-button";
// import { CommentToolbarButton } from "@/components/editor/ui/xcomment-toolbar-button";
import { EmojiToolbarButton } from "@/components/editor/ui/emoji-toolbar-button";
import { ExportToolbarButton } from "@/components/editor/ui/export-toolbar-button";
import { FontColorToolbarButton } from "@/components/editor/ui/font-color-toolbar-button";
import { FontSizeToolbarButton } from "@/components/editor/ui/font-size-toolbar-button";
import {
  RedoToolbarButton,
  UndoToolbarButton,
} from "@/components/editor/ui/history-toolbar-button";
import { ImportToolbarButton } from "@/components/editor/ui/import-toolbar-button";
import {
  IndentToolbarButton,
  OutdentToolbarButton,
} from "@/components/editor/ui/indent-toolbar-button";
import { InsertToolbarButton } from "@/components/editor/ui/insert-toolbar-button";
import { LineHeightToolbarButton } from "@/components/editor/ui/line-height-toolbar-button";
import { LinkToolbarButton } from "@/components/editor/ui/link-toolbar-button";
import {
  BulletedListToolbarButton,
  NumberedListToolbarButton,
  TodoListToolbarButton,
} from "@/components/editor/ui/list-toolbar-button";
import { MarkToolbarButton } from "@/components/editor/ui/mark-toolbar-button";
import { MediaToolbarButton } from "@/components/editor/ui/media-toolbar-button";
import { ModeToolbarButton } from "@/components/editor/ui/mode-toolbar-button";
import { MoreToolbarButton } from "@/components/editor/ui/more-toolbar-button";
import { TableToolbarButton } from "@/components/editor/ui/table-toolbar-button";
import { ToggleToolbarButton } from "@/components/editor/ui/toggle-toolbar-button";
import { Toolbar, ToolbarGroup } from "@/components/editor/ui/toolbar";
import { TurnIntoToolbarButton } from "@/components/editor/ui/turn-into-toolbar-button";
import { cn } from "@/lib/utils";
import {
  ArrowUpToLineIcon,
  BaselineIcon,
  BoldIcon,
  Code2Icon,
  HighlighterIcon,
  ItalicIcon,
  PaintBucketIcon,
  StrikethroughIcon,
  UnderlineIcon,
  WandSparklesIcon,
} from "lucide-react";
import { KEYS } from "platejs";
import { createPlatePlugin, useEditorReadOnly } from "platejs/react";
import * as React from "react";

export function FixedToolbar(props: React.ComponentProps<typeof Toolbar>) {
  return (
    <Toolbar
      {...props}
      className={cn(
        "sticky top-0 left-0 z-50 scrollbar-hide w-full justify-between overflow-x-auto rounded-t-lg border-b border-b-border bg-background/95 p-1 backdrop-blur-sm supports-backdrop-blur:bg-background/60",
        props.className
      )}
    />
  );
}

function FixedToolbarButtons() {
  const readOnly = useEditorReadOnly();

  return (
    <div className="flex w-full">
      {!readOnly && (
        <>
          <ToolbarGroup>
            <UndoToolbarButton />
            <RedoToolbarButton />
          </ToolbarGroup>

          <ToolbarGroup>
            <AIToolbarButton tooltip="AI commands">
              <WandSparklesIcon />
            </AIToolbarButton>
          </ToolbarGroup>

          <ToolbarGroup>
            <ExportToolbarButton>
              <ArrowUpToLineIcon />
            </ExportToolbarButton>

            <ImportToolbarButton />
          </ToolbarGroup>

          <ToolbarGroup>
            <InsertToolbarButton />
            <TurnIntoToolbarButton />
            <FontSizeToolbarButton />
          </ToolbarGroup>

          <ToolbarGroup>
            <MarkToolbarButton nodeType={KEYS.bold} tooltip="Bold (⌘+B)">
              <BoldIcon />
            </MarkToolbarButton>

            <MarkToolbarButton nodeType={KEYS.italic} tooltip="Italic (⌘+I)">
              <ItalicIcon />
            </MarkToolbarButton>

            <MarkToolbarButton
              nodeType={KEYS.underline}
              tooltip="Underline (⌘+U)"
            >
              <UnderlineIcon />
            </MarkToolbarButton>

            <MarkToolbarButton
              nodeType={KEYS.strikethrough}
              tooltip="Strikethrough (⌘+⇧+M)"
            >
              <StrikethroughIcon />
            </MarkToolbarButton>

            <MarkToolbarButton nodeType={KEYS.code} tooltip="Code (⌘+E)">
              <Code2Icon />
            </MarkToolbarButton>

            <FontColorToolbarButton nodeType={KEYS.color} tooltip="Text color">
              <BaselineIcon />
            </FontColorToolbarButton>

            <FontColorToolbarButton
              nodeType={KEYS.backgroundColor}
              tooltip="Background color"
            >
              <PaintBucketIcon />
            </FontColorToolbarButton>
          </ToolbarGroup>

          <ToolbarGroup>
            <AlignToolbarButton />

            <NumberedListToolbarButton />
            <BulletedListToolbarButton />
            <TodoListToolbarButton />
            <ToggleToolbarButton />
          </ToolbarGroup>

          <ToolbarGroup>
            <LinkToolbarButton />
            <TableToolbarButton />
            <EmojiToolbarButton />
          </ToolbarGroup>

          <ToolbarGroup>
            <MediaToolbarButton nodeType={KEYS.img} />
            <MediaToolbarButton nodeType={KEYS.video} />
            <MediaToolbarButton nodeType={KEYS.audio} />
            <MediaToolbarButton nodeType={KEYS.file} />
          </ToolbarGroup>

          <ToolbarGroup>
            <LineHeightToolbarButton />
            <OutdentToolbarButton />
            <IndentToolbarButton />
          </ToolbarGroup>

          <ToolbarGroup>
            <MoreToolbarButton />
          </ToolbarGroup>
        </>
      )}

      <div className="grow" />

      <ToolbarGroup>
        <MarkToolbarButton nodeType={KEYS.highlight} tooltip="Highlight">
          <HighlighterIcon />
        </MarkToolbarButton>
        {/* <CommentToolbarButton /> */}
      </ToolbarGroup>

      <ToolbarGroup>
        <ModeToolbarButton />
      </ToolbarGroup>
    </div>
  );
}

export const FixedToolbarKit = [
  createPlatePlugin({
    key: "fixed-toolbar",
    render: {
      beforeEditable: () => (
        <FixedToolbar>
          <FixedToolbarButtons />
        </FixedToolbar>
      ),
    },
  }),
];
