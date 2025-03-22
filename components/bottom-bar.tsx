"use client";
import { BadgePlus, Compass, User } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Button } from "./ui/button";

export function BottomBar() {
  const router = useRouter();
  const pathname = usePathname(); // Directly from Next.js router
  const [currentPath, setCurrentPath] = useState(pathname);

  useEffect(() => {
    setCurrentPath(pathname); // Ensure the state updates on route change
  }, [pathname]);

  const activeButtonStyle =
    "bg-primaryContainer text-onPrimaryContainer rounded-full";
  const idleButtonStyle = "bg-transparent text-primary rounded-full";

  return (
    <footer className="bg-background dark:bg-secondary h-[5vh] w-screen drop-shadow-4xl flex flex-row justify-around">
      <Button
        className={currentPath === "/" ? activeButtonStyle : idleButtonStyle}
        variant="link"
        size="icon"
        onClick={() => router.push("/")}
      >
        <Compass size={24} />
      </Button>
      <Button
        className={
          currentPath === "/create" ? activeButtonStyle : idleButtonStyle
        }
        size="icon"
        onClick={() => router.push("/create")}
      >
        <BadgePlus size={24} />
      </Button>
      <Button
        className={
          currentPath === "/profile" ? activeButtonStyle : idleButtonStyle
        }
        size="icon"
        onClick={() => router.push("/profile")}
      >
        <User size={24} />
      </Button>
    </footer>
  );
}
