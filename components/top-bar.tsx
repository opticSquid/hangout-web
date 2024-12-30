import { Bell } from "lucide-react";
import { ModeToggle } from "./mode-toggle";
import { Button } from "./ui/button";
import Link from "next/link";

export function TopBar() {
  return (
    <div className="flex flex-row items-center z-10 drop-shadow-3xl border-b">
      <div className="flex-none">
        <ModeToggle />
      </div>
      <div className="flex-1 text-center">HangOut!</div>
      <div className="flex-none">
        <Link href="/notifications">
          <Button variant="link" size="icon">
            <Bell size={18} />
          </Button>
        </Link>
      </div>
    </div>
  );
}
