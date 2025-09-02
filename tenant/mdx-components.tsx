import { PluginView } from "@/components/editor/markdown-ui";
import { type MDXComponents } from "@trythis/fuma-react";

const components: MDXComponents = {
  fs_component: PluginView,
};

// Override or add your mdx components here
export function useMDXComponents(
  defaultComponents?: MDXComponents
): MDXComponents {
  return {
    ...defaultComponents,
    ...components,
  };
}
