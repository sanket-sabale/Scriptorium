import { notFound } from "next/navigation";
import { ContentTemplate } from "@/components/content/content-template";
import { getAdjacentNotes, getNoteBySlug, getNoteSlugs } from "@/lib/notes/notes";
import { createPageMetadata } from "@/lib/seo";

type NotePageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = false;

export async function generateStaticParams() {
  const slugs = await getNoteSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: NotePageProps) {
  const { slug } = await params;
  const note = await getNoteBySlug(slug);
  return note ? createPageMetadata({
    path: `/notes/${note.slug}`,
    title: note.title,
    description: note.description,
    indexable: note.indexable,
  }) : {};
}

export default async function NotePage({ params }: NotePageProps) {
  const { slug } = await params;
  const note = await getNoteBySlug(slug);
  if (!note) notFound();
  const adjacent = await getAdjacentNotes(slug);
  return <ContentTemplate content={note} section="Notes" collection="notes" {...adjacent} />;
}