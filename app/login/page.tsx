"use client";
import { LoadingOverlay } from "@/components/loading-overlay";
import { LoginForm } from "@/components/login-form";
import {
  DeviceInfo,
  OS,
  ScreenDimensions,
} from "@/lib/types/device-identifier-interface";
import { ErrorResponse } from "@/lib/types/error-response-interface";
import { LoginResponse } from "@/lib/types/login-response-interface";
import { LoginFormSchema } from "@/lib/types/loin-form-schema";
import { useEffect, useState } from "react";
import { z } from "zod";

export default function Login() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>({
    os: { name: "", version: "" },
    screen: { height: 0.0, width: 0.0 },
  });
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
  async function onSubmit(
    values: z.infer<typeof LoginFormSchema>
  ): Promise<void> {
    setIsSubmitted(true);
    console.log(values);
    const response = await fetch(
      `${process.env.BACKEND_BASE_URL}/auth/v1/public/login`,
      {
        method: "POST",
        headers: new Headers({
          os: deviceInfo.os.name,
          "screen-height": String(deviceInfo.screen.height),
          "screen-width": String(deviceInfo.screen.width),
        }),
        body: JSON.stringify(values),
      }
    );
    if (!response.ok) {
      const error: ErrorResponse = await response.json();
      console.error("could not login user", error);
    } else {
      //TODO: assign the tokens to zustand store
      const session: LoginResponse = await response.json();
    }
  }
  return (
    <LoadingOverlay visible={isSubmitted} message="Signing in...">
      <LoginForm isSubmitted={isSubmitted} onSubmit={onSubmit} />
    </LoadingOverlay>
  );
}
