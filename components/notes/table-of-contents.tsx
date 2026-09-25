"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { NoteHeading } from "@/lib/notes/notes";

export function TableOfContents({ headings }: { headings: NoteHeading[] }) {
  const visibleHeadings = headings.filter((heading) => heading.level >= 2 && heading.level <= 3);
  const [activeId, setActiveId] = useState(visibleHeadings[0]?.id ?? "");

  useEffect(() => {
    const observedHeadings = headings.filter((heading) => heading.level >= 2 && heading.level <= 3);
    const elements = observedHeadings.map((heading) => document.getElementById(heading.id)).filter((element): element is HTMLElement => element !== null);
    if (!elements.length) return;

    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((left, right) => left.boundingClientRect.top - right.boundingClientRect.top);
      if (visible[0]) setActiveId(visible[0].target.id);
    }, { rootMargin: "-72px 0px -65% 0px", threshold: [0, 1] });

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [headings]);

  if (!visibleHeadings.length) return null;

  return (
    <details className="note-toc" open>
      <summary id="note-toc-toggle" className="note-toc-summary">Table of contents</summary>
      <nav aria-label="Table of contents" className="mt-3">
        <ol className="note-toc-list">
          {visibleHeadings.map((heading) => (
            <li key={heading.id} className={heading.level === 3 ? "note-toc-nested" : undefined}>
              <Link href={`#${heading.id}`} className={heading.id === activeId ? "note-toc-link-active" : undefined} aria-current={heading.id === activeId ? "location" : undefined}>{heading.title}</Link>
            </li>
          ))}
        </ol>
      </nav>
    </details>
  );
}