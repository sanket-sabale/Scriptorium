import Image from "next/image";
import type { ReactNode } from "react";
import type {
  ProfileContact,
  ProfileData,
  ProfileEducation,
  ProfileExperience,
  ProfileProject,
  ProfileSkillGroup,
} from "@/lib/profile-data";

function ContactIcon({ icon }: Pick<ProfileContact, "icon">) {
  if (icon === "email") {
    return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><path d="M3 6.5h18v11H3z" /><path d="m3 7 9 6 9-6" /></svg>;
  }

  if (icon === "location") {
    return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z" /><circle cx="12" cy="10" r="2.25" /></svg>;
  }

  if (icon === "github") {
    return <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2.5a9.5 9.5 0 0 0-3 18.51c.48.09.65-.21.65-.46v-1.68c-2.64.57-3.2-1.12-3.2-1.12-.44-1.1-1.08-1.4-1.08-1.4-.88-.6.07-.59.07-.59.97.07 1.48 1 1.48 1 .87 1.48 2.28 1.05 2.84.8.09-.63.34-1.05.62-1.29-2.11-.24-4.33-1.05-4.33-4.7 0-1.04.37-1.89.98-2.56-.1-.24-.43-1.21.09-2.52 0 0 .8-.26 2.62.98A9.1 9.1 0 0 1 12 7.15c.81 0 1.63.11 2.39.32 1.82-1.24 2.62-.98 2.62-.98.52 1.31.19 2.28.09 2.52.61.67.19 2.28.19 2.28.34.67.98 1.52.98 2.56 0 3.66-2.22 4.46-4.34 4.7.35.3.66.87.66 1.76v2.61c0 .25.17.55.66.46A9.5 9.5 0 0 0 12 2.5Z" /></svg>;
  }

  if (icon === "linkedin") {
    return <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M5.1 7.1a1.6 1.6 0 1 1 0-3.2 1.6 1.6 0 0 1 0 3.2ZM3.7 20.1h2.8v-10H3.7v10ZM8.3 10.1H11v1.37h.04c.38-.72 1.32-1.48 2.72-1.48 2.91 0 3.45 1.91 3.45 4.4v5.7h-2.8v-5.06c0-1.21-.02-2.76-1.68-2.76-1.68 0-1.94 1.31-1.94 2.67v5.15H8.3v-10Z" /></svg>;
  }

  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><circle cx="12" cy="12" r="8.5" /><path d="M3.8 12h16.4M12 3.5c2.1 2.3 3.2 5.1 3.2 8.5s-1.1 6.2-3.2 8.5c-2.1-2.3-3.2-5.1-3.2-8.5S9.9 5.8 12 3.5Z" /></svg>;
}

export function ContactLinks({ contacts }: { contacts: ProfileContact[] }) {
  return (
    <div className="flex flex-wrap gap-x-5 gap-y-3 text-sm text-ink/65">
      {contacts.map((contact) => {
        const content = (
          <>
            <span className="h-4 w-4 shrink-0 text-maroon"><ContactIcon icon={contact.icon} /></span>
            <span>{contact.value}</span>
          </>
        );

        return contact.href ? (
          <a
            key={contact.label}
            href={contact.href}
            target={contact.href.startsWith("http") ? "_blank" : undefined}
            rel={contact.href.startsWith("http") ? "noreferrer" : undefined}
            aria-label={`${contact.label}: ${contact.value}`}
            className="profile-contact-link inline-flex items-center gap-2"
          >
            {content}
          </a>
        ) : (
          <span key={contact.label} className="inline-flex items-center gap-2" aria-label={`${contact.label}: ${contact.value}`}>
            {content}
          </span>
        );
      })}
    </div>
  );
}

export function ProfileHero({ profile }: { profile: ProfileData }) {
  return (
    <header className="profile-hero">
      <Image
        src={profile.photo}
        alt={profile.photoAlt}
        width={176}
        height={176}
        priority
        className="profile-portrait h-36 w-36 shrink-0 rounded-full object-cover sm:h-44 sm:w-44"
      />
      <div className="min-w-0 text-center sm:text-left">
        <p className="profile-kicker">The keeper of these pages</p>
        <h1 className="mt-3 font-display text-5xl leading-[1.02] tracking-[-0.02em] text-ink sm:text-6xl">{profile.name}</h1>
        <p className="mt-3 text-lg text-maroon">{profile.title}</p>
        <p className="mt-4 max-w-xl font-display text-xl leading-8 text-ink/72">“{profile.tagline}”</p>
        <div className="mt-6 flex justify-center sm:justify-start">
          <ContactLinks contacts={profile.contacts} />
        </div>
      </div>
    </header>
  );
}

function SectionHeading({ index, title }: { index: string; title: string }) {
  return (
    <div className="profile-section-heading">
      <span>{index}</span>
      <h2>{title}</h2>
    </div>
  );
}

