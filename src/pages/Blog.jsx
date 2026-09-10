import BlogHero from "../components/Blog/BlogHero";
import BlogList from "../components/Blog/BlogList";

const Blog = () => {
  return (
    <main className="bg-slate-50/50 min-h-screen pb-20">
      <BlogHero />
      <BlogList />
    </main>
  );
};

export default Blog;
