
import type { MDXComponents } from "mdx/types";

const components: MDXComponents = {
};

// Override or add your mdx components here
export function useMDXComponents(defaultmdxComponents?: MDXComponents): MDXComponents {
  return {
    ...defaultmdxComponents,
    ...components
  };
}
