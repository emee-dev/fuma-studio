// import { useMDXComponents } from "@/mdx-components";
// import { notFound } from "next/navigation";

// const createRelativeLink = () => ""
// const DocsBody = () => {}
// const DocsDescription = () => {}
// const DocsPage = () => {}
// const DocsTitle = () => {}

// export default async function Page(props: {
//   params: Promise<{ slug?: string[] }>;
// }) {
//   const params = await props.params;
//   const page = data.getPage(params.slug);
//   if (!page) notFound();

//   const MDXContent = page.data.body;

//   return (
//     <DocsPage toc={page.data.toc} full={page.data.full}>
//       <DocsTitle>{page.data.title}</DocsTitle>
//       <DocsDescription>{page.data.description}</DocsDescription>
//       <DocsBody>
//         {/* <MDXContent
//           components={useMDXComponents({
//             // this allows you to link to other pages with relative file paths
//             a: createRelativeLink(rest, page),
//           })}
//         /> */}
//       </DocsBody>
//     </DocsPage>
//   );
// }

// export async function generateStaticParams() {
//   return data.generateParams();
// }

// export async function generateMetadata(props: {
//   params: Promise<{ slug?: string[] }>;
// }) {
//   const params = await props.params;
//   const page = data.getPage(params.slug);
//   if (!page) notFound();

//   return {
//     title: page.data.title,
//     description: page.data.description,
//   };
// }

export default function () {
  return <div>Slug page</div>;
}
