import Link from "next/link";
import { ContentPage } from "@/components/content-page";
import { serializeJsonLd, siteDescription, siteName, absoluteSiteUrl } from "@/lib/seo";

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd({
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: siteName,
            url: absoluteSiteUrl("/"),
            description: siteDescription,
          }),
        }}
      />
      <ContentPage
        eyebrow="A personal knowledge base"
        title="A quiet place for useful things."
        description="Scriptorium is a home for notes, plans, documentation, and the small discoveries worth keeping close."
      >
        <div className="grid gap-5 sm:grid-cols-3">
          <Link href="/notes" className="content-card group">
            <span className="card-kicker">Notes</span>
            <span className="mt-3 block font-display text-2xl text-ink group-hover:text-maroon">Thoughts & fragments</span>
            <span className="mt-2 block text-sm leading-6 text-ink/60">Ideas, observations, and things still taking shape.</span>
          </Link>
          <Link href="/plans" className="content-card group">
            <span className="card-kicker">Plans</span>
            <span className="mt-3 block font-display text-2xl text-ink group-hover:text-maroon">What comes next</span>
            <span className="mt-2 block text-sm leading-6 text-ink/60">A gentle view of work in motion and on the horizon.</span>
          </Link>
          <Link href="/documentation" className="content-card group">
            <span className="card-kicker">Documentation</span>
            <span className="mt-3 block font-display text-2xl text-ink group-hover:text-maroon">The handbook</span>
            <span className="mt-2 block text-sm leading-6 text-ink/60">Reference material for projects, habits, and systems.</span>
          </Link>
        </div>
      </ContentPage>
    </>
  );
}
