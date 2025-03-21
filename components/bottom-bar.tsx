"use client";
import useSessionProvider from "@/lib/hooks/session-provider";
import { BadgePlus, Compass, User } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "./ui/button";
export function BottomBar() {
  const path: string = usePathname();
  const router = useRouter();
  const [sessionState] = useSessionProvider();
  const activeButtonStyle: string =
    "bg-primaryContainer text-onPrimaryContainer rounded-full";
  const idleButtonStyle: string = "bg-transparent text-primary rounded-full";
  const navigateHome = () => {
    router.push("/");
  };
  const navigateCreate = () => {
    router.push("/create");
  };
  const navigateProfile = () => {
    router.push(`/profile/${sessionState.userId}`);
  };
  return (
    <footer className="bg-background dark:bg-secondary h-[5vh] w-screen drop-shadow-4xl flex flex-row justify-around">
      <Button
        className={path === "/" ? activeButtonStyle : idleButtonStyle}
        variant="link"
        size="icon"
        onClick={navigateHome}
      >
        <Compass size={24} />
      </Button>
      <Button
        className={path === "/create" ? activeButtonStyle : idleButtonStyle}
        size="icon"
        onClick={navigateCreate}
      >
        <BadgePlus size={24} />
      </Button>
      <Button
        className={
          path === `/profile/${sessionState.userId}`
            ? activeButtonStyle
            : idleButtonStyle
        }
        size="icon"
        onClick={navigateProfile}
      >
        <User size={24} />
      </Button>
    </footer>
  );
}
