import { notFound } from "next/navigation";
import { ContentTemplate } from "@/components/content/content-template";
import { getAdjacentContent, getContentBySlug, getPublishedContentSlugs } from "@/lib/content/repository";
import { createPageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };
export const dynamicParams = false;
export async function generateStaticParams() { return (await getPublishedContentSlugs("plans")).map((slug) => ({ slug })); }
export async function generateMetadata({ params }: Props) { const { slug } = await params; const content = await getContentBySlug("plans", slug); return content ? createPageMetadata({ path: `/plans/${content.slug}`, title: content.title, description: content.description, indexable: content.indexable }) : {}; }
export default async function PlanPage({ params }: Props) { const { slug } = await params; const content = await getContentBySlug("plans", slug); if (!content || content.status === "draft") notFound(); const adjacent = await getAdjacentContent("plans", slug); return <ContentTemplate content={content} section="Plans" collection="plans" {...adjacent} />; }