import { Dot } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { PostOwner } from "@/lib/types/post-owner-interface";

export function PostOwnerInfo(owner: PostOwner) {
  return (
    <div className="flex flex-row ml-1">
      <div className="basis-10 flex items-center">
        <Avatar>
          <AvatarImage src={owner.photo} alt="@shadcn" />
          <AvatarFallback delayMs={500}>CN</AvatarFallback>
        </Avatar>
      </div>
      <div className="ml-1 flex flex-col gap-0">
        <div className="font-semibold mb-0">{owner.name}</div>
        <div className="text-sm font-light tracking-tight flex flex-row items-center">
          <div>{owner.category}</div>
          <Dot size={16} />
          <div>{owner.location}</div>
        </div>
      </div>
      <div className="grow"></div>
    </div>
  );
}
