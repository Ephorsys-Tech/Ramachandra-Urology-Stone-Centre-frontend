import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, memo } from "react";
import { Image } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllGalleries } from "../../redux/features/gallery/galleryThunk";
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
    return "Doctors";
  }
  
  if (
    title.includes("lab") || 
    title.includes("research") || 
    title.includes("microscope") || 
    title.includes("tablet") || 
    title.includes("equipment") || 
    title.includes("device") || 
    title.includes("machinery") || 
    title.includes("diagnostic") ||
    desc.includes("laboratory") || 
    desc.includes("microscope") || 
    desc.includes("equipment") || 
    desc.includes("diagnostic")
  ) {
    return "Medical Equipment";
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
    return "Wards & Rooms";
  }
  
  return "Infrastructure";
};

// Bento layout spans pattern (repeating)
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

const GalleryGrid = memo(() => {
  const dispatch = useDispatch();
  const { galleries, loading } = useSelector((state) => state.gallery);
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    if (galleries.length === 0) {
      dispatch(fetchAllGalleries());
    }
  }, [dispatch, galleries.length]);

  const categories = ["All", "Infrastructure", "Doctors", "Medical Equipment", "Wards & Rooms"];

  const filtered = activeCategory === "All" 
    ? galleries 
    : galleries.filter(item => categorizeItem(item) === activeCategory);

  return (
    <section className="max-w-7xl mx-auto px-6 pb-24 relative min-h-[400px]">
      {/* Category Filters */}
      <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer border-none ${
              activeCategory === category
                ? "bg-secondary text-white shadow-lg shadow-secondary/25 scale-105"
                : "bg-slate-100 text-slate-650 hover:bg-slate-200 hover:text-primary"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

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
            return (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
                key={img._id}
                className={`group relative overflow-hidden rounded-[2rem] aspect-[16/10] bg-white border border-slate-250/60 shadow-sm hover:shadow-md transition-all duration-300 ${getCardSpan(index)}`}
              >
                <img
                  src={img.image}
                  alt={img.title || "Usthi Hospital Gallery"}
                  className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-700"
                  loading="lazy"
                  decoding="async"
                />
                {img.title && (
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 via-black/20 to-transparent text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <p className="text-xs font-bold truncate">{img.title}</p>
                  </div>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>
      )}

      {filtered.length === 0 && !loading && (
        <div className="text-center py-24 bg-slate-50 border border-slate-200 rounded-[2.5rem]">
          <Image className="w-16 h-16 text-slate-450 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-primary mb-2 font-sans">No images found</h3>
          <p className="text-slate-500 text-sm">There are no images registered under this category.</p>
        </div>
      )}
    </section>
  );
});

GalleryGrid.displayName = "GalleryGrid";
export default GalleryGrid;
