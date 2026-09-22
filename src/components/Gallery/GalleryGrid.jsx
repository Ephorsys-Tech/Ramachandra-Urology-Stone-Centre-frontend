import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, memo, useCallback } from "react";
import {
  Image as ImageIcon,
  Maximize2,
  X,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Building2,
  Stethoscope,
  Activity,
  BedDouble,
  Layers,
  Calendar
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllGalleries } from "../../redux/features/gallery/galleryThunk";
import { openAppointmentModal } from "../../redux/features/patient/patientSlice";
import { GalleryCardSkeleton } from "../common/Skeletons";

// Helper to dynamically classify gallery items in the frontend
const categorizeItem = (item) => {
  const title = (item.title || "").toLowerCase();
  const desc = (item.description || "").toLowerCase();

  if (
    title.includes("doctor") ||
    title.includes("staff") ||
    title.includes("specialist") ||
    title.includes("team") ||
    title.includes("surgeon") ||
    title.includes("nurse") ||
    desc.includes("doctor") ||
    desc.includes("specialist") ||
    desc.includes("surgeon") ||
    desc.includes("nurse") ||
    desc.includes("team")
  ) {
    return "Doctors & Care Team";
  }

  if (
    title.includes("lab") ||
    title.includes("research") ||
    title.includes("microscope") ||
    title.includes("laser") ||
    title.includes("thulium") ||
    title.includes("equipment") ||
    title.includes("device") ||
    title.includes("machinery") ||
    title.includes("diagnostic") ||
    desc.includes("laboratory") ||
    desc.includes("microscope") ||
    desc.includes("laser") ||
    desc.includes("equipment") ||
    desc.includes("diagnostic")
  ) {
    return "Laser & Medical Tech";
  }

  if (
    title.includes("room") ||
    title.includes("ward") ||
    title.includes("icu") ||
    title.includes("ot") ||
    title.includes("bed") ||
    title.includes("clinic") ||
    title.includes("reception") ||
    title.includes("hall") ||
    desc.includes("room") ||
    desc.includes("ward") ||
    desc.includes("bed") ||
    desc.includes("reception")
  ) {
    return "Wards & Patient Rooms";
  }

  return "Hospital Infrastructure";
};

// Bento layout spans pattern
const getCardSpan = (index) => {
  const pattern = [
    "col-span-1 lg:col-span-1", // 0
    "col-span-1 lg:col-span-2", // 1 (wide)
    "col-span-1 lg:col-span-2", // 2 (wide)
    "col-span-1 lg:col-span-1", // 3
    "col-span-1 lg:col-span-1", // 4
    "col-span-1 lg:col-span-2", // 5 (wide)
  ];
  return pattern[index % pattern.length];
};

const categoryIcons = {
  "All": Layers,
  "Hospital Infrastructure": Building2,
  "Laser & Medical Tech": Activity,
  "Doctors & Care Team": Stethoscope,
  "Wards & Patient Rooms": BedDouble,
};

