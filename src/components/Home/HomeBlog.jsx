import { motion } from "framer-motion";
import { Calendar, Clock, ArrowRight, Tag } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, memo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchBlogs } from "../../redux/features/blog/blogThunk";

const categoryColorMap = {
  Cardiology: "text-red-600 bg-red-50 border-red-100",
  Pediatrics: "text-green-600 bg-green-50 border-green-100",
  Endocrinology: "text-purple-600 bg-purple-50 border-purple-100",
  Neurology: "text-yellow-700 bg-yellow-50 border-yellow-100",
  Orthopedics: "text-amber-700 bg-amber-50 border-amber-100",
  Ophthalmology: "text-cyan-600 bg-cyan-55 border-cyan-100",
  General: "text-secondary bg-blue-50 border-blue-100",
};

const HomeBlog = memo(() => {
  const dispatch = useDispatch();
  const { blogs } = useSelector((state) => state.blog || { blogs: [] });

  useEffect(() => {
    dispatch(fetchBlogs({ limit: 3 }));
  }, [dispatch]);

  const displayPosts = blogs && blogs.length > 0 ? blogs.slice(0, 3) : [];

  if (displayPosts.length === 0) {
    return null; // Don't render the section if there are no blogs in the DB
  }

  return (
    <section className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <motion.div
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div>
            <span className="inline-block text-tertiary font-bold text-sm tracking-widest uppercase mb-4">
              Health Insights
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-primary font-sans">
              Latest{" "}
              <span className="text-secondary">
                Medical News
              </span>
            </h2>
          </div>
          <Link
            to="/blog"
            className="flex items-center gap-2 text-secondary hover:text-primary font-semibold transition-colors group cursor-pointer"
          >
            View All Articles
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

        {/* Blog Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
          {displayPosts.map((post, i) => {
            const catColor = categoryColorMap[post.category] || "text-secondary bg-blue-50 border-blue-100";
            return (
              <motion.article
                key={post._id}
                className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:border-secondary/40 hover:-translate-y-1.5 hover:shadow-[0_12px_30px_rgba(0,0,0,0.05)] transition-all duration-400 group"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                {/* Image */}
                <div className="overflow-hidden h-52">
                  <img
                    src={post.image}
                    alt={post.title}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                {/* Content */}
                <div className="p-6">
                  {/* Category badge */}
                  <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full border mb-4 ${catColor}`}>
                    <Tag className="w-3 h-3" />
                    {post.category}
                  </span>

                  <h3 className="text-primary font-bold text-lg leading-snug mb-3 group-hover:text-secondary transition-colors line-clamp-2">
                    {post.title}
                  </h3>

                  <p className="text-slate-600 text-sm leading-relaxed mb-5 line-clamp-2">
                    {post.description}
                  </p>

                  {/* Meta */}
                  <div className="flex items-center justify-between text-slate-500 text-xs mb-5">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" /> {post.date || (post.createdAt ? new Date(post.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : "")}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" /> {post.readTime}
                    </span>
                  </div>

                  <Link
                    to={`/blog/${post._id}`}
                    className="flex items-center gap-2 text-secondary hover:text-primary text-sm font-semibold hover:gap-3 transition-all group/link cursor-pointer"
                  >
                    Read Full Article
                    <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
});

export default HomeBlog;
