"use client";

import { useSessionContext } from "@/lib/hooks/session-provider";
import {
  DeviceInfo,
  OS,
  ScreenDimensions,
} from "@/lib/types/device-identifier-interface";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";

export function Logout() {
  const [sessionState, sessionActions] = useSessionContext();
  const router = useRouter();
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>({
    os: { name: "", version: "" },
    screen: { height: 0.0, width: 0.0 },
  });

  // collects device info
  useEffect(() => {
    const userAgent = window.navigator.userAgent;

    const detectOS = (): OS => {
      const osMap: { [key: string]: OS } = {
        windows: { name: "Windows" },
        macos: { name: "macOS" },
        linux: { name: "Linux" },
        android: { name: "Android" },
        ios: { name: "iOS" },
      };

      for (const [key, value] of Object.entries(osMap)) {
        if (userAgent.toLowerCase().includes(key)) {
          return value;
        }
      }

      return { name: "Unknown" };
    };

    const getScreenDimensions = (): ScreenDimensions => {
      const { innerWidth, innerHeight } = window;
      let width = innerWidth;
      let height = innerHeight;

      if (typeof screen.width === "number") {
        width = screen.width;
      }
      if (typeof screen.height === "number") {
        height = screen.height;
      }

      return { width, height };
    };

    const updateDeviceInfo = () => {
      setDeviceInfo({
        os: detectOS(),
        screen: getScreenDimensions(),
      });
    };

    updateDeviceInfo(); // Initial data on component mount
    window.addEventListener("resize", updateDeviceInfo);

    return () => {
      window.removeEventListener("resize", updateDeviceInfo);
    };
  }, []);

  const handleLogout = async () => {
    const response: Response = await fetch(
      `${process.env.NEXT_PUBLIC_AUTH_API_URL}/user/logout`,
      {
        method: "DELETE",
        headers: new Headers({
          Authorization: `Bearer ${sessionState.accessToken}`,
          os: deviceInfo.os.name,
          "screen-height": String(deviceInfo.screen.height),
          "screen-width": String(deviceInfo.screen.width),
          "Content-Type": "application/json",
        }),
      }
    );
    if (response.ok) {
      sessionActions.reset();
      router.replace("/");
    } else {
      alert("Error occured during logout");
    }
  };
  return (
    <Button variant="destructive" size="sm" onClick={handleLogout}>
      Logout
    </Button>
  );
}
