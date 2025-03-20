"use client";
import useStore from "@/lib/hooks/use-store";
import { useNewSessionStore } from "@/lib/stores/old-session-store";
import { BadgePlus, Compass, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "./ui/button";
export function BottomBar() {
  const router: string = usePathname();
  const store = useStore(useNewSessionStore, (state) => state);
  const activeButtonStyle: string =
    "bg-primaryContainer text-onPrimaryContainer rounded-full";
  const idleButtonStyle: string = "bg-transparent text-primary rounded-full";
  return (
    <footer className="bg-background dark:bg-secondary py-1 drop-shadow-4xl">
      <div className="flex justify-around">
        <Button
          className={router === "/" ? activeButtonStyle : idleButtonStyle}
          variant="link"
          size="icon"
        >
          <Link href="/">
            <Compass size={24} />
          </Link>
        </Button>
        <Button
          className={router === "/create" ? activeButtonStyle : idleButtonStyle}
          size="icon"
        >
          <Link href="/create">
            <BadgePlus size={24} />
          </Link>
        </Button>
        <Button
          className={
            router === `/profile/${store?.userId}`
              ? activeButtonStyle
              : idleButtonStyle
          }
          size="icon"
        >
          <Link href={`/profile/${store?.userId}`}>
            <User size={24} />
          </Link>
        </Button>
      </div>
    </footer>
  );
}
