"use client";
import { useEffect, useRef } from "react";
import {
  DeviceInfo,
  OS,
  ScreenDimensions,
} from "../types/device-identifier-interface";
import { useServiceWorkerStore } from "./service-worker-provider";
import { useSessionStore } from "./session-provider";
import { CookiesStorage } from "../cookie-storage";
import { useRouter } from "next/navigation";

export function DataInitalizer() {
  const deviceInfo = useRef<DeviceInfo>({
    os: { name: "", version: "" },
    screen: { height: 0.0, width: 0.0 },
  });
  const {
    clearAccessToken,
    refreshToken,
    setAccessToken,
    accessToken,
    userId,
  } = useSessionStore((state) => state);

  const { addWorker } = useServiceWorkerStore((state) => state);
  const router = useRouter();
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
      deviceInfo.current = {
        os: detectOS(),
        screen: getScreenDimensions(),
      };
    };

    updateDeviceInfo(); // Initial data on component mount
    window.addEventListener("resize", updateDeviceInfo);

    return () => {
      window.removeEventListener("resize", updateDeviceInfo);
    };
  }, []);

  // This useEffect hook periodically creates renew token request to renew access token
  useEffect(() => {
    function createRenewTokenEvent(registration: ServiceWorkerRegistration) {
      registration.active?.postMessage({
        type: "renew-token-request",
        refreshToken: refreshToken,
        deviceInfo: deviceInfo.current,
        backendUrl: process.env.NEXT_PUBLIC_BACKEND_BASE_URL,
      });
    }
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/service-worker.js")
        .then((registration) => {
          console.log(
            "service worker registered in scope: ",
            registration.scope
          );
          // adding this service worker in context so that it can be called from anywhere
          addWorker(registration);
          if (refreshToken) {
            console.info("user logged in, starting the timer to renew tokens");
            // ** This call immidiate after loading is required becuase we need to get a new token after a user had went offline for some time and came back
            createRenewTokenEvent(registration);
            setInterval(() => {
              console.log("firing renew token request event");
              clearAccessToken();
              createRenewTokenEvent(registration);
            }, 5 * 60 * 1000);
          }
        });
      navigator.serviceWorker.addEventListener("message", (event) => {
        if (event.data.type === "renew-token-response") {
          setAccessToken(event.data.accessToken);
          CookiesStorage.setItem("accessToken", event.data.accessToken);
        }
      });
    }
  }, [refreshToken, addWorker, clearAccessToken, setAccessToken]);

  // This useEffect checks if the profile of the logged in user exist, otherwise sends them to create profile page
  useEffect(() => {
    async function checkProfileExistence() {
      const profileResponse: Response = await fetch(
        `${process.env.NEXT_PUBLIC_PROFILE_API_URL}/profile`,
        {
          method: "GET",
          headers: new Headers({
            Authorization: `Bearer ${accessToken}`,
          }),
        }
      );
      if (profileResponse.status === 404) {
        router.replace(`/profile/${userId}/create`);
      }
    }
    if (accessToken) {
      checkProfileExistence();
    }
  }, [accessToken, router, userId]);

  //* Needed if we use VideoJs video player
  //setting this property for video-js to make it not choose any dimension
  // useEffect(() => {
  //   window.VIDEOJS_NO_DYNAMIC_STYLE = true;
  // });
  return <></>;
}
