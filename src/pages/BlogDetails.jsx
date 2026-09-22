import { useEffect, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { motion } from "framer-motion";
import {
  Calendar,
  Clock,
  User,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  FileText,
  UserCheck,
  LayoutGrid,
  BookOpen,
  Folder,
  HeartPulse,
  Share2,
} from "lucide-react";
import BlogContentRenderer from "../components/Blog/BlogContentRenderer";
import { fetchBlogById, fetchBlogs } from "../redux/features/blog/blogThunk";
import { clearSelectedBlog } from "../redux/features/blog/blogSlice";



const BlogDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { selectedBlog, blogs = [], loading, error } = useSelector(
    (state) => state.blog || { selectedBlog: null, blogs: [], loading: false, error: null }
  );

  useEffect(() => {
    dispatch(fetchBlogById(id));
    // Also fetch other blogs to populate Related Articles dynamically
    dispatch(fetchBlogs({ limit: 6 }));
    return () => {
      dispatch(clearSelectedBlog());
    };
  }, [dispatch, id]);

  // Filter out current blog to get true related articles
  const relatedArticles = useMemo(() => {
    if (!blogs || blogs.length === 0) return [];
    return blogs.filter((b) => b._id !== selectedBlog?._id).slice(0, 4);
  }, [blogs, selectedBlog]);

  if (loading && !selectedBlog) {
    return (
      <div className="bg-slate-50 min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0FA8D6]"></div>
      </div>
    );
  }

  if (error || !selectedBlog) {
    return (
      <div className="bg-slate-50 min-h-screen flex flex-col items-center justify-center p-4 text-center">
        <h2 className="text-2xl font-bold text-[#012442] mb-2">Failed to load blog post</h2>
        <p className="text-slate-500 text-sm mb-6">{error || "The article you are trying to view does not exist."}</p>
        <Link
          to="/blog"
          className="flex items-center gap-2 bg-[#0FA8D6] hover:bg-[#00b4ea] text-[#012442] px-6 py-2.5 rounded-full font-bold transition no-underline text-xs tracking-wide uppercase"
        >
          <ArrowLeft size={14} /> Back to Health Articles
        </Link>
      </div>
    );
  }

  const doctorName = selectedBlog.doctorAuthor?.name
    ? `Dr. ${selectedBlog.doctorAuthor.name}`
    : selectedBlog.authorName || "Dr. Ramachandra Pradhan";

  const authorBadge =
    selectedBlog.authorType === "Doctor" ? "Doctor (On Behalf Of)" : "Admin";

  return (
    <main className="bg-[#f8fbfa] min-h-screen pb-20 text-slate-900">
      {/* ── TOP HERO HEADER SECTION ── */}
      <section className="relative bg-gradient-to-r from-[#e7f5fb] via-[#eef8fd] to-[#f4faff] border-b border-slate-200/80 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 relative z-10">
          <div className="max-w-3xl">
            {/* Health Blog Category Pill */}
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#0FA8D6]/15 text-[#024363] border border-[#0FA8D6]/30 font-medium text-xs mb-4 shadow-2xs">
              <HeartPulse size={13} className="text-[#0FA8D6]" />
              <span>{selectedBlog.category || "Health Blog"}</span>
            </div>

            {/* Main Title */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-medium text-[#012442] tracking-tight leading-[1.18] mb-4">
              {selectedBlog.title}
            </h1>

            {/* Subtitle / Excerpt */}
            {selectedBlog.description && (
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-6">
                {selectedBlog.description}
              </p>
            )}

            {/* Meta Row: Date, Read Time, Author */}
            <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs text-slate-600 pt-3 border-t border-[#0FA8D6]/20">
              <div className="flex items-center gap-1.5 font-medium">
                <Calendar size={14} className="text-[#0FA8D6] shrink-0" />
                <span>
                  {selectedBlog.date ||
                    (selectedBlog.createdAt
                      ? new Date(selectedBlog.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })
                      : "Recent")}
                </span>
              </div>

              <div className="flex items-center gap-1.5 font-medium">
                <Clock size={14} className="text-[#0FA8D6] shrink-0" />
                <span>{selectedBlog.readTime || "5 min read"}</span>
              </div>

              <div className="flex items-center gap-1.5 font-medium text-[#012442]">
                <User size={14} className="text-[#0FA8D6] shrink-0" />
                <span>
                  By {doctorName}{" "}
                  <span className="text-slate-500 font-normal">
                    ({selectedBlog.authorType === "Doctor" ? "Doctor - On Behalf Of" : "Admin"})
                  </span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative Right Hero Overlay */}
        <div className="hidden lg:block absolute right-0 top-0 bottom-0 w-[42%] pointer-events-none ">
          <div className="relative w-full h-full">
            <div className="absolute inset-0 bg-gradient-to-r from-[#eef8fd] via-[#eef8fd]/70 to-transparent"></div>
          </div>
        </div>
      </section>

      {/* ── MAIN CONTENT CONTAINER (2 COLUMNS) ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          
          {/* ──── LEFT / MAIN ARTICLE COLUMN (8 Cols) ──── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="lg:col-span-8 space-y-8"
          >
            {/* Top Navigation Back link */}
            <div className="flex items-center justify-between pb-2">
              <Link
                to="/blog"
                className="inline-flex items-center gap-2 text-[#024363] hover:text-[#0FA8D6] transition font-medium text-xs uppercase tracking-wider no-underline"
              >
                <ArrowLeft size={14} /> Back to All Articles
              </Link>
            </div>

            {/* Featured Image */}
            <div className="rounded-3xl overflow-hidden border border-slate-200/90 shadow-sm bg-slate-100 aspect-[16/9] w-full">
              <img
                src={selectedBlog.image}
                alt={selectedBlog.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Rich TipTap Content Body */}
            <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-10 shadow-2xs">
              <BlogContentRenderer content={selectedBlog.content} />
            </div>

            {/* Medical Callout / Note Banner */}
            <div className="bg-[#0FA8D6]/10 border border-[#0FA8D6]/25 rounded-2xl p-5 sm:p-6 flex items-start gap-4 shadow-2xs">
              <div className="w-10 h-10 rounded-xl bg-[#0FA8D6] text-white flex items-center justify-center shrink-0 shadow-xs">
                <ShieldCheck size={22} />
              </div>
              <p className="text-[#024363] italic font-medium text-xs sm:text-sm leading-relaxed pt-1">
                If you have concerns about your health or have risk factors for diseases, consult a qualified healthcare professional for personalized medical advice.
              </p>
            </div>

            {/* Medical Disclaimer */}
            <p className="text-slate-400 italic text-xs leading-relaxed border-t border-slate-200/70 pt-4">
              This article is intended for general educational purposes and should not replace professional medical advice, diagnosis, or treatment.
            </p>
          </motion.div>

          {/* ──── RIGHT / SIDEBAR COLUMN (4 Cols) ──── */}
          <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
            
            {/* Widget 1: Article Details */}
            <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-2xs space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100 text-[#012442] font-medium text-sm sm:text-base">
                <FileText size={18} className="text-[#0FA8D6]" />
                <span>Article Details</span>
              </div>

              <div className="space-y-3 text-xs sm:text-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-slate-500 font-medium">
                    <Folder size={15} className="text-slate-400" />
                    <span>Category</span>
                  </div>
                  <span className="px-3 py-1 bg-[#0FA8D6]/15 text-[#024363] border border-[#0FA8D6]/30 text-xs font-medium rounded-full">
                    {selectedBlog.category || "General"}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-slate-500 font-medium">
                    <Clock size={15} className="text-slate-400" />
                    <span>Read Time</span>
                  </div>
                  <span className="font-medium text-slate-700">
                    {selectedBlog.readTime || "5 min read"}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-slate-500 font-medium">
                    <User size={15} className="text-slate-400" />
                    <span>Author Type</span>
                  </div>
                  <span className="font-medium text-slate-700">
                    {authorBadge}
                  </span>
                </div>
              </div>
            </div>

            {/* Widget 2: Author Profile */}
            <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-2xs space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100 text-[#012442] font-medium text-sm sm:text-base">
                <UserCheck size={18} className="text-[#0FA8D6]" />
                <span>Author</span>
              </div>

              <div className="flex items-center gap-3.5">
                <img
                  src={
                    selectedBlog.doctorAuthor?.photo ||
                    "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=300&q=80"
                  }
                  alt={doctorName}
                  className="w-14 h-14 rounded-full border-2 border-[#0FA8D6]/30 object-cover shrink-0 shadow-xs"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm text-[#012442] truncate">
                    {doctorName}
                  </h4>
                  <p className="text-xs text-slate-500 truncate">
                    {selectedBlog.doctorAuthor?.specialization || "Urologist & Stone Specialist"}
                  </p>
                  <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-[10.5px] font-medium bg-[#0FA8D6]/15 text-[#024363] border border-[#0FA8D6]/30">
                    {authorBadge}
                  </span>
                </div>
              </div>

              <p className="text-slate-600 text-xs leading-relaxed">
                {selectedBlog.doctorAuthor?.description ||
                  selectedBlog.doctorAuthor?.bio ||
                  selectedBlog.doctorAuthor?.about ||
                  (selectedBlog.authorType === "Doctor"
                    ? `${doctorName} is a renowned specialist with extensive clinical experience in treating urological disorders, surgical interventions, and preventive care.`
                    : "Published by the editorial and clinical specialist team at Ramachandra Urology & Stone Centre, ensuring evidence-based and physician-verified health insights.")}
              </p>

           
            </div>

            {/* Widget 3: Related Articles */}
            <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-2xs space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100 text-[#012442] font-medium text-sm sm:text-base">
                <BookOpen size={18} className="text-[#0FA8D6]" />
                <span>Related Articles</span>
              </div>

              <div className="space-y-3.5">
                {relatedArticles.length > 0 ? (
                  relatedArticles.map((article) => (
                    <Link
                      key={article._id}
                      to={`/blog/${article._id}`}
                      className="flex items-center gap-3 group no-underline p-1.5 rounded-2xl hover:bg-slate-50 transition-colors"
                    >
                      <div className="w-14 h-14 rounded-2xl overflow-hidden bg-slate-100 shrink-0 border border-slate-100 shadow-2xs">
                        <img
                          src={article.image}
                          alt={article.title}
                          className="w-full h-full object-cover group-hover:scale-106 transition-transform duration-300"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h5 className="font-medium text-xs text-[#012442] group-hover:text-[#0FA8D6] transition-colors line-clamp-2 leading-snug">
                          {article.title}
                        </h5>
                        <p className="text-[11px] text-slate-400 font-medium mt-1">
                          {article.date || "Recent"} • {article.readTime || "4 min read"}
                        </p>
                      </div>
                    </Link>
                  ))
                ) : (
                  <p className="text-xs text-slate-400">No other articles found.</p>
                )}
              </div>
            </div>

          </div>
        </div>
      </section>
    </main>
  );
};

export default BlogDetails;
