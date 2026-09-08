import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Search, Calendar, Clock, ArrowRight, Tag, User, ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { fetchBlogs } from "../../redux/features/blog/blogThunk";
import { BlogCardSkeleton } from "../common/Skeletons";

const categoryOptions = ["All", "Cardiology", "Pediatrics", "Endocrinology", "Neurology", "Orthopedics", "Ophthalmology"];

const categoryColorMap = {
  All: "text-secondary bg-secondary/10 border-secondary/20",
  Cardiology: "text-red-650 bg-red-50 border-red-200/60",
  Pediatrics: "text-emerald-650 bg-emerald-50 border-emerald-200/60",
  Endocrinology: "text-purple-650 bg-purple-50 border-purple-200/60",
  Neurology: "text-amber-650 bg-amber-55 border-amber-200/60",
  Orthopedics: "text-blue-650 bg-blue-55 border-blue-200/60",
  Ophthalmology: "text-cyan-650 bg-cyan-55 border-cyan-200/60",
};

const BlogList = () => {
  const dispatch = useDispatch();
  const { blogs, loading, currentPage, totalPages, categoryCounts = {} } = useSelector(
    (state) => state.blog || { blogs: [], loading: false, currentPage: 1, totalPages: 1, categoryCounts: {} }
  );

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [page, setPage] = useState(1);

  // Fetch blogs when filter changes
  useEffect(() => {
    dispatch(fetchBlogs({ search, category: selectedCategory === "All" ? "" : selectedCategory, page, limit: 5 }));
  }, [dispatch, search, selectedCategory, page]);

  // Reset page when category or search changes
  const handleCategoryChange = (cat) => {
    setSelectedCategory(cat);
    setPage(1);
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  // Get recent 3 posts for sidebar
  const recentPosts = blogs.slice(0, 3);

  return (
    <>
      {/* Search/Filter Bar */}
      <section className="max-w-7xl mx-auto px-4 mb-8">
        {/* <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-72">
            <input
              type="text"
              placeholder="Search articles..."
              value={search}
              onChange={handleSearchChange}
              className="w-full bg-white/5 border border-white/10 text-white rounded-full pl-12 pr-5 py-3.5 focus:outline-none focus:border-[#007bff] transition-colors placeholder:text-slate-500 text-sm font-medium"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          </div>
        </div> */}
      </section>

      {/* Main Blog List Content */}
      <section className="max-w-7xl mx-auto px-4 pb-20">
        <div className="flex flex-col lg:flex-row gap-10">
          
          {/* Blog Articles list (left column) */}
          <div className="w-full lg:w-2/3 space-y-8 relative min-h-[400px]">
            {loading && blogs.length === 0 ? (
              <div className="space-y-6">
                {Array.from({ length: 3 }).map((_, idx) => (
                  <BlogCardSkeleton key={idx} />
                ))}
              </div>
            ) : (
            <AnimatePresence mode="popLayout">
              {blogs && blogs.length > 0 ? (
                blogs.map((post, i) => {
                  const catColor = categoryColorMap[post.category] || "text-secondary bg-secondary/10 border-secondary/20";
                  return (
                    <motion.article
                      key={post._id}
                      layout
                      className="bg-white border border-slate-200 rounded-3xl overflow-hidden flex flex-col md:flex-row hover:border-slate-350 hover:shadow-md transition-all duration-350 group"
                      initial={{ opacity: 0, y: 25 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.96 }}
                      transition={{ duration: 0.35, delay: i * 0.04 }}
                    >
                      {/* Featured Image */}
                      <div className="w-full md:w-2/5 h-56 md:h-auto overflow-hidden relative flex-shrink-0">
                        <img
                          src={post.image}
                          alt={post.title}
                          loading="lazy"
                          decoding="async"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute top-4 left-4">
                          <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full border backdrop-blur-md ${catColor}`}>
                            <Tag className="w-3 h-3" /> {post.category}
                          </span>
                        </div>
                      </div>

                      {/* Content Summary */}
                      <div className="w-full md:w-3/5 p-7 flex flex-col justify-center">
                        <div className="flex flex-wrap items-center gap-4 text-slate-500 text-xs font-semibold mb-3">
                          <span className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-secondary" /> {post.date || (post.createdAt ? new Date(post.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : "")}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <User className="w-3.5 h-3.5 text-secondary" /> {post.authorName}
                          </span>
                        </div>
                        <h3 className="text-xl font-bold text-primary mb-3 leading-snug group-hover:text-secondary transition-colors font-sans">
                          {post.title}
                        </h3>
                        <p className="text-slate-500 text-sm leading-relaxed mb-5 line-clamp-2">
                          {post.description}
                        </p>
                        <div className="mt-auto flex items-center justify-between">
                          <span className="flex items-center gap-1.5 text-slate-500 text-xs font-medium">
                            <Clock className="w-3.5 h-3.5" /> {post.readTime}
                          </span>
                          <Link
                            to={`/blog/${post._id}`}
                            className="flex items-center gap-2 text-secondary text-sm font-bold hover:gap-3.5 transition-all no-underline"
                          >
                            Read More <ArrowRight className="w-4 h-4" />
                          </Link>
                        </div>
                      </div>
                    </motion.article>
                  );
                })
              ) : (
                !loading && (
                  <div className="text-center py-20 bg-slate-50 rounded-3xl border border-slate-200">
                    <h3 className="text-xl font-bold text-primary mb-2 font-sans">No articles found</h3>
                    <p className="text-slate-500 text-sm">
                      {search ? "No posts match your search query." : "There are currently no blog articles published in this category."}
                    </p>
                  </div>
                )
              )}
            </AnimatePresence>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-4 pt-6">
                <button
                  onClick={() => setPage((p) => Math.max(p - 1, 1))}
                  disabled={page === 1}
                  className="p-2 border border-slate-200 bg-white text-slate-700 rounded-xl hover:bg-slate-50 disabled:opacity-30 disabled:hover:bg-transparent transition cursor-pointer"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <span className="text-slate-705 text-sm font-semibold">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                  disabled={page === totalPages}
                  className="p-2 border border-slate-200 bg-white text-slate-700 rounded-xl hover:bg-slate-50 disabled:opacity-30 disabled:hover:bg-transparent transition cursor-pointer"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>

          {/* Sidebar Controls (right column) */}
          <div className="w-full lg:w-1/3 space-y-8">
            {/* Search widget */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
              <h3 className="text-lg font-bold text-primary mb-4 font-sans tracking-tight">Search Articles</h3>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  value={search}
                  onChange={handleSearchChange}
                  className="w-full bg-slate-50 border border-slate-200 text-primary rounded-xl pl-12 pr-4 py-3.5 focus:outline-none focus:border-secondary transition-colors placeholder:text-slate-400 text-sm font-medium"
                />
                <Search className="w-5 h-5 text-slate-450 absolute left-4 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            {/* Categories filter list */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
              <h3 className="text-lg font-bold text-primary mb-4 font-sans tracking-tight">Categories</h3>
              <ul className="space-y-3">
                {categoryOptions.map((cat, i) => {
                  const count = categoryCounts[cat] || 0;
                  return (
                    <li key={i}>
                      <button
                        onClick={() => handleCategoryChange(cat)}
                        className={`w-full flex items-center justify-between border-none bg-transparent transition-colors text-sm font-semibold group cursor-pointer ${
                          selectedCategory === cat ? "text-secondary" : "text-slate-500 hover:text-primary"
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <span className={`w-1.5 h-1.5 rounded-full transition-colors ${
                            selectedCategory === cat ? "bg-secondary" : "bg-slate-400 group-hover:bg-primary"
                          }`}></span>
                          {cat === "All" ? "All Categories" : cat}
                        </span>
                        <span className="text-xs bg-slate-100 group-hover:bg-slate-200 px-2 py-0.5 rounded-md border border-slate-200/60 text-slate-500 group-hover:text-primary transition-colors">
                          {count}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Recent Posts widget */}
            {recentPosts && recentPosts.length > 0 && (
              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
                <h3 className="text-lg font-bold text-primary mb-6 font-sans tracking-tight">Recent Articles</h3>
                <div className="space-y-5">
                  {recentPosts.map((post, idx) => (
                    <Link to={`/blog/${post._id}`} key={post._id} className="flex gap-4 group no-underline">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-20 h-16 rounded-xl object-cover flex-shrink-0 border border-slate-200 group-hover:border-secondary/30 transition-colors"
                      />
                      <div>
                        <h4 className="text-primary text-sm font-bold mb-1 group-hover:text-secondary transition-colors line-clamp-2 leading-snug font-sans">
                          {post.title}
                        </h4>
                        <span className="text-slate-500 text-xs font-semibold flex items-center gap-1.5">
                          <Calendar className="w-3 h-3 text-secondary" strokeWidth={2.5} /> {post.date || (post.createdAt ? new Date(post.createdAt).toLocaleDateString("en-US") : "")}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

        </div>
      </section>
    </>
  );
};

export default BlogList;
