import { Metadata } from "next";
import { getAllBlogs, getBlog } from "./lib/utils";
import Card from "./components/card";

const Page = async () => {
  const blogs = await getAllBlogs();

  if (!blogs) return null;

  const promises = blogs.map(async (blog) => {
    const post = await getBlog(blog);
    return post;
  });

  const posts = await Promise.all(promises);

  return (
    <div className="grid place-items-center">
      {posts.map(({ metadata, slug }, index) => (
        <Card key={index} meta={metadata} slug={slug} />
      ))}
    </div>
  );
};

export default Page;
