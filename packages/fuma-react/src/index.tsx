import * as changeCase from "change-case";
import { compileMDX, type MDXRemoteProps } from "next-mdx-remote/rsc";
import type { JSX } from "react";
import type { Plugin } from "unified";
import { visit } from "unist-util-visit";

/**
 * Type for a renderable FSC plugin component.
 *
 * Each plugin must:
 * - Be a valid React component
 * - Have a static `name` string (matching the JSX tag in MDX)
 *
 * Example:
 * ```tsx
 * const MyPlugin: FSCPlugin = (props) => {
 *   return <div>Props: {JSON.stringify(props)}</div>;
 * };
 * ```
 */
export type FSCPlugin = {
  (props: Record<string, any>): JSX.Element;
};

/**
 * Mapping of available FSC components.
 *
 * Keys must be lowercase identifiers (e.g. `"fs_component"`).
 * They will be automatically transformed into PascalCase for rendering.
 */
export type MDXComponents = {
  [x: string]: FSCPlugin;
};

/**
 * Compile function input.
 */
export type CompileSourceProps = {
  /** Raw MDX string */
  source: string;

  /** Components to be injected into MDX rendering */
  components: MDXComponents;
};

/**
 * Remark plugin:
 * Ensures that component names in the MDX AST are normalized to PascalCase
 * so React can correctly render them.
 *
 * Example:
 * ```mdx
 * <fs_component />  // Becomes <FsComponent />
 * ```
 */
const handleComponents = (keys: string[]) => {
  const handle: Plugin = () => {
    return (tree: any) => {
      visit(tree, ["mdxJsxFlowElement", "mdxJsxTextElement"], (node: any) => {
        if (node.name && keys.includes(node.name)) {
          node.name = changeCase.pascalCase(node.name);
        }
      });
    };
  };

  return handle;
};

/**
 * Converts component keys to PascalCase for React rendering
 * while returning the original lowercase keys for remark processing.
 *
 * Example:
 * ```ts
 * pascalizeKeys({ fs_component: Plugin })
 * // => { keys: ["fs_component"], pascalComponents: { FsComponent: Plugin } }
 * ```
 */
function pascalizeKeys<T extends Record<string, any>>(
  obj: T
): { keys: string[]; pascalComponents: T } {
  const keys: string[] = [];

  const entries = Object.fromEntries(
    Object.entries(obj).map(([key, value]) => {
      keys.push(key);
      return [changeCase.pascalCase(key), value];
    })
  ) as T;

  return { keys, pascalComponents: entries };
}

/**
 * Compile MDX source with FSC components.
 *
 * Rules/constraints:
 * 1. Only components starting with `fsc_` are allowed (e.g. `<fsc_component />`).
 * 2. Custom (non-FSC) components are not supported.
 * 3. Children elements are not supported — only void/self-closing elements.
 * 4. All props must be serializable (no functions, classes, or React nodes).
 * 5. Dynamic props referencing other components are not allowed.
 *
 * Example:
 * ```tsx
 * import { compileSource } from "@fuma/sdk";
 * import { useMDXComponents } from "@/mdx-components";
 *
 * const components = useMDXComponents();
 *
 * const { content, frontmatter } = await compileSource({
 *   source: `
 *     ---
 *     title: Example
 *     ---
 *     <fs_component name="emmanuel" age={30} arr={[]} />
 *   `,
 *   components,
 * });
 *
 * return <>{content}</>;
 * ```
 */
export const compileSource = async <T extends Record<string, any>>({
  source,
  components,
}: CompileSourceProps) => {
  const { keys, pascalComponents } = pascalizeKeys(components);

  const options: MDXRemoteProps["options"] = {
    parseFrontmatter: true,
    mdxOptions: {
      remarkPlugins: [handleComponents(keys)],
    },
  };

  const result = await compileMDX<T>({
    source,
    options,
    components: pascalComponents,
  });

  return result;
};
