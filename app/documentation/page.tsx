import { ContentPage } from "@/components/content-page";
import { ContentExplorer } from "@/components/content/content-explorer";
import { getAllContent, getAllContentSearchEntries } from "@/lib/content/repository";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  path: "/documentation",
  title: "Documentation",
  description: "Getting-started, reference, and changelog pages for the Scriptorium knowledge library.",
});

export default async function DocumentationPage() {
  const [content, searchEntries] = await Promise.all([getAllContent("documentation"), getAllContentSearchEntries("documentation")]);
  return <ContentPage eyebrow="The handbook" title="Documentation" description="Reference material for projects, habits, systems, and the Scriptorium itself."><ContentExplorer content={content} searchEntries={searchEntries} basePath="documentation" /></ContentPage>;
}