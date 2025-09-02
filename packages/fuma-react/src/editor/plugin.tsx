import type { MdMdxJsxTextElement, MdRules } from "@platejs/markdown";
import { createPlatePlugin, type PlateElementProps } from "platejs/react";
import { type JSX } from "react";

/**
 * Base shape for a Fuma Studio component node.
 *
 * Extend this interface when creating your own FSC element:
 *
 * ```ts
 * export interface MyComponentElement extends FSComponent {
 *   type: "fs_component";
 * }
 * ```
 */
export type FSComponent = {
  /**
   * Unique identifier for the component.
   * Should match the JSX tag name.
   *
   * Example:
   * ```tsx
   * <custom_component /> // type === "custom_component"
   * ```
   */
  type: string;

  /**
   * Object containing all props passed to the component.
   *
   * Example:
   * ```tsx
   * <fsc_component name="emmanuel" age={30} arr={[]} />
   *
   * // Becomes:
   * const fsProps = { name: "emmanuel", age: 30, arr: [] };
   *
   * // Usage:
   * const { fsProps, setFsProps } = useFSCState({ element });
   * ```
   */
  fsProps: Record<string, any>;

  /**
   * The body of the JSX element.
   * Currently unused — components are always self-closing:
   *
   * ```tsx
   * <custom_component /> ✅
   * <custom_component>children</custom_component> ❌
   * ```
   */
  children: [{ text: "" }];
};

export type FSCProps<T extends FSComponent> = PlateElementProps<T>;
export type FSCPlugin<T extends FSComponent = FSComponent> = (
  args: FSCProps<T>
) => JSX.Element;

type CreateFsPlugin<T extends FSComponent> = Record<string, FSCPlugin<T>>;

const isFunction = (x: any): x is Function => typeof x === "function";

/**
 * Create Plate plugins for FSC components.
 *
 * The keys must match the component's `type` (or `fscId`).
 *
 * Example:
 * ```ts
 * const customPlugins = createFscPlugin({
 *   ["fs_component"]: ComponentHandler,
 *   ["fs_component_yaml"]: YamlHandler,
 * });
 *
 * // Renders <YamlHandler /> for <fs_component_yaml />
 * ```
 */
export const createFscPlugin = <T extends FSComponent>(
  args: CreateFsPlugin<T>
) => {
  return Object.fromEntries(
    Object.entries(args).map(([key, Plugin]) => [
      key,
      createPlatePlugin({
        key,
        node: {
          isElement: true,
          isVoid: true,
        },
      }).withComponent(Plugin),
    ])
  );
};

/**
 * Generate MDX rules for FSC serialization and deserialization.
 *
 * Can use default behavior or provide custom `serialize` / `deserialize`.
 *
 * Example:
 * ```ts
 * const rules = fscMdxRules({
 *   ...customPlugins,
 *   yaml: {
 *     deserialize(mdastNode: MdYaml) {
 *       const fsProps = yaml.load(mdastNode.value);
 *       return { type: "fs_component_yaml", fsProps, children: [] };
 *     },
 *     serialize(slateNode: FSComponent): MdYaml {
 *       return { type: "yaml", value: yaml.dump(slateNode.fsProps) };
 *     },
 *   },
 * });
 * ```
 */
export const fscMdxRules = <T,>(
  plugins: Record<string, Record<"serialize" | "deserialize", any> | T>
): MdRules => {
  return Object.fromEntries(
    Object.entries(plugins).map(([pluginKey, ruleOrPlugin]) => {
      return [
        pluginKey,
        {
          // Deserialize JSX element → Slate node
          // (default if no custom handler is provided)
          deserialize: isFunction((ruleOrPlugin as any)?.serialize)
            ? (ruleOrPlugin as any).deserialize
            : (mdastNode: MdMdxJsxTextElement) => {
                const fsProps: Record<string, any> = {};
                for (const attr of mdastNode.attributes || []) {
                  if (attr.type === "mdxJsxAttribute") {
                    fsProps[attr.name] =
                      typeof attr.value === "string"
                        ? attr.value
                        : attr.value?.value || "";
                  }
                }
                return { type: pluginKey, fsProps, children: [] };
              },

          // Serialize Slate node → JSX element
          serialize: isFunction((ruleOrPlugin as any)?.serialize)
            ? (ruleOrPlugin as any).serialize
            : (slateNode: FSComponent): MdMdxJsxTextElement => {
                const attributes = Object.entries(slateNode.fsProps || {}).map(
                  ([key, value]) => ({
                    type: "mdxJsxAttribute",
                    name: key,
                    value:
                      typeof value === "string" ? value : JSON.stringify(value),
                  })
                ) as any;

                return {
                  type: "mdxJsxTextElement",
                  name: pluginKey,
                  attributes,
                  children: [],
                };
              },
        },
      ];
    })
  );
};
