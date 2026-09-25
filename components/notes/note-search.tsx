"use client";

import { useEffect, useState } from "react";

export interface NoteSearchTarget {
  id: string;
  title: string;
  searchText: string;
}

export function NoteSearch({ sections, placeholder = "Search this note..." }: { sections: NoteSearchTarget[]; placeholder?: string }) {
  const [query, setQuery] = useState("");
  const [activeMatchIndex, setActiveMatchIndex] = useState(0);
  const normalizedQuery = query.trim().toLocaleLowerCase();
  const matches = normalizedQuery
    ? sections.filter((section) => section.searchText.toLocaleLowerCase().includes(normalizedQuery))
    : [];
  const activeMatch = matches[activeMatchIndex] ?? null;

  useEffect(() => {
    const highlightedSections = document.querySelectorAll<HTMLElement>("[data-note-section-highlight]");
    highlightedSections.forEach((section) => section.removeAttribute("data-note-section-highlight"));

    if (!activeMatch) {
      return;
    }

    const target = document.getElementById(activeMatch.id);
    if (!target) {
      return;
    }

    target.setAttribute("data-note-section-highlight", "true");
    target.scrollIntoView({ behavior: "smooth", block: "center" });

    return () => target.removeAttribute("data-note-section-highlight");
  }, [activeMatch]);

  useEffect(() => {
    function handleShortcut(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null;
      if (target?.tagName === "INPUT" || target?.tagName === "TEXTAREA" || target?.isContentEditable) {
        if (event.key === "Escape") {
          setQuery("");
          setActiveMatchIndex(0);
        }
        return;
      }
      if (event.key === "/") {
        event.preventDefault();
        document.getElementById("note-search")?.focus();
      }
      if (event.key === "Escape") {
        setQuery("");
        setActiveMatchIndex(0);
      }
      if (event.key.toLowerCase() === "t") document.getElementById("note-toc-toggle")?.focus();
    }

    document.addEventListener("keydown", handleShortcut);
    return () => document.removeEventListener("keydown", handleShortcut);
  }, []);

  useEffect(() => {
    function scrollToHash() {
      const hash = window.location.hash.slice(1);
      if (!hash) {
        return;
      }

      const target = document.getElementById(decodeURIComponent(hash));
      if (!target) {
        return;
      }

      target.setAttribute("data-note-section-highlight", "true");
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      window.setTimeout(() => target.removeAttribute("data-note-section-highlight"), 1800);
    }

    scrollToHash();
    window.addEventListener("hashchange", scrollToHash);
    return () => window.removeEventListener("hashchange", scrollToHash);
  }, []);

  function updateQuery(value: string) {
    setQuery(value);
    setActiveMatchIndex(0);
  }

  function clearSearch() {
    setQuery("");
    setActiveMatchIndex(0);
  }

  function showPreviousMatch() {
    setActiveMatchIndex((current) => (current - 1 + matches.length) % matches.length);
  }

  function showNextMatch() {
    setActiveMatchIndex((current) => (current + 1) % matches.length);
  }

  return (
    <div className="note-search-shell">
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <svg className="h-5 w-5 shrink-0 text-maroon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
          <circle cx="10.8" cy="10.8" r="6.3" />
          <path d="m16 16 4.2 4.2" />
        </svg>
        <label htmlFor="note-search" className="sr-only">Search this note</label>
        <input
          id="note-search"
          type="search"
          value={query}
          onChange={(event) => updateQuery(event.target.value)}
          placeholder={placeholder}
          className="min-w-0 flex-1 bg-transparent text-sm text-ink outline-none placeholder:text-ink/45"
        />
        {query ? (
          <button type="button" onClick={clearSearch} className="rounded px-1.5 text-xs text-ink/55 transition hover:text-maroon focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-maroon" aria-label="Clear search">
            Clear
          </button>
        ) : null}
      </div>

      {normalizedQuery ? (
        <div className="flex shrink-0 items-center gap-2 text-xs text-ink/55" aria-live="polite">
          {matches.length ? <span>{activeMatchIndex + 1} of {matches.length}</span> : <span>No matching section found.</span>}
          {matches.length > 1 ? (
            <span className="flex items-center gap-1">
              <button type="button" onClick={showPreviousMatch} className="note-search-button" aria-label="Previous matching section">Prev</button>
              <button type="button" onClick={showNextMatch} className="note-search-button" aria-label="Next matching section">Next</button>
            </span>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}