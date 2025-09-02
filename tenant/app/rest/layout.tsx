import { useMDXComponents } from "@/mdx-components";
import { compileSource } from "@trythis/fuma-react";

interface Frontmatter {
  title: string;
  layout: string;
}

type PageProps = {
  params: Promise<{ projectSlug: string }>;
};

export default async function ProjectPage({ params }: PageProps) {
  const components = useMDXComponents();

  const source = `---
title: Framework Theme
layout: project
---
<fs_component name="emee" num={0} arr={[]} args={{}} />
`;

  const { content, frontmatter } = await compileSource<Frontmatter>({
    source,
    components,
  });

  return (
    <div className="mt-10 mx-auto w-[60%] bg-gray-200 h-screen">
      {JSON.stringify(frontmatter)}
      {content}
    </div>
  );
}
