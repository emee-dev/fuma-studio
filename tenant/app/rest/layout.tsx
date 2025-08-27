import type { ReactNode } from "react";

const DocsLayout = () => {}

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
