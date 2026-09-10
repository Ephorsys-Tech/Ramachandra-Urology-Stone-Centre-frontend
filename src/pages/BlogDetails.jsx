import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { motion } from "framer-motion";
import {
  Calendar,
  User,
  Clock,
  ArrowLeft,
  Tag,
  ShieldCheck,
  CheckCircle2,
  Share2,
  CalendarCheck,
  Phone
} from "lucide-react";
import PageHero from "../components/common/PageHero";
import { fetchBlogById } from "../redux/features/blog/blogThunk";
import { clearSelectedBlog } from "../redux/features/blog/blogSlice";
import { openAppointmentModal } from "../redux/features/patient/patientSlice";

const BlogDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { selectedBlog, loading, error } = useSelector(
    (state) => state.blog || { selectedBlog: null, loading: false, error: null }
  );
  const { settings } = useSelector((state) => state.setting || { settings: null });
  const emergencyPhone = settings?.emergencyPhone || "9090963722";

  useEffect(() => {
    dispatch(fetchBlogById(id));
    return () => {
      dispatch(clearSelectedBlog());
    };
  }, [dispatch, id]);

  if (loading) {
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
        <p className="text-slate-500 text-sm mb-6">{error || "The post you are trying to view does not exist."}</p>
        <Link
          to="/blog"
          className="flex items-center gap-2 bg-[#0FA8D6] hover:bg-[#00b4ea] text-[#012442] px-6 py-2.5 rounded-full font-bold transition no-underline text-xs tracking-wide uppercase"
        >
          <ArrowLeft size={14} /> Back to Health Articles
        </Link>
      </div>
    );
  }

  return (
    <main className="bg-slate-50/50 min-h-screen pb-24 text-slate-900 font-sans">
      <PageHero
        breadcrumb={`Blog / ${selectedBlog.category || "Article"}`}
        badge={selectedBlog.category || "Urology Insight"}
        title={selectedBlog.title}
        image={selectedBlog.image}
        imageAlt={selectedBlog.title}
        imageTag="Physician-Verified Guide"
        theme="blue"
      >
        <div className="flex flex-wrap items-center gap-3 text-slate-300 text-xs font-semibold pt-1">
          <span className="flex items-center gap-1.5 bg-white/10 px-3.5 py-1.5 rounded-xl border border-white/15 backdrop-blur-md">
            <User size={14} className="text-[#0FA8D6]" />
            <span>{selectedBlog.authorName || "Specialist Doctor"}</span>
          </span>
          <span className="flex items-center gap-1.5 bg-white/10 px-3.5 py-1.5 rounded-xl border border-white/15 backdrop-blur-md">
            <Calendar size={14} className="text-[#0FA8D6]" />
            <span>
              {selectedBlog.date ||
                (selectedBlog.createdAt
                  ? new Date(selectedBlog.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric"
                    })
                  : "Recent")}
            </span>
          </span>
          {selectedBlog.readTime && (
            <span className="flex items-center gap-1.5 bg-white/10 px-3.5 py-1.5 rounded-xl border border-white/15 backdrop-blur-md">
              <Clock size={14} className="text-[#0FA8D6]" />
              <span>{selectedBlog.readTime}</span>
            </span>
          )}
          <span className="flex items-center gap-1.5 bg-[#0FA8D6]/20 text-cyan-200 px-3 py-1.5 rounded-xl border border-[#0FA8D6]/30 backdrop-blur-md">
            <ShieldCheck size={14} className="text-[#0FA8D6]" />
            <span>Clinically Verified</span>
          </span>
        </div>
      </PageHero>

      {/* Article Body Content */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="space-y-8"
        >
          {/* Top navigation actions */}
          <div className="flex items-center justify-between border-b border-slate-200 pb-4">
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 text-slate-600 hover:text-[#0FA8D6] transition font-bold text-xs uppercase tracking-wider no-underline"
            >
              <ArrowLeft size={14} /> Back to All Articles
            </Link>

            <span className="text-xs text-slate-500 font-semibold flex items-center gap-1.5 bg-white px-3 py-1 rounded-full border border-slate-200 shadow-2xs">
              <CheckCircle2 size={13} className="text-[#0FA8D6]" />
              Published by Ramachandra Urology & Stone Centre
            </span>
          </div>

          {/* Key Takeaway / Excerpt Box */}
          {selectedBlog.description && (
            <div className="border-l-4 border-[#0FA8D6] bg-white p-6 rounded-r-2xl shadow-xs border border-slate-200/60 font-medium text-base sm:text-lg text-[#012442] leading-relaxed italic">
              "{selectedBlog.description}"
            </div>
          )}

          {/* Full content body */}
          <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-10 shadow-xs text-slate-700 leading-relaxed text-base sm:text-[17px] space-y-6 whitespace-pre-line">
            {selectedBlog.content}
          </div>

          {/* Author signature & credentials */}
          <div className="bg-gradient-to-r from-[#012442] to-[#024363] text-white rounded-3xl p-6 sm:p-8 shadow-md border border-[#0FA8D6]/20 flex flex-col sm:flex-row items-center gap-6">
            <div className="w-18 h-18 rounded-2xl overflow-hidden border-2 border-[#0FA8D6]/40 shrink-0 shadow-md">
              <img
                src={
                  selectedBlog.doctorAuthor?.photo ||
                  "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=300&q=80"
                }
                alt={selectedBlog.doctorAuthor?.name || selectedBlog.authorName}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="text-center sm:text-left flex-1">
              <div className="text-[11px] text-[#0FA8D6] font-bold uppercase tracking-wider mb-1">
                Medical Author & Reviewer
              </div>
              <h4 className="font-extrabold text-white text-lg tracking-tight">
                {selectedBlog.doctorAuthor?.name
                  ? `Dr. ${selectedBlog.doctorAuthor.name}`
                  : selectedBlog.authorName || "Clinical Specialist"}
              </h4>
              <p className="text-slate-300 text-xs mt-1">
                {selectedBlog.doctorAuthor?.specialization || "Senior Consultant Urologist & Laser Surgeon"} • Ramachandra Urology & Stone Centre, Sambalpur
              </p>
            </div>
            <button
              onClick={() => dispatch(openAppointmentModal())}
              className="shrink-0 bg-[#0FA8D6] hover:bg-[#00b4ea] text-[#012442] font-black text-xs px-5 py-3 rounded-full no-underline transition-colors shadow-xs uppercase tracking-wide cursor-pointer border-none"
            >
              Consult Specialist
            </button>
          </div>

          {/* Quick Consultation CTA Banner */}
          <div className="bg-slate-100/90 border border-slate-200 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="text-base font-bold text-[#012442]">Have Questions or Facing Urological Symptoms?</h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Our care coordinators are available 24/7 to assist with OPD appointments and inquiries.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <a
                href={`tel:${emergencyPhone}`}
                className="inline-flex items-center gap-1.5 bg-white border border-slate-200 text-[#024363] hover:text-[#0FA8D6] font-bold text-xs px-4 py-2.5 rounded-xl no-underline transition-colors shadow-2xs"
              >
                <Phone size={13} className="text-[#0FA8D6]" />
                <span>+91 {emergencyPhone}</span>
              </a>
              <button
                onClick={() => dispatch(openAppointmentModal())}
                className="inline-flex items-center gap-1.5 bg-[#024363] hover:bg-[#012442] text-white font-bold text-xs px-4 py-2.5 rounded-xl border-none cursor-pointer transition-colors shadow-xs"
              >
                <CalendarCheck size={13} className="text-[#0FA8D6]" />
                <span>Book Visit</span>
              </button>
            </div>
          </div>
        </motion.div>
      </section>
    </main>
  );
};

export default BlogDetails;
