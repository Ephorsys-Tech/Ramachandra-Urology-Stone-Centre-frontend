import { motion } from "framer-motion";

const BlogHero = () => {
  return (
    <div className="w-full bg-background mb-12">
      {/* ── TOP HERO IMAGE BANNER ── */}
      <div
        className="w-full h-[220px] md:h-[440px] bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url('https://res.cloudinary.com/drqb4p2a2/image/upload/v1783148317/PXL_20260701_144557189.jpg_i7iqlz.jpg')` }}
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
            Health Insights & Medical News
          </h1>
          <p className="text-sm md:text-base font-black text-slate-800 mt-2 font-sans tracking-wide">
            Stay Informed with Tips from Our Experts
          </p>
          <div className="w-16 h-0.5 bg-[#07a7a5] mx-auto my-3" />
          <p className="text-xs md:text-sm text-slate-650 leading-relaxed font-sans max-w-3xl mx-auto">
            Welcome to the Usthi Hospital Blog. Discover helpful health tips, learn about advanced medical procedures, read inspirational patient recovery stories, and stay up to date with the latest medical news and developments published by our qualified doctors and specialists.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default BlogHero;
