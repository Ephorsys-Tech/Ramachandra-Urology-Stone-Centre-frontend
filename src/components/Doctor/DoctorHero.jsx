import { motion } from "framer-motion";
import { Sparkles, Shield, Stethoscope } from "lucide-react";

const DoctorHero = () => {
  return (
    <div className="relative w-full bg-gradient-to-b from-[#eaf4fc] via-[#f3f8fd] to-[#f4f7fb] pt-12 pb-16 px-4 sm:px-6 overflow-hidden select-none border-b border-slate-200/60">
      {/* ── AMBIENT BACKGROUND MEDICAL CROSSES & PATTERNS ── */}
      <div className="absolute top-6 left-10 text-sky-200/60 font-thin text-6xl pointer-events-none select-none">
        +
      </div>
      <div className="absolute top-24 left-24 text-sky-200/40 font-thin text-4xl pointer-events-none select-none">
        +
      </div>
      <div className="absolute bottom-6 left-1/4 text-sky-200/50 font-thin text-5xl pointer-events-none select-none">
        +
      </div>

      {/* Decorative Hospital Silhouette / Building on Right */}
      <div className="absolute right-0 top-0 bottom-0 w-1/3 max-w-[420px] hidden lg:block pointer-events-none opacity-20 bg-cover bg-center"
        style={{
          backgroundImage: `url('https://res.cloudinary.com/drqb4p2a2/image/upload/v1787555587/1I5A4330_1_ol33o9.webp')`,
          maskImage: 'linear-gradient(to left, rgba(0,0,0,1) 40%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to left, rgba(0,0,0,1) 40%, transparent 100%)'
        }}
      />

      <div className="max-w-4xl mx-auto text-center relative z-10">
        {/* ── TOP PILL BADGE ── */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-100/80 border border-sky-200/80 text-[#0052cc] text-xs font-black tracking-wider uppercase mb-4 shadow-2xs"
        >
          <Stethoscope size={14} className="text-[#0052cc]" />
          <span>OUR EXPERTS</span>
        </motion.div>

        {/* ── MAIN TITLE ── */}
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-3xl sm:text-4xl md:text-5xl font-black text-[#0d2e5c] tracking-tight font-sans leading-tight"
        >
          Our Doctors, Your Health Experts
        </motion.h1>

        {/* ── SUBTITLE WITH DIVIDERS ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex items-center justify-center gap-3 mt-3.5 mb-4 text-[#008ba3] font-bold text-xs sm:text-sm md:text-base tracking-wide"
        >
          <div className="w-8 sm:w-12 h-0.5 bg-[#008ba3]/40 rounded-full" />
          <span>World-Class Care by Leading Specialists at Usthi Hospital</span>
          <div className="w-8 sm:w-12 h-0.5 bg-[#008ba3]/40 rounded-full" />
        </motion.div>

        {/* ── INTRO PARAGRAPH ── */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-xs sm:text-sm text-slate-600 leading-relaxed font-sans max-w-2xl mx-auto font-medium"
        >
          Usthi Hospital is home to a team of highly experienced and compassionate doctors providing advanced medical care across multiple specialties. Our experts are committed to your well-being with precision, empathy, and excellence.
        </motion.p>
      </div>
    </div>
  );
};

export default DoctorHero;
