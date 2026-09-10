import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { submitAppointmentRequest } from "../redux/features/appointmentRequest/appointmentRequestThunk";
import { sendMessage } from "../redux/features/message/messageThunk";
import { openAppointmentModal } from "../redux/features/patient/patientSlice";
import toast from "react-hot-toast";
import {
  Zap,
  ShieldCheck,
  Clock,
  Sparkles,
  Calendar,
  Phone,
  ArrowRight,
  Stethoscope,
  Building2,
  HeartHandshake,
  Award,
  Activity,
  ChevronLeft,
  ChevronRight,
  MessageCircle,
  Star,
  BadgeCheck,
  CheckCircle2,
} from "lucide-react";

const heroSlides = [
  {
    image: "https://res.cloudinary.com/drqb4p2a2/image/upload/v1787568072/dj_inb2ih.png",
    tag: "Western Odisha's Pioneer Laser Urology Centre",
    title: "Advanced Laser Stone Lithotripsy (RIRS & Mini-PCNL)",
    subtitle: "Painless, incision-free Holmium laser kidney & ureter stone removal with same-day daycare discharge in Sambalpur.",
    highlight1: "Zero Incision RIRS",
    highlight2: "Same Day Discharge",
    highlight3: "100% Cashless BSKY / Ayushman",
  },
  {
    image: "https://res.cloudinary.com/drqb4p2a2/image/upload/v1787555588/1I5A4339_1_kx1liu.webp",
    tag: "NABH-Standard Surgical Infrastructure",
    title: "Laminar Flow Modular Operation Theatres",
    subtitle: "HEPA-filtered sterile environment equipped with German high-definition endovision systems for ultra-safe urology procedures.",
    highlight1: "HEPA 0.3μ Filtration",
    highlight2: "99.4% Clinical Success",
    highlight3: "German HD Optics",
  },
  {
    image: "https://res.cloudinary.com/drqb4p2a2/image/upload/v1787555589/1I5A4435_1_mbsm4v.webp",
    tag: "Senior Surgical Leadership • 25+ Years Experience",
    title: "Complete Laser Prostate (TURP) & Reconstructive Urology",
    subtitle: "Minimally invasive laser enucleation and vaporization for enlarged prostate (BPH), strictures, and bladder conditions.",
    highlight1: "Laser TURP / BPH",
    highlight2: "No Blood Loss",
    highlight3: "Quick Recovery",
  },
  {
    image: "https://res.cloudinary.com/drqb4p2a2/image/upload/v1783148317/PXL_20260701_144557189.jpg_i7iqlz.jpg",
    tag: "24/7 Sambalpur Urology Hospital",
    title: "Round-the-Clock Acute Stone & Renal Colic Emergency",
    subtitle: "Immediate pain relief triage, emergency DJ stenting, and fully accredited cashless facilities under Ayushman Bharat & BSKY.",
    highlight1: "24/7 ICU & Triage",
    highlight2: "Cashless On-Desk Verification",
    highlight3: "Sambalpur City Centre",
  },
];

