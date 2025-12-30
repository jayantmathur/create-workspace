import { useRouter } from '@tanstack/react-router'
import { createContext, type PropsWithChildren, use } from 'react'
import { setThemeServerFn, type Theme } from '@/lib/theme'

type ThemeContextVal = { theme: Theme; setTheme: (value: Theme) => void }
type Props = PropsWithChildren<{ theme: Theme }>

const ThemeContext = createContext<ThemeContextVal | null>(null)

export function useTheme() {
  const value = use(ThemeContext)
  if (!value) throw new Error('useTheme called outside of ThemeProvider!')
  return value
}

export function ThemeProvider({ children, theme }: Props) {
  const router = useRouter()

  function setTheme(value: Theme) {
    setThemeServerFn({ data: value }).then(() => router.invalidate())
  }

  return <ThemeContext value={{ theme, setTheme }}>{children}</ThemeContext>
}

/*

Example usage

import { createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
*import { ThemeProvider } from "@/components/theme-provider";
*import { getThemeServerFn } from "@/lib/theme";

export const Route = createRootRoute({
  ...
* loader: () => getThemeServerFn(),
  shellComponent: RootDocument,
});

function RootDocument({ children }: { children: React.ReactNode }) {
* const theme = Route.useLoaderData();
  return (
*   <html className={theme} lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
*       <ThemeProvider theme={theme}>{children}</ThemeProvider>
        <Scripts />
      </body>
    </html>
  );
}

*/
