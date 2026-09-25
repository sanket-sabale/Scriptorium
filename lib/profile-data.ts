export interface ProfileContact {
  label: string;
  value: string;
  href?: string;
  icon: "email" | "location" | "github" | "linkedin" | "website";
}

export interface ProfileExperience {
  role: string;
  company: string;
  employmentType?: string;
  dateRange: string;
  location?: string;
  highlights: string[];
}

export interface ProfileEducation {
  institution: string;
  degree: string;
  dateRange: string;
  detail?: string;
}

export interface ProfileSkillGroup {
  category: string;
  skills: string[];
}

export interface ProfileProject {
  name: string;
  description: string;
  stack: string[];
  href?: string;
}

export interface ProfileData {
  name: string;
  title: string;
  tagline: string;
  photo: string;
  photoAlt: string;
  summary: string;
  contacts: ProfileContact[];
  experience: ProfileExperience[];
  education: ProfileEducation[];
  skillGroups: ProfileSkillGroup[];
  projects: ProfileProject[];
}

export const profileData: ProfileData = {
  name: "Sanket Sabale",
  title: "Full-Stack Developer",
  tagline: "Building thoughtful web experiences with modern engineering and timeless simplicity.",
  photo: "/profile-placeholder.svg",
  photoAlt: "Illustrated profile placeholder for Sanket Sabale",
  summary:
    "I build thoughtful digital tools that make complex work feel a little clearer. My practice sits between product thinking and hands-on engineering, with a soft spot for accessible interfaces, durable systems, and well-written documentation.",
  contacts: [
    { label: "Email", value: "sanketsabale2003@gmail.com", href: "mailto:sanketsabale2003@gmail.com", icon: "email" },
    { label: "Location", value: "Pune, India", icon: "location" },
    { label: "GitHub", value: "github.com/sanketsabale", href: "https://github.com/sanketsabale", icon: "github" },
    { label: "LinkedIn", value: "linkedin.com/in/sanketsabale", href: "https://www.linkedin.com/in/sanketsabale", icon: "linkedin" },
  ],
  experience: [
    {
      role: "Senior Software Engineer",
      company: "Northstar Systems",
      employmentType: "Full-time",
      dateRange: "2022 — Present",
      location: "Portland, Oregon",
      highlights: [
        "Led a product platform refresh that shortened key workflows and improved accessibility across the application.",
        "Partnered with design and product teams to turn ambiguous requirements into small, shippable increments.",
        "Mentored engineers through architectural decisions, code reviews, and sustainable delivery practices.",
      ],
    },
    {
      role: "Software Engineer",
      company: "Field Notes Studio",
      employmentType: "Full-time",
      dateRange: "2019 — 2022",
      location: "Remote",
      highlights: [
        "Built and maintained TypeScript and Node.js services supporting a growing customer-facing product.",
        "Introduced shared UI patterns that made new features faster to develop and easier to use.",
      ],
    },
  ],
  education: [
    {
      institution: "Oregon State University",
      degree: "B.S. in Computer Science",
      dateRange: "2015 — 2019",
      detail: "Focus in human-computer interaction and software systems.",
    },
  ],
  skillGroups: [
    { category: "Languages", skills: ["TypeScript", "JavaScript", "Python", "SQL"] },
    { category: "Frameworks", skills: ["React", "Next.js", "Node.js", "Tailwind CSS"] },
    { category: "Tools", skills: ["Git", "Docker", "PostgreSQL", "Figma"] },
  ],
  projects: [
    {
      name: "Scriptorium",
      description: "A personal knowledge base for notes, plans, and documentation.",
      stack: ["Next.js", "TypeScript", "Tailwind CSS"],
    },
  ],
};