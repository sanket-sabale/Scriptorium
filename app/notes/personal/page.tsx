import { ContentPage } from "@/components/content-page";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  path: "/notes/personal",
  title: "Personal Notes",
  description: "A placeholder for personal notes that have not yet been added to the Scriptorium.",
});

export default function PersonalNotesPage() {
  return <ContentPage eyebrow="Notes / Personal" title="Personal notes" description="A private-feeling shelf for observations, reflections, and daily discoveries." />;
}