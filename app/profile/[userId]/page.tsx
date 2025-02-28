import { PhotoViewer } from "@/components/photo-viewer";
import { ProfileResponse as ProfileData } from "@/lib/types/get-profile-response";

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
    <div className="flex flex-col">
      <div className="flex flex-row">
        <div className="rounded-full basis-1/3 border border-red-500">
          <PhotoViewer
            filename={profileData.profilePicture.filename}
            rounded={true}
          />
        </div>
        <div className="grow">{profileData.name}</div>
      </div>
    </div>
  );
}
