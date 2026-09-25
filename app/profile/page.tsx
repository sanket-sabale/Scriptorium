import {
  AboutSection,
  EducationSection,
  ExperienceTimeline,
  ProfileColumn,
  ProfileHero,
  ProjectsSection,
  SkillsSection,
} from "@/components/profile-sections";
import { profileData } from "@/lib/profile-data";

export default function ProfilePage() {
  return (
    <main className="flex-1">
      <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8 sm:py-16 lg:py-20">
        <ProfileHero profile={profileData} />

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