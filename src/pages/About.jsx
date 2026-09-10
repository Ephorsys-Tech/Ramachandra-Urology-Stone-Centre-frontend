import React, { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { 
  ArrowUpRight, 
  ShieldCheck, 
  Crosshair, 
  Sparkles, 
  Plus, 
  Minus,
  CheckCircle2,
  Award,
  Stethoscope,
  Clock,
  HeartPulse,
  Building2,
  Zap,
  MapPin,
  Phone,
  Mail,
  UserCheck,
  Check
} from "lucide-react";

// Individual Scroll-Triggered Narrative Chapter Component with Image Frame
const NarrativeChapter = ({ chapter, index, isActive, onViewportEnter }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { margin: "-25% 0px -25% 0px" });

  React.useEffect(() => {
    if (isInView && onViewportEnter) {
      onViewportEnter(index);
    }
  }, [isInView, index, onViewportEnter]);

  return (
    <motion.article
      ref={ref}
      initial={{ opacity: 0.4, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0.4, y: 20 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="relative pb-16 border-b border-slate-200 last:border-0 last:pb-0 transition-all duration-500"
    >
      {/* Micro-Header Strip */}
      <div className="flex items-center justify-between mb-4 font-mono text-xs text-slate-400 uppercase tracking-widest">
        <span className="flex items-center gap-2 text-[#00875a] font-bold">
          <span className="w-1.5 h-1.5 rounded-full bg-[#00875a]" />
          CHAPTER {chapter.id}
        </span>
        <span>[{chapter.tag}]</span>
      </div>

      {/* Chapter Title */}
      <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mb-4 font-sans leading-snug">
        {chapter.title}
      </h3>

      {/* Chapter Image Frame */}
      {chapter.image && (
        <div className="relative my-6 rounded-2xl overflow-hidden border border-slate-200 shadow-md group">
          <img 
            src={chapter.image} 
            alt={chapter.title}
            className="w-full h-56 sm:h-72 object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />
          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white font-mono text-xs">
            <span className="bg-white/95 text-slate-900 px-3 py-1 rounded-md font-bold shadow-xs">
              {chapter.badge}
            </span>
            <span className="text-slate-200 font-sans text-xs">
              Burla, Sambalpur, Odisha
            </span>
          </div>
        </div>
      )}

      {/* Primary Narrative Paragraph */}
      <p className="text-slate-650 text-base sm:text-lg leading-relaxed mb-6 font-sans">
        {chapter.body}
      </p>

      {/* Leadership / Detail Cards Container if present */}
      {chapter.leaders && (
        <div className="grid grid-cols-1 gap-4 my-6">
          {chapter.leaders.map((leader, i) => (
            <a
              key={i}
              href="/doctors"
              className="group relative p-5 rounded-2xl bg-white border border-slate-200 shadow-xs hover:shadow-lg hover:border-[#00875a] hover:bg-emerald-50/40 transition-all duration-300 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer no-underline block overflow-hidden"
            >
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0 relative">
                  <img 
                    src={leader.image} 
                    alt={leader.name}
                    className="w-full h-full object-cover object-top group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-[#00875a]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-base sm:text-lg font-black text-slate-900 group-hover:text-[#00875a] transition-colors leading-snug">
                      {leader.name}
                    </h4>
                    <ArrowUpRight className="w-4 h-4 text-[#00875a] opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300" />
                  </div>
                  <p className="text-xs font-mono text-[#00875a] font-bold mt-0.5">
                    {leader.qualifications}
                  </p>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">
                    {leader.role}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs px-3 py-1.5 rounded-lg bg-slate-100 group-hover:bg-[#00875a] text-slate-700 group-hover:text-white font-semibold transition-colors duration-300">
                  {leader.specialty}
                </span>
              </div>
            </a>
          ))}
        </div>
      )}

      {/* Feature Bullet Points if present */}
      {chapter.bullets && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-6">
          {chapter.bullets.map((b, i) => (
            <div key={i} className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-3">
              <CheckCircle2 className="w-4 h-4 text-[#00875a] flex-shrink-0 mt-0.5" />
              <div>
                <h5 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono mb-1">{b.title}</h5>
                <p className="text-xs text-slate-600 leading-relaxed font-sans">{b.desc}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Quote Block */}
      {chapter.quote && (
        <div className="p-5 bg-emerald-50/70 border-l-4 border-[#00875a] rounded-r-xl my-6">
          <p className="text-sm sm:text-base font-medium text-slate-800 italic leading-relaxed">
            "{chapter.quote}"
          </p>
        </div>
      )}

    </motion.article>
  );
};

const About = () => {
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);
  const [expandedAccordion, setExpandedAccordion] = useState(0);

  // Hairline Metric Ledger Data
  const metrics = [
    { value: "NABH", label: "ACCREDITED FACILITY", note: "International Quality & Safety Standards" },
    { value: "AIIMS", label: "NEW DELHI LEADERSHIP", note: "M.Ch Urology Leadership" },
    { value: "TFL", label: "THULIUM LASER CARE", note: "Ultra-Precise Dust-Free Lithotripsy" },
    { value: "BSKY", label: "PM-JAY CASHLESS CARE", note: "Government Subsidized Treatments" },
  ];

  // Core Principles Data
  const corePrinciples = [
    {
      title: "Quality",
      desc: "Uncompromising excellence in every diagnostic step, laboratory test, and surgical intervention.",
      icon: Award
    },
    {
      title: "Safety",
      desc: "Rigorous, protocol-driven clinical standards prioritizing patient well-being at every stage.",
      icon: ShieldCheck
    },
    {
      title: "Trust",
      desc: "Ethical medical practices, transparent counseling, and patient-first clinical decision making.",
      icon: HeartPulse
    },
    {
      title: "Compassion",
      desc: "Human-centric treatment designed for individual dignity, rapid healing, and lasting recovery.",
      icon: Stethoscope
    }
  ];

  // Editorial Narrative Chapters Data with Official Content
  const chapters = [
    {
      id: "01",
      tag: "WHO WE ARE",
      title: "Western Odisha's Premier Surgical Facility",
      body: "Ramachandra Urology & Stone Centre is the largest dedicated urology, stone care, and laparoscopic surgical facility in Western Odisha. Built on a foundation of medical precision and compassionate healing, our hospital brings world-class surgical innovations and comprehensive renal care under one unified roof. We are proudly NABH Accredited, reflecting our uncompromising commitment to patient safety, clinical quality, and international healthcare standards.",
      quote: "Quality healthcare is not a luxury—it is a rigorous, protocol-driven commitment to every patient who walks through our doors.",
      image: "https://res.cloudinary.com/drqb4p2a2/image/upload/v1783339988/WhatsApp_Image_2026-07-06_at_5.40.57_PM_1_vjgpse.jpg",
      badge: "NABH Accredited Hospital"
    },
    {
      id: "02",
      tag: "SURGICAL LEADERSHIP",
      title: "Renowned Medical & Surgical Directors",
      body: "Our clinical team is led by Dr. Sanjay Kumar Mahapatra [M.S. (Surgery), M.Ch (Urology, AIIMS, New Delhi)], Consultant Urologist, Andrologist, and Endo-Lap Surgeon. Working alongside specialist consultant urologists Dr. Sovan Hota and Dr. Kiran Negi, our medical team provides evidence-based treatments ranging from complex renal stone extractions to intricate reconstructive and oncological surgeries.",
      leaders: [
        {
          name: "Dr. Sanjay Kumar Mahapatra",
          qualifications: "M.S. (Surgery), M.Ch (Urology, AIIMS, New Delhi)",
          role: "Consultant Urologist, Andrologist & Endo-Lap Surgeon",
          specialty: "AIIMS Alumnus & Surgical Lead",
          image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=600&q=80"
        },
        {
          name: "Dr. Sovan Hota",
          qualifications: "M.S., M.Ch (Urology)",
          role: "Specialist Consultant Urologist",
          specialty: "Endourology & Stone Care",
          image: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=600&q=80"
        },
        {
          name: "Dr. Kiran Negi",
          qualifications: "M.S., M.Ch (Urology)",
          role: "Specialist Consultant Urologist",
          specialty: "Laparoscopy & Reconstruction",
          image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=600&q=80"
        }
      ]
    },
    {
      id: "03",
      tag: "ADVANCED INFRASTRUCTURE",
      title: "Next-Generation Laser & Modular Theatres",
      body: "We operate with cutting-edge medical technology to ensure minimal discomfort, minimal blood loss, and faster recovery times for every patient:",
      bullets: [
        {
          title: "Thulium Fiber Laser (TFL)",
          desc: "Next-generation laser lithotripsy for ultra-precise, dust-free breakdown of kidney, ureteric, and bladder stones, as well as advanced ThuFLEP laser prostate surgery."
        },
        {
          title: "Modular Operation Theatres",
          desc: "Fully integrated surgical suites equipped with high-definition laparoscopy and advanced multi-energy delivery systems."
        },
        {
          title: "Complete In-House Diagnostics",
          desc: "24/7 support including automated pathology, digital X-ray, ultrasound (USG), uroflowmetry, and comprehensive urodynamic studies."
        },
        {
          title: "Emergency Care Unit",
          desc: "Round-the-clock emergency urological care, acute stone colic management, and critical care monitoring."
        }
      ],
      image: "https://res.cloudinary.com/drqb4p2a2/image/upload/v1783148317/PXL_20260701_144557189.jpg_i7iqlz.jpg",
      badge: "Thulium Fiber Laser & HD Laparoscopy"
    },
    {
      id: "04",
      tag: "ACCESSIBLE HEALTHCARE",
      title: "Government Schemes & Cashless Treatment",
      body: "To make superspeciality treatment accessible to every family across Western Odisha and neighboring regions, we provide cashless and subsidized treatment under government healthcare schemes, ensuring zero financial barrier to life-saving urological surgeries.",
      bullets: [
        {
          title: "Ayushman Bharat (PM-JAY)",
          desc: "Cashless hospitalization and surgical care for eligible beneficiaries under the central government health scheme."
        },
        {
          title: "Biju Swasthya Kalyan Yojana (BSKY / GJAY)",
          desc: "Full coverage for advanced urological procedures, laser stone surgeries, and inpatient care under Odisha government health schemes."
        }
      ],
      quote: "Financial constraints should never stand between a patient and world-class surgical treatment."
    }
  ];

  return (
    <main className="min-h-screen bg-[#f0fbf7]/40 text-slate-800 font-sans selection:bg-[#00875a] selection:text-white">
      
      {/* ── 1. MINIMAL HERO SECTION WITH HOSPITAL BRANDING & MOTTO ── */}
      <header className="border-b border-slate-200/80 bg-white pt-10 sm:pt-16 pb-14 sm:pb-20 px-4 sm:px-8 lg:px-12">
        <div className="max-w-7xl mx-auto">
          
          {/* Hero Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            
            {/* Left Main Title & Motto */}
            <div className="lg:col-span-7 space-y-6">

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.08] font-sans">
                Better Care. <br />
                <span className="text-[#00875a]">Healthier Lives.</span>
              </h1>

              <p className="text-lg sm:text-xl font-medium text-slate-700 font-sans italic border-l-3 border-[#00875a] pl-4">
                "Flow Freely, Live Fully"
              </p>

              <p className="text-slate-650 text-base sm:text-lg leading-relaxed font-sans max-w-2xl">
                Ramachandra Urology & Stone Centre is the largest dedicated urology, stone care, and laparoscopic surgical facility in Western Odisha. Led by AIIMS New Delhi alumnus Dr. Sanjay Kumar Mahapatra, we combine world-class surgical innovations with compassionate patient care.
              </p>

              {/* Quick Specs */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                {[
                  { title: "NABH Accredited", desc: "Quality Standards" },
                  { title: "AIIMS Lead Director", desc: "Dr. S.K. Mahapatra" },
                  { title: "TFL Laser Lithotripsy", desc: "Dust-Free Stone Care" }
                ].map((spec, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                    <p className="text-xs font-bold text-[#00875a] uppercase font-mono">{spec.title}</p>
                    <p className="text-xs text-slate-500 font-medium">{spec.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Hero Image Card */}
            <div className="lg:col-span-5">
              <div className="relative max-w-md mx-auto lg:max-w-none">
                <div className="absolute -inset-3 bg-gradient-to-tr from-emerald-100 to-teal-100 rounded-3xl blur-md opacity-60" />
                
                <div className="relative bg-white p-3 rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
                  <div className="rounded-2xl overflow-hidden h-[340px] sm:h-[400px] relative">
                    <img 
                      src="https://res.cloudinary.com/drqb4p2a2/image/upload/v1783339988/WhatsApp_Image_2026-07-06_at_5.40.57_PM_1_vjgpse.jpg" 
                      alt="Ramachandra Urology & Stone Centre Hospital Building" 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
                    
                    {/* Floating Overlay Badge */}
                    <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-white/95 backdrop-blur-md border border-slate-200 shadow-md flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-lg bg-emerald-50 text-[#00875a]">
                          <Award className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">NABH Accredited</p>
                          <p className="text-sm font-black text-slate-900">Largest in Western Odisha</p>
                        </div>
                      </div>
                      <span className="text-xs font-bold px-3 py-1 bg-[#00875a] text-white rounded-md">
                        Burla
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>
      </header>

      {/* ── 2. HAIRLINE METRIC LEDGER ── */}
      <section className="border-b border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-slate-200">
            {metrics.map((m, idx) => (
              <div key={idx} className="p-6 sm:p-8 lg:p-10 flex flex-col justify-between">
                <span className="font-mono text-[11px] text-[#00875a] uppercase tracking-widest block mb-3 font-bold">
                  LEDGER N° 0{idx + 1}
                </span>
                <div>
                  <div className="font-mono text-3xl sm:text-4xl lg:text-5xl font-black tracking-tighter text-slate-900 mb-1">
                    {m.value}
                  </div>
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-1">
                    {m.label}
                  </div>
                  <div className="text-xs font-mono text-slate-400">
                    {m.note}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. STICKY SPLIT-SCROLL NARRATIVE WITH OFFICIAL DATA ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 py-16 sm:py-24 border-b border-slate-200">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-14 items-start">
          
          {/* LEFT COLUMN: Sticky Anchor Card */}
          <div className="md:col-span-5 md:sticky md:top-24 space-y-6">
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/90 shadow-sm space-y-6">
              
              <div>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  Ramachandra Urology & Stone Centre
                </h2>
              </div>

              {/* Active Milestone Progress Bar */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2.5">
                <div className="flex items-center justify-between font-mono text-xs text-slate-500">
                  <span>ACTIVE SECTION</span>
                  <span className="text-[#00875a] font-bold">
                    0{activeChapterIndex + 1} / 0{chapters.length}
                  </span>
                </div>
                <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-[#00875a] transition-all duration-500 ease-out"
                    style={{ width: `${((activeChapterIndex + 1) / chapters.length) * 100}%` }}
                  />
                </div>
                <p className="text-xs font-bold text-slate-800 truncate pt-1">
                  → {chapters[activeChapterIndex]?.title}
                </p>
              </div>

              {/* Contact & Location Brief */}
              <div className="space-y-3 pt-2 border-t border-slate-100">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
                  BURLA CAMPUS LOCATION
                </h4>
                <div className="space-y-2 text-xs text-slate-700 font-medium">
                  <div className="flex items-start gap-2.5">
                    <MapPin className="w-4 h-4 text-[#00875a] flex-shrink-0 mt-0.5" />
                    <span>Sourav Vihar, Burla, Sambalpur – 768017, Odisha</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Phone className="w-4 h-4 text-[#00875a] flex-shrink-0" />
                    <span>+91 9937566625 / 7653899159</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Mail className="w-4 h-4 text-[#00875a] flex-shrink-0" />
                    <span>ruasc.burla@gmail.com</span>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* RIGHT COLUMN: Editorial Chapters */}
          <div className="md:col-span-7 space-y-16 sm:space-y-20">
            {chapters.map((chapter, index) => (
              <NarrativeChapter
                key={chapter.id}
                chapter={chapter}
                index={index}
                isActive={activeChapterIndex === index}
                onViewportEnter={setActiveChapterIndex}
              />
            ))}
          </div>

        </div>
      </section>

      {/* ── 4. CORE PRINCIPLES (EDITORIAL HAIRLINE LEDGER GRID) ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 py-16 sm:py-24 border-b border-slate-200">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-14">
          <div className="max-w-2xl">
            <span className="font-mono text-xs uppercase tracking-widest text-[#00875a] font-bold block mb-2">
              OUR FOUNDATIONAL ETHOS
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight uppercase">
              Our Four Core Principles
            </h2>
            <p className="text-slate-600 text-base sm:text-lg font-sans mt-3 leading-relaxed">
              Every diagnostic decision, surgical procedure, and patient interaction is anchored by four unwavering commitments.
            </p>
          </div>
          <div className="hidden md:flex items-center gap-2 font-mono text-xs text-slate-400 uppercase tracking-widest bg-slate-100 px-4 py-2 rounded-xl border border-slate-200">
            <span className="w-2 h-2 rounded-full bg-[#00875a]" />
            <span>[ ETHOS LEDGER N° 04 ]</span>
          </div>
        </div>

        {/* Hairline 4-Column Grid Container */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden divide-y lg:divide-y-0 lg:divide-x divide-slate-200 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {corePrinciples.map((item, idx) => {
            const IconComp = item.icon;
            return (
              <div 
                key={idx}
                className="p-8 sm:p-10 flex flex-col justify-between hover:bg-emerald-50/30 transition-all duration-300 group"
              >
                <div>
                  {/* Top Monospace Number & Icon */}
                  <div className="flex items-center justify-between mb-8">
                    <span className="font-mono text-xs font-bold text-[#00875a] bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                      0{idx + 1}
                    </span>
                    <div className="w-12 h-12 rounded-xl bg-slate-50 text-[#00875a] border border-slate-200 flex items-center justify-center group-hover:bg-[#00875a] group-hover:text-white transition-colors duration-300 shadow-xs">
                      <IconComp className="w-5 h-5" />
                    </div>
                  </div>

                  {/* Principle Title */}
                  <h3 className="text-2xl font-black text-slate-900 mb-3 group-hover:text-[#00875a] transition-colors">
                    {item.title}
                  </h3>

                  {/* Description */}
                  <p className="text-slate-650 text-sm leading-relaxed font-sans">
                    {item.desc}
                  </p>
                </div>

                {/* Bottom Footer Tag */}
                <div className="pt-8 font-mono text-[10px] text-slate-400 font-bold uppercase tracking-widest border-t border-slate-100 mt-8 flex items-center justify-between">
                  <span>VERIFIED ETHOS</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-300 group-hover:bg-[#00875a] transition-colors" />
                </div>
              </div>
            );
          })}
        </div>

      </section>

      {/* ── 5. QUICK FACTS & CONTACT BAR ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 py-16 sm:py-24">
        <div className="bg-white rounded-3xl p-8 sm:p-12 lg:p-16 border border-slate-200/80 shadow-lg relative overflow-hidden">
          
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#0b5c9e] via-[#00875a] to-[#007a87]" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-8 space-y-6">
              <span className="font-mono text-xs uppercase tracking-widest text-[#00875a] font-bold">
                REACH OUR CLINICAL TEAM
              </span>
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
                Ramachandra Urology & Stone Centre
              </h3>
              <p className="text-slate-600 text-base leading-relaxed">
                Sourav Vihar, Burla, Sambalpur – 768017, Odisha
              </p>
              
              <div className="flex flex-wrap gap-4 text-xs sm:text-sm font-mono text-slate-700 pt-2">
                <span className="px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200">
                  📞 +91 9937566625 / 7653899159
                </span>
                <span className="px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200">
                  📞 +91 8895062072 / 0663-4075199
                </span>
                <span className="px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200">
                  ✉️ ruasc.burla@gmail.com
                </span>
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-4 justify-end">
              <a
                href="/contact"
                className="inline-flex items-center justify-center gap-3 px-6 py-4 rounded-xl bg-[#00875a] hover:bg-[#00704a] text-white font-bold text-sm transition-all shadow-md hover:shadow-lg"
              >
                <span>BOOK AN APPOINTMENT</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>
              <a
                href="/services"
                className="inline-flex items-center justify-center gap-3 px-6 py-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm transition-all border border-slate-200"
              >
                <span>VIEW SURGICAL SERVICES</span>
              </a>
            </div>

          </div>

        </div>
      </section>

    </main>
  );
};

export default About;
