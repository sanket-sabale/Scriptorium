import Link from "next/link";
import { ContentPage } from "@/components/content-page";

export default function NotFound() {
  return (
    <ContentPage eyebrow="404 / Not found" title="This page is missing" description="The requested page could not be found in the Scriptorium library.">
      <div className="note-empty-state max-w-2xl">
        <p className="leading-7 text-ink/70">Return to the library and choose another page.</p>
        <Link href="/notes" className="note-clear-button mt-4 inline-block">Back to notes</Link>
      </div>
    </ContentPage>
  );
}