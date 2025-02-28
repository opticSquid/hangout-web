import { PhotoViewer } from "@/components/photo-viewer";
import { Button } from "@/components/ui/button";
import { ProfileResponse as ProfileData } from "@/lib/types/get-profile-response";
import { Grid3X3 } from "lucide-react";

export default async function Profile({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const profileResponse: Response = await fetch(
    `${process.env.NEXT_PUBLIC_PROFILE_API_URL}/profile/${
      (
        await params
      ).userId
    }`
  );
  const profileData: ProfileData = await profileResponse.json();

  return (
    <div className="flex flex-col p-1 space-y-2">
      <div className="flex flex-row items-center justify-center">
        <div className="rounded-full basis-1/3">
          <PhotoViewer
            filename={profileData.profilePicture.filename}
            rounded={true}
          />
        </div>
        <div className="grow text-lg font-medium tracking-wide">
          {profileData.name}
        </div>
      </div>
      <div className="flex flex-row border-t border-b justify-center">
        <Button variant="ghost" size="icon">
          <Grid3X3 />
          &nbsp;POSTS
        </Button>
      </div>
    </div>
  );
}
