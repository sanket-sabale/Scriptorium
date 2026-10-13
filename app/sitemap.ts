import type { MetadataRoute } from "next";
import { getAllContentDocuments } from "@/lib/content/repository";
import { absoluteSiteUrl, indexableStaticPaths } from "@/lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const notes = await getAllContentDocuments("notes");
  const staticPages = indexableStaticPaths.map((path) => ({ url: absoluteSiteUrl(path) }));
  const indexableNotes = notes
    .filter((note) => note.indexable)
    .map((note) => ({ url: absoluteSiteUrl(`/notes/${note.slug}`) }));

  return [...staticPages, ...indexableNotes];
}