import { memo } from "react";
import {
  Award,
  ShieldCheck,
  HeartHandshake,
  Heart,
  Sparkles,
  CheckCircle2,
} from "lucide-react";

const careValues = [
  {
    title: "QUALITY",
    tagline: "Excellence in Every Step",
    desc: "Adherence to NABH clinical protocols, modular laminar airflow OTs, and world-standard fiber laser technologies.",
    icon: Award,
    color: "text-[#0FA8D6]",
    bg: "bg-[#0FA8D6]/10",
  },
  {
    title: "SAFETY",
    tagline: "Your Safety is Our Priority",
    desc: "Stringent infection control, minimal-radiation imaging, and zero-cut endoscopic procedures for risk-free recovery.",
    icon: ShieldCheck,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
  },
  {
    title: "TRUST",
    tagline: "Built on Trust, Driven by Care",
    desc: "Over 50,000 treated patients across Western Odisha, transparent cashless Ayushman billing, and clear clinical guidance.",
    icon: HeartHandshake,
    color: "text-indigo-600",
    bg: "bg-indigo-50",
  },
  {
    title: "WE CARE",
    tagline: "Compassion in Everything We Do",
    desc: "Dedicated clinical empathy, 24/7 renal colic emergency assistance, and supportive post-operative follow-ups.",
    icon: Heart,
    color: "text-rose-600",
    bg: "bg-rose-50",
  },
];

const HomeCareValues = memo(() => {
  return (
    <section className="py-16 sm:py-20 bg-slate-50/60  border-t border-slate-100 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#0FA8D6]/15 border border-[#0FA8D6]/30 text-[#024363] text-xs font-bold uppercase tracking-wider mb-3 shadow-2xs">
            <Sparkles size={12} className="text-[#0FA8D6]" />
            Guiding Philosophy & Patient Promise
          </span>
          <h2 className="text-3xl sm:text-4xl font-medium text-[#012442] tracking-tight mb-2.5">
            A Milestone of Trust • Quality • Compassion
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm max-w-xl mx-auto m-0">
            Our Commitment, Your Care — Delivering advanced urological precision with uncompromising human touch.
          </p>
        </div>

        {/* 4 Values Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {careValues.map((val) => {
            const Icon = val.icon;
            return (
              <div
                key={val.title}
                className="bg-white rounded-3xl p-6 border border-slate-200/90 hover:border-[#0FA8D6]/40 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className={`w-12 h-12 rounded-2xl ${val.bg} ${val.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-xs`}>
                    <Icon size={24} className="stroke-[2.2]" />
                  </div>

                  <h3 className="text-lg font-medium text-[#012442] tracking-tight mb-0.5">
                    {val.title}
                  </h3>

                  <span className={`text-xs font-bold ${val.color} block mb-2.5`}>
                    {val.tagline}
                  </span>

                  <p className="text-xs text-slate-600 leading-relaxed m-0">
                    {val.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section >
  );
});

HomeCareValues.displayName = "HomeCareValues";
export default HomeCareValues;
