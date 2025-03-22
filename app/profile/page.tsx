import { Logout } from "@/components/logout";
import { PhotoViewer } from "@/components/photo-viewer";
import { PostGrid } from "@/components/post-grid";
import { Button } from "@/components/ui/button";
import { ProfileData } from "@/lib/types/get-profile-response";
import { Grid3X3 } from "lucide-react";
import { cookies } from "next/headers";

export default async function Profile() {
  const cookieStore = await cookies();
  const userId: string | undefined = cookieStore.get("hangout|userId")?.value;

  const profileResponse: Response = await fetch(
    `${process.env.NEXT_PUBLIC_PROFILE_API_URL}/profile/${userId}`,
    {
      headers: new Headers({
        "Content-Type": "application/json",
      }),
    }
  );
  const profileData: ProfileData = await profileResponse.json();

  return (
    <>
      <div className="flex flex-row items-center justify-start p-2 gap-x-2">
        <div className="rounded-full">
          <PhotoViewer
            filename={profileData.profilePicture.filename}
            rounded={true}
            radius="medium"
          />
        </div>
        <div className="flex flex-col">
          <div className="grow text-lg font-medium tracking-wide">
            {profileData.name}
          </div>
          <Logout />
        </div>
      </div>
      <div className="flex flex-row border-t border-b justify-center">
        <Button variant="ghost" size="icon">
          <Grid3X3 />
          &nbsp;POSTS
        </Button>
      </div>
      <PostGrid />
    </>
  );
}
