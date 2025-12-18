import { HTMLAttributes, cloneElement } from "react";
import Link from "next/link";
import { Home, User, Library } from "lucide-react";

import { buttonVariants } from "./ui/button";
import ContactButton from "./contact";
import { cn } from "@/lib/utils";

const pages = [
  {
    name: "home",
    href: "/",
    icon: <Home />,
  },
  {
    name: "about me",
    href: "/about",
    icon: <User />,
  },
  {
    name: "my work",
    href: "/content",
    icon: <Library />,
  },
];

const Component = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      className,
      "grid grid-flow-col w-full max-w-2xl place-content-evenly",
    )}
    {...props}
  >
    {pages.map(({ name, href, icon }) => (
      <Link
        href={href}
        key={name}
        className={cn(buttonVariants({ variant: "link" }), "no-underline")}
      >
        <div className="flex gap-2">
          {cloneElement(icon, { className: "-m-1 p-1" })}
          <div className="capitalize hidden sm:inline">{name}</div>
        </div>
      </Link>
    ))}
    <ContactButton />
  </div>
);

export default Component;
