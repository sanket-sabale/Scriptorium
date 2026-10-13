import Link from "next/link";
import type { ContentCollection, ContentMetadata } from "@/lib/content/repository";

const itemLabels: Record<ContentCollection, string> = {
  notes: "note",
  plans: "plan",
  documentation: "documentation page",
};

export function NoteNavigation({ collection, previous, next }: { collection: ContentCollection; previous: ContentMetadata | null; next: ContentMetadata | null }) {
  if (!previous && !next) return null;
  const itemLabel = itemLabels[collection];

  return (
    <nav aria-label={`${collection} navigation`} className="note-navigation">
      {previous ? <Link href={`/${collection}/${previous.slug}`} className="note-navigation-link note-navigation-previous"><span>Previous {itemLabel}</span><strong>← {previous.title}</strong></Link> : <span />}
      {next ? <Link href={`/${collection}/${next.slug}`} className="note-navigation-link note-navigation-next"><span>Next {itemLabel}</span><strong>{next.title} →</strong></Link> : <span />}
    </nav>
  );
}