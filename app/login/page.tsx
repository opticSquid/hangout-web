"use client";
import { LoadingOverlay } from "@/components/loading-overlay";
import { LoginForm } from "@/components/login-form";
import { UntrustedSessionAlert } from "@/components/utrusted-session-alert";
import { useSessionStore } from "@/lib/hooks/session-provider";
import {
  DeviceInfo,
  OS,
  ScreenDimensions,
} from "@/lib/types/device-identifier-interface";
import { ErrorResponse } from "@/lib/types/error-response-interface";
import { Session } from "@/lib/types/login-response-interface";
import { LoginFormSchema } from "@/lib/types/login-form-schema";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { z } from "zod";

export default function Login() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>({
    os: { name: "", version: "" },
    screen: { height: 0.0, width: 0.0 },
  });
  const [openUntrustedSessionAlert, setOpenUntrustedSessionAlert] =
    useState(false);
  const router = useRouter();
  const { setAccessToken, setRefreshToken, setTrustedSession } =
    useSessionStore((state) => state);
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
    try {
      const response: Response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/auth-api/v1/public/login`,
        {
          method: "POST",
          headers: new Headers({
            os: deviceInfo.os.name,
            "screen-height": String(deviceInfo.screen.height),
            "screen-width": String(deviceInfo.screen.width),
            "Content-Type": "application/json",
          }),
          body: JSON.stringify(values),
        }
      );
      if (response.status === 200) {
        const session: Session = await response.json();
        setAccessToken(session.accessToken);
        setRefreshToken(session.refreshToken);
        setTrustedSession(true);
        router.push("/");
      } else if (response.status === 307) {
        const session: Session = await response.json();
        setAccessToken(session.accessToken);
        setRefreshToken(session.refreshToken);
        setTrustedSession(false);
        setOpenUntrustedSessionAlert(true);
      } else {
        const error: ErrorResponse = await response.json();
        console.error("could not login user", error);
      }
    } catch (error: unknown) {
      console.error(
        "could not perform http request. Something went wrong, error: ",
        error
      );
    } finally {
      setIsSubmitted(false);
    }
  }
  return (
    <>
      <LoadingOverlay visible={isSubmitted} message="Signing in...">
        <LoginForm isSubmitted={isSubmitted} onSubmit={onSubmit} />
      </LoadingOverlay>
      <UntrustedSessionAlert open={openUntrustedSessionAlert} />
    </>
  );
}
