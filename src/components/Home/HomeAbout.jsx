import { memo } from "react";
import { Link } from "react-router-dom";
import { CheckCircle2, ArrowRight, ShieldCheck, Sparkles, Award } from "lucide-react";

const features = [
  {
    title: "Super-Specialist Urologists",
    desc: "Decades of surgical mastery in laser & stone care",
  },
  {
    title: "Laser OT & Daycare Center",
    desc: "Stitchless stone removal with same-day recovery",
  },
  {
    title: "24/7 Renal Colic Triage",
    desc: "Immediate relief for acute kidney stone pain",
  },
  {
    title: "100% Cashless Empanelment",
    desc: "Ayushman Bharat, BSKY & private health TPAs",
  },
];

const HomeAbout = memo(() => {
  return (
    <section className="py-16 sm:py-24 bg-white relative overflow-hidden font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16">

          {/* Left Image Section */}
          <div className="w-full lg:w-[46%] relative h-[320px] sm:h-[400px] lg:h-[460px]">
            <img
              src="https://res.cloudinary.com/drqb4p2a2/image/upload/v1783148317/PXL_20260701_144557189.jpg_i7iqlz.jpg"
              alt="Ramachandra Urology & Stone Centre Sambalpur"
              className="w-full h-full object-cover rounded-3xl lg:rounded-[36px] shadow-xl border border-slate-200/90"
            />
            <div className="absolute inset-0 bg-[#012442]/10 mix-blend-multiply rounded-3xl lg:rounded-[36px]" />

            {/* Floating Experience Badge */}
            <div className="absolute -bottom-5 -right-4 sm:-bottom-6 sm:-right-6 bg-gradient-to-br from-[#012442] via-[#024363] to-[#012442] text-white p-5 sm:p-7 rounded-3xl shadow-xl border border-[#0FA8D6]/30 z-10 min-w-[150px] sm:min-w-[180px] text-center">
              <div className="w-8 h-8 rounded-full bg-[#0FA8D6]/20 mx-auto flex items-center justify-center mb-1 text-[#0FA8D6]">
                <Award size={18} />
              </div>
              <p className="text-3xl sm:text-4xl font-black mb-0.5 text-white">25<span className="text-[#0FA8D6]">+</span></p>
              <p className="text-[11px] sm:text-xs font-bold tracking-wider uppercase text-cyan-200">Years of<br />Urology Excellence</p>
            </div>
          </div>

          {/* Text Section (Right Side) */}
          <div className="w-full lg:w-[50%]">
            <div className="mb-6">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#0FA8D6]/15 border border-[#0FA8D6]/30 text-[#024363] text-xs font-black uppercase tracking-wider mb-3 shadow-2xs">
                <Sparkles size={12} className="text-[#0FA8D6]" />
                Western Odisha's Pioneer Urology Wing
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-black text-[#012442] leading-[1.18] tracking-tight">
                Dedicated to Advanced <br />
                <span className="text-[#0FA8D6]">Kidney Stone & Urology Care</span>
              </h2>
            </div>

            <p className="text-slate-600 leading-relaxed mb-4 text-xs sm:text-sm">
              Ramachandra Urology & Stone Centre is Sambalpur’s premier specialized medical institution offering comprehensive endourology, laser lithotripsy (RIRS/PCNL), prostate surgeries, and nephrology services under one trusted roof.
            </p>
            <p className="text-slate-600 leading-relaxed mb-8 text-xs sm:text-sm">
              We eliminate traditional surgical incisions through cutting-edge fiber lasers and flexible digital endoscopes, ensuring quicker healing, minimal pain, and rapid discharge.
            </p>

            {/* Feature Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 mb-8">
              {features.map((item) => (
                <div key={item.title} className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                  <div className="w-9 h-9 rounded-xl bg-[#0FA8D6]/15 flex items-center justify-center text-[#0FA8D6] shrink-0">
                    <CheckCircle2 size={18} />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-xs sm:text-sm text-[#012442]">{item.title}</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <Link
              to="/about"
              className="inline-flex items-center gap-2.5 bg-gradient-to-r from-[#0FA8D6] to-[#024363] hover:from-[#00b4ea] hover:to-[#013550] text-white px-7 py-3.5 rounded-2xl font-extrabold transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5 cursor-pointer no-underline text-xs sm:text-sm uppercase tracking-wider"
            >
              <span>Explore Our Full Story</span>
              <ArrowRight size={15} />
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
});

HomeAbout.displayName = "HomeAbout";
export default HomeAbout;
