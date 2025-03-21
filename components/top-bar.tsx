import { Bell } from "lucide-react";
import { ModeToggle } from "./mode-toggle";
import { Button } from "./ui/button";
import Link from "next/link";

export function TopBar() {
  return (
    <div className="flex flex-row justify-center items-center drop-shadow-3xl border-b h-[5vh]">
      <ModeToggle />
      <div className="grow text-center">HangOut!</div>
      <Link href="/notifications">
        <Button variant="link" size="icon">
          <Bell size={18} />
        </Button>
      </Link>
    </div>
  );
}
