import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Navbar } from "@/components/navbar";
import { getAllContent } from "@/lib/content/repository";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Scriptorium",
    template: "%s | Scriptorium",
  },
  description: "A quiet place for notes, plans, and documentation.",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const [notes, plans, documentation] = await Promise.all([
    getAllContent("notes"),
    getAllContent("plans"),
    getAllContent("documentation"),
  ]);

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: `(() => { try { const stored = localStorage.getItem("scriptorium-theme"); const theme = stored === "dark" || (!stored && window.matchMedia("(prefers-color-scheme: dark)").matches) ? "dark" : "light"; document.documentElement.dataset.theme = theme; } catch (_) {} })();` }} />
      </head>
      <body className="min-h-full flex flex-col">
        <Navbar notes={notes} plans={plans} documentation={documentation} />
        {children}
      </body>
    </html>
  );
}
