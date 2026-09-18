import { useState, useEffect, useRef, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Play, X, HeartPulse, Sparkles } from "lucide-react";

const videoReviews = [
  {
    id: 1,
    name: "Dr. Satyajit Padhi",
    role: "Senior Medical Consultant",
    rating: 5,
    videoUrl: "#",
    poster: "https://res.cloudinary.com/drqb4p2a2/image/upload/v1783343757/WhatsApp_Image_2026-07-06_at_6.36.36_PM_qe34yf.jpg",
    quote: "The modular operation theatres and advanced laser lithotripsy systems at Ramachandra Urology offer outstanding clinical precision.",
  },
  {
    id: 2,
    name: "Dr. Shabari Bhattacharya",
    role: "Clinical Specialist",
    rating: 5,
    videoUrl: "#",
    poster: "https://res.cloudinary.com/drqb4p2a2/image/upload/v1783343756/WhatsApp_Image_2026-07-06_at_6.37.20_PM_poff0j.jpg",
    quote: "Daycare stone surgeries and seamless Ayushman / GJAY cashless support make this hospital the top urology choice in Sambalpur.",
  },
  {
    id: 3,
    name: "Dr. Abhishek Chatterjee",
    role: "Physician & Care Coordinator",
    rating: 5,
    videoUrl: "#",
    poster: "https://res.cloudinary.com/drqb4p2a2/image/upload/v1783344016/WhatsApp_Image_2026-07-06_at_6.36.37_PM_k9mmky.jpg",
    quote: "Patient-first attitude, stitchless laser surgeries, and rapid recovery protocols define the high standards of care here.",
  },
];

const HomeVideoReviews = memo(() => {
  const [activeVideo, setActiveVideo] = useState(null);
  const modalRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setActiveVideo(null);
      }
    };
    if (activeVideo) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [activeVideo]);

  return (
    <section className="py-16 sm:py-24 bg-slate-50/70 relative overflow-hidden ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#0FA8D6]/15 border border-[#0FA8D6]/30 text-[#024363] font-medium text-xs uppercase tracking-wider mb-3 shadow-2xs"
          >
            <Sparkles size={12} className="text-[#0FA8D6]" />
            <span>Doctor & Patient Experiences</span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl font-medium text-[#012442] tracking-tight"
          >
            Real Stories, Verified Outcomes
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-3 text-slate-600 max-w-2xl mx-auto text-xs sm:text-sm leading-relaxed"
          >
            Watch clinical feedback and patient testimonials describing their journey through modern laser stone treatments.
          </motion.p>
        </div>

        {/* Video Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {videoReviews.map((review, index) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="bg-white rounded-3xl overflow-hidden border border-slate-200/90 shadow-xs hover:shadow-xl hover:border-[#0FA8D6]/40 transition-all duration-300 flex flex-col group"
            >
              {/* Thumbnail Container */}
              <div
                className="relative aspect-video w-full overflow-hidden bg-slate-900 cursor-pointer"
                onClick={() => setActiveVideo(review)}
              >
                <img
                  src={review.poster}
                  alt={review.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

                {/* Play Button */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-13 h-13 rounded-full bg-gradient-to-tr from-[#0FA8D6] to-[#024363] text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Play className="w-5 h-5 ml-0.5 fill-current" />
                  </div>
                </div>

                <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-md text-[10.5px] font-bold text-white flex items-center gap-1">
                  <HeartPulse className="w-3 h-3 text-[#0FA8D6]" />
                  <span>Clinical Perspective</span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1 mb-3">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-3.5 h-3.5 fill-[#0FA8D6] text-[#0FA8D6]"
                      />
                    ))}
                  </div>
                  <p className="text-xs text-slate-600 italic leading-relaxed mb-4">
                    "{review.quote}"
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-[#012442]">{review.name}</h4>
                    <p className="text-[11px] text-[#0FA8D6] font-bold">{review.role}</p>
                  </div>
                  <button
                    onClick={() => setActiveVideo(review)}
                    className="text-xs font-medium text-[#024363] hover:text-[#0FA8D6] flex items-center gap-1 border-none bg-transparent cursor-pointer"
                  >
                    <span>Watch</span> ↗
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Video Modal */}
      <AnimatePresence>
        {activeVideo && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4"
            onClick={() => setActiveVideo(null)}
          >
            <motion.div
              ref={modalRef}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-4xl bg-black rounded-3xl overflow-hidden shadow-2xl border border-white/10"
            >
              <button
                onClick={() => setActiveVideo(null)}
                className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center backdrop-blur-md transition-colors border-none cursor-pointer"
              >
                <X size={18} />
              </button>
              <div className="aspect-video w-full bg-black">
                <video
                  src={activeVideo.videoUrl}
                  controls
                  autoPlay
                  className="w-full h-full object-contain"
                />
              </div>

              <div className="p-4 sm:p-5 bg-slate-900 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-white">{activeVideo.name}</h4>
                  <p className="text-xs text-[#0FA8D6] font-bold">{activeVideo.role}</p>
                </div>
                <div className="flex gap-1">
                  {Array.from({ length: activeVideo.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#0FA8D6] text-[#0FA8D6]" />
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section >
  );
});

HomeVideoReviews.displayName = "HomeVideoReviews";
export default HomeVideoReviews;
