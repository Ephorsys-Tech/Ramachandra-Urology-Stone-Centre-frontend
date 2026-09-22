import { motion } from "framer-motion";
import { Calendar, Clock, ArrowRight, Tag, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, memo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchBlogs } from "../../redux/features/blog/blogThunk";

const categoryColorMap = {
  Urology: "text-[#024363] bg-[#0FA8D6]/15 border-[#0FA8D6]/30",
  "Kidney Stones": "text-cyan-700 bg-cyan-50 border-cyan-200",
  "Laser Surgery": "text-indigo-700 bg-indigo-50 border-indigo-200",
  Nephrology: "text-blue-700 bg-blue-50 border-blue-200",
  "Prostate Care": "text-sky-700 bg-sky-50 border-sky-200",
  General: "text-[#024363] bg-slate-100 border-slate-200",
};

const HomeBlog = memo(() => {
  const dispatch = useDispatch();
  const { blogs } = useSelector((state) => state.blog || { blogs: [] });

  useEffect(() => {
    dispatch(fetchBlogs({ limit: 3 }));
  }, [dispatch]);

  const displayPosts = blogs && blogs.length > 0 ? blogs.slice(0, 3) : [];

  if (displayPosts.length === 0) {
    return null;
  }

  return (
    <section className="py-16 sm:py-24 bg-white ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12"
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div>
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#0FA8D6]/15 border border-[#0FA8D6]/30 text-[#024363] font-medium text-xs uppercase tracking-wider mb-3 shadow-2xs">
              <Sparkles size={12} className="text-[#0FA8D6]" />
              Urological Health Insights
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-medium text-[#012442] tracking-tight">
              Expert Advice & Urology Care Guides
            </h2>
          </div>
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-extrabold text-[#024363] hover:text-[#0FA8D6] transition-colors group cursor-pointer no-underline"
          >
            <span>View All Health Guides</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

        {/* Blog Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-7">
          {displayPosts.map((post, i) => {
            const catColor = categoryColorMap[post.category] || "text-[#024363] bg-[#0FA8D6]/15 border-[#0FA8D6]/30";
            return (
              <motion.article
                key={post._id}
                className="bg-white border border-slate-200/90 rounded-3xl overflow-hidden hover:border-[#0FA8D6]/40 hover:-translate-y-1 hover:shadow-xl transition-all duration-300 group flex flex-col justify-between"
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
              >
                {/* Image */}
                <div className="overflow-hidden h-52 relative">
                  <img
                    src={post.image}
                    alt={post.title}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3">
                    <span className={`inline-flex items-center gap-1 text-[10.5px] font-medium uppercase tracking-wider px-3 py-1 rounded-full border shadow-2xs backdrop-blur-md ${catColor}`}>
                      <Tag className="w-3 h-3" />
                      {post.category}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-[#012442] font-medium text-base leading-snug mb-2.5 group-hover:text-[#0FA8D6] transition-colors line-clamp-2">
                      {post.title}
                    </h3>

                    <p className="text-slate-600 text-xs leading-relaxed mb-4 line-clamp-2">
                      {post.description}
                    </p>
                  </div>

                  <div>
                    {/* Meta */}
                    <div className="flex items-center justify-between text-slate-400 text-[11px] mb-4 pt-3 border-t border-slate-100">
                      <span className="flex items-center gap-1 font-medium">
                        <Calendar className="w-3 h-3 text-[#0FA8D6]" /> {post.date || (post.createdAt ? new Date(post.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) : "")}
                      </span>
                      <span className="flex items-center gap-1 font-medium">
                        <Clock className="w-3 h-3 text-[#0FA8D6]" /> {post.readTime || "4 min read"}
                      </span>
                    </div>

                    <Link
                      to={`/blog/${post._id}`}
                      className="flex items-center gap-1.5 text-[#024363] hover:text-[#0FA8D6] text-xs font-medium transition-all group/link cursor-pointer no-underline"
                    >
                      <span>Read Full Guide</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div >
    </section >
  );
});

HomeBlog.displayName = "HomeBlog";
export default HomeBlog;
