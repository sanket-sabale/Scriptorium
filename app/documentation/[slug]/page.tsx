import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ContentTemplate } from "@/components/content/content-template";
import { getAdjacentContent, getContentBySlug, getPublishedContentSlugs } from "@/lib/content/repository";

type Props = { params: Promise<{ slug: string }> };
export const dynamicParams = false;
export async function generateStaticParams() { return (await getPublishedContentSlugs("documentation")).map((slug) => ({ slug })); }
export async function generateMetadata({ params }: Props): Promise<Metadata> { const { slug } = await params; const content = await getContentBySlug("documentation", slug); return content ? { title: content.title, description: content.description } : {}; }
export default async function DocumentationPage({ params }: Props) { const { slug } = await params; const content = await getContentBySlug("documentation", slug); if (!content || content.status === "draft") notFound(); const adjacent = await getAdjacentContent("documentation", slug); return <ContentTemplate content={content} section="Documentation" {...adjacent} />; }