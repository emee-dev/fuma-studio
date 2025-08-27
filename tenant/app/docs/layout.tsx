import type { ReactNode } from "react";

const DocsLayout = (props: {children: ReactNode, tree: any}) => {}

export default function Layout({ children }: { children: ReactNode }) {
  const data = {
    pageTree: []
  }

  return (
    <DocsLayout tree={data.pageTree}>
      {children}
    </DocsLayout>
  );
}
