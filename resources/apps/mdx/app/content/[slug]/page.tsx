import Image from "next/image";
import { redirect } from "next/navigation";
import { getBlog } from "../lib/utils";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { cn } from "@/lib/utils";

const Page = async ({ params }: { params: { slug: string } }) => {
  const slug = params.slug;
  const blog = await getBlog(slug);

  if (!blog) redirect("/content");

  const { content: Content, metadata } = blog;
  const { src, alt, width, height, className, ...imageProps } = metadata.image;

  return (
    <>
      {src && alt && (
        <div className="mb-10">
          <AspectRatio ratio={16 / 9}>
            <Image
              src={src}
              alt={alt}
              fill
              sizes="(max-width: 640px) 100vw, 640px"
              className={cn(className, "m-0")}
              {...imageProps}
            />
          </AspectRatio>
        </div>
      )}
      <div className="text-5xl font-bold font-urb text-primary">
        {metadata.name}
      </div>
      <p className={cn("opacity-50 text-xs")}>Written {metadata.date}</p>
      {/* <p className="py-2">{metadata.description}</p> */}
      {metadata.keywords && (
        <div className="flex flex-row gap-2 py-2 flex-wrap">
          {metadata.keywords.map((tag) => (
            <div
              key={tag}
              className="uppercase pointer-events-none border-2 px-4 py-2 opacity-75 rounded-sm text-xs"
            >
              {tag}
            </div>
          ))}
        </div>
      )}
      <div className="mt-10">
        <Content />
      </div>
    </>
  );
};

export default Page;