const GalleryGrid = memo(() => {
  const dispatch = useDispatch();
  const { galleries, loading } = useSelector((state) => state.gallery || { galleries: [], loading: false });
  const [activeCategory, setActiveCategory] = useState("All");
  
  // Lightbox Modal state
  const [activeLightboxIndex, setActiveLightboxIndex] = useState(null);

  useEffect(() => {
    if (galleries.length === 0) {
      dispatch(fetchAllGalleries());
    }
  }, [dispatch, galleries.length]);

  const categories = [
    "All",
    "Hospital Infrastructure",
    "Laser & Medical Tech",
    "Doctors & Care Team",
    "Wards & Patient Rooms"
  ];

  const filtered = activeCategory === "All"
    ? galleries
    : galleries.filter((item) => categorizeItem(item) === activeCategory);

  // Keyboard navigation for lightbox
  const handleKeyDown = useCallback(
    (e) => {
      if (activeLightboxIndex === null) return;
      if (e.key === "Escape") setActiveLightboxIndex(null);
      if (e.key === "ArrowLeft") {
        setActiveLightboxIndex((prev) => (prev > 0 ? prev - 1 : filtered.length - 1));
      }
      if (e.key === "ArrowRight") {
        setActiveLightboxIndex((prev) => (prev < filtered.length - 1 ? prev + 1 : 0));
      }
    },
    [activeLightboxIndex, filtered.length]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const currentLightboxItem = activeLightboxIndex !== null ? filtered[activeLightboxIndex] : null;

  return (
    <section className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-[500px]">
      
      {/* ── CATEGORY PILL FILTER TABS ── */}
      <div className="flex flex-wrap items-center justify-center gap-2.5 mb-10 pb-4 border-b border-slate-200/80">
        {categories.map((category) => {
          const isSelected = activeCategory === category;
          const Icon = categoryIcons[category] || Layers;
          const count = category === "All"
            ? galleries.length
            : galleries.filter((item) => categorizeItem(item) === category).length;

          return (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer border ${
                isSelected
                  ? "bg-[#00B4EA] text-white border-transparent shadow-md shadow-[#0FA8D6]/20 scale-105"
                  : "bg-white text-slate-700 border-slate-200 hover:border-[#0FA8D6]/40 hover:text-[#024363] hover:bg-slate-50"
              }`}
            >
              <Icon size={14} className={isSelected ? "text-white" : "text-[#0FA8D6]"} />
              <span>{category}</span>
              <span
                className={`text-[10.5px] px-2 py-0.5 rounded-full font-bold ${
                  isSelected ? "bg-white/20 text-white" : "bg-slate-100 text-slate-600 border border-slate-200"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* ── BENTO GALLERY GRID ── */}
      {loading && galleries.length === 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, idx) => (
            <GalleryCardSkeleton key={idx} span={getCardSpan(idx)} />
          ))}
        </div>
      ) : (
        <motion.div layout className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filtered.map((img, index) => {
              const itemCat = categorizeItem(img);
              return (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.35, delay: index * 0.03 }}
                  key={img._id || index}
                  onClick={() => setActiveLightboxIndex(index)}
                  className={`group relative overflow-hidden rounded-3xl aspect-[16/10] bg-slate-900 border border-slate-200 shadow-xs hover:shadow-2xl hover:border-[#0FA8D6]/50 transition-all duration-500 cursor-pointer ${getCardSpan(
                    index
                  )}`}
                >
                  {/* Image with zoom effect */}
                  <img
                    src={img.image}
                    alt={img.title || "Ramachandra Urology & Stone Centre Campus"}
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                    loading="lazy"
                    decoding="async"
                  />

                  {/* Gradient Scrim */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#012442]/90 via-[#012442]/20 to-transparent opacity-80 group-hover:opacity-95 transition-opacity duration-300" />

                  {/* Top Badge: Category */}
                  <div className="absolute top-3.5 left-3.5 z-10">
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-bold px-3 py-1 rounded-full bg-white/90 text-[#012442] border border-white/40 shadow-xs backdrop-blur-md">
                
                      {itemCat}
                    </span>
                  </div>

                  {/* Top Right: Fullscreen Trigger Icon */}
                  <div className="absolute top-3.5 right-3.5 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-8 h-8 rounded-full bg-[#0FA8D6] text-[#012442] flex items-center justify-center shadow-md">
                      <Maximize2 size={14} />
                    </div>
                  </div>

                  {/* Bottom Info Banner */}
                  <div className="absolute bottom-0 left-0 right-0 p-5 z-10 transform translate-y-1 group-hover:translate-y-0 transition-transform duration-300">
                    <h4 className="text-white font-extrabold text-sm sm:text-base leading-snug tracking-tight mb-1 truncate group-hover:text-cyan-200 transition-colors">
                      {img.title || "Modern Clinical Facility"}
                    </h4>
                    {img.description && (
                      <p className="text-slate-300 text-xs line-clamp-1 opacity-90 group-hover:opacity-100 font-medium">
                        {img.description}
                      </p>
                    )}
                    <div className="pt-2 flex items-center gap-1 text-[11px] font-bold text-[#0FA8D6] opacity-0 group-hover:opacity-100 transition-opacity">
                      <span>Click to view full preview</span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      )}

      {/* ── EMPTY STATE ── */}
      {filtered.length === 0 && !loading && (
        <div className="text-center py-24 bg-white border border-slate-200 rounded-3xl p-8 max-w-lg mx-auto shadow-xs">
          <div className="w-16 h-16 rounded-2xl bg-[#0FA8D6]/15 text-[#0FA8D6] flex items-center justify-center mx-auto mb-4">
            <ImageIcon size={28} />
          </div>
          <h4 className="text-lg font-bold text-[#012442] mb-1">No photographs found</h4>
          <p className="text-slate-500 text-xs">
            There are currently no facility images registered under "{activeCategory}".
          </p>
          <button
            onClick={() => setActiveCategory("All")}
            className="mt-4 px-4 py-2 bg-[#024363] text-white text-xs font-bold rounded-full hover:bg-[#012442] transition cursor-pointer border-none"
          >
            Show All Photographs
          </button>
        </div>
      )}

      {/* ── FULL-SCREEN INTERACTIVE LIGHTBOX MODAL ── */}
      <AnimatePresence>
        {activeLightboxIndex !== null && currentLightboxItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 bg-[#012442]/95 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 "
            onClick={() => setActiveLightboxIndex(null)}
          >
            {/* Close Button */}
            <button
              onClick={() => setActiveLightboxIndex(null)}
              className="absolute top-4 right-4 sm:top-6 sm:right-6 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition border border-white/20 cursor-pointer z-50"
              aria-label="Close Preview"
            >
              <X size={20} />
            </button>

            {/* Previous Image Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setActiveLightboxIndex((prev) => (prev > 0 ? prev - 1 : filtered.length - 1));
              }}
              className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-white/10 hover:bg-[#0FA8D6] hover:text-[#012442] text-white flex items-center justify-center transition border border-white/20 cursor-pointer z-50"
              aria-label="Previous image"
            >
              <ChevronLeft size={24} />
            </button>

            {/* Next Image Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setActiveLightboxIndex((prev) => (prev < filtered.length - 1 ? prev + 1 : 0));
              }}
              className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-white/10 hover:bg-[#0FA8D6] hover:text-[#012442] text-white flex items-center justify-center transition border border-white/20 cursor-pointer z-50"
              aria-label="Next image"
            >
              <ChevronRight size={24} />
            </button>

            {/* Modal Dialog Content */}
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="max-w-5xl w-full max-h-[90vh] flex flex-col items-center bg-slate-900 rounded-3xl overflow-hidden border border-white/15 shadow-2xl relative z-40"
              onClick={(e) => e.stopPropagation()}
            >
              {/* High-Res Image Showcase */}
              <div className="w-full max-h-[70vh] bg-black flex items-center justify-center overflow-hidden">
                <img
                  src={currentLightboxItem.image}
                  alt={currentLightboxItem.title || "Facility Showcase"}
                  className="max-h-[70vh] w-auto max-w-full object-contain"
                />
              </div>

              {/* Bottom Details Bar */}
              <div className="w-full bg-[#012442] p-4 sm:p-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-center sm:text-left min-w-0">
                  <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#0FA8D6]/20 text-cyan-200 border border-[#0FA8D6]/40">
                      {categorizeItem(currentLightboxItem)}
                    </span>
                    <span className="text-xs text-slate-400 font-semibold">
                      Photo {activeLightboxIndex + 1} of {filtered.length}
                    </span>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-white tracking-tight truncate">
                    {currentLightboxItem.title || "Ramachandra Urology & Stone Centre"}
                  </h3>
                  {currentLightboxItem.description && (
                    <p className="text-xs text-slate-300 mt-0.5 line-clamp-1">
                      {currentLightboxItem.description}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <button
                    onClick={() => {
                      setActiveLightboxIndex(null);
                      dispatch(openAppointmentModal());
                    }}
                    className="flex items-center gap-1.5 bg-[#0FA8D6] hover:bg-[#00b4ea] text-[#012442] font-medium text-xs px-5 py-2.5 rounded-full no-underline transition-colors shadow-xs uppercase tracking-wide cursor-pointer border-none"
                  >
                    <Calendar size={13} />
                    <span>Book Hospital Visit</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </section>
  );
});

GalleryGrid.displayName = "GalleryGrid";
export default GalleryGrid;

