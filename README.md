# 📜 Scriptorium

**Scriptorium** is a personal knowledge-base web app for keeping notes, study material, documentation, and plans — all in one organized, easy-to-navigate place, along with a resume-style profile page.

Built as a static site with a warm, "old manuscript" aesthetic (parchment tones, serif typography) to match its name — in medieval times, a *scriptorium* was the room where manuscripts and knowledge were written and preserved.

---

## ✨ Features

- **Responsive Navbar** — Sticky top navigation with the app name as the logo, active-route highlighting, desktop dropdowns, and a mobile hamburger menu with accordion sections
- **Home Page** — Landing page introducing the app
- **My Profile** — A resume-style page with a profile photo, summary, experience, education, and skills
- **Notes** — Organized sub-sections: Personal, Ideas, Archive
- **Plans** — Organized sub-sections: Weekly, Quarterly, Someday
- **Documentation** — Organized sub-sections: Getting Started, Reference, Changelog
- **Fully Responsive** — Clean layout across mobile, tablet, and desktop
- **Static Site** — No backend or database required; fast and simple to deploy

---

## 🛠️ Tech Stack

- [Next.js](https://nextjs.org/) (App Router)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [React](https://react.dev/)

---

## 📁 Project Structure

```
scriptorium/
├── app/
│   ├── page.tsx                  # Home page
│   ├── profile/page.tsx
│   ├── notes/[slug]/page.tsx
│   ├── plans/[slug]/page.tsx
│   ├── documentation/[slug]/page.tsx
│   ├── robots.ts
│   ├── sitemap.ts
│   └── icon.svg
├── content/                      # Markdown files with front matter
├── components/
│   ├── navbar.tsx
│   ├── content-page.tsx
│   └── profile-photo.tsx
├── lib/
│   ├── profile-data.ts
│   └── seo.ts                     # Origin validation and shared metadata
├── public/
│   ├── profile_photo.png
│   └── scriptorium-social-preview.png
├── assets/
│   └── scriptorium-social-preview.svg
└── ...
```

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or later recommended)
- npm

### Installation

```bash
git clone <your-repo-url>
cd scriptorium
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the app.

### Build

```bash
npm run build
```

### Lint

```bash
npm run lint
```

### SEO Output Verification

After building and starting the production server, run `npm run verify:seo` with `NEXT_PUBLIC_SITE_URL` set to the same origin used for the build. The script checks route metadata, indexability, sitemap/robots output, JSON-LD, and image/favicon responses.

### Production URL

Set `NEXT_PUBLIC_SITE_URL` in the production build environment to the real public HTTPS origin (for example, the origin configured for your deployment, with no path, query, or fragment). This value is public site metadata, not a secret. No production domain is configured in this repository. Production builds fail when `NEXT_PUBLIC_SITE_URL` is missing, invalid, or points to a local/private origin; development defaults to `http://localhost:3000`.

Routes are statically prerendered by `next build`, but `next.config.ts` does not enable `output: "export"`; the current build is served by a Next.js runtime using `npm start`. Changing to a standalone static export requires a separate deployment decision.

---

## 📝 Customization

- **Profile content** — Edit `lib/profile-data.ts` to update your name, title, contact info, experience, education, and skills
- **Profile photo** — Replace `public/profile_photo.png` and update `lib/profile-data.ts` if its path changes
- **Theme colors** — Adjust the parchment/ink color palette in the Tailwind config or global CSS to personalize the look
- **Content pages** — Add Markdown under `content/notes`, `content/plans`, or `content/documentation`. A missing `status` defaults to `draft`; only `status: published` is included in generated routes. Add `indexable: true` to opt a substantive page into search indexing and the sitemap. Indexing is off by default.

Published Markdown is included in the public build and can be fetched directly. `noindex` and `robots.txt` are crawler instructions, not access control; do not put confidential notes or private plans in these folders.

Social platforms may cache preview images and metadata. After a deployment changes a card, use the relevant platform's preview/debugger or cache-refresh flow where available; local verification cannot guarantee a particular platform's rendering.

---

## 📌 Roadmap

- [ ] Connect Notes/Plans/Documentation to real content (markdown or JSON-based)
- [ ] Add search functionality
- [ ] Add tagging/categorization for notes
- [ ] Optional: "Download resume as PDF" button on the profile page

---

## 📄 License

This is a personal project. License terms are up to you — add one here if you plan to share or open-source it.