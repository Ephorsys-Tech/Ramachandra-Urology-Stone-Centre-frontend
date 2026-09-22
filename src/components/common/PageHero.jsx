import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ChevronRight, Sparkles, ShieldCheck, MapPin } from "lucide-react";

const PageHero = ({
  badge = "Ramachandra Urology & Stone Centre • Sambalpur",
  title,
  highlightTitle,
  subtitle,
  breadcrumb = "Page",
  image,
  imageAlt = "Hospital Feature",
  imageTag = "NABH Accredited Hospital",
  theme = "emerald", // 'emerald' | 'blue'
  children
}) => {
  const isBlue = theme === "blue";

  return (
    <div className={`relative w-full text-slate-900 pt-8 sm:pt-12 pb-12 sm:pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden select-none border-b ${
      isBlue
        ? "bg-gradient-to-br from-[#0FA8D6]/10 via-[#024363]/5 to-slate-50 border-slate-200/80"
        : "bg-gradient-to-br from-emerald-50/70 via-teal-50/40 to-slate-50 border-slate-200/80"
    }`}>
      
      {/* ── AMBIENT SOFT MEDICAL GLOWS & PATTERNS ── */}
      <div className={`absolute top-0 right-1/4 w-96 h-96 blur-[100px] rounded-full pointer-events-none ${
        isBlue ? "bg-[#0FA8D6]/15" : "bg-emerald-300/15"
      }`} />
      <div className={`absolute bottom-0 left-1/4 w-96 h-96 blur-[100px] rounded-full pointer-events-none ${
        isBlue ? "bg-[#024363]/10" : "bg-teal-200/20"
      }`} />
      
      {/* Subtle Dot Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.035] pointer-events-none"
        style={{
          backgroundImage: isBlue 
            ? "radial-gradient(#024363 1.5px, transparent 1.5px)" 
            : "radial-gradient(#00875a 1.5px, transparent 1.5px)",
          backgroundSize: "24px 24px"
        }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* ── BREADCRUMBS ── */}
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 mb-4"
        >
          <Link to="/" className={`hover:underline transition-colors no-underline text-slate-500 font-medium ${
            isBlue ? "hover:text-[#024363]" : "hover:text-emerald-700"
          }`}>
            Home
          </Link>
          <ChevronRight size={13} className="text-slate-400" />
          <span className={`font-bold ${isBlue ? "text-[#024363]" : "text-emerald-800"}`}>
            {breadcrumb}
          </span>
        </motion.div>

        {/* ── 2-COLUMN HERO LAYOUT ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Text & Badges */}
          <div className={`${image ? "lg:col-span-7" : "lg:col-span-12"} space-y-4 text-left`}>
            
            {/* Top Pill Badge */}
            {badge && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35 }}
                className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/95 border text-xs font-extrabold tracking-wider uppercase shadow-2xs backdrop-blur-md ${
                  isBlue
                    ? "border-[#0FA8D6]/40 text-[#024363]"
                    : "border-emerald-200 text-emerald-800"
                }`}
              >
               
                <span>{badge}</span>
              </motion.div>
            )}

            {/* Main Title */}
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.06 }}
              className="text-3xl sm:text-4xl md:text-5xl font-medium text-slate-900 tracking-tight leading-[1.12]"
            >
              {title}{" "}
              {highlightTitle && (
                <span className={
                  isBlue
                    ? "bg-gradient-to-r from-[#024363] via-[#0FA8D6] to-[#012442] bg-clip-text text-transparent"
                    : "bg-gradient-to-r from-emerald-700 via-teal-600 to-emerald-800 bg-clip-text text-transparent"
                }>
                  {highlightTitle}
                </span>
              )}
            </motion.h1>

            {/* Subtitle */}
            {subtitle && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.12 }}
                className="text-xs sm:text-sm md:text-base text-slate-600 leading-relaxed font-medium max-w-2xl"
              >
                {subtitle}
              </motion.p>
            )}


          </div>

          {/* Right Column: Clean 3D Elevated Image Frame */}
          {image && (
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.1 }}
              className="lg:col-span-5 relative"
            >
              <div className={`relative rounded-3xl p-2 bg-white/95 backdrop-blur-md border shadow-xl group ${
                isBlue 
                  ? "border-[#0FA8D6]/30 shadow-[#024363]/5" 
                  : "border-slate-200/90 shadow-[0_20px_50px_rgba(0,135,90,0.08)]"
              }`}>
                <div className="rounded-2xl overflow-hidden aspect-[16/11] sm:aspect-[16/10] bg-slate-100 relative">
                  <img
                    src={image}
                    alt={imageAlt}
                    loading="eager"
                    className="w-full h-full object-cover object-center group-hover:scale-104 transition-transform duration-700 ease-out"
                  />

                  {/* Gentle Gradient Tint */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent opacity-60" />
                </div>


              </div>

              {/* Decorative Subtle Shadow Glow */}
              <div className={`absolute -bottom-2 -right-2 w-32 h-32 rounded-full blur-2xl pointer-events-none ${
                isBlue ? "bg-[#0FA8D6]/15" : "bg-emerald-500/10"
              }`} />
            </motion.div>
          )}

        </div>

      </div>
    </div>
  );
};

export default PageHero;
