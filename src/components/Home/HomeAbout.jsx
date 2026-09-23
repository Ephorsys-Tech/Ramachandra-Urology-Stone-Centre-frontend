import { memo } from "react";
import { Link } from "react-router-dom";
import {
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Award,
  Stethoscope,
  Building2,
  Phone,
  Zap,
  Clock,
  HeartPulse,
} from "lucide-react";

const keyPillars = [
  {
    title: "AIIMS-Trained Surgical Faculty",
    desc: "Led by Dr. Sanjay Kumar Mahapatra [M.S. (Surgery), M.Ch. (Urology, AIIMS New Delhi)].",
    icon: Stethoscope,
    color: "text-[#0FA8D6]",
    bg: "bg-[#0FA8D6]/10",
  },
  {
    title: "Thulium Fiber Laser & Modular OT",
    desc: "Stitchless stone dusting (RIRS/PCNL) and THUFLEP with HEPA-filtered cleanroom safety.",
    icon: Zap,
    color: "text-purple-600",
    bg: "bg-purple-50",
  },
  {
    title: "100% Cashless Ayushman & GJAY",
    desc: "Direct cashless hospitalization under PM-JAY and Gopabandhu Jan Arogya Yojana.",
    icon: ShieldCheck,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
  },
  {
    title: "24/7 Acute Renal Emergency",
    desc: "Immediate relief for severe kidney stone pain, ureteric colic, and DJ stenting.",
    icon: Clock,
    color: "text-rose-600",
    bg: "bg-rose-50",
  },
];

const HomeAbout = memo(() => {
  return (
    <section className="py-16 sm:py-24 bg-white relative overflow-hidden  border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* ── TOP SECTION HEADER ── */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12 lg:mb-16">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#0FA8D6]/15 border border-[#0FA8D6]/30 text-[#024363] text-xs font-medium uppercase tracking-wider mb-3 shadow-2xs">
             
              Ramachandra Urology & Stone Centre • Reg No: 14/2024
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-[40px] font-medium text-[#012442] tracking-tight leading-[1.2]">
              Advanced Kidney Care & <br className="hidden sm:inline" />
              Laser Urological Surgeries
            </h2>
          </div>
          <div className="max-w-md text-left lg:text-right">
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed m-0 font-normal">
              Located in Sourav Vihar, Burla, Sambalpur — providing world-class endourology, laser lithotripsy, and laparoscopic interventions right here in Western Odisha.
            </p>
          </div>
        </div>

        {/* ── MAIN CONTENT GRID ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">

          {/* Left Column: Interactive Visual Stack (5 cols) */}
          <div className="lg:col-span-5 relative">

            {/* Main Visual Container */}
            <div className="relative rounded-3xl overflow-hidden bg-slate-100 border border-slate-200 shadow-md">
              <img
                src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80"
                alt="Ramachandra Urology & Stone Centre Campus in Burla Sambalpur"
                loading="lazy"
                decoding="async"
                width="800"
                height="440"
                className="w-full h-[380px] sm:h-[440px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#012442]/85 via-[#012442]/20 to-transparent" />

              {/* In-Image Caption Overlay */}
              <div className="absolute bottom-5 left-5 right-5 text-white">
                <span className="text-[11px] font-medium text-cyan-200 uppercase tracking-wider block">
                  Sourav Vihar, Burla, Sambalpur
                </span>
                <h3 className="text-lg font-medium text-white tracking-tight mt-0.5 m-0">
                  Centre of Excellence in Endourology
                </h3>
              </div>
            </div>

            {/* Floating Top Accreditation Badge */}
            <div className="absolute -top-4 -right-4 sm:-top-5 sm:-right-5 bg-white rounded-2xl p-3.5 sm:p-4 shadow-xl border border-slate-200 flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0">
                <Award size={22} />
              </div>
              <div>
                <span className="text-[10.5px] font-bold text-slate-400 uppercase tracking-wider block">
                  NABH Accredited
                </span>
                <span className="text-xs sm:text-sm font-bold text-[#012442] block">
                  Entry Level SHCO
                </span>
              </div>
            </div>

            {/* Floating Bottom Quick Stat */}
            <div className="absolute -bottom-4 -left-4 sm:-bottom-5 sm:-left-5 bg-[#012442] text-white rounded-2xl p-3.5 sm:p-4 shadow-xl border border-[#0FA8D6]/30 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#0FA8D6]/20 text-[#0FA8D6] flex items-center justify-center shrink-0">
                <ShieldCheck size={20} />
              </div>
              <div>
                <span className="text-[10px] text-cyan-200 uppercase tracking-wider block">
                  100% Cashless
                </span>
                <span className="text-xs sm:text-sm font-medium text-white block">
                  Ayushman & GJAY
                </span>
              </div>
            </div>

          </div>

          {/* Right Column: Key Pillars & Actions (7 cols) */}
          <div className="lg:col-span-7 space-y-6">

            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed m-0 font-normal">
              Ramachandra Urology & Stone Centre brings modern, stitchless, and precision-guided surgical care to patients suffering from complex kidney stones, enlarged prostate (BPH), and urological conditions. Led by AIIMS New Delhi trained faculty, our centre eliminates the need for long travel to metros by providing advanced surgical science right here at home.
            </p>

            {/* 4 Clean Feature Cards in 2x2 Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {keyPillars.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.title}
                    className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200/80 hover:bg-white hover:border-[#0FA8D6]/40 hover:shadow-sm transition-all duration-300 flex items-start gap-3"
                  >
                    <div className={`w-10 h-10 rounded-xl ${item.bg} ${item.color} flex items-center justify-center shrink-0`}>
                      <Icon size={19} />
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-medium text-[#012442] leading-snug m-0">
                        {item.title}
                      </h4>
                      <p className="text-[11.5px] text-slate-500 mt-1 leading-relaxed m-0">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Action Bar */}
            <div className="pt-4 flex flex-wrap items-center gap-4">
              <Link
                to="/about"
                className="inline-flex items-center gap-2 bg-[#00B4EA] hover:from-[#00b4ea] hover:to-[#013550] text-white px-6 py-3 rounded-2xl text-xs sm:text-sm font-medium transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 cursor-pointer no-underline uppercase tracking-wider"
              >
                <span>Read Full Story & Mission</span>
                <ArrowRight size={14} />
              </Link>

              <a
                href="tel:9937566625"
                className="inline-flex items-center gap-2 bg-slate-50 border border-slate-200 hover:border-[#0FA8D6]/40 text-[#012442] px-5 py-3 rounded-2xl text-xs sm:text-sm font-medium transition-colors no-underline"
              >
                <Phone size={14} className="text-[#0FA8D6]" />
                <span>OPD Desk: 9937566625</span>
              </a>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
});

HomeAbout.displayName = "HomeAbout";
export default HomeAbout;

