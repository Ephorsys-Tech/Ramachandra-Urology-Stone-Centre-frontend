import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Search,
  Calendar,
  Clock,
  ArrowRight,
  Tag,
  User,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Sparkles,
  X
} from "lucide-react";
import { Link } from "react-router-dom";
import { fetchBlogs } from "../../redux/features/blog/blogThunk";
import { BlogCardSkeleton } from "../common/Skeletons";

const categoryOptions = [
  "All",
  "Urology",
  "Kidney Stones",
  "Laser Surgery",
  "Men's Health",
  "Cardiology",
  "Pediatrics",
  "Orthopedics",
  "General Wellness"
];

// Color palette mapping for category badges
const categoryBadgeColors = {
  Urology: "bg-[#0FA8D6]/10 text-[#024363] border-[#0FA8D6]/30",
  "Kidney Stones": "bg-cyan-50 text-cyan-800 border-cyan-200",
  "Laser Surgery": "bg-sky-50 text-sky-800 border-sky-200",
  "Men's Health": "bg-blue-50 text-blue-800 border-blue-200",
  Cardiology: "bg-rose-50 text-rose-800 border-rose-200",
  Pediatrics: "bg-emerald-50 text-emerald-800 border-emerald-200",
  Orthopedics: "bg-amber-50 text-amber-800 border-amber-200",
  "General Wellness": "bg-teal-50 text-teal-800 border-teal-200"
};

