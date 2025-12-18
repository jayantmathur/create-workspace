import { cloneElement } from "react";
import Link from "next/link";
import { MessagesSquare, Mail, Linkedin } from "lucide-react";

import { buttonVariants, Button, ButtonProps } from "./ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const contacts = [
  {
    name: "Email",
    href: "mailto:jayant@psu.edu",
    url: "jayant@psu.edu",
    icon: <Mail />,
  },
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/in/jayantmathur",
    url: "https://linkedin.com/in/jayantmathur",
    icon: <Linkedin />,
  },
];

const Component = ({ className, ...props }: ButtonProps) => (
  <Sheet>
    <SheetTrigger
      className={buttonVariants({
        variant: "link",
        className: "flex gap-2",
      })}
    >
      <MessagesSquare className="-m-1 p-1" />
      <div className="capitalize hidden sm:inline">Get in touch</div>
    </SheetTrigger>
    <SheetContent side="top" className="sm:px-[20svw] flex-nowrap">
      <SheetHeader>
        <SheetTitle>Let&apos;s connect!</SheetTitle>
        <SheetDescription>Reach me via</SheetDescription>
      </SheetHeader>
      <div className="grid grid-flow-row gap-4 my-4">
        {contacts.map(({ name, href, url, icon }) => (
          <Link
            key={name}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="no-underline hover:bg-muted p-2 rounded-lg"
          >
            <div className="flex flex-nowrap items-center gap-2">
              {cloneElement(icon, { className: "-m-1 p-1" })}
              {name}
            </div>
            <div className="text-xs opacity-75 ml-6">{url}</div>
          </Link>
        ))}
      </div>
      <SheetFooter>
        <SheetClose asChild>
          <Button type="submit" variant="outline">
            Will do!
          </Button>
        </SheetClose>
      </SheetFooter>
    </SheetContent>
  </Sheet>
);

export default Component;
