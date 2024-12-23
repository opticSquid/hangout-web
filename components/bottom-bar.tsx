"use client";
import { BadgePlus, Compass, Ticket, User } from "lucide-react";
import { usePathname } from "next/navigation";
import { Button } from "./ui/button";
import Link from "next/link";
export function BottomBar() {
  const router: string = usePathname();
  const activeButtonStyle: string =
    "bg-primaryContainer text-onPrimaryContainer rounded-full transition ease-in duration-100";
  const idleButtonStyle: string =
    "bg-transparent text-primary rounded-full transition ease-out duration-100";
  return (
    <footer className="fixed bottom-0 left-0 right-0 z-50 pt-2 pb-2 pl-1 pr-1 bg-background rounded-t-xl border-t">
      <div className="flex justify-around">
        <Button
          className={router == "/" ? activeButtonStyle : idleButtonStyle}
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
            router === "/bookings" ? activeButtonStyle : idleButtonStyle
          }
          size="icon"
        >
          <Link href="/bookings">
            <Ticket size={24} />
          </Link>
        </Button>
        <Button
          className={
            router === "/profile" ? activeButtonStyle : idleButtonStyle
          }
          size="icon"
        >
          <Link href="/profile">
            <User size={24} />
          </Link>
        </Button>
      </div>
    </footer>
  );
}
