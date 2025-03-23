"use client";
import { BadgePlus } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "./ui/card";

export function EmptyFeed() {
  const router = useRouter();
  const navigateCreate = () => {
    router.push("/create");
  };
  return (
    <div className="px-2 my-2">
      <Card className="text-center">
        <CardHeader>
          <CardTitle>🚨 Empty Vibes Alert! 🚨</CardTitle>
          <CardDescription>
            Looks like this spot is a ghost town… 👻 But hey, every legend
            starts somewhere! 👀
          </CardDescription>
        </CardHeader>
        <CardContent>
          Why scroll in silence when you can make some noise? 🥁 Drop your
          hottest take, a cool pic, or something totally random. Hit the&nbsp;
          <BadgePlus
            size={18}
            className="bg-primaryContainer text-onPrimaryContainer rounded-full inline"
          />
          &nbsp; button below and be the main character! ✨
        </CardContent>
        <CardFooter className="flex flex-row justify-center">
          <Button
            className="bg-primaryContainer text-onPrimaryContainer rounded-full p-6"
            size="icon"
            onClick={navigateCreate}
          >
            <BadgePlus size={36} />
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
