import { useState, useEffect, useRef, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Play, X, HeartPulse, Sparkles } from "lucide-react";

const videoReviews = [
  {
    id: 1,
    name: "Satyajit Padhi",
    role: "Consultant Neurologist",
    rating: 5,
    videoUrl: "https://res.cloudinary.com/drqb4p2a2/video/upload/v1783343770/WhatsApp_Video_2026-07-06_at_6.34.36_PM_fgjjlb.mp4",
    poster: "https://res.cloudinary.com/drqb4p2a2/image/upload/v1783343757/WhatsApp_Image_2026-07-06_at_6.36.36_PM_qe34yf.jpg",
    quote: "The maternity team and facilities at Usthi Hospital made my delivery smooth and wonderful. The care was absolute 5-star.",
  },
  {
    id: 2,
    name: "Shabari Bhattacharya",
    role: "Consultant Obstetrician",
    rating: 5,
    videoUrl: "https://res.cloudinary.com/drqb4p2a2/video/upload/v1783343759/WhatsApp_Video_2026-07-06_at_6.34.35_PM_mwnxbr.mp4",
    poster: "https://res.cloudinary.com/drqb4p2a2/image/upload/v1783343756/WhatsApp_Image_2026-07-06_at_6.37.20_PM_poff0j.jpg",
    quote: "My bypass surgery was performed by world-class cardiologists. I'm active and healthy again. Eternally grateful to Usthi Hospital.",
  },
  {
    id: 3,
    name: "Abhishek Chatterjee",
    role: "General Physician",
    rating: 5,
    videoUrl: "https://res.cloudinary.com/drqb4p2a2/video/upload/v1783343762/WhatsApp_Video_2026-07-06_at_6.34.41_PM_evmtxx.mp4",
    poster: "https://res.cloudinary.com/drqb4p2a2/image/upload/v1783344016/WhatsApp_Image_2026-07-06_at_6.36.37_PM_k9mmky.jpg",
    quote: "After my knee replacement, I'm walking pain-free. The post-op rehabilitation and care team here are exceptional.",
  },
];

const HomeVideoReviews = memo(() => {
  const [activeVideo, setActiveVideo] = useState(null);
  const modalRef = useRef(null);

  // Close modal on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setActiveVideo(null);
      }
    };
    if (activeVideo) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden"; // Prevent scrolling when open
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [activeVideo]);

  return (
    <section className="py-24 bg-slate-50 relative overflow-hidden">
      {/* Decorative Blur Background Blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-[#07a7a5]/5 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[#0b5c9e]/5 rounded-full blur-3xl translate-y-1/3 translate-x-1/3" />
      </div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-50 border border-cyan-150 text-[#07a7a5] font-bold text-xs uppercase tracking-widest mb-4"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Video Testimonial   s</span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl md:text-5xl font-black text-slate-800 mb-4 font-sans tracking-tight"
          >
            Stories of <span className="text-[#07a7a5]">Hope & Healing</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-slate-500 max-w-2xl mx-auto text-base md:text-lg leading-relaxed"
          >
            Watch real-life patient reviews and follow their recovery journeys under our specialty clinical care.
          </motion.p>
        </div>

        {/* Video Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {videoReviews.map((video, idx) => (
            <motion.div
              key={video.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.015)] group hover:shadow-xl hover:border-slate-300/80 transition-all duration-300 flex flex-col h-full cursor-pointer"
              onClick={() => setActiveVideo(video)}
            >
              {/* Video Poster Preview Block */}
              <div className="aspect-[16/10] relative overflow-hidden bg-slate-900 shrink-0">
                <img
                  src={video.poster}
                  alt={video.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                />

                {/* Dark Vignette Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-slate-900/10 to-transparent transition-opacity group-hover:opacity-70 duration-350" />

                {/* Aesthetic Glowing Play Button */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-14 h-14 rounded-full bg-white/20 border border-white/40 text-white backdrop-blur-md flex items-center justify-center shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:bg-[#07a7a5] group-hover:border-transparent group-hover:shadow-[#07a7a5]/30">
                    <Play className="w-6 h-6 fill-current text-white translate-x-0.5" />
                  </div>
                </div>

                {/* Badge Overlay */}
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm border border-slate-100 rounded-full px-3 py-1 shadow-sm flex items-center gap-1">
                  <HeartPulse className="w-3.5 h-3.5 text-[#07a7a5]" />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-700">Patient Review</span>
                </div>
              </div>

              {/* Card Details Block */}
              <div className="p-6 flex flex-col flex-grow text-left justify-between">
                <div className="space-y-3">
                  {/* Rating Stars */}
                  <div className="flex gap-0.5">
                    {Array.from({ length: video.rating }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>

                  {/* Patient Quote Preview */}
                  <p className="text-slate-600 text-sm leading-relaxed italic font-medium">
                    "{video.quote}"
                  </p>
                </div>

                <div className="flex items-center gap-3 pt-5 border-t border-slate-100 mt-5 shrink-0">
                  <div className="w-9 h-9 rounded-full bg-[#07a7a5]/10 text-[#07a7a5] border border-[#07a7a5]/20 flex items-center justify-center font-bold text-xs uppercase shrink-0">
                    {video.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm text-[#0b5c9e] tracking-tight">{video.name}</h4>
                    <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wide">{video.role}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Premium Video Lightbox Modal */}
      <AnimatePresence>
        {activeVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-50 flex items-center justify-center p-4"
            onClick={() => setActiveVideo(null)}
          >
            <motion.div
              ref={modalRef}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl relative"
              onClick={(e) => e.stopPropagation()} // Prevent close on player click
            >
              {/* Close Button */}
              <button
                onClick={() => setActiveVideo(null)}
                className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-slate-800/80 hover:bg-slate-700/80 hover:scale-105 active:scale-95 text-white flex items-center justify-center transition-all cursor-pointer border-none"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Video Player */}
              <div className="aspect-video w-full bg-black flex items-center justify-center">
                <video
                  src={activeVideo.videoUrl}
                  poster={activeVideo.poster}
                  autoPlay
                  controls
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Modal Metadata Footer */}
              <div className="p-5 md:p-6 bg-slate-900 text-left border-t border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <h3 className="font-extrabold text-white text-base font-sans tracking-tight">
                    {activeVideo.name}
                  </h3>
                  <p className="text-[#07a7a5] text-xs font-bold uppercase tracking-wider">
                    {activeVideo.role}
                  </p>
                </div>
                <div className="flex gap-0.5 shrink-0 self-start md:self-center">
                  {Array.from({ length: activeVideo.rating }).map((_, i) => (
                    <Star key={i} className="w-4.5 h-4.5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
});

HomeVideoReviews.displayName = "HomeVideoReviews";
export default HomeVideoReviews;
