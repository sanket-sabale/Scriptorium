import {
  getAdjacentContent,
  getAllContent,
  getAllContentSearchEntries,
  getContentBySlug,
  getContentSlugs,
  createContentHeadingIndex,
  createContentSearchTargets,
  slugifyHeading,
  type ContentDocument,
  type ContentHeading,
  type ContentMetadata,
  type ContentSearchEntry,
  type ContentStatus,
} from "@/lib/content/repository";

export type NoteStatus = ContentStatus;
export type NoteMetadata = ContentMetadata;
export type NoteDocument = ContentDocument;
export type NoteSearchEntry = ContentSearchEntry;

export type NoteHeading = ContentHeading;

export const getNoteBySlug = (slug: string) => getContentBySlug("notes", slug);
export const getNoteSlugs = () => getContentSlugs("notes").then(async (slugs) => {
  const documents = await Promise.all(slugs.map((slug) => getNoteBySlug(slug)));
  return documents.filter((note): note is NoteDocument => note !== null && note.status === "published").map((note) => note.slug);
});
export const getAllNoteSlugs = getNoteSlugs;
export const getAllNotes = () => getAllContent("notes");
export const getAllNoteSearchEntries = () => getAllContentSearchEntries("notes");
export const getAdjacentNotes = (slug: string) => getAdjacentContent("notes", slug);
export const createHeadingIndex = createContentHeadingIndex;
export const createSearchTargets = createContentSearchTargets;
export { slugifyHeading };