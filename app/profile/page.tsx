import {
  AboutSection,
  EducationSection,
  ExperienceTimeline,
  ProfileColumn,
  ProfileHero,
  ProjectsSection,
  SkillsSection,
} from "@/components/profile-sections";
import { ProfilePhoto } from "@/components/profile-photo";
import { profileData } from "@/lib/profile-data";
import { absoluteSiteUrl, createPageMetadata, serializeJsonLd } from "@/lib/seo";

export const metadata = createPageMetadata({
  path: "/profile",
  title: profileData.name,
  description: `Resume, experience, education, skills, and selected work for ${profileData.name}, ${profileData.title}.`,
  indexable: true,
});

export default function ProfilePage() {
  return (
    <main className="flex-1">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd({
            "@context": "https://schema.org",
            "@type": "ProfilePage",
            name: `${profileData.name} - Profile`,
            url: absoluteSiteUrl("/profile"),
            mainEntity: {
              "@type": "Person",
              name: profileData.name,
              jobTitle: profileData.title,
              image: absoluteSiteUrl(profileData.photo),
            },
          }),
        }}
      />
      <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8 sm:py-16 lg:py-20">
        <div className="profile-hero">
          <ProfilePhoto profile={profileData} />
          <ProfileHero profile={profileData} />
        </div>

        <div className="mt-12 grid gap-x-14 lg:grid-cols-[minmax(0,1fr)_19rem] lg:gap-x-16">
          <ProfileColumn>
            <AboutSection summary={profileData.summary} />
            <ExperienceTimeline experience={profileData.experience} />
            <EducationSection education={profileData.education} />
          </ProfileColumn>

          <aside className="mt-12 border-t border-ink/10 pt-10 lg:mt-0 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0">
            <SkillsSection groups={profileData.skillGroups} />
            <ProjectsSection projects={profileData.projects} />
          </aside>
        </div>
      </div>
    </main>
  );
}