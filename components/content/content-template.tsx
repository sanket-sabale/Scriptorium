import { ContentPage } from "@/components/content-page";
import { MarkdownRenderer } from "@/components/notes/markdown-renderer";
import { NoteNavigation } from "@/components/notes/note-navigation";
import { NoteSearch } from "@/components/notes/note-search";
import { ReadingProgress } from "@/components/notes/reading-progress";
import { TableOfContents } from "@/components/notes/table-of-contents";
import { createContentHeadingIndex, createContentSearchTargets, type ContentCollection, type ContentDocument, type ContentMetadata } from "@/lib/content/repository";

export function ContentTemplate({ content, section, collection, previous, next }: { content: ContentDocument; section: string; collection: ContentCollection; previous: ContentMetadata | null; next: ContentMetadata | null }) {
  const searchTargets = createContentSearchTargets(content);
  const headings = createContentHeadingIndex(content.content);

  return (
    <>
      <ReadingProgress />
      <ContentPage eyebrow={`${section} / ${content.title}`} title={content.title} description={content.description}>
        <div className="max-w-3xl">
          <div className="note-metadata">
            <span>{content.category}</span>
            {content.tags.map((tag) => <span key={tag} className="note-tag">{tag}</span>)}
          </div>
          <TableOfContents headings={headings} />
          <div className="note-search-sticky">
            <NoteSearch sections={searchTargets} />
          </div>
          <article className="markdown-note-content mt-10">
            <MarkdownRenderer content={content.content} />
          </article>
          <NoteNavigation collection={collection} previous={previous} next={next} />
        </div>
      </ContentPage>
    </>
  );
}