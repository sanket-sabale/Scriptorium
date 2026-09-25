import type { ReactNode } from "react";

type ContentPageProps = {
  eyebrow: string;
  title: string;
  description: string;
  children?: ReactNode;
};

export function ContentPage({ eyebrow, title, description, children }: ContentPageProps) {
  return (
    <main className="flex-1 page-transition">
      <div className="mx-auto max-w-5xl px-5 py-16 sm:px-8 sm:py-20">
        <div className="max-w-3xl">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-maroon">{eyebrow}</p>
          <h1 className="font-display text-4xl leading-tight text-ink sm:text-5xl">{title}</h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-ink/70">{description}</p>
        </div>
        <div className="mt-12 border-t border-ink/10 pt-8 text-[1.02rem] leading-8 text-ink/75">
          {children ?? <p>This space is ready for your own material.</p>}
        </div>
      </div>
    </main>
  );
}