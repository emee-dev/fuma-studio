import { useEditorRef, useSelected } from "platejs/react";
import type { FSComponent } from "./plugin";

/**
 * Hook for managing FSC component props inside the editor.
 *
 * Provides:
 * - `fsProps`: current props of the component
 * - `isSelected`: whether the component is selected
 * - `setFsProps`: update props of the component
 * - `removeElement`: delete the component
 *
 * Example:
 * ```tsx
 * const { fsProps, setFsProps, removeElement } = useFSCState({ element });
 * ```
 */
export const useFSCState = <T extends FSComponent = FSComponent>(args: {
  element: T;
}) => {
  const editor = useEditorRef();
  const isSelected = useSelected();
  const element = args.element;
  const fsProps = element.fsProps;

  return {
    fsProps,
    isSelected,
    setFsProps(next: T["fsProps"]) {
      if (!editor.selection) return;
      editor.tf.setNodes<FSComponent>(
        { fsProps: next },
        {
          at: editor.selection,
          match: (n) => n === element,
        }
      );
    },
    removeElement() {
      if (!editor.selection) return;
      editor.tf.removeNodes({
        at: editor.selection,
        match: (n) => n === element,
      });
    },
  };
};
