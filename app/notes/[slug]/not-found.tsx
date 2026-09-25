import Link from "next/link";
import { ContentPage } from "@/components/content-page";

export default function NoteNotFound() {
  return (
    <ContentPage eyebrow="Notes / Not found" title="This page is missing" description="The requested note does not exist in the Scriptorium library.">
      <div className="note-empty-state max-w-2xl">
        <p className="leading-7 text-ink/70">Check the note name or return to the library to choose another page.</p>
        <Link href="/notes" className="note-clear-button mt-4 inline-block">Back to notes</Link>
      </div>
    </ContentPage>
  );
}