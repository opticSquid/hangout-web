"use client";

import useSessionProvider from "@/lib/hooks/session-provider";
import { Button } from "./ui/button";

export function Logout() {
  const [sessionState, sessionActions] = useSessionProvider();
  const handleLogout = async () => {
    fetch(`${process.env.NEXT_PUBLIC_AUTH_API_URL}/user/logout`, {
      method: "DELETE",
      headers: new Headers({
        Authorization: `Bearer ${sessionState.accessToken}`,
      }),
    });
    sessionActions.reset();
  };
  return (
    <Button variant="destructive" size="sm" onClick={handleLogout}>
      Logout
    </Button>
  );
}
