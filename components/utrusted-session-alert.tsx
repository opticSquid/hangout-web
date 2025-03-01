"use client";
import { CookiesStorage } from "@/lib/cookie-storage";
import { useSessionStore } from "@/lib/hooks/session-provider";
import {
  DeviceInfo,
  OS,
  ScreenDimensions,
} from "@/lib/types/device-identifier-interface";
import { ErrorResponse } from "@/lib/types/error-response-interface";
import { Session } from "@/lib/types/login-response-interface";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { LoadingOverlay } from "./loading-overlay";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
interface openDialog {
  open: boolean;
}
export function UntrustedSessionAlert({ open }: openDialog) {
  const [loading, setLoading] = useState(false);
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>({
    os: { name: "", version: "" },
    screen: { height: 0.0, width: 0.0 },
  });
  const router: AppRouterInstance = useRouter();
  const { accessToken, setAccessToken, setRefreshToken, setTrustedSession } =
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
  async function trustDevice(): Promise<void> {
    setLoading(true);
    try {
      const response: Response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/auth-api/v1/user/trust-device`,
        {
          method: "POST",
          headers: new Headers({
            os: deviceInfo.os.name,
            "screen-height": String(deviceInfo.screen.height),
            "screen-width": String(deviceInfo.screen.width),
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          }),
        }
      );
      if (response.status === 200) {
        const session: Session = await response.json();
        setAccessToken(session.accessToken);
        setRefreshToken(session.refreshToken);
        setTrustedSession(true);
        CookiesStorage.setItem("accessToken", session.accessToken);
        CookiesStorage.setItem("refreshToken", session.refreshToken);
        router.push("/");
      } else if (response.status >= 400 && response.status < 500) {
        alert("could not trust device");
      } else {
        const error: ErrorResponse = await response.json();
        console.error("could not login user. Internal Server Error", error);
      }
    } catch (error: unknown) {
      console.error(
        "could not perform http request. Something went wrong, error: ",
        error
      );
    } finally {
      setLoading(false);
    }
  }
  return (
    <LoadingOverlay visible={loading} message="ulocking platform...">
      <AlertDialog open={open}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>New Device Login Detected</AlertDialogTitle>
            <AlertDialogDescription>
              You are logging in through this device for the first time. Do you
              trust this device? If yes click on <strong>Trust session</strong>
              button and all capabilities of the platform will be unloked or if
              you click on <strong>Continue</strong> butoon you will be logged
              in but only some capabilities of the platform will be available
              and you will automatically be logged out within 10 mins
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => router.push("/")}>
              Continue
            </AlertDialogCancel>
            <AlertDialogAction onClick={trustDevice}>
              Trust session
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </LoadingOverlay>
  );
}
