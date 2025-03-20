import { BottomBar } from "@/components/bottom-bar";
import { ThemeProvider } from "@/components/theme-provider";
import { TopBar } from "@/components/top-bar";
import { SessionStoreProvider } from "@/lib/hooks/old-session-provider";
import type { Metadata } from "next";
import { Roboto_Flex } from "next/font/google";
import "./globals.css";
import { CSPostHogProvider } from "./providers";
import { DataInitalizer } from "@/lib/hooks/data-intializer";
import { ServiceWorkerStoreProvider } from "@/lib/hooks/service-worker-provider";
const robotoFlex = Roboto_Flex({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "HangOut",
  description: "Chill Bro!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <CSPostHogProvider>
        <body
          className={` ${robotoFlex.className} antialiased box-border scroll-smooth`}
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <SessionStoreProvider>
              <ServiceWorkerStoreProvider>
                <DataInitalizer />
                <div className="h-screen flex flex-col">
                  <TopBar />
                  <main className="grow overflow-y-auto">{children}</main>
                  <BottomBar />
                </div>
              </ServiceWorkerStoreProvider>
            </SessionStoreProvider>
          </ThemeProvider>
        </body>
      </CSPostHogProvider>
    </html>
  );
}
