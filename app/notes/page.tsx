import { ContentPage } from "@/components/content-page";
import { ContentExplorer } from "@/components/content/content-explorer";
import { getAllNotes, getAllNoteSearchEntries } from "@/lib/notes/notes";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  path: "/notes",
  title: "Notes",
  description: "Technical references and learning notes, including a Docker command guide and a Java full-stack roadmap.",
  indexable: true,
});

export default async function NotesPage() {
  const notes = await getAllNotes();
  const searchEntries = await getAllNoteSearchEntries();

  return (
    <ContentPage eyebrow="The notebook" title="Notes" description="A growing collection of references, observations, and useful things worth remembering.">
      <ContentExplorer content={notes} searchEntries={searchEntries} basePath="notes" />
    </ContentPage>
  );
}