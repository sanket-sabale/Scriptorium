import Link from "next/link";
import type { NoteMetadata } from "@/lib/notes/notes";

export function NoteNavigation({ previous, next }: { previous: NoteMetadata | null; next: NoteMetadata | null }) {
  if (!previous && !next) return null;

  return (
    <nav aria-label="Note navigation" className="note-navigation">
      {previous ? <Link href={`/notes/${previous.slug}`} className="note-navigation-link note-navigation-previous"><span>Previous note</span><strong>← {previous.title}</strong></Link> : <span />}
      {next ? <Link href={`/notes/${next.slug}`} className="note-navigation-link note-navigation-next"><span>Next note</span><strong>{next.title} →</strong></Link> : <span />}
    </nav>
  );
}