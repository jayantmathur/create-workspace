"use client";

import { useState, useEffect, cloneElement } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { TabsProps } from "@radix-ui/react-tabs";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

const themes = [
  {
    name: "light",
    icon: <Sun />,
  },
  {
    name: "dark",
    icon: <Moon />,
  },
];

const Component = ({ className, ...props }: TabsProps) => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const toggleTheme = () => setTheme(theme === "light" ? "dark" : "light");

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <Tabs
      defaultValue="dark"
      value={theme}
      className={cn(className)}
      {...props}
    >
      <TabsList>
        {themes.map(({ name, icon }) => (
          <TabsTrigger
            key={name}
            value={name}
            className={`flex gap-2 ${theme === name && "pointer-events-none"}`}
            onClick={toggleTheme}
          >
            {cloneElement(icon, { className: "-m-1 p-1" })}
            <div className="capitalize hidden sm:inline">{name}</div>
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
};

export default Component;
