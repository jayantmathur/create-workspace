import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { ArrowRightOnRectangleIcon } from "@heroicons/react/24/solid";
import { cn } from "@/lib/utils";

const BackButton = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(buttonVariants({ variant: "destructive" }), className)}
    {...props}
  >
    <Link
      href="/content"
      className="flex flex-row gap-2 items-center justify-center no-underline"
    >
      <ArrowRightOnRectangleIcon className="w-4 rotate-180" />
      <div className="capitalize hidden sm:inline">Back</div>
    </Link>
  </div>
);

export default BackButton;
