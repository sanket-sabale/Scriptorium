import Image from "next/image";
import type { ProfileData } from "@/lib/profile-data";

type ProfilePhotoProps = {
  profile: Pick<ProfileData, "photo" | "photoAlt" | "photoPosition">;
};

export function ProfilePhoto({ profile }: ProfilePhotoProps) {
  return (
    <figure className="group mx-auto w-36 shrink-0 sm:w-40 lg:w-48">
      <div className="relative aspect-square rounded-full bg-gradient-to-br from-maroon via-border-strong to-parchment-200 p-[3px] shadow-lg shadow-ink/15 motion-safe:transition-shadow motion-safe:duration-300 group-hover:shadow-xl group-hover:shadow-ink/20">
        <div className="relative h-full w-full overflow-hidden rounded-full border-2 border-parchment-100 bg-parchment-100">
          <Image
            src={profile.photo}
            alt={profile.photoAlt}
            fill
            sizes="(max-width: 639px) 144px, (max-width: 1023px) 160px, 192px"
            priority
            className="object-cover object-center motion-safe:transition-transform motion-safe:duration-300 motion-safe:group-hover:scale-[1.03]"
            style={{ objectPosition: profile.photoPosition ?? "center 15%" }}
          />
        </div>
      </div>
      <span aria-hidden="true" className="mx-auto mt-4 block h-px w-12 bg-border-strong" />
    </figure>
  );
}