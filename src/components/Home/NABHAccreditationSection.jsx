import { memo } from "react";
import {
  Award,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  FileCheck2,
  Building2,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";

const scopeServices = [
  {
    category: "Clinical Services",
    items: ["Comprehensive Urology & Endourology", "Kidney Stone Laser Lithotripsy", "Laparoscopic Surgeries"],
  },
  {
    category: "Diagnostic Services",
    items: ["High-Resolution Ultrasound (USG)", "Computerized Urodynamic Studies (UDS)", "Digital Plain X-Ray"],
  },
  {
    category: "Laboratory Services",
    items: ["Clinical Bio-Chemistry", "Clinical Pathology", "Haematology & Coagulation"],
  },
  {
    category: "Pharmacy Services",
    items: ["24/7 Hospital Dispensary", "Emergency Renal Medication", "Post-Operative Urological Supplies"],
  },
];

const NABHAccreditationSection = memo(() => {
  return (
    <section id="nabh-accreditation" className="py-16 sm:py-24 bg-white  border-t border-slate-100 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        <div className="bg-gradient-to-br from-[#012442] via-[#024363] to-[#012442] text-white rounded-3xl lg:rounded-[36px] p-8 sm:p-12 lg:p-14 border border-[#0FA8D6]/30 shadow-2xl relative overflow-hidden">

          {/* Subtle Ambient Glows */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#0FA8D6]/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center relative z-10">

            {/* Left Column: Certificate Details */}
            <div className="lg:col-span-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-bold uppercase tracking-wider mb-5 shadow-2xs">
                <Award size={14} className="text-amber-400" />
                National Accreditation Board for Hospitals & Healthcare Providers
              </div>

              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-medium text-white tracking-tight mb-4 leading-tight">
                NABH Entry Level SHCO Accredited
              </h2>

              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed mb-6">
                Ramachandra Urology Stone Centre (Souravbihar, Burla, Sambalpur – 768017) has been formally accredited under the Entry Level Small Healthcare Organisation (SHCO) standards by the National Accreditation Board for Hospitals & Healthcare Providers (NABH).
              </p>

              {/* Certificate Verification Table / Card */}
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/15 space-y-3 mb-6">
                <div className="flex items-center justify-between text-xs pb-2.5 border-b border-white/10">
                  <span className="text-cyan-200 font-semibold">Certificate Number</span>
                  <span className=" font-bold text-white tracking-wider bg-[#0FA8D6]/20 px-2.5 py-0.5 rounded">
                    PESHCO-0306-13433
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs pb-2.5 border-b border-white/10">
                  <span className="text-cyan-200 font-semibold">Validity Period</span>
                  <span className="font-bold text-white">
                    30 June 2025 — 29 June 2028
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-cyan-200 font-semibold">Hospital Reg. No.</span>
                  <span className="font-bold text-white">14/2024</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <Link
                  to="/about"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-[#0FA8D6] to-[#00b4ea] hover:from-[#00b4ea] hover:to-[#0FA8D6] text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all cursor-pointer no-underline uppercase tracking-wider"
                >
                  <span>Learn About Quality Standards</span>
                  <ArrowRight size={14} />
                </Link>
                {/* TODO: confirm with client — high-resolution original NABH certificate PDF download link */}
              </div>
            </div>

            {/* Right Column: NABH Scope of Services Breakdown */}
            <div className="lg:col-span-6 bg-white/5 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-white/15">
              <h3 className="text-base sm:text-lg font-bold text-white mb-4 flex items-center gap-2">
                <FileCheck2 size={18} className="text-[#0FA8D6]" />
                Accredited Scope of Healthcare Services
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {scopeServices.map((scope) => (
                  <div
                    key={scope.category}
                    className="p-3.5 rounded-2xl bg-white/10 border border-white/10 hover:border-[#0FA8D6]/40 transition-colors"
                  >
                    <span className="text-[11px] font-bold text-cyan-200 uppercase tracking-wider block mb-2">
                      {scope.category}
                    </span>
                    <ul className="space-y-1.5 m-0 p-0 list-none">
                      {scope.items.map((srv) => (
                        <li key={srv} className="flex items-center gap-1.5 text-xs text-slate-200">
                          <CheckCircle2 size={12} className="text-[#0FA8D6] shrink-0" />
                          <span className="leading-snug">{srv}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-300">
                <span>Committed to Patient Safety & Clinical Excellence</span>
                <span className="font-bold text-amber-300 flex items-center gap-1">
                  <ShieldCheck size={13} /> Entry Level SHCO
                </span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
});

NABHAccreditationSection.displayName = "NABHAccreditationSection";
export default NABHAccreditationSection;
