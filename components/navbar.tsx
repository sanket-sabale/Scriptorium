"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ThemeToggle } from "@/components/theme-toggle";
import type { ContentMetadata } from "@/lib/content/repository";

type NavItem = {
  label: string;
  href: string;
};

type DropdownName = "notes" | "plans" | "documentation";

type DropdownConfig = {
  label: string;
  items: NavItem[];
};

const dropdownNames: DropdownName[] = ["notes", "plans", "documentation"];

function isPathActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

function Chevron({ open }: { open: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={`ml-2 h-1.5 w-1.5 rotate-45 border-b border-r border-current transition-transform ${
        open ? "-translate-y-0.5 rotate-[225deg]" : ""
      }`}
    />
  );
}

function DropdownMenu({
  dropdown,
  open,
  pathname,
  onToggle,
  onSelect,
}: {
  dropdown: DropdownConfig;
  open: boolean;
  pathname: string;
  onToggle: () => void;
  onSelect: () => void;
}) {
  const active = dropdown.items.some((item) => isPathActive(pathname, item.href));

  return (
    <div className="relative">
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={onToggle}
        className={`nav-link ${active ? "nav-link-active" : ""}`}
      >
        {dropdown.label}
        <Chevron open={open} />
      </button>
      {open ? (
        <div className="absolute right-0 top-[calc(100%+0.75rem)] z-30 min-w-48 rounded-xl border border-ink/10 bg-parchment-50 p-2 shadow-menu">
          {dropdown.items.length ? dropdown.items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={onSelect}
              className={`dropdown-link ${isPathActive(pathname, item.href) ? "dropdown-link-active" : ""}`}
            >
              {item.label}
            </Link>
          )) : <span className="block px-3 py-2 text-sm text-ink/60">No published {dropdown.label.toLocaleLowerCase()} yet.</span>}
        </div>
      ) : null}
    </div>
  );
}

export function Navbar({ notes, plans, documentation }: { notes: ContentMetadata[]; plans: ContentMetadata[]; documentation: ContentMetadata[] }) {
  const pathname = usePathname();
  const [openDropdown, setOpenDropdown] = useState<DropdownName | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileDropdown, setMobileDropdown] = useState<DropdownName | null>(null);
  const navRef = useRef<HTMLElement>(null);
  const dropdowns: Record<DropdownName, DropdownConfig> = {
    notes: { label: "Notes", items: notes.map((note) => ({ label: note.title, href: `/notes/${note.slug}` })) },
    plans: { label: "Plans", items: plans.map((plan) => ({ label: plan.title, href: `/plans/${plan.slug}` })) },
    documentation: { label: "Documentation", items: documentation.map((item) => ({ label: item.title, href: `/documentation/${item.slug}` })) },
  };

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (!navRef.current?.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpenDropdown(null);
        setMobileOpen(false);
        setMobileDropdown(null);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  function toggleDropdown(name: DropdownName) {
    setOpenDropdown((current) => (current === name ? null : name));
  }

  function closeMenus() {
    setOpenDropdown(null);
    setMobileOpen(false);
    setMobileDropdown(null);
  }

  return (
    <header ref={navRef} className="sticky top-0 z-40 border-b border-ink/10 bg-parchment-50/95 backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8" aria-label="Main navigation">
        <Link href="/" onClick={closeMenus} className="font-display text-2xl font-semibold tracking-tight text-maroon" aria-label="Scriptorium home">
          Scriptorium
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          <Link href="/" onClick={closeMenus} className={`nav-link ${pathname === "/" ? "nav-link-active" : ""}`}>
            Home
          </Link>
          <Link href="/profile" onClick={closeMenus} className={`nav-link ${isPathActive(pathname, "/profile") ? "nav-link-active" : ""}`}>
            My Profile
          </Link>
          {dropdownNames.map((name) => (
            <DropdownMenu
              key={name}
              dropdown={dropdowns[name]}
              open={openDropdown === name}
              pathname={pathname}
              onToggle={() => toggleDropdown(name)}
              onSelect={() => setOpenDropdown(null)}
            />
          ))}
          <ThemeToggle />
        </div>

        <button
          type="button"
          aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((open) => !open)}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-ink/10 text-ink transition hover:border-maroon/40 hover:text-maroon md:hidden"
        >
          <span className="sr-only">Menu</span>
          <span className="flex w-5 flex-col gap-1.5" aria-hidden="true">
            <span className={`h-px w-full bg-current transition ${mobileOpen ? "translate-y-2 rotate-45" : ""}`} />
            <span className={`h-px w-full bg-current transition ${mobileOpen ? "opacity-0" : ""}`} />
            <span className={`h-px w-full bg-current transition ${mobileOpen ? "-translate-y-2 -rotate-45" : ""}`} />
          </span>
        </button>
      </nav>

      {mobileOpen ? (
        <div className="border-t border-ink/10 px-5 pb-5 pt-3 md:hidden sm:px-8">
          <div className="mx-auto max-w-7xl">
            <Link href="/" onClick={closeMenus} className={`mobile-nav-link ${pathname === "/" ? "mobile-nav-link-active" : ""}`}>
              Home
            </Link>
            <Link href="/profile" onClick={closeMenus} className={`mobile-nav-link ${isPathActive(pathname, "/profile") ? "mobile-nav-link-active" : ""}`}>
              My Profile
            </Link>
            {dropdownNames.map((name) => {
              const dropdown = dropdowns[name];
              const active = dropdown.items.some((item) => isPathActive(pathname, item.href));
              const expanded = mobileDropdown === name;
              return (
                <div key={name} className="border-t border-ink/10">
                  <button
                    type="button"
                    aria-expanded={expanded}
                    onClick={() => setMobileDropdown(expanded ? null : name)}
                    className={`mobile-nav-link w-full justify-between ${active ? "mobile-nav-link-active" : ""}`}
                  >
                    {dropdown.label}
                    <Chevron open={expanded} />
                  </button>
                  {expanded ? (
                    <div className="mb-2 ml-4 border-l border-maroon/20 pl-3">
                      {dropdown.items.length ? dropdown.items.map((item) => (
                        <Link key={item.href} href={item.href} onClick={closeMenus} className="mobile-sub-link">
                          {item.label}
                        </Link>
                      )) : <span className="mobile-sub-link text-ink/60">No published {dropdown.label.toLocaleLowerCase()} yet.</span>}
                    </div>
                  ) : null}
                </div>
              );
            })}
            <div className="border-t border-ink/10 pt-3">
              <ThemeToggle />
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}