"use client";
import { Post } from "@/components/post";
import { posts } from "@/lib/data";
import { useSessionStore } from "@/lib/hooks/session-provider";
import {
  DeviceInfo,
  OS,
  ScreenDimensions,
} from "@/lib/types/device-identifier-interface";
import type { PostObject } from "@/lib/types/post-interface";
import { useEffect, useState } from "react";
import { getCookie } from "typescript-cookie";
export default function Explore() {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>({
    os: { name: "", version: "" },
    screen: { height: 0.0, width: 0.0 },
  });
  const { refreshToken, setAccessToken, setRefreshToken, setTrustedSession } =
    useSessionStore((state) => state);
  // this useEffect hook collects device info and sets the headers
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
  //this useEffect hook loads data from cookie storage to state
  useEffect(() => {
    const base: string = "hangout-session|";
    setAccessToken(getCookie(base + "accessToken"));
    setRefreshToken(getCookie(base + "refreshToken"));
    setTrustedSession(
      getCookie(base + "trustedSession")
        ? getCookie(base + "trustedSession") === "true"
        : undefined
    );
  }, []);
  // This useEffect hook periodically creates renew token request to renew access token
  useEffect(() => {
    function createRenewTokenEvent(registration: ServiceWorkerRegistration) {
      registration.active?.postMessage({
        type: "renew-token-request",
        refreshToken: refreshToken,
        deviceInfo: deviceInfo,
        backendUrl: process.env.NEXT_PUBLIC_BACKEND_BASE_URL,
      });
    }
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/service-worker.js")
        .then((registration) => {
          if (refreshToken) {
            console.info("user logged in, starting the timer to renew tokens");
            // ** This call immidiate after loading is required becuase we need to get a new token after a user had went offline for some time and came back
            createRenewTokenEvent(registration);
            setInterval(() => {
              console.log("firing renew token request event");
              createRenewTokenEvent(registration);
            }, 5 * 60 * 1000);
          }
          console.log(
            "service worker registered in scope: ",
            registration.scope
          );
        });
      navigator.serviceWorker.addEventListener("message", (event) => {
        switch (event.data.type) {
          case "renew-token-response":
            setAccessToken(event.data.accessToken);
            break;
          default:
        }
      });
    }
  }, [refreshToken]);

  return (
    <div className="flex flex-col gap-2">
      {posts.map((p: PostObject) => (
        <Post key={p.postId} {...p}></Post>
      ))}
    </div>
  );
}
