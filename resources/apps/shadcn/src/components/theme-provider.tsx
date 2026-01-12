import { useRouter } from '@tanstack/react-router'
import { Moon, Sun } from 'lucide-react'
import { createContext, type PropsWithChildren, use } from 'react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { setThemeServerFn, type Theme } from '@/lib/theme'
import { cn } from '@/lib/utils'

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

export function ThemeToggle({
  className,
  ...props
}: React.ComponentProps<typeof Button>) {
  const { setTheme } = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        asChild
        className={cn(
          // 'absolute right-4 top-4',
          // 'm-4',
          className,
        )}
        {...props}
      >
        <Button variant="outline" size="icon">
          <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme('light')}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('dark')}>
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('system')}>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
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
*       <ThemeProvider theme={theme}>
*         <ThemeToggle />      
*         {children}
*       </ThemeProvider>
        <Scripts />
      </body>
    </html>
  );
}

*/
