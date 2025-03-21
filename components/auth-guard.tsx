"use client";
import useSessionProvider from "@/lib/hooks/session-provider";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";

export function AuthGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  //const { isAuthenticated } = useSessionStore((state) => state);
  const [, sessionActions] = useSessionProvider();
  const [isAllowed, setIsAllowed] = useState<boolean>(false);
  const authenticationStatus = sessionActions.isAuthenticated();
  useEffect(() => {
    console.log("is authenticated: ", sessionActions.isAuthenticated());
    if (!sessionActions?.isAuthenticated()) {
      setIsAllowed(false);
      router.replace("/login");
    } else {
      setIsAllowed(true);
    }
  }, [sessionActions?.isAuthenticated, authenticationStatus, router]);
  if (!isAllowed) {
    return null;
  } else {
    return <>{children}</>;
  }
}
