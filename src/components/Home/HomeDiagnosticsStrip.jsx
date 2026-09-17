import { memo } from "react";
import {
  FlaskConical,
  Scan,
  Activity,
  Pill,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  FileText,
  Clock,
} from "lucide-react";
import { Link } from "react-router-dom";

const diagnosticServices = [
  {
    title: "Clinical Pathology & Biochemistry",
    category: "In-House Laboratory",
    desc: "Complete haematology, serum creatinine, electrolytes, urine routine & culture tests with rapid turnaround for urgent clinical decisions.",
    icon: FlaskConical,
    badge: "Accredited Lab",
  },
  {
    title: "Ultrasound & Digital X-Ray",
    category: "Radiology & Imaging",
    desc: "High-resolution USG KUB (Kidney, Ureter, Bladder), pelvic sonography, and digital plain X-Ray KUB for precise stone localization.",
    icon: Scan,
    badge: "Digital HD",
  },
  {
    title: "Urodynamics & Uroflowmetry",
    category: "Functional Urology Suite",
    desc: "Advanced computerized Uroflowmetry and Urodynamic Studies (UDS) for neurogenic bladder, urinary incontinence, and voiding dysfunctions.",
    icon: Activity,
    badge: "Specialized Suite",
  },
  {
    title: "24/7 In-House Pharmacy",
    category: "Hospital Dispensary",
    desc: "Fully stocked urological pharmacy providing authentic emergency renal colic relief, post-operative medications, and stent care supplies.",
    icon: Pill,
    badge: "24/7 Open",
  },
];

const HomeDiagnosticsStrip = memo(() => {
  return (
    <section className="py-16 sm:py-24 bg-slate-50/70  border-t border-slate-100 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#0FA8D6]/15 border border-[#0FA8D6]/30 text-[#024363] text-xs font-bold uppercase tracking-wider mb-3 shadow-2xs">
              <Sparkles size={12} className="text-[#0FA8D6]" />
              Complete Diagnostic Ecosystem Under One Roof
            </span>
            <h2 className="text-3xl sm:text-4xl font-medium text-[#012442] tracking-tight">
              In-House Diagnostics & Facilities
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm mt-2 leading-relaxed m-0">
              Accurate treatment starts with accurate diagnosis. Our hospital houses specialized pathology, ultrasound, urodynamic suites, and an all-hours pharmacy.
            </p>
          </div>

          <Link
            to="/contact"
            className="self-start md:self-auto inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-white border border-slate-200 hover:border-[#0FA8D6]/50 hover:bg-slate-50 text-[#012442] text-xs sm:text-sm font-bold shadow-xs hover:shadow-md transition-all cursor-pointer no-underline uppercase tracking-wider shrink-0"
          >
            <span>Visit Diagnostic Center</span>
            <ArrowRight size={15} className="text-[#0FA8D6]" />
          </Link>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {diagnosticServices.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="bg-white rounded-3xl p-6 border border-slate-200/90 hover:border-[#0FA8D6]/40 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-[#0FA8D6]/10 text-[#0FA8D6] flex items-center justify-center group-hover:scale-110 group-hover:bg-[#0FA8D6] group-hover:text-white transition-all duration-300 shadow-xs">
                      <Icon size={24} />
                    </div>
                    <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md">
                      {item.badge}
                    </span>
                  </div>

                  <span className="text-[10.5px] font-bold uppercase tracking-wider text-[#0FA8D6] block mb-1">
                    {item.category}
                  </span>

                  <h3 className="text-base sm:text-lg font-bold text-[#012442] mb-2.5 group-hover:text-[#024363] transition-colors leading-snug">
                    {item.title}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed m-0">
                    {item.desc}
                  </p>
                </div>

                <div className="pt-4 mt-6 border-t border-slate-100 flex items-center gap-1.5 text-[11.5px] font-bold text-[#024363]">
                  <CheckCircle2 size={13} className="text-emerald-500 shrink-0" />
                  <span>Available Daily In-House</span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section >
  );
});

HomeDiagnosticsStrip.displayName = "HomeDiagnosticsStrip";
export default HomeDiagnosticsStrip;
