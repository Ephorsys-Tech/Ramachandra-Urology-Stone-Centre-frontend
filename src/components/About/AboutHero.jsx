import { useState, useRef } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { HeartPulse, Award, ShieldCheck, Stethoscope, Sparkles, ChevronRight } from "lucide-react";

const AboutHero = () => {
  const [activePillar, setActivePillar] = useState(0);
  const containerRef = useRef(null);

  // Track scroll progress of the AboutHero section
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  // Layer 2 animation: Header Text slides up & fades out as user scrolls down
  const titleOpacity = useTransform(scrollYProgress, [0, 0.25], [1, 0]);
  const titleY = useTransform(scrollYProgress, [0, 0.25], [0, -60]);
  
  // Layer 1 animation: Background image parallax scaling
  const bgScale = useTransform(scrollYProgress, [0, 0.8], [1, 1.08]);

  const pillars = [
    {
      id: 0,
      title: "Healing Legacy",
      subtitle: "Spanning Over Two Decades",
      detail: "Built on a foundation of compassionate patient care, healing, and community trust since 2006.",
      icon: Award,
      tag: "Since 2006",
      bgColor: "bg-emerald-50/90 border-emerald-200/80 text-emerald-950",
    },
    {
      id: 1,
      title: "Clinical Excellence",
      subtitle: "Comprehensive Medical Services",
      detail: "Providing top-tier diagnostic, surgical, and therapeutic care guided by expert medical specialists.",
      icon: Stethoscope,
      tag: "Top Tier Care",
      bgColor: "bg-blue-50/90 border-blue-200/80 text-blue-950",
    },
    {
      id: 2,
      title: "State-of-the-Art Facilities",
      subtitle: "Advanced Infrastructure",
      detail: "Equipped with cutting-edge medical technology and a team of outstanding healthcare professionals.",
      icon: ShieldCheck,
      tag: "24/7 Facilities",
      bgColor: "bg-teal-50/90 border-teal-200/80 text-teal-950",
    },
  ];

  return (
    <div ref={containerRef} className="w-full relative bg-slate-900 overflow-hidden">
      
      {/* ── LAYER 1: FIXED BACKGROUND IMAGE (PINNED STICKY TOP 0) ── */}
      <div className="sticky top-0 w-full h-screen z-0 overflow-hidden">
        <motion.div
          className="w-full h-full bg-cover bg-no-repeat origin-center"
          style={{
            backgroundImage: `url('https://res.cloudinary.com/drqb4p2a2/image/upload/v1783339988/WhatsApp_Image_2026-07-06_at_5.40.57_PM_1_vjgpse.jpg')`,
            backgroundPosition: "center 30%",
            scale: bgScale,
          }}
        />
        {/* Dark Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/70 via-slate-900/50 to-slate-950/80" />

        {/* ── LAYER 2: HERO HEADER TEXT ANIMATION (FADES OUT & SLIDES UP ON SCROLL) ── */}
        <motion.div
          style={{ opacity: titleOpacity, y: titleY }}
          className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 sm:px-6 pointer-events-none pb-32 sm:pb-40 z-10"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto"
          >
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-medium text-white tracking-tight drop-shadow-2xl  mb-3 sm:mb-4">
              About Ramachandra Urology
            </h1>
            <p className="text-xl sm:text-3xl font-extrabold text-emerald-300 tracking-wide drop-shadow-lg ">
              Centre for Advanced Kidney Care
            </p>
          </motion.div>
        </motion.div>
      </div>

      {/* ── LAYER 3: OVERLAPPING FOREGROUND CONTENT CARD (SCROLLS DIRECTLY UP OVER HERO) ── */}
      <div className="relative z-20 -mt-[45vh] sm:-mt-[50vh]">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="bg-white rounded-t-[32px] sm:rounded-t-[40px] shadow-[0_-20px_50px_rgba(0,0,0,0.25)] border-t border-slate-200/80 p-6 sm:p-10 lg:p-14 relative overflow-hidden"
          >
            {/* Top Gradient Accent Divider Line */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#0b5c9e] via-[#00875a] to-[#007a87]" />

            {/* SPLIT GRID LAYOUT */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center pt-2">
              
              {/* LEFT COLUMN: Badge, Heading, ECG Divider, Description Paragraph & Interactive Pillars */}
              <div className="lg:col-span-7 space-y-6 sm:space-y-8">
                
                {/* Badge Chip */}
                <div className="inline-flex items-center gap-3 px-4 py-2 rounded-xl bg-slate-50 border border-slate-200 shadow-2xs">
                  <div className="w-2 h-5 bg-[#00875a] rounded-full" />
                  <span className="text-xs sm:text-sm font-bold text-slate-800 tracking-wider uppercase">
                    NABH ACCREDITED SHCO
                  </span>
                  <span className="text-slate-300">|</span>
                  <span className="text-xs sm:text-sm font-semibold text-[#007a87]">
                    Super-Specialty Urology & Stone Centre
                  </span>
                </div>

                {/* Heading */}
                <div>
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                    A Legacy Built on Healing & Compassion
                  </h2>

                  {/* Animated Heartbeat / ECG Divider Line */}
                  <div className="relative w-full max-w-md h-7 my-3 overflow-hidden">
                    <svg className="w-full h-full stroke-emerald-500" fill="none" viewBox="0 0 400 40">
                      <motion.path
                        d="M 0 20 L 100 20 L 110 5 L 120 35 L 130 10 L 140 28 L 150 20 L 400 20"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        initial={{ pathLength: 0, opacity: 0.3 }}
                        whileInView={{ pathLength: 1, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.5, ease: "easeInOut" }}
                      />
                    </svg>
                  </div>
                </div>

                {/* Primary Description Paragraph */}
                <div className="relative pl-5 border-l-4 border-[#00875a]">
                  <p className="text-slate-700 text-base sm:text-lg leading-relaxed  font-normal">
                    Ramachandra Urology & Stone Centre is a leading super-specialty healthcare institution dedicated to providing comprehensive, high-quality urological, laparoscopic, and kidney care services. Our institution is equipped with advanced laser lithotripsy, modular surgical theatres, and an expert medical team led by AIIMS-trained specialists.
                  </p>
                </div>

                {/* ── INTERACTIVE PILLAR ACTION BUTTONS / SWITCHER ── */}
                <div className="pt-2">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Core Foundations
                    </span>
                    <span className="text-xs font-medium text-emerald-600 flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" /> Interactive details
                    </span>
                  </div>

                  {/* Pillar Action Buttons */}
                  <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-4">
                    {pillars.map((pillar) => {
                      const IconComp = pillar.icon;
                      const isActive = activePillar === pillar.id;
                      return (
                        <button
                          key={pillar.id}
                          onClick={() => setActivePillar(pillar.id)}
                          className={`p-3 rounded-xl border text-left transition-all relative overflow-hidden flex flex-col items-center sm:items-start cursor-pointer ${
                            isActive
                              ? "bg-white border-[#00875a] shadow-md ring-2 ring-[#00875a]/20"
                              : "bg-slate-50 border-slate-200 hover:bg-white hover:border-slate-300 text-slate-600"
                          }`}
                        >
                          <IconComp
                            className={`w-5 h-5 mb-1.5 ${
                              isActive ? "text-[#00875a]" : "text-slate-400"
                            }`}
                          />
                          <span className={`text-xs sm:text-sm font-bold block truncate w-full ${
                            isActive ? "text-slate-900" : "text-slate-600"
                          }`}>
                            {pillar.title}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Animated Detail Card */}
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activePillar}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -12 }}
                      transition={{ duration: 0.3 }}
                      className={`p-5 rounded-2xl border ${pillars[activePillar].bgColor} shadow-2xs relative`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold tracking-wide uppercase px-2.5 py-0.5 rounded-full bg-white/90 border border-slate-200/60 shadow-2xs">
                          {pillars[activePillar].tag}
                        </span>
                        <span className="text-xs font-medium text-slate-500 flex items-center">
                          Pillar 0{activePillar + 1} <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                        </span>
                      </div>
                      <h4 className="text-base sm:text-lg font-bold text-slate-900 mb-1">
                        {pillars[activePillar].subtitle}
                      </h4>
                      <p className="text-xs sm:text-sm text-slate-650 leading-relaxed">
                        {pillars[activePillar].detail}
                      </p>
                    </motion.div>
                  </AnimatePresence>
                </div>

              </div>

              {/* RIGHT COLUMN: Hospital Interior Image Card & Sidebar Frame */}
              <div className="lg:col-span-5">
                <div className="relative max-w-md mx-auto lg:max-w-none">
                  
                  {/* Ambient Glow Backdrop */}
                  <div className="absolute -inset-3 bg-gradient-to-tr from-[#00875a]/20 via-[#007a87]/20 to-[#0b5c9e]/20 rounded-3xl blur-xl opacity-70" />

                  {/* Main Interior Image Frame Card */}
                  <div className="relative bg-white p-3 rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
                    <div className="rounded-2xl overflow-hidden h-[340px] sm:h-[420px] relative">
                      <img
                        src="https://res.cloudinary.com/drqb4p2a2/image/upload/v1783148317/PXL_20260701_144557189.jpg_i7iqlz.jpg"
                        alt="Hospital Interior & Campus"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
                      
                      {/* Floating Badge Overlay */}
                      <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-white/95 backdrop-blur-md border border-slate-200/80 shadow-lg flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2.5 rounded-lg bg-emerald-50 text-[#00875a] border border-emerald-100">
                            <HeartPulse className="w-6 h-6 animate-pulse" />
                          </div>
                          <div>
                            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Care Guarantee</p>
                            <p className="text-sm font-extrabold text-slate-900">20+ Years Legacy</p>
                          </div>
                        </div>
                        <span className="text-xs font-bold px-3 py-1 bg-[#00875a] text-white rounded-md">
                          Est. 2006
                        </span>
                      </div>
                    </div>
                  </div>

                </div>
              </div>

            </div>
          </motion.div>

        </div>
      </div>

    </div>
  );
};

export default AboutHero;