const BlogList = () => {
  const dispatch = useDispatch();
  const listRef = useRef(null);
  
  const { blogs = [], loading, currentPage = 1, totalPages = 1, total = 0, categoryCounts = {} } = useSelector(
    (state) => state.blog || { blogs: [], loading: false, currentPage: 1, totalPages: 1, total: 0, categoryCounts: {} }
  );

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [page, setPage] = useState(1);

  // Fetch blogs on criteria change
  useEffect(() => {
    dispatch(
      fetchBlogs({
        search,
        category: selectedCategory === "All" ? "" : selectedCategory,
        page,
        limit: 9
      })
    );
  }, [dispatch, search, selectedCategory, page]);

  const handleCategoryChange = (cat) => {
    setSelectedCategory(cat);
    setPage(1);
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    if (listRef.current) {
      listRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <section ref={listRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      
      {/* ── FILTER & SEARCH TOOLBAR ── */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 mb-10 pb-6 border-b border-slate-200/80">
        
        {/* Category Pills Slider */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          {categoryOptions.map((cat) => {
            const isSelected = selectedCategory === cat;
            const count = categoryCounts[cat] || (cat === "All" ? total || blogs.length : 0);
            return (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all duration-200 shrink-0 cursor-pointer flex items-center gap-1.5 border ${
                  isSelected
                    ? "bg-[#024363] text-white border-[#024363] shadow-md shadow-[#024363]/15"
                    : "bg-white text-slate-600 border-slate-200 hover:border-[#0FA8D6]/50 hover:text-[#024363] hover:bg-slate-50/80"
                }`}
              >
                <span>{cat}</span>
                {count > 0 && (
                  <span
                    className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded-full ${
                      isSelected ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Search Input Box */}
        <div className="relative w-full lg:w-80 shrink-0">
          <input
            type="text"
            placeholder="Search health guides & articles..."
            value={search}
            onChange={handleSearchChange}
            className="w-full bg-white border border-slate-200 text-[#012442] rounded-full pl-10 pr-9 py-2.5 text-xs font-semibold focus:outline-none focus:border-[#0FA8D6] focus:ring-2 focus:ring-[#0FA8D6]/15 transition-all placeholder:text-slate-400 shadow-2xs"
          />
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 border-none bg-transparent cursor-pointer p-0.5 transition-colors"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* ── SECTION HEADER & ARTICLE COUNT ── */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0FA8D6] uppercase tracking-wider mb-1">
            <Sparkles size={13} />
            <span>Physician-Reviewed Library</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#012442] tracking-tight">
            {selectedCategory === "All" ? "Latest Health Guides & Clinical Articles" : `${selectedCategory} Articles`}
          </h2>
        </div>
        
        <span className="hidden sm:inline-flex text-xs font-bold text-slate-600 bg-white px-3.5 py-1.5 rounded-full border border-slate-200 shadow-2xs">
          Showing {blogs.length} {blogs.length === 1 ? "article" : "articles"}
        </span>
      </div>

      {/* ── BLOG CARDS GRID ── */}
      {loading && blogs.length === 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {Array.from({ length: 6 }).map((_, idx) => (
            <BlogCardSkeleton key={idx} />
          ))}
        </div>
      ) : (
        <AnimatePresence mode="popLayout">
          {blogs && blogs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {blogs.map((post, index) => {
                const badgeStyle =
                  categoryBadgeColors[post.category] || "bg-[#0FA8D6]/10 text-[#024363] border-[#0FA8D6]/30";

                return (
                  <motion.article
                    key={post._id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.35, delay: index * 0.05 }}
                    className="bg-white rounded-3xl border border-slate-200/90 shadow-xs hover:shadow-xl hover:border-[#0FA8D6]/40 transition-all duration-300 flex flex-col overflow-hidden group hover:-translate-y-1"
                  >
                    {/* Card Image */}
                    <Link
                      to={`/blog/${post._id}`}
                      className="relative aspect-[16/10] overflow-hidden block bg-slate-100"
                    >
                      <img
                        src={post.image}
                        alt={post.title}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-106 transition-transform duration-600 ease-out"
                      />
                      
                      {/* Category Floating Pill */}
                      {post.category && (
                        <div className="absolute top-3.5 left-3.5">
                          <span
                            className={`inline-flex items-center gap-1 text-[11px] font-extrabold px-3 py-1 rounded-full border shadow-2xs backdrop-blur-md ${badgeStyle}`}
                          >
                            <Tag size={11} />
                            {post.category}
                          </span>
                        </div>
                      )}
                    </Link>

                    {/* Card Body */}
                    <div className="p-6 flex-1 flex flex-col justify-between">
                      <div>
                        {/* Meta: Date & Reading Time */}
                        <div className="flex items-center gap-3 text-xs text-slate-500 font-semibold mb-3">
                          <span className="flex items-center gap-1.5">
                            <Calendar size={13} className="text-[#0FA8D6]" />
                            {post.date ||
                              (post.createdAt
                                ? new Date(post.createdAt).toLocaleDateString("en-US", {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric"
                                  })
                                : "Recent")}
                          </span>
                          <span className="text-slate-300">•</span>
                          <span className="flex items-center gap-1.5">
                            <Clock size={13} className="text-[#0FA8D6]" />
                            {post.readTime || "4 min read"}
                          </span>
                        </div>

                        {/* Title */}
                        <h3 className="text-lg sm:text-xl font-bold text-[#012442] leading-snug group-hover:text-[#0FA8D6] transition-colors line-clamp-2 mb-2.5">
                          <Link to={`/blog/${post._id}`} className="no-underline text-inherit">
                            {post.title}
                          </Link>
                        </h3>

                        {/* Excerpt */}
                        <p className="text-slate-600 text-xs sm:text-sm leading-relaxed line-clamp-3 mb-6">
                          {post.description}
                        </p>
                      </div>

                      {/* Card Footer: Specialist Author + Read Button */}
                      <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-[#0FA8D6]/10 border border-[#0FA8D6]/20 text-[#024363] flex items-center justify-center font-bold text-xs">
                            <User size={12} />
                          </div>
                          <span className="text-xs font-semibold text-slate-700 truncate max-w-[130px]">
                            {post.authorName || "Specialist Surgeon"}
                          </span>
                        </div>

                        <Link
                          to={`/blog/${post._id}`}
                          className="inline-flex items-center gap-1 text-xs font-extrabold text-[#024363] group-hover:text-[#0FA8D6] transition-all no-underline"
                        >
                          <span>Read Full Guide</span>
                          <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" />
                        </Link>
                      </div>
                    </div>
                  </motion.article>
                );
              })}
            </div>
          ) : (
            !loading && (
              <div className="text-center py-16 bg-white border border-slate-200/90 rounded-3xl p-8 shadow-xs max-w-xl mx-auto">
                <div className="w-14 h-14 rounded-2xl bg-[#0FA8D6]/10 text-[#0FA8D6] flex items-center justify-center mx-auto mb-4">
                  <BookOpen size={28} />
                </div>
                <h3 className="text-lg font-bold text-[#012442] mb-1.5">No articles found</h3>
                <p className="text-slate-500 text-xs leading-relaxed max-w-md mx-auto">
                  {search
                    ? `We couldn't find any articles matching "${search}". Try searching for other medical topics such as "stone", "laser", or "kidney".`
                    : "There are currently no published articles under this specialty category."}
                </p>
                {(search || selectedCategory !== "All") && (
                  <button
                    onClick={() => {
                      setSearch("");
                      setSelectedCategory("All");
                      setPage(1);
                    }}
                    className="mt-5 inline-flex items-center gap-1.5 bg-[#024363] hover:bg-[#012442] text-white px-5 py-2.5 rounded-full text-xs font-bold transition-all shadow-xs cursor-pointer border-none"
                  >
                    <span>Reset All Filters</span>
                  </button>
                )}
              </div>
            )
          )}
        </AnimatePresence>
      )}

      {/* ── PAGINATION CONTROLS ── */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-12 sm:pt-14">
          <button
            onClick={() => handlePageChange(Math.max(page - 1, 1))}
            disabled={page === 1}
            className="px-4 py-2 rounded-full border border-slate-200 bg-white text-[#012442] hover:bg-slate-50 disabled:opacity-30 disabled:hover:bg-white transition text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-2xs"
          >
            <ChevronLeft size={14} />
            <span>Prev</span>
          </button>

          <div className="flex items-center gap-1.5">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
              const isCurrent = p === page;
              return (
                <button
                  key={p}
                  onClick={() => handlePageChange(p)}
                  className={`w-9 h-9 rounded-full text-xs font-bold transition-all cursor-pointer border ${
                    isCurrent
                      ? "bg-[#024363] text-white border-[#024363] shadow-xs"
                      : "bg-white text-slate-700 border-slate-200 hover:border-[#0FA8D6] hover:text-[#024363]"
                  }`}
                >
                  {p}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => handlePageChange(Math.min(page + 1, totalPages))}
            disabled={page === totalPages}
            className="px-4 py-2 rounded-full border border-slate-200 bg-white text-[#012442] hover:bg-slate-50 disabled:opacity-30 disabled:hover:bg-white transition text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-2xs"
          >
            <span>Next</span>
            <ChevronRight size={14} />
          </button>
        </div>
      )}

    </section>
  );
};

export default BlogList;
