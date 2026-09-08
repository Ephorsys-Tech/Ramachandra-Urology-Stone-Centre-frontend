import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { motion } from "framer-motion";
import { Calendar, User, Clock, ArrowLeft, Tag } from "lucide-react";
import { fetchBlogById } from "../redux/features/blog/blogThunk";
import { clearSelectedBlog } from "../redux/features/blog/blogSlice";

const categoryColorMap = {
  Cardiology: "text-red-650 bg-red-50 border-red-200/60",
  Pediatrics: "text-emerald-650 bg-emerald-50 border-emerald-200/60",
  Endocrinology: "text-purple-650 bg-purple-50 border-purple-200/60",
  Neurology: "text-amber-650 bg-amber-50 border-amber-200/60",
  Orthopedics: "text-blue-650 bg-blue-55 border-blue-200/60",
  Ophthalmology: "text-cyan-650 bg-cyan-55 border-cyan-200/60",
};

const BlogDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  
  const { selectedBlog, loading, error } = useSelector(
    (state) => state.blog || { selectedBlog: null, loading: false, error: null }
  );

  useEffect(() => {
    dispatch(fetchBlogById(id));
    return () => {
      dispatch(clearSelectedBlog());
    };
  }, [dispatch, id]);

  if (loading) {
    return (
      <div className="bg-background min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary"></div>
      </div>
    );
  }

  if (error || !selectedBlog) {
    return (
      <div className="bg-background min-h-screen flex flex-col items-center justify-center p-4 text-center">
        <h2 className="text-2xl font-bold text-primary mb-2">Failed to load blog post</h2>
        <p className="text-slate-500 text-sm mb-6">{error || "The post you are trying to view does not exist."}</p>
        <Link to="/blog" className="flex items-center gap-2 bg-secondary hover:bg-secondary/90 text-white px-5 py-2.5 rounded-full font-bold transition no-underline">
          <ArrowLeft className="w-4 h-4" /> Back to Blog
        </Link>
      </div>
    );
  }

  const catColor = categoryColorMap[selectedBlog.category] || "text-secondary bg-secondary/10 border-secondary/20";

  return (
    <main className="bg-background min-h-screen pb-24 text-primary">
      {/* Article Header & Image Background */}
      <section className="relative px-4 py-24 mb-12 flex items-center justify-center min-h-[45vh] overflow-hidden">
        <div className="absolute inset-0 z-0 bg-background/80">
          <img 
            src={selectedBlog.image} 
            alt={selectedBlog.title} 
            className="w-full h-full object-cover brightness-[0.9] opacity-25"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent"></div>
        </div>

        <div className="max-w-4xl mx-auto relative z-10 text-center px-4">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4"
          >
            <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full border backdrop-blur-md ${catColor}`}>
              <Tag className="w-3 h-3" /> {selectedBlog.category}
            </span>
          </motion.div>

          <motion.h1 
            className="text-3xl md:text-5xl font-black text-primary mb-6 leading-tight font-sans tracking-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {selectedBlog.title}
          </motion.h1>

          <motion.div 
            className="flex flex-wrap items-center justify-center gap-6 text-slate-600 text-sm font-semibold"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            <span className="flex items-center gap-2"><User className="w-4.5 h-4.5 text-secondary" /> {selectedBlog.authorName}</span>
            <span className="flex items-center gap-2"><Calendar className="w-4.5 h-4.5 text-secondary" /> {selectedBlog.date || (selectedBlog.createdAt ? new Date(selectedBlog.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : "")}</span>
            <span className="flex items-center gap-2"><Clock className="w-4.5 h-4.5 text-secondary" /> {selectedBlog.readTime}</span>
          </motion.div>
        </div>
      </section>

      {/* Article Body Content */}
      <section className="max-w-3xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="space-y-6"
        >
          {/* Back button */}
          <Link to="/blog" className="inline-flex items-center gap-2 text-slate-500 hover:text-primary transition font-semibold text-sm mb-6 no-underline">
            <ArrowLeft className="w-4 h-4" /> Back to Articles
          </Link>

          {/* Excerpt */}
          <div className="border-l-4 border-secondary bg-slate-50 p-5 rounded-r-2xl font-medium text-lg text-slate-700 leading-relaxed italic">
            "{selectedBlog.description}"
          </div>

          {/* Full content */}
          <div className="text-slate-650 leading-loose text-base font-medium space-y-6 whitespace-pre-line pt-4">
            {selectedBlog.content}
          </div>

          {/* Author signature section */}
          {selectedBlog.doctorAuthor && (
            <div className="bg-white border border-slate-200 shadow-sm p-6 rounded-3xl mt-12 flex flex-col sm:flex-row items-center gap-5">
              <div className="w-16 h-16 rounded-full overflow-hidden border border-slate-200 shrink-0">
                <img
                  src={selectedBlog.doctorAuthor.photo || "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=200&q=80"}
                  alt={selectedBlog.doctorAuthor.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-center sm:text-left">
                <h4 className="font-bold text-primary text-base font-sans">Written by Dr. {selectedBlog.doctorAuthor.name}</h4>
                <p className="text-slate-500 text-xs mt-1">{selectedBlog.doctorAuthor.specialization || "Medical Specialist"} • Usthi Hospital Expert</p>
              </div>
            </div>
          )}
        </motion.div>
      </section>
    </main>
  );
};

export default BlogDetails;
