import { ContentPage } from "@/components/content-page";
import { ContentExplorer } from "@/components/content/content-explorer";
import { getAllContent, getAllContentSearchEntries } from "@/lib/content/repository";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  path: "/plans",
  title: "Plans",
  description: "Weekly, quarterly, and someday planning pages in the Scriptorium.",
});

export default async function PlansPage() {
  const [content, searchEntries] = await Promise.all([getAllContent("plans"), getAllContentSearchEntries("plans")]);
  return <ContentPage eyebrow="The planner" title="Plans" description="A practical place for the work ahead, the work in motion, and ideas worth keeping on the horizon."><ContentExplorer content={content} searchEntries={searchEntries} basePath="plans" /></ContentPage>;
}