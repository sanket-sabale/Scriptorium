"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { ContentMetadata, ContentSearchEntry } from "@/lib/content/repository";

export function ContentExplorer({ content, searchEntries, basePath }: { content: ContentMetadata[]; searchEntries: ContentSearchEntry[]; basePath: string }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [tag, setTag] = useState("All");
  const searchRef = useRef<HTMLInputElement>(null);
  const categories = [...new Set(content.map((item) => item.category))].sort((left, right) => left.localeCompare(right));
  const tags = [...new Set(content.flatMap((item) => item.tags))].sort((left, right) => left.localeCompare(right));
  const searchBySlug = new Map(searchEntries.map((entry) => [entry.slug, entry.searchText]));
  const normalizedQuery = query.trim().toLocaleLowerCase();
  const filteredContent = content.filter((item) => {
    const matchesCategory = category === "All" || item.category === category;
    const matchesTag = tag === "All" || item.tags.includes(tag);
    const matchesQuery = !normalizedQuery || (searchBySlug.get(item.slug) ?? "").toLocaleLowerCase().includes(normalizedQuery);
    return matchesCategory && matchesTag && matchesQuery;
  });

  useEffect(() => {
    function handleShortcut(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null;
      if (target?.tagName === "INPUT" || target?.tagName === "TEXTAREA" || target?.isContentEditable) return;
      if (event.key === "/") {
        event.preventDefault();
        searchRef.current?.focus();
      }
      if (event.key === "Escape") {
        setQuery("");
        setCategory("All");
        setTag("All");
      }
    }
    document.addEventListener("keydown", handleShortcut);
    return () => document.removeEventListener("keydown", handleShortcut);
  }, []);

  function clearFilters() {
    setQuery("");
    setCategory("All");
    setTag("All");
  }

  return (
    <div>
      <div className="note-index-search">
        <label htmlFor={`${basePath}-search`} className="sr-only">Search {basePath}</label>
        <svg className="h-5 w-5 shrink-0 text-maroon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><circle cx="10.8" cy="10.8" r="6.3" /><path d="m16 16 4.2 4.2" /></svg>
        <input ref={searchRef} id={`${basePath}-search`} type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder={`Search ${basePath}...`} className="min-w-0 flex-1 bg-transparent text-sm text-ink outline-none placeholder:text-ink/45" />
        <kbd className="hidden rounded border border-ink/10 px-1.5 py-0.5 text-[0.65rem] text-ink/45 sm:inline">/</kbd>
      </div>
      <div className="mt-6 space-y-4">
        <div className="flex flex-wrap items-center gap-2" aria-label="Filter by category"><span className="mr-1 text-xs font-semibold uppercase tracking-[0.14em] text-ink/50">Category</span>{["All", ...categories].map((item) => <button key={item} type="button" onClick={() => setCategory(item)} className={`note-filter-button ${category === item ? "note-filter-button-active" : ""}`} aria-pressed={category === item}>{item}</button>)}</div>
        {tags.length ? <div className="flex flex-wrap items-center gap-2" aria-label="Filter by tag"><span className="mr-1 text-xs font-semibold uppercase tracking-[0.14em] text-ink/50">Tags</span>{["All", ...tags].map((item) => <button key={item} type="button" onClick={() => setTag(item)} className={`note-filter-button ${tag === item ? "note-filter-button-active" : ""}`} aria-pressed={tag === item}>{item}</button>)}</div> : null}
      </div>
      <div className="mt-8 flex items-center justify-between gap-4 border-t border-ink/10 pt-4 text-sm text-ink/60"><span>{filteredContent.length} {filteredContent.length === 1 ? basePath.slice(0, -1) : basePath} found</span>{query || category !== "All" || tag !== "All" ? <button type="button" onClick={clearFilters} className="note-clear-button">Clear filters</button> : null}</div>
      {content.length === 0 ? <div className="note-empty-state mt-6"><h2 className="font-display text-2xl text-ink">No published {basePath} yet.</h2><p className="mt-2 text-sm leading-6 text-ink/60">Add a Markdown file to content/{basePath}/ to begin.</p></div> : filteredContent.length ? <div className="mt-5 grid gap-4 sm:grid-cols-2">{filteredContent.map((item) => <Link key={item.slug} href={`/${basePath}/${item.slug}`} className="content-card group"><div className="flex items-start justify-between gap-3"><span className="card-kicker">{item.category}</span>{item.tags.length ? <span className="text-xs text-ink/45">{item.tags.length} tags</span> : null}</div><span className="mt-3 block font-display text-2xl text-ink transition-colors group-hover:text-maroon">{item.title}</span><span className="mt-2 block text-sm leading-6 text-ink/60">{item.description || `A ${basePath} page.`}</span>{item.tags.length ? <span className="mt-4 flex flex-wrap gap-1.5">{item.tags.map((itemTag) => <span key={itemTag} className="note-tag">{itemTag}</span>)}</span> : null}</Link>)}</div> : <div className="note-empty-state mt-6"><h2 className="font-display text-2xl text-ink">No {basePath} found.</h2><p className="mt-2 text-sm leading-6 text-ink/60">Try another search term or clear your filters.</p><button type="button" onClick={clearFilters} className="mt-4 note-clear-button">Clear filters</button></div>}
    </div>
  );
}