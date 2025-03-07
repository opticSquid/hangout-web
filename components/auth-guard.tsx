"use client";
import { useSessionStore } from "@/lib/hooks/session-provider";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";

export function AuthGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { isAuthenticated } = useSessionStore((state) => state);
  const [isAllowed, setIsAllowed] = useState<boolean>(false);
  const authenticationStatus = isAuthenticated();
  useEffect(() => {
    console.log("is authenticated: ", isAuthenticated());
    if (!isAuthenticated()) {
      setIsAllowed(false);
      router.replace("/login");
    } else {
      setIsAllowed(true);
    }
  }, [isAuthenticated, authenticationStatus, router]);
  if (!isAllowed) {
    return null;
  } else {
    return <>{children}</>;
  }
}
