import type { Metadata } from "next";
import { Roboto_Flex } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { BottomBar } from "@/components/bottom-bar";
import { ModeToggle } from "@/components/mode-toggle";

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
    <html lang="en">
      <body
        className={` ${robotoFlex.className} antialiased box-border scroll-smooth`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="h-screen flex flex-col">
            <div className="p-2">
              <ModeToggle />
            </div>
            <main className="flex-grow overflow-y-auto pl-2 pr-2 pt-1">
              {children}
            </main>
          </div>
          <BottomBar />
        </ThemeProvider>
      </body>
    </html>
  );
}
