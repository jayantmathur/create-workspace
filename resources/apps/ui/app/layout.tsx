import "./globals.css";
// import { Analytics } from "@vercel/analytics/react";
// import { SpeedInsights } from "@vercel/speed-insights/next"
import { Metadata } from "next";

import { cn } from "@/lib/utils";
import { rhd, rhm, urb } from "@/config/fonts";
import Providers from "./providers";
import ThemeSwitch from "@/components/theme-switch";
import Navbar from "@/components/navbar";
// import Title from "@/components/title";

export const metadata: Metadata = {
  title: "Jayant Mathur",
  description: "Jayant Mathur's personal website",
  icons: {
    icon: "/icons/favicon.ico",
    shortcut: "/icons/favicon-1024.png",
    apple: "/icons/favicon-1024.png",
  },
  manifest: "/manifest.webmanifest",
  keywords: ["Next.js", "Tailwind CSS", "TypeScript"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const hfclass =
    "fixed z-10 w-full grid grid-flow-col place-items-center bg-background p-4 [&>*]:scale-125 [&>*]:sm:scale-100";

  return (
    <html lang="en" className="dark" style={{ colorScheme: "dark" }}>
      <body
        className={cn(
          "prose dark:prose-invert max-w-none min-h-screen antialiased grid",
          `${rhd.variable} ${rhm.variable} ${urb.variable}`,
          "font-sans prose-headings:font-urb prose-headings:font-semibold",
        )}
      >
        <Providers>
          <header
            className={cn(
              hfclass,
              "top-0 place-content-between pb-4 sm:pb-2 z-40",
            )}
          >
            {/* <Title className="origin-top-left" /> */}
            <ThemeSwitch className="origin-top-right" />
          </header>
          <main className="max-w-3xl place-self-center px-4 py-20">
            {children}
          </main>
          <footer className={cn(hfclass, "bottom-0 pt-4 sm:pt-2 z-40")}>
            <Navbar className="place-self-center origin-bottom" />
          </footer>
        </Providers>
        {/* <Analytics /> */}
        {/* <SpeedInsights /> */}
      </body>
    </html>
  );
}
