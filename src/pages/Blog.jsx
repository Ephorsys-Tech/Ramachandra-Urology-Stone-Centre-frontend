import BlogHero from "../components/Blog/BlogHero";
import BlogList from "../components/Blog/BlogList";

const Blog = () => {
  return (
    <main className="bg-background min-h-screen pb-24">
      <BlogHero />
      <BlogList />
    </main>
  );
};

export default Blog;
