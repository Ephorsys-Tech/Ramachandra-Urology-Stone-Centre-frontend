import { useState, useEffect, memo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { openAppointmentModal } from "../redux/features/patient/patientSlice";
import {
  Calendar,
  Phone,
  ArrowRight,
  MessageCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const heroSlides = [
  {
    id: 1,
    headlineLine1: "Western Odisha’s Premier Hospital",
    headlineLine2: "For Urology & Kidney Stone Care",
    tagline: "Now in Sambalpur!",
    description: "Advanced Thulium Fiber Laser Surgery (RIRS & Mini-PCNL) with same-day daycare discharge.",
    image: "https://res.cloudinary.com/drqb4p2a2/image/upload/v1787555588/1I5A4339_1_kx1liu.webp",
    imageAlt: "Advanced Laser Operation Theatre",
  },
  {
    id: 2,
    headlineLine1: "Zero-Incision Laser Surgery",
    headlineLine2: "For Painless Kidney Stone Removal",
    tagline: "100% Stitch-Free RIRS!",
    description: "World-class laser lithotripsy for complete kidney stone dusting with 99.8% clinical success.",
    image: "https://res.cloudinary.com/drqb4p2a2/image/upload/v1787555590/1I5A4502_1_wxjyz5.webp",
    imageAlt: "AIIMS Specialist Consultation",
  },
  {
    id: 3,
    headlineLine1: "Advanced Prostate & Andrology Care",
    headlineLine2: "Modern Laser THUFLEP & Men’s Health",
    tagline: "Ultra-Fast 24-Hour Recovery!",
    description: "Minimally invasive laser enucleation for enlarged prostate (BPH) & comprehensive male fertility care.",
    image: "https://res.cloudinary.com/drqb4p2a2/image/upload/v1787555589/1I5A4435_1_mbsm4v.webp",
    imageAlt: "Hospital Reception and Diagnostics",
  },
  {
    id: 4,
    headlineLine1: "24/7 Renal Colic Emergency Desk",
    headlineLine2: "Instant Relief & Emergency DJ Stenting",
    tagline: "100% Cashless Ayushman & GJAY!",
    description: "Immediate emergency triage, diagnostic ultrasonography, and instant cashless desk approvals in Burla, Sambalpur.",
    image: "https://res.cloudinary.com/drqb4p2a2/image/upload/v1783148317/PXL_20260701_144557189.jpg_i7iqlz.jpg",
    imageAlt: "Sambalpur Hospital Campus",
  },
];

const HeroSection = memo(() => {
  const dispatch = useDispatch();
  const { settings } = useSelector((state) => state.setting || { settings: null });

  const primaryPhone = settings?.phone || "+91 88950 62072";
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Auto slide rotation every 7 seconds
  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 7000);
    return () => clearInterval(interval);
  }, [isHovered]);

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const active = heroSlides[currentSlide];

  return (
    <section
      className="w-full  select-none overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* ── FULL-WIDTH HERO BANNER WITH NATURAL BG PHOTOS + LIGHT BLACKISH OVERLAY ── */}
      <div className="relative w-full bg-slate-950 min-h-[320px] sm:min-h-[360px] md:min-h-[390px] lg:min-h-[420px] flex flex-col justify-between py-8 sm:py-10 md:py-12 px-6 sm:px-12 lg:px-20 text-white shadow-sm overflow-hidden">

        {/* ── BACKGROUND IMAGE SLIDER WITH NATURAL COLORS ── */}
        <div className="absolute inset-0 z-0">
          <AnimatePresence mode="sync">
            <motion.div
              key={active.id}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.9, ease: "easeOut" }}
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: `url('${active.image}')` }}
            />
          </AnimatePresence>

          {/* Light Blackish / Neutral Dark Gradient Overlay: Keeps Image Visible While Ensuring Maximum Text Legibility */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-black/25 z-10" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 z-10" />
        </div>

        {/* ── MAIN CONTENT (CLEAN, SHARP & LEFT-ALIGNED) ── */}
        <div className="relative z-20 max-w-6xl mr-auto ml-0 sm:ml-4 lg:ml-6 w-full flex flex-col justify-center my-auto py-2">
          <AnimatePresence mode="wait">
            <motion.div
              key={active.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.35, ease: "easeInOut" }}
              className="text-left space-y-2.5 sm:space-y-3"
            >
              {/* Main Headline Lines with Crisp Shadow */}
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-[44px] font-medium text-white leading-[1.16] tracking-tight drop-shadow-[0_2px_8px_rgba(0,0,0,0.7)]">
                {active.headlineLine1}
                <span className="block mt-0.5 sm:mt-1 text-white">
                  {active.headlineLine2}
                </span>
              </h1>

 

              {/* Highlight Tagline ("Now in Sambalpur!") */}
              <div className="text-xl sm:text-2xl md:text-3xl font-medium text-cyan-300 tracking-tight drop-shadow-[0_2px_6px_rgba(0,0,0,0.7)]">
                {active.tagline}
              </div>

              {/* Brief Description */}
              <p className="text-slate-100 text-xs sm:text-sm md:text-base font-medium max-w-2xl leading-relaxed pt-0.5 drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]">
                {active.description}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-3 pt-4 sm:pt-5">
            <button
              onClick={() => dispatch(openAppointmentModal())}
              className="inline-flex items-center gap-2 px-6 py-2.5 sm:py-3 rounded-xl bg-gradient-to-r from-[#0FA8D6] to-[#0284c7] hover:from-[#00bbf0] hover:to-[#0396e3] text-white text-xs sm:text-sm font-medium  cursor-pointer uppercase tracking-wider border border-white/20"
            >
              <Calendar size={15} />
              <span>Book Appointment</span>
              <ArrowRight size={14} />
            </button>

            <a
              href={`tel:${primaryPhone.replace(/\s+/g, "")}`}
              className="inline-flex items-center gap-2 px-5 py-2.5 sm:py-3 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs sm:text-sm font-bold backdrop-blur-md border border-white/25 transition-all hover:scale-[1.02] active:scale-[0.98] no-underline shadow-md"
            >
              <Phone size={14} className="text-[#0FA8D6]" />
              <span>Call: {primaryPhone}</span>
            </a>


          </div>
        </div>



        {/* Subtle Next / Prev Carousel Arrows on Sides */}
        <button
          onClick={handlePrevSlide}
          aria-label="Previous Slide"
          className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-8 sm:w-9 h-8 sm:h-9 rounded-full bg-black/40 hover:bg-black/60 border border-white/20 text-white flex items-center justify-center backdrop-blur-md transition-all cursor-pointer z-20 shadow-md"
        >
          <ChevronLeft size={18} />
        </button>
        <button
          onClick={handleNextSlide}
          aria-label="Next Slide"
          className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-8 sm:w-9 h-8 sm:h-9 rounded-full bg-black/40 hover:bg-black/60 border border-white/20 text-white flex items-center justify-center backdrop-blur-md transition-all cursor-pointer z-20 shadow-md"
        >
          <ChevronRight size={18} />
        </button>

      </div>
    </section>
  );
});

HeroSection.displayName = "HeroSection";
export default HeroSection;
