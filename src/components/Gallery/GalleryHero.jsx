import { motion } from "framer-motion";

const GalleryHero = () => {
  return (
    <div className="w-full bg-background mb-12">
      {/* ── TOP HERO IMAGE BANNER ── */}
      <div 
        className="w-full h-[220px] md:h-[320px]  bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url('https://images.unsplash.com/photo-1538108149393-fbbd81895907?auto=format&fit=crop&w=2000&q=80')` }}
      />

      {/* ── HEADER BOX ── */}
      <div className="max-w-7xl mx-auto px-6 mt-8">
        <motion.div 
          className="border-2 border-[#e2e8f0] rounded-2xl p-6 text-center shadow-[0_8px_30px_rgba(0,0,0,0.015)] bg-white max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#0b5c9e] tracking-tight font-sans">
            Photo Gallery
          </h1>
          <p className="text-sm md:text-base font-black text-slate-800 mt-2 font-sans tracking-wide">
            A Glimpse into Our State-of-the-Art Hospital
          </p>
          <div className="w-16 h-0.5 bg-[#07a7a5] mx-auto my-3" />
          <p className="text-xs md:text-sm text-slate-650 leading-relaxed font-sans max-w-3xl mx-auto">
            Take a visual tour of our world-class infrastructure, modern medical equipment, comfortable patient care spaces, and dedicated healthcare professionals in action.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default GalleryHero;
