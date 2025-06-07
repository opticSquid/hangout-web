import { BottomBar } from "@/components/bottom-bar";
import { ThemeProvider } from "@/components/theme-provider";
import { TopBar } from "@/components/top-bar";
import type { Metadata } from "next";
import { Roboto_Flex } from "next/font/google";
import "./globals.css";
import { CSPostHogProvider } from "./providers";
import { DataInitalizer } from "@/lib/hooks/data-intializer";
import { SessionProvider } from "@/lib/hooks/session-provider";
import { SideBar } from "@/components/SideBar";
const robotoFlex = Roboto_Flex({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "HangOut",
  description: "See content from creators near you (Literally)...",
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
            <SessionProvider>
              <DataInitalizer />
              <div className="lg:hidden flex flex-col h-screen">
                <TopBar />
                <main className="flex-1 overflow-y-auto">{children}</main>
                <BottomBar />
              </div>
              <div className="hidden lg:flex flex-row h-screen w-screen overflow-hidden gap-x-4">
                <SideBar />
                <main className="basis-2/5 overflow-y-auto">{children}</main>
              </div>
            </SessionProvider>
          </ThemeProvider>
        </body>
      </CSPostHogProvider>
    </html>
  );
}
