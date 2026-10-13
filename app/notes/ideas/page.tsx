import { ContentPage } from "@/components/content-page";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  path: "/notes/ideas",
  title: "Ideas in Progress",
  description: "A placeholder for ideas that have not yet been added to the Scriptorium.",
});

export default function IdeasPage() {
  return <ContentPage eyebrow="Notes / Ideas" title="Ideas in progress" description="Loose threads and sparks waiting for a little more attention." />;
}