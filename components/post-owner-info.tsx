"use client";
import { PostOwner } from "@/lib/types/post-owner-interface";
import { Dot } from "lucide-react";
import dynamic from "next/dynamic";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { PhotoViewer } from "./photo-viewer";
const ShowPostLocationContainer = dynamic(
  () => import("@/components/post-location-alert"),
  { ssr: false, loading: () => <p>Loading...</p> }
);
export function PostOwnerInfo({
  owner,
  showDistance,
}: {
  owner: PostOwner;
  showDistance: boolean;
}) {
  const distance =
    owner.distance / 1000 < 1
      ? "< 1 km"
      : (owner.distance / 1000).toFixed(2) + " km";
  const address = `${owner.city}, ${owner.state} ${
    showDistance && "(" + distance + ")"
  }`;
  return (
    <div className="flex flex-row ml-1">
      <div className="basis-10 flex items-center">
        <PhotoViewer filename={owner.photo} rounded={true} radius="small" />
      </div>
      <div className="ml-1 flex flex-col gap-0">
        <div className="font-semibold mb-0">{owner.name}</div>
        <div className="text-sm font-light tracking-tight flex flex-row items-center">
          <div className="text-primaryButton font-thin italic">
            {owner.category ? owner.category : "community post"}
          </div>
          <Dot size={16} />
          <ShowPostLocationContainer
            address={address}
            location={owner.location}
          />
        </div>
      </div>
      <div className="grow" />
    </div>
  );
}
