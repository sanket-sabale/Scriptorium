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
│   ├── profile/
│   │   └── page.tsx               # My Profile (resume-style)
│   ├── notes/
│   │   ├── personal/page.tsx
│   │   ├── ideas/page.tsx
│   │   └── archive/page.tsx
│   ├── plans/
│   │   ├── weekly/page.tsx
│   │   ├── quarterly/page.tsx
│   │   └── someday/page.tsx
│   └── documentation/
│       ├── getting-started/page.tsx
│       ├── reference/page.tsx
│       └── changelog/page.tsx
├── components/
│   ├── navbar.tsx
│   ├── nav-dropdown.tsx
│   ├── mobile-menu.tsx
│   └── content-page.tsx
├── lib/
│   └── profile-data.ts            # Typed profile/resume data
├── public/
│   └── profile.jpg                # Profile photo
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

---

## 📝 Customization

- **Profile content** — Edit `lib/profile-data.ts` to update your name, title, contact info, experience, education, and skills
- **Profile photo** — Replace `public/profile.jpg` with your own image
- **Theme colors** — Adjust the parchment/ink color palette in the Tailwind config or global CSS to personalize the look
- **Content pages** — Notes, Plans, and Documentation pages currently use placeholder content; replace with your own notes, markdown, or data source as needed

---

## 📌 Roadmap

- [ ] Connect Notes/Plans/Documentation to real content (markdown or JSON-based)
- [ ] Add search functionality
- [ ] Add tagging/categorization for notes
- [ ] Optional: "Download resume as PDF" button on the profile page

---

## 📄 License

This is a personal project. License terms are up to you — add one here if you plan to share or open-source it.