import { ContentPage } from "@/components/content-page";
import { ContentExplorer } from "@/components/content/content-explorer";
import { getAllNotes, getAllNoteSearchEntries } from "@/lib/notes/notes";

export default async function NotesPage() {
  const notes = await getAllNotes();
  const searchEntries = await getAllNoteSearchEntries();

  return (
    <ContentPage eyebrow="The notebook" title="Notes" description="A growing collection of references, observations, and useful things worth remembering.">
      <ContentExplorer content={notes} searchEntries={searchEntries} basePath="notes" />
    </ContentPage>
  );
}