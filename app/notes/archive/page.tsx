import { ContentPage } from "@/components/content-page";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  path: "/notes/archive",
  title: "The Archive",
  description: "A placeholder for archived notes that have not yet been added to the Scriptorium.",
});

export default function ArchivePage() {
  return <ContentPage eyebrow="Notes / Archive" title="The archive" description="Older notes kept for context, reference, and the occasional unexpected return." />;
}