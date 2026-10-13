import { notFound } from "next/navigation";
import { ContentTemplate } from "@/components/content/content-template";
import { getAdjacentContent, getContentBySlug, getPublishedContentSlugs } from "@/lib/content/repository";
import { createPageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };
export const dynamicParams = false;
export async function generateStaticParams() { return (await getPublishedContentSlugs("documentation")).map((slug) => ({ slug })); }
export async function generateMetadata({ params }: Props) { const { slug } = await params; const content = await getContentBySlug("documentation", slug); return content ? createPageMetadata({ path: `/documentation/${content.slug}`, title: content.title, description: content.description, indexable: content.indexable }) : {}; }
export default async function DocumentationPage({ params }: Props) { const { slug } = await params; const content = await getContentBySlug("documentation", slug); if (!content || content.status === "draft") notFound(); const adjacent = await getAdjacentContent("documentation", slug); return <ContentTemplate content={content} section="Documentation" collection="documentation" {...adjacent} />; }