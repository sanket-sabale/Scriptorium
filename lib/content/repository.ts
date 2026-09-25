import matter from "gray-matter";
import { readFile, readdir } from "node:fs/promises";
import path from "node:path";

export type ContentCollection = "notes" | "plans" | "documentation";
export type ContentStatus = "published" | "draft";

export interface ContentMetadata {
  slug: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  status: ContentStatus;
  order?: number;
}

export interface ContentDocument extends ContentMetadata {
  content: string;
}

export interface ContentSearchEntry extends ContentMetadata {
  searchText: string;
}

export interface ContentHeading {
  id: string;
  title: string;
  level: number;
}

const safeSlugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function collectionDirectory(collection: ContentCollection) {
  return path.resolve(process.cwd(), "content", collection);
}

function fallbackTitle(slug: string) {
  return slug.split("-").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
}

function normalizeTags(value: unknown) {
  if (Array.isArray(value)) return value.filter((tag): tag is string => typeof tag === "string").map((tag) => tag.trim()).filter(Boolean);
  return typeof value === "string" ? value.split(",").map((tag) => tag.trim()).filter(Boolean) : [];
}

function parseContent(source: string, slug: string): Omit<ContentDocument, "slug"> | null {
  try {
    const parsed = matter(source);
    const data = parsed.data as Record<string, unknown>;
    return {
      title: typeof data.title === "string" && data.title.trim() ? data.title.trim() : fallbackTitle(slug),
      description: typeof data.description === "string" ? data.description.trim() : "",
      category: typeof data.category === "string" && data.category.trim() ? data.category.trim() : "Uncategorized",
      tags: normalizeTags(data.tags),
      status: data.status === "draft" ? "draft" : "published",
      order: typeof data.order === "number" ? data.order : undefined,
      content: parsed.content.trimStart(),
    };
  } catch (error) {
    console.error(`Unable to parse content metadata for ${slug}.`, error);
    return null;
  }
}

function validateSlug(slug: string) {
  return safeSlugPattern.test(slug);
}

export async function getContentSlugs(collection: ContentCollection) {
  try {
    const entries = await readdir(collectionDirectory(collection), { withFileTypes: true });
    return entries.filter((entry) => entry.isFile() && entry.name.endsWith(".md")).map((entry) => entry.name.slice(0, -3)).filter(validateSlug).sort();
  } catch {
    return [];
  }
}

export async function getContentBySlug(collection: ContentCollection, slug: string): Promise<ContentDocument | null> {
  if (!validateSlug(slug)) return null;
  const directory = collectionDirectory(collection);
  const filePath = path.resolve(directory, `${slug}.md`);
  if (!filePath.startsWith(`${directory}${path.sep}`)) return null;

  try {
    const parsed = parseContent(await readFile(filePath, "utf8"), slug);
    return parsed ? { slug, ...parsed } : null;
  } catch {
    return null;
  }
}

export async function getAllContentDocuments(collection: ContentCollection) {
  const documents = await Promise.all((await getContentSlugs(collection)).map((slug) => getContentBySlug(collection, slug)));
  return documents.filter((content): content is ContentDocument => content !== null && content.status === "published").sort((left, right) => {
    if (left.order !== undefined || right.order !== undefined) return (left.order ?? Number.MAX_SAFE_INTEGER) - (right.order ?? Number.MAX_SAFE_INTEGER);
    return left.title.localeCompare(right.title);
  });
}

export async function getAllContent(collection: ContentCollection): Promise<ContentMetadata[]> {
  return (await getAllContentDocuments(collection)).map((content) => ({
    slug: content.slug,
    title: content.title,
    description: content.description,
    category: content.category,
    tags: content.tags,
    status: content.status,
    order: content.order,
  }));
}

export async function getAllContentSearchEntries(collection: ContentCollection): Promise<ContentSearchEntry[]> {
  return (await getAllContentDocuments(collection)).map((content) => ({
    ...content,
    searchText: `${content.title} ${content.description} ${content.category} ${content.tags.join(" ")} ${content.content}`,
  }));
}

export async function getAdjacentContent(collection: ContentCollection, slug: string) {
  const content = await getAllContent(collection);
  const index = content.findIndex((item) => item.slug === slug);
  return { previous: index > 0 ? content[index - 1] : null, next: index >= 0 && index < content.length - 1 ? content[index + 1] : null };
}

export function slugifyHeading(value: string, usedIds = new Map<string, number>()) {
  const base = value.replace(/[`*_]/g, "").replace(/\[([^\]]+)\]\([^)]*\)/g, "$1").toLocaleLowerCase().trim().replace(/[^\p{L}\p{N}\s-]/gu, "").replace(/\s+/g, "-");
  const count = usedIds.get(base) ?? 0;
  usedIds.set(base, count + 1);
  return count ? `${base}-${count}` : base;
}

export function createContentHeadingIndex(content: string): ContentHeading[] {
  const headings = [...content.matchAll(/^(#{1,6})\s+(.+)$/gm)];
  const usedIds = new Map<string, number>();
  return headings.map((heading) => ({ id: slugifyHeading(heading[2], usedIds), title: heading[2].replace(/[`*_]/g, "").trim(), level: heading[1].length }));
}

export function createContentSearchTargets(content: ContentDocument) {
  const headings = [...content.content.matchAll(/^(#{1,6})\s+(.+)$/gm)];
  const targets = headings.filter((heading) => {
    const plainHeading = heading[2].replace(/[`*_]/g, "").trim();
    return /^\d+\.\s/.test(plainHeading) || plainHeading.startsWith("Next:");
  });
  const usedIds = new Map<string, number>();

  if (!targets.length) return [{ id: slugifyHeading(content.title, usedIds), title: content.title, searchText: content.content }];

  return targets.map((heading, index) => {
    const start = heading.index ?? 0;
    const end = index + 1 < targets.length ? targets[index + 1].index ?? content.content.length : content.content.length;
    const title = heading[2].replace(/[`*_]/g, "").trim();
    return { id: slugifyHeading(title, usedIds), title, searchText: content.content.slice(start, end) };
  });
}

export async function getPublishedContentSlugs(collection: ContentCollection) {
  const documents = await Promise.all((await getContentSlugs(collection)).map((slug) => getContentBySlug(collection, slug)));
  return documents.filter((content): content is ContentDocument => content !== null && content.status === "published").map((content) => content.slug);
}