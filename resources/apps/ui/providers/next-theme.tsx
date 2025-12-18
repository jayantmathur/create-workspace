"use client";

import { ThemeProvider as NextThemeProvider } from "next-themes";

const Provider = ({ children }: { children: React.ReactNode }) => (
  <NextThemeProvider
    attribute="class"
    enableSystem={false}
    defaultTheme="dark"
    enableColorScheme
    disableTransitionOnChange
  >
    {children}
  </NextThemeProvider>
);

export default Provider;
