"use client";
import { BadgePlus, Bell, Compass, User } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import Image from "next/image";

export function SideBar() {
  const router = useRouter();
  const pathname = usePathname(); // Directly from Next.js router
  const [currentPath, setCurrentPath] = useState(pathname);

  useEffect(() => {
    setCurrentPath(pathname); // Ensure the state updates on route change
  }, [pathname]);

  return (
    <section className="drop-shadow-4xl w-1/5">
      <Image src="/logo.png" alt="Logo" width={2048} height={2048} />
      <div className="text-center text-xl tracking-wide">HangOut</div>
      <div className="flex flex-col shrink  justify-start items-start gap-y-4 mt-4  ml-4">
        <Button
          variant={currentPath === "/" ? "outline" : "secondary"}
          size="lg"
          onClick={() => router.push("/")}
          role="link"
        >
          <Compass size={24} />
          &nbsp;Explore
        </Button>
        <Button
          variant={currentPath === "/create" ? "outline" : "secondary"}
          size="lg"
          onClick={() => router.push("/create")}
          role="link"
        >
          <BadgePlus size={24} />
          &nbsp;Create
        </Button>
        <Button
          variant={currentPath === "/notifications" ? "outline" : "secondary"}
          size="lg"
          onClick={() => router.push("/notifications")}
          role="link"
        >
          <Bell size={24} />
          &nbsp;Notifications
        </Button>
        <Button
          variant={currentPath === "/profile" ? "outline" : "secondary"}
          size="lg"
          onClick={() => router.push("/profile")}
          role="link"
        >
          <User size={24} />
          &nbsp;Profile
        </Button>
      </div>
    </section>
  );
}