export default function HeroSection() {
  const dispatch = useDispatch();
  const { settings } = useSelector((state) => state.setting || { settings: null });

  const emergencyPhone = settings?.emergencyPhone || "9090963722";
  const generalPhone = settings?.phone || "8065906200";

  const [currentSlide, setCurrentSlide] = useState(0);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    treatment: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  const handleHeroFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim()) {
      toast.error("Please enter your name and phone number");
      return;
    }

    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(formData.phone)) {
      toast.error("Phone number must be exactly 10 digits");
      return;
    }

    try {
      setIsSubmitting(true);
      const payload = {
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        department: formData.treatment || "Urology & Kidney Stone Care",
        age: 30,
        gender: "Other",
        preferredDate: new Date().toISOString().split("T")[0],
        preferredTimeSlot: "10:00 AM - 01:00 PM",
        message: `Priority callback requested from Full-BG Hero Desk for: ${formData.treatment || "General Urology"}`,
      };

      const res = await dispatch(submitAppointmentRequest(payload));

      const messagePayload = {
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        subject: formData.treatment ? `Hero Callback: ${formData.treatment}` : "Hero Consult Request",
        message: `Priority callback requested from Full-BG Hero Section for ${formData.treatment || "Urology treatment"}.`,
      };
      await dispatch(sendMessage(messagePayload));

      if (submitAppointmentRequest.fulfilled.match(res)) {
        toast.success("Thank you! Our Sambalpur medical desk will call you within 15 minutes.");
        setFormData({ name: "", phone: "", treatment: "" });
      } else {
        toast.error(res.payload || "Could not submit. Please call our 24/7 hotline.");
      }
    } catch {
      toast.error("An unexpected error occurred. Please call our hotline.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const active = heroSlides[currentSlide];

  return (
    <section 
      className="relative w-full min-h-[640px] lg:min-h-[720px] text-white overflow-hidden font-sans select-none flex flex-col justify-between"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      
      {/* ── FULL BACKGROUND IMAGE SLIDER WITH FADE & ZOOM ── */}
      <div className="absolute inset-0 z-0 bg-[#012442]">
        <AnimatePresence mode="sync">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, scale: 1.08 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url('${active.image}')` }}
          />
        </AnimatePresence>

        {/* Multi-layered cinematic overlay gradient to preserve brand colours and ensure 100% legibility */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#012442]/95 via-[#012442]/85 to-[#024363]/70 z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#012442] via-transparent to-[#012442]/60 z-10" />
        
        {/* Glowing Brand Accent Orbs */}
        <div className="absolute top-10 left-10 w-96 h-96 bg-[#0FA8D6]/15 rounded-full blur-3xl pointer-events-none z-10" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#024363]/40 rounded-full blur-3xl pointer-events-none z-10" />
      </div>

      {/* ── FOREGROUND CONTENT STAGE ── */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 pb-6 w-full flex-1 flex flex-col justify-between">
        
        {/* Top Emergency Status Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-white/10 hover:bg-white/15 border border-white/15 backdrop-blur-md rounded-2xl px-4 py-2.5 text-xs transition-all mb-6">
          <div className="flex items-center gap-2.5">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span className="font-bold text-emerald-300">24/7 EMERGENCY ADMISSIONS OPEN</span>
            <span className="hidden sm:inline text-white/40">•</span>
            <span className="hidden sm:inline text-slate-200">Acute Renal Colic & Stone Pain Management in Sambalpur</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-cyan-200 hidden md:inline-flex items-center gap-1.5 font-semibold">
              <BadgeCheck size={14} className="text-[#0FA8D6]" /> 100% Cashless Ayushman & BSKY
            </span>
            <a 
              href={`tel:${emergencyPhone}`}
              className="text-white hover:text-[#0FA8D6] font-extrabold inline-flex items-center gap-1 transition-colors no-underline"
            >
              <Phone size={13} className="text-[#0FA8D6]" /> +91 {emergencyPhone}
            </a>
          </div>
        </div>

        {/* ── MAIN HERO SPLIT: SLIDE HEADLINE + QUICK CONSULT FORM ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center my-auto py-4">
          
          {/* LEFT 7 COLUMNS: DYNAMIC SLIDE CONTENT */}
          <div className="lg:col-span-7 space-y-6 text-left">
            
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="space-y-4"
              >
                {/* Pre-title Tag Badge */}
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0FA8D6]/20 border border-[#0FA8D6]/40 text-cyan-200 text-xs font-black uppercase tracking-wider backdrop-blur-md shadow-sm">
                  <Sparkles size={14} className="text-[#0FA8D6]" />
                  <span>{active.tag}</span>
                </div>

                {/* Main Headline */}
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[52px] font-black text-white leading-[1.12] tracking-tight">
                  {active.title.split("(")[0]}
                  {active.title.includes("(") && (
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0FA8D6] via-cyan-300 to-white">
                      ({active.title.split("(")[1]}
                    </span>
                  )}
                </h1>

                {/* Subtitle */}
                <p className="text-slate-200 text-sm sm:text-base leading-relaxed max-w-2xl font-normal drop-shadow-sm">
                  {active.subtitle}
                </p>

                {/* Highlight Pills */}
                <div className="flex flex-wrap items-center gap-2.5 pt-1">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 border border-white/15 backdrop-blur-md text-xs font-bold text-white">
                    <CheckCircle2 size={13} className="text-[#0FA8D6]" /> {active.highlight1}
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 border border-white/15 backdrop-blur-md text-xs font-bold text-white">
                    <CheckCircle2 size={13} className="text-[#0FA8D6]" /> {active.highlight2}
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 backdrop-blur-md text-xs font-bold text-emerald-300">
                    <ShieldCheck size={13} className="text-emerald-400" /> {active.highlight3}
                  </span>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* CTAs Bar */}
            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <button
                onClick={() => dispatch(openAppointmentModal())}
                className="inline-flex items-center gap-2.5 px-7 py-4 rounded-2xl bg-gradient-to-r from-[#0FA8D6] to-[#024363] hover:from-[#00b4ea] hover:to-[#013550] text-white text-xs sm:text-sm font-black shadow-xl hover:shadow-[#0FA8D6]/30 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer border border-[#0FA8D6]/40 uppercase tracking-wider"
              >
                <Calendar size={17} />
                <span>Book Doctor Appointment ↗</span>
              </button>

              <a
                href={`tel:${emergencyPhone}`}
                className="inline-flex items-center gap-2 px-6 py-4 rounded-2xl bg-white/10 hover:bg-white/15 text-white text-xs sm:text-sm font-bold backdrop-blur-md border border-white/20 transition-all hover:scale-[1.02] active:scale-[0.98] no-underline shadow-sm"
              >
                <Phone size={16} className="text-[#0FA8D6]" />
                <span>24/7 Helpline: +91 {emergencyPhone}</span>
              </a>

              <a
                href={`https://wa.me/91${emergencyPhone}?text=Hello%20Ramachandra%20Urology%20Hospital,%20I%20want%20to%20consult%20for%20urology/stone%20treatment`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-4 py-4 rounded-2xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 text-xs sm:text-sm font-bold transition-all no-underline"
              >
                <MessageCircle size={16} />
                <span className="hidden sm:inline">WhatsApp</span>
              </a>
            </div>

            {/* Social Proof & Rating Bar */}
            <div className="pt-2 flex items-center gap-3 text-xs text-slate-300">
              <div className="flex -space-x-2 overflow-hidden">
                <img className="inline-block h-8 w-8 rounded-full ring-2 ring-[#012442] object-cover" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80" alt="Patient" />
                <img className="inline-block h-8 w-8 rounded-full ring-2 ring-[#012442] object-cover" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80" alt="Patient" />
                <img className="inline-block h-8 w-8 rounded-full ring-2 ring-[#012442] object-cover" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80" alt="Patient" />
                <div className="h-8 w-8 rounded-full bg-[#0FA8D6] text-white text-[10px] font-black flex items-center justify-center ring-2 ring-[#012442]">
                  15k+
                </div>
              </div>
              <div>
                <div className="flex items-center gap-1 text-amber-400">
                  <Star size={13} fill="currentColor" />
                  <Star size={13} fill="currentColor" />
                  <Star size={13} fill="currentColor" />
                  <Star size={13} fill="currentColor" />
                  <Star size={13} fill="currentColor" />
                  <span className="font-extrabold text-white ml-1">4.9/5</span>
                </div>
                <p className="text-[11px] text-slate-300">Trusted by 50,000+ patients across Western Odisha</p>
              </div>
            </div>

          </div>

          {/* RIGHT 5 COLUMNS: GLASS CONSULTATION FORM & SLIDE CONTROLS */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* Quick Callback Desk Card */}
            <div className="relative rounded-3xl bg-white/10 border border-white/20 backdrop-blur-xl p-5 sm:p-6 shadow-2xl overflow-hidden text-left">
              
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div>
                  <span className="text-[11px] font-black uppercase tracking-wider text-[#0FA8D6] flex items-center gap-1.5">
                    <Sparkles size={13} /> Instant Consultation Desk
                  </span>
                  <h3 className="text-base font-black text-white mt-0.5">
                    Fast Doctor Call-Back
                  </h3>
                </div>
                <span className="text-[10.5px] text-slate-300 font-bold bg-white/10 border border-white/15 px-2.5 py-1 rounded-xl">
                  Sambalpur OPD
                </span>
              </div>

              {/* Form */}
              <form onSubmit={handleHeroFormSubmit} className="space-y-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-200 mb-1">
                    Patient Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Enter patient full name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-white/15 border border-white/20 rounded-xl text-xs outline-none focus:border-[#0FA8D6] focus:bg-white/20 transition text-white font-medium placeholder:text-slate-300"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-200 mb-1">
                    Phone Number (10 Digits) *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="Enter 10-digit mobile number"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value.replace(/\D/g, "").slice(0, 10) })
                    }
                    className="w-full px-3.5 py-2.5 bg-white/15 border border-white/20 rounded-xl text-xs outline-none focus:border-[#0FA8D6] focus:bg-white/20 transition text-white font-medium placeholder:text-slate-300"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-200 mb-1">
                    Treatment Required
                  </label>
                  <select
                    value={formData.treatment}
                    onChange={(e) => setFormData({ ...formData, treatment: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#012442]/90 border border-white/20 rounded-xl text-xs outline-none focus:border-[#0FA8D6] transition text-white font-medium cursor-pointer"
                  >
                    <option value="" className="bg-[#012442] text-white">Select Procedure / Disease</option>
                    <option value="Kidney Stone & Laser RIRS" className="bg-[#012442] text-white">Kidney Stone & Laser RIRS (No Cut)</option>
                    <option value="Mini-PCNL Large Stone Surgery" className="bg-[#012442] text-white">Mini-PCNL (Large Stone Removal)</option>
                    <option value="Prostate (BPH) & Laser Surgery" className="bg-[#012442] text-white">Prostate (BPH) Laser Surgery</option>
                    <option value="Urinary Stricture / Ureteric Stone" className="bg-[#012442] text-white">Urinary Stricture / Ureteric Stone</option>
                    <option value="General Urology Consultation" className="bg-[#012442] text-white">General Urology Consultation</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 bg-gradient-to-r from-[#0FA8D6] to-[#024363] hover:from-[#00b4ea] hover:to-[#013550] text-white text-xs font-black rounded-xl transition-all cursor-pointer border border-[#0FA8D6]/40 shadow-lg disabled:opacity-50 flex items-center justify-center gap-2 uppercase tracking-wider"
                >
                  <span>{isSubmitting ? "Submitting Request..." : "Request Priority Callback"}</span>
                  <ArrowRight size={14} />
                </button>
              </form>

              {/* Guarantee Note */}
              <p className="text-[10px] text-slate-300 text-center mt-3 font-medium">
                🔒 Verified Confidential • Care Coordinator Calls Within 15 Mins
              </p>
            </div>

            {/* Slider Navigation Bar Controls */}
            <div className="flex items-center justify-between bg-white/10 border border-white/15 backdrop-blur-md rounded-2xl px-4 py-2.5">
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-[#0FA8D6]">0{currentSlide + 1}</span>
                <span className="text-xs text-slate-400 font-bold">/ 0{heroSlides.length}</span>
                
                {/* Progress Indicators */}
                <div className="flex gap-1.5 ml-2">
                  {heroSlides.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentSlide(i)}
                      aria-label={`Go to slide ${i + 1}`}
                      className={`h-1.5 rounded-full transition-all border-none cursor-pointer ${
                        currentSlide === i ? "w-6 bg-[#0FA8D6]" : "w-2 bg-white/40"
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Prev / Next buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrevSlide}
                  aria-label="Previous Slide"
                  className="w-8 h-8 rounded-xl bg-white/15 hover:bg-[#0FA8D6] hover:text-white flex items-center justify-center text-white border border-white/20 cursor-pointer transition-all active:scale-95"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  onClick={handleNextSlide}
                  aria-label="Next Slide"
                  className="w-8 h-8 rounded-xl bg-white/15 hover:bg-[#0FA8D6] hover:text-white flex items-center justify-center text-white border border-white/20 cursor-pointer transition-all active:scale-95"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>

          </div>

        </div>

        {/* ── BOTTOM 4 FAST-TRACK ACTION CARDS ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          
          {/* Card 1: Laser Stone Wing */}
          <Link
            to="/departments"
            className="p-4 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/15 hover:border-[#0FA8D6]/60 backdrop-blur-md transition-all duration-300 flex items-center justify-between group cursor-pointer text-left shadow-lg hover:-translate-y-1 no-underline"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#0FA8D6]/20 border border-[#0FA8D6]/40 text-[#0FA8D6] flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <Zap size={18} />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-black text-white group-hover:text-[#0FA8D6] transition-colors">
                  Laser Stone Clinic
                </h4>
                <p className="text-[10.5px] text-slate-300 font-medium">
                  RIRS & Mini-PCNL Dusting
                </p>
              </div>
            </div>
            <ArrowRight size={15} className="text-white/50 group-hover:text-[#0FA8D6] group-hover:translate-x-1 transition-all shrink-0" />
          </Link>

          {/* Card 2: Urology Specialists */}
          <Link
            to="/doctors"
            className="p-4 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/15 hover:border-[#0FA8D6]/60 backdrop-blur-md transition-all duration-300 flex items-center justify-between group cursor-pointer text-left shadow-lg hover:-translate-y-1 no-underline"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#0FA8D6]/20 border border-[#0FA8D6]/40 text-[#0FA8D6] flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <Stethoscope size={18} />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-black text-white group-hover:text-[#0FA8D6] transition-colors">
                  Our Urologists
                </h4>
                <p className="text-[10.5px] text-slate-300 font-medium">
                  Senior Surgical Specialists
                </p>
              </div>
            </div>
            <ArrowRight size={15} className="text-white/50 group-hover:text-[#0FA8D6] group-hover:translate-x-1 transition-all shrink-0" />
          </Link>

          {/* Card 3: 100% Cashless Helpdesk */}
          <div
            onClick={() => dispatch(openAppointmentModal())}
            className="p-4 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/15 hover:border-emerald-400/60 backdrop-blur-md transition-all duration-300 flex items-center justify-between group cursor-pointer text-left shadow-lg hover:-translate-y-1"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <ShieldCheck size={18} />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-black text-white group-hover:text-emerald-300 transition-colors">
                  100% Cashless TPA
                </h4>
                <p className="text-[10.5px] text-slate-300 font-medium">
                  Ayushman & BSKY On-Desk
                </p>
              </div>
            </div>
            <ArrowRight size={15} className="text-white/50 group-hover:text-emerald-300 group-hover:translate-x-1 transition-all shrink-0" />
          </div>

          {/* Card 4: 24/7 Sambalpur Emergency */}
          <a
            href={`tel:${emergencyPhone}`}
            className="p-4 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/15 hover:border-red-400/60 backdrop-blur-md transition-all duration-300 flex items-center justify-between group cursor-pointer text-left shadow-lg hover:-translate-y-1 no-underline"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-500/20 border border-red-500/40 text-red-300 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <HeartHandshake size={18} />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-black text-white group-hover:text-red-300 transition-colors">
                  24/7 Emergency
                </h4>
                <p className="text-[10.5px] text-slate-300 font-medium">
                  Renal Colic & Triage Desk
                </p>
              </div>
            </div>
            <ArrowRight size={15} className="text-white/50 group-hover:text-red-300 group-hover:translate-x-1 transition-all shrink-0" />
          </a>

        </div>

      </div>

    </section>
  );
}
