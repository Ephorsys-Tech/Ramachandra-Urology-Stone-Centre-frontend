import React, { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { openAppointmentModal } from "../redux/features/patient/patientSlice";
import PageHero from "../components/common/PageHero";
import FounderSpotlight from "../components/About/FounderSpotlight";
import LeadershipTeam from "../components/About/LeadershipTeam";
import InfrastructureShowcase from "../components/About/InfrastructureShowcase";
import VisionMissionValues from "../components/About/VisionMissionValues";
import AccreditationPartners from "../components/About/AccreditationPartners";
import SEO from "../components/common/SEO";
import { 
  ArrowUpRight, 
  ShieldCheck, 
  Sparkles, 
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
  ArrowRight,
  Calendar,
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
      initial={{ opacity: 0.35, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0.35, y: 20 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="relative pb-14 sm:pb-16 border-b border-slate-200 last:border-0 last:pb-0 transition-all duration-500"
    >
      {/* Micro-Header Strip */}
      <div className="flex items-center justify-between mb-3  text-xs text-slate-400 uppercase tracking-widest">
        <span className="flex items-center gap-2 text-[#024363] font-bold">
          <span className="w-2 h-2 rounded-full bg-[#0FA8D6]" />
          CHAPTER {chapter.id}
        </span>
        <span className="text-[#0FA8D6] font-bold">[{chapter.tag}]</span>
      </div>

      {/* Chapter Title */}
      <h3 className="text-2xl sm:text-3xl font-medium text-[#012442] tracking-tight mb-4  leading-snug">
        {chapter.title}
      </h3>

      {/* Chapter Image Frame */}
      {chapter.image && (
        <div className="relative my-6 rounded-3xl overflow-hidden border border-[#0FA8D6]/30 shadow-md group">
          <img 
            src={chapter.image} 
            alt={chapter.title}
            className="w-full h-60 sm:h-80 object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#012442]/80 via-transparent to-transparent" />

        </div>
      )}

      {/* Primary Narrative Paragraph */}
      <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-6 ">
        {chapter.body}
      </p>

      {/* Leadership / Detail Cards Container if present */}
      {chapter.leaders && (
        <div className="grid grid-cols-1 gap-4 my-6">
          {chapter.leaders.map((leader, i) => (
            <Link
              key={i}
              to="/doctors"
              className="group relative p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:shadow-lg hover:border-[#0FA8D6] hover:bg-[#0FA8D6]/5 transition-all duration-300 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer no-underline block overflow-hidden"
            >
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl overflow-hidden bg-slate-100 border border-[#0FA8D6]/30 shrink-0 relative">
                  <img 
                    src={leader.image} 
                    alt={leader.name}
                    className="w-full h-full object-cover object-top group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-[#024363]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-base sm:text-lg font-medium text-[#012442] group-hover:text-[#024363] transition-colors leading-snug">
                      {leader.name}
                    </h4>
                    <ArrowUpRight className="w-4 h-4 text-[#0FA8D6] opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300" />
                  </div>
                  <p className="text-xs  text-[#024363] font-bold mt-0.5">
                    {leader.qualifications}
                  </p>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">
                    {leader.role}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className=" text-xs px-3 py-1.5 rounded-xl bg-slate-100 group-hover:bg-[#024363] text-slate-700 group-hover:text-white font-bold transition-colors duration-300">
                  {leader.specialty}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Feature Bullet Points if present */}
      {chapter.bullets && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-6">
          {chapter.bullets.map((b, i) => (
            <div key={i} className="p-4 rounded-2xl bg-white border border-[#0FA8D6]/20 shadow-xs flex items-start gap-3 hover:border-[#0FA8D6]/50 transition-colors">
              <CheckCircle2 className="w-4 h-4 text-[#0FA8D6] shrink-0 mt-0.5" />
              <div>
                <h5 className="text-xs font-medium text-[#012442] uppercase tracking-wider  mb-1">{b.title}</h5>
                <p className="text-xs text-slate-600 leading-relaxed  m-0">{b.desc}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Quote Block */}
      {chapter.quote && (
        <div className="p-5 bg-[#0FA8D6]/10 border-l-4 border-[#0FA8D6] rounded-r-2xl my-6">
          <p className="text-sm sm:text-base font-medium text-[#012442] italic leading-relaxed m-0">
            &quot;{chapter.quote}&quot;
          </p>
        </div>
      )}

    </motion.article>
  );
};

const About = () => {
  const dispatch = useDispatch();
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);
  const { settings } = useSelector((state) => state.setting || {});

  const emergencyPhone = settings?.emergencyPhone || "99375 66625";
  const generalPhone = settings?.phone || "88950 62072";
  const hospitalEmail = settings?.email || "ruasc.burla@gmail.com";
  const hospitalAddress = "Sourav Vihar, Burla, Sambalpur - 768017, Odisha";

  // Hairline Metric Ledger Data
  const metrics = [
    { value: "NABH", label: "ENTRY LEVEL SHCO", note: "PESHCO-0306-13433 (2025–2028)" },
    { value: "AIIMS", label: "NEW DELHI LEADERSHIP", note: "Dr. Sanjay Kumar Mahapatra (M.Ch)" },
    { value: "TFL", label: "THULIUM FIBER LASER", note: "Dust-Free Laser Lithotripsy & THUFLEP" },
    { value: "100%", label: "CASHLESS GOVT. SCHEMES", note: "Ayushman Bharat & GJAY Empanelled" },
  ];

  // Editorial Narrative Chapters Data with Official Content
  const chapters = [
    {
      id: "01",
      tag: "WHO WE ARE",
      title: "Western Odisha's Premier Laser Urology Destination",
      body: "Ramachandra Urology & Stone Centre is the largest dedicated super-specialty urology, stone management, and laparoscopic surgical hospital in Western Odisha. Built on a foundation of surgical precision, state-of-the-art lasers, and compassionate care, our hospital brings world-class renal and surgical innovations under one unified roof. We are proudly NABH Accredited, reflecting our strict adherence to highest patient safety and clinical quality benchmarks.",
      quote: "Quality healthcare is not a privilege—it is a rigorous, protocol-driven commitment to every patient who walks through our doors.",
      image: "https://res.cloudinary.com/drqb4p2a2/image/upload/v1783339988/WhatsApp_Image_2026-07-06_at_5.40.57_PM_1_vjgpse.jpg",
      badge: "NABH Accredited Hospital"
    },
    {
      id: "02",
      tag: "SURGICAL LEADERSHIP",
      title: "Renowned Medical & Surgical Directors",
      body: "Our clinical team is led by Dr. Sanjay Kumar Mahapatra [M.S. (Surgery), M.Ch (Urology, AIIMS, New Delhi)], Senior Consultant Urologist, Andrologist, and Endo-Lap Surgeon. Supported by expert consultant urologists Dr. Sovan Hota and Dr. Kiran Negi, our surgical team delivers cutting-edge, evidence-based treatments ranging from complex renal stone extractions to intricate reconstructive and uro-oncology surgeries.",
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
          specialty: "Endourology & Laser Stone Care",
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
          desc: "Fully integrated surgical suites with HEPA filtration, high-definition 3D laparoscopy, and multi-energy delivery systems."
        },
        {
          title: "Complete In-House Diagnostics",
          desc: "24/7 support including automated pathology, digital X-ray, high-resolution ultrasound (USG), and comprehensive uroflowmetry."
        },
        {
          title: "24x7 Emergency Trauma Unit",
          desc: "Round-the-clock emergency urological care, acute stone colic relief, and dedicated ICU monitoring."
        }
      ],
      image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=600&q=80",
      badge: "Thulium Fiber Laser & Modular OT"
    },
    {
      id: "04",
      tag: "ACCESSIBLE HEALTHCARE",
      title: "Government Health Schemes & Cashless Treatment",
      body: "To make superspecialty treatment accessible to every family across Western Odisha and neighboring regions, we provide cashless and subsidized treatment under government healthcare schemes, ensuring zero financial barrier to life-saving urological surgeries.",
      bullets: [
        {
          title: "Ayushman Bharat (PM-JAY)",
          desc: "Cashless hospitalization and surgical care for eligible beneficiaries under the central government health scheme."
        },
        {
          title: "Gopabandhu Jan Arogya Yojana (GJAY)",
          desc: "Full coverage for advanced urological procedures, laser stone surgeries, and inpatient care under Odisha government health schemes."
        }
      ],
      quote: "Financial constraints should never stand between a patient and world-class surgical treatment."
    }
  ];

  const aboutStructuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "AboutPage",
        "@id": "https://ramachandraurology.com/about#webpage",
        "url": "https://ramachandraurology.com/about",
        "name": "About Ramachandra Urology & Stone Centre | Burla, Sambalpur",
        "description": "Learn about Ramachandra Urology & Stone Centre, Western Odisha’s premier NABH-accredited kidney care hospital founded by Dr. Sanjay Kumar Mahapatra (M.Ch AIIMS New Delhi).",
        "breadcrumb": {
          "@type": "BreadcrumbList",
          "itemListElement": [
            {
              "@type": "ListItem",
              "position": 1,
              "name": "Home",
              "item": "https://ramachandraurology.com/"
            },
            {
              "@type": "ListItem",
              "position": 2,
              "name": "About Us",
              "item": "https://ramachandraurology.com/about"
            }
          ]
        },
        "mainEntity": {
          "@type": "Hospital",
          "name": "Ramachandra Urology & Stone Centre",
          "founder": {
            "@type": "Person",
            "name": "Dr. Sanjay Kumar Mahapatra",
            "jobTitle": "Founder & Chief Urologist",
            "alumniOf": "AIIMS New Delhi (M.Ch Urology)"
          },
          "award": "NABH Entry Level SHCO Accreditation (PESHCO-0306-13433)"
        }
      }
    ]
  };

  return (
    <>
      <SEO
        title="About Us | Leading Urology & Kidney Stone Centre in Sambalpur"
        description="Discover Ramachandra Urology & Stone Centre in Burla, Sambalpur. Led by Dr. Sanjay Kumar Mahapatra (M.Ch AIIMS New Delhi), offering state-of-the-art Thulium Fiber Laser surgery, modular OTs, and NABH-accredited care."
        canonical="/about"
        structuredData={aboutStructuredData}
      />
      <main className="min-h-screen bg-[#f8fafc] text-slate-800  selection:bg-[#0FA8D6] selection:text-white">
      
      {/* ── 1. UNIFIED PAGE HERO (BLUE THEME) ── */}
      <PageHero
        badge="Ramachandra Urology & Stone Centre • Sambalpur"
        breadcrumb="About Hospital"
        title="Super-Specialty Care."
        highlightTitle="World-Class Precision."
        subtitle="Ramachandra Urology & Stone Centre is Western Odisha's premier destination for advanced laser urology, RIRS stone removal, laparoscopic surgeries, and comprehensive renal healthcare — founded and directed by AIIMS New Delhi alumnus Dr. Sanjay Kumar Mahapatra."
        image="https://res.cloudinary.com/drqb4p2a2/image/upload/v1783339988/WhatsApp_Image_2026-07-06_at_5.40.57_PM_1_vjgpse.jpg"
        imageAlt="Ramachandra Urology & Stone Centre Building, Sambalpur"
        imageTag="NABH Accredited Hospital"
        theme="blue"
      >
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-2">
          {[
            { title: "NABH Accredited", desc: "Certified Hospital" },
            { title: "AIIMS Lead Director", desc: "Dr. S.K. Mahapatra" },
            { title: "TFL Laser Center", desc: "Dust-Free Lithotripsy" }
          ].map((spec, idx) => (
            <div key={idx} className="p-2.5 rounded-2xl bg-white border border-[#0FA8D6]/30 shadow-2xs">
              <p className="text-xs font-bold text-[#024363] uppercase  m-0">{spec.title}</p>
              <p className="text-[11px] text-slate-500 font-medium m-0 mt-0.5">{spec.desc}</p>
            </div>
          ))}
        </div>
      </PageHero>

      {/* ── 2. HAIRLINE METRIC LEDGER ── */}
      <section className="border-b border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-slate-200">
            {metrics.map((m, idx) => (
              <div key={idx} className="p-6 sm:p-8 lg:p-10 flex flex-col justify-between">
                <span className=" text-[11px] text-[#0FA8D6] uppercase tracking-widest block mb-3 font-bold">
                  METRIC N° 0{idx + 1}
                </span>
                <div>
                  <div className=" text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tighter text-[#012442] mb-1">
                    {m.value}
                  </div>
                  <div className="text-xs font-bold uppercase tracking-wider text-[#024363] mb-1">
                    {m.label}
                  </div>
                  <div className="text-xs  text-slate-400">
                    {m.note}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. PRESERVED INTERACTIVE SPLIT-SCROLL NARRATIVE CHAPTERS ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 py-16 sm:py-24 border-b border-slate-200">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-14 items-start">
          
          {/* LEFT COLUMN: Sticky Anchor Card */}
          <div className="md:col-span-5 md:sticky md:top-24 self-start space-y-6">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#0FA8D6]/30 shadow-md space-y-6">
              
              <div>
                <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#0FA8D6]  block mb-1">
                  Institutional Profile
                </span>
                <h2 className="text-2xl sm:text-3xl font-medium text-[#012442] tracking-tight leading-tight m-0">
                  Ramachandra Urology & Stone Centre
                </h2>
              </div>

              {/* Active Milestone Progress Bar */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2.5">
                <div className="flex items-center justify-between  text-xs text-slate-500">
                  <span>ACTIVE CHAPTER</span>
                  <span className="text-[#024363] font-bold">
                    0{activeChapterIndex + 1} / 0{chapters.length}
                  </span>
                </div>
                <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-[#00B4EA] transition-all duration-500 ease-out"
                    style={{ width: `${((activeChapterIndex + 1) / chapters.length) * 100}%` }}
                  />
                </div>
                <p className="text-xs font-bold text-[#012442] truncate pt-1 m-0">
                  → {chapters[activeChapterIndex]?.title}
                </p>
              </div>

              {/* Contact & Location Brief */}
              <div className="space-y-3 pt-2 border-t border-slate-100">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#024363]  m-0">
                  SAMBALPUR CAMPUS LOCATION
                </h4>
                <div className="space-y-2 text-xs text-slate-700 font-medium">
                  <div className="flex items-start gap-2.5">
                    <MapPin className="w-4 h-4 text-[#0FA8D6] shrink-0 mt-0.5" />
                    <span>{hospitalAddress}</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Phone className="w-4 h-4 text-[#0FA8D6] shrink-0" />
                    <span>+91 {emergencyPhone} / {generalPhone}</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Mail className="w-4 h-4 text-[#0FA8D6] shrink-0" />
                    <span>{hospitalEmail}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2">
                <button
                  onClick={() => dispatch(openAppointmentModal())}
                  className="w-full py-3 bg-[#00B4EA] hover:from-[#00b4ea] hover:to-[#013550] text-white font-extrabold text-xs rounded-xl shadow-sm transition-all cursor-pointer border-none flex items-center justify-center gap-2 uppercase tracking-wider"
                >
                  <Calendar size={14} />
                  <span>Book Hospital Visit</span>
                </button>
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

      {/* ── 4. FOUNDER & SURGICAL DIRECTOR SPOTLIGHT ── */}
      <FounderSpotlight />

      {/* ── 5. CLINICAL LEADERSHIP & FACULTY TEAM ── */}
      <LeadershipTeam />

      {/* ── 6. STATE-OF-THE-ART MEDICAL INFRASTRUCTURE ── */}
      <InfrastructureShowcase />

      {/* ── 7. GUIDING VISION, MISSION & 4 CORE ETHOS ── */}
      <VisionMissionValues />

      {/* ── 8. ACCREDITATIONS & CASHLESS SCHEMES ── */}
      <AccreditationPartners />

      {/* ── 9. 24/7 HOSPITAL REACH & FAST APPOINTMENT CTA ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="bg-gradient-to-br from-[#012442] via-[#024363] to-[#012442] text-white rounded-3xl p-8 sm:p-12 lg:p-16 border border-[#0FA8D6]/30 shadow-xl relative overflow-hidden">
          
          <div className="absolute top-0 right-1/4 w-80 h-full bg-white/5 blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            
            <div className="lg:col-span-8 space-y-4">
              <span className=" text-xs uppercase tracking-widest text-[#0FA8D6] font-extrabold block">
                VISIT OUR SAMBALPUR HOSPITAL
              </span>
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-medium text-white tracking-tight m-0 leading-tight">
                Ramachandra Urology & Stone Centre
              </h3>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed m-0 font-medium">
                {hospitalAddress}
              </p>
              
              <div className="flex flex-wrap gap-2.5 text-xs text-white pt-2">
                <a
                  href={`tel:+91${emergencyPhone.replace(/\s/g, '')}`}
                  className="px-3.5 py-1.5 rounded-xl bg-white/10 border border-white/20 hover:bg-white/20 transition-colors no-underline text-white"
                >
                  📞 24x7 SOS: +91 {emergencyPhone}
                </a>
                <a
                  href={`tel:+91${generalPhone.replace(/[^\d]/g, '')}`}
                  className="px-3.5 py-1.5 rounded-xl bg-white/10 border border-white/20 hover:bg-white/20 transition-colors no-underline text-white"
                >
                  📞 OPD: +91 {generalPhone}
                </a>
                <a
                  href={`mailto:${hospitalEmail}`}
                  className="px-3.5 py-1.5 rounded-xl bg-white/10 border border-white/20 hover:bg-white/20 transition-colors no-underline text-white"
                >
                  ✉️ {hospitalEmail}
                </a>
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3 justify-end">
              <button
                onClick={() => dispatch(openAppointmentModal())}
                className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#0FA8D6] to-[#00b4ea] hover:brightness-110 text-[#012442] font-medium text-xs uppercase tracking-wider transition-all shadow-md cursor-pointer border-none"
              >
                <Calendar size={14} />
                <span>BOOK AN APPOINTMENT</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              
              <Link
                to="/doctors"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider transition-all border border-white/20 no-underline text-center"
              >
                <span>CONSULT OUR SPECIALISTS</span>
              </Link>
            </div>

          </div>

        </div>
      </section>

    </main>
    </>
  );
};

export default About;
