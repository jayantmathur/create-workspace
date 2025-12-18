import { HTMLAttributes } from "react";
import Link from "next/link";
import Image from "next/image";
import { buttonVariants } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Metadata } from "../types";
import { getKeywordAcronym } from "../lib/utils";
import { cn } from "@/lib/utils";

type Props = HTMLAttributes<HTMLDivElement> & { meta: Metadata; slug: string };

const Card = ({ meta, slug, className, ...props }: Props) => {
  const { name, description, date, keywords, image } = meta;

  const {
    src,
    alt,
    width,
    height,
    className: imgClasses,
    ...imageProps
  } = image;

  return (
    <div
      className={cn(
        "flex flex-wrap gap-8 rounded-lg p-4",
        "hover:shadow-[0_8px_0_1.75px] outline-2 hover:outline hover:-translate-y-1 transition-all max-w-3xl",
        className,
      )}
      {...props}
    >
      {src && alt && (
        <div className="grid place-items-center flex-1 max-w-sm">
          <AspectRatio ratio={1 / 1}>
            <Image
              src={src}
              alt={alt}
              fill
              sizes="(max-width: 640px) 100vw, 640px"
              className={cn(imgClasses, "m-0 rounded-lg")}
              {...imageProps}
            />
          </AspectRatio>
        </div>
      )}
      <div className={cn("[&>*]:m-0 basis-96", className)}>
        <h2>{name}</h2>
        <p className={cn("opacity-50 text-xs")}>Written {date}</p>
        <p className="py-2">{description}</p>
        {keywords && (
          <div className="flex flex-row gap-2 py-2 flex-wrap">
            {keywords.map((tag) => (
              <div
                key={tag}
                className="uppercase pointer-events-none border-2 px-4 py-2 opacity-75 rounded-sm text-xs"
              >
                {/* {getKeywordAcronym(tag)} */}
                {tag}
              </div>
            ))}
          </div>
        )}
        <div className="pt-2">
          <Link
            href={`/content/${slug}`}
            className={cn(
              buttonVariants({ variant: "default" }),
              "no-underline",
            )}
          >
            Read More
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Card;
