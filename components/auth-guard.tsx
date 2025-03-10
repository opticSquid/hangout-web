"use client";
import useStore from "@/lib/hooks/use-store";
import { useNewSessionStore } from "@/lib/stores/session-store";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";

export function AuthGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  //const { isAuthenticated } = useSessionStore((state) => state);
  const store = useStore(useNewSessionStore, (state) => state);
  const [isAllowed, setIsAllowed] = useState<boolean>(false);
  const authenticationStatus = store?.isAuthenticated();
  useEffect(() => {
    console.log("is authenticated: ", store?.isAuthenticated());
    if (!store?.isAuthenticated()) {
      setIsAllowed(false);
      router.replace("/login");
    } else {
      setIsAllowed(true);
    }
  }, [store?.isAuthenticated, authenticationStatus, router]);
  if (!isAllowed) {
    return null;
  } else {
    return <>{children}</>;
  }
}