export function AboutSection({ summary }: { summary: string }) {
  return (
    <section className="profile-section" aria-labelledby="about-heading">
      <SectionHeading index="01" title="About me" />
      <h2 id="about-heading" className="sr-only">About me</h2>
      <p className="profile-lede">{summary}</p>
    </section>
  );
}

function ExperienceItem({ entry }: { entry: ProfileExperience }) {
  return (
    <article className="profile-timeline-item">
      <div className="flex flex-col justify-between gap-2 sm:flex-row sm:gap-8">
        <div>
          <h3 className="font-display text-2xl text-ink">{entry.role}</h3>
          <p className="mt-1 text-maroon">{entry.company}{entry.employmentType ? <span className="text-ink/45"> · {entry.employmentType}</span> : null}</p>
        </div>
        <div className="shrink-0 text-sm text-ink/55 sm:text-right">
          <p>{entry.dateRange}</p>
          {entry.location ? <p className="mt-1">{entry.location}</p> : null}
        </div>
      </div>
      <ul className="mt-4 space-y-2 text-sm leading-6 text-ink/70">
        {entry.highlights.map((highlight) => <li key={highlight} className="pl-5 before:mr-2 before:text-maroon before:content-['•']">{highlight}</li>)}
      </ul>
    </article>
  );
}

export function ExperienceTimeline({ experience }: { experience: ProfileExperience[] }) {
  return (
    <section className="profile-section" aria-labelledby="experience-heading">
      <SectionHeading index="02" title="Experience" />
      <h2 id="experience-heading" className="sr-only">Experience</h2>
      <div className="profile-timeline">
        {experience.map((entry) => <ExperienceItem key={`${entry.company}-${entry.role}`} entry={entry} />)}
      </div>
    </section>
  );
}

export function EducationSection({ education }: { education: ProfileEducation[] }) {
  return (
    <section className="profile-section" aria-labelledby="education-heading">
      <SectionHeading index="03" title="Education" />
      <h2 id="education-heading" className="sr-only">Education</h2>
      <div className="space-y-6">
        {education.map((entry) => (
          <article key={`${entry.institution}-${entry.degree}`} className="flex flex-col justify-between gap-2 sm:flex-row sm:gap-6">
            <div>
              <h3 className="font-display text-xl text-ink">{entry.degree}</h3>
              <p className="mt-1 text-maroon">{entry.institution}</p>
              {entry.detail ? <p className="mt-2 text-sm leading-6 text-ink/65">{entry.detail}</p> : null}
            </div>
            <p className="shrink-0 text-sm text-ink/55 sm:pt-1 sm:text-right">{entry.dateRange}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function SkillGroup({ group }: { group: ProfileSkillGroup }) {
  return (
    <div>
      <h3 className="profile-skill-category">{group.category}</h3>
      <div className="mt-3 flex flex-wrap gap-2">
        {group.skills.map((skill) => <span key={skill} className="profile-skill-tag">{skill}</span>)}
      </div>
    </div>
  );
}

export function SkillsSection({ groups }: { groups: ProfileSkillGroup[] }) {
  return (
    <section className="profile-aside-section" aria-labelledby="skills-heading">
      <SectionHeading index="04" title="Skills" />
      <h2 id="skills-heading" className="sr-only">Skills</h2>
      <div className="space-y-6">
        {groups.map((group) => <SkillGroup key={group.category} group={group} />)}
      </div>
    </section>
  );
}

function ProjectEntry({ project }: { project: ProfileProject }) {
  const content = (
    <>
      <div className="flex items-start justify-between gap-4">
        <h3 className="font-display text-2xl text-ink">{project.name}</h3>
        {project.href ? <span aria-hidden="true" className="text-lg text-maroon transition-transform group-hover:translate-x-1">↗</span> : null}
      </div>
      <p className="mt-3 text-sm leading-6 text-ink/68">{project.description}</p>
      <div className="mt-4 flex flex-wrap gap-x-3 gap-y-1 text-xs uppercase tracking-[0.12em] text-maroon/80">
        {project.stack.map((technology) => <span key={technology}>{technology}</span>)}
      </div>
    </>
  );

  return project.href ? (
    <a href={project.href} target="_blank" rel="noreferrer" className="profile-project-row group block">
      {content}
    </a>
  ) : (
    <div className="profile-project-row">{content}</div>
  );
}

export function ProjectsSection({ projects }: { projects: ProfileProject[] }) {
  return (
    <section className="profile-aside-section" aria-labelledby="projects-heading">
      <SectionHeading index="05" title="Selected projects" />
      <h2 id="projects-heading" className="sr-only">Selected projects</h2>
      <div className="space-y-4">
        {projects.map((project) => <ProjectEntry key={project.name} project={project} />)}
      </div>
    </section>
  );
}

export function ProfileColumn({ children }: { children: ReactNode }) {
  return <div>{children}</div>;
}