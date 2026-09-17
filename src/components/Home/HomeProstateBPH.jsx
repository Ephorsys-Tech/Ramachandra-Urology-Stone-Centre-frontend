import { memo } from "react";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  AlertCircle,
  Activity,
  ArrowRight,
  ShieldCheck,
  Zap,
  Clock,
  Sparkles,
  Layers,
} from "lucide-react";
import { useDispatch } from "react-redux";
import { openAppointmentModal } from "../../redux/features/patient/patientSlice";

const bphSymptoms = [
  {
    title: "Frequent Urination",
    desc: "Needing to urinate more often than usual, especially waking up multiple times at night (nocturia).",
  },
  {
    title: "Weak or Interrupted Stream",
    desc: "Hesitant urine stream that starts and stops, requiring strain or effort to maintain flow.",
  },
  {
    title: "Urgent Need to Urinate",
    desc: "A sudden, compelling urge to urinate that is difficult to postpone or control.",
  },
  {
    title: "Incomplete Bladder Emptying",
    desc: "Persistent sensation that the bladder has not fully emptied after urination.",
  },
];

const thuflepBenefits = [
  "Stitchless & No Open Surgical Incisions",
  "Near-Zero Intraoperative Blood Loss",
  "Suitable for All Prostate Sizes (Small to Giant)",
  "Early Catheter Removal within 24 to 48 Hours",
  "Fast Daycare Recovery & Quick Return to Daily Life",
  "Low Risk of Recurrence Compared to Conventional TURP",
];

const HomeProstateBPH = memo(() => {
  const dispatch = useDispatch();

  return (
    <section className="py-16 sm:py-24 bg-white relative overflow-hidden  border-t border-slate-100">
      {/* Ambient background blur */}
      <div className="absolute top-1/3 right-0 w-80 h-80 bg-[#0FA8D6]/5 rounded-full blur-[90px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#0FA8D6]/15 border border-[#0FA8D6]/30 text-[#024363] text-xs font-bold uppercase tracking-wider mb-3 shadow-2xs">
            <Sparkles size={12} className="text-[#0FA8D6]" />
            Comprehensive Prostate Care & Laser Enucleation
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-medium text-[#012442] tracking-tight mb-3">
            Enlarged Prostate (BPH) & THUFLEP Surgery
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm leading-relaxed max-w-2xl mx-auto m-0">
            Benign Prostatic Hyperplasia (BPH) causes progressive urinary obstruction in aging men. At Ramachandra Urology, we provide advanced Thulium Fiber Laser prostate enucleation for rapid relief and long-term urinary wellness.
          </p>
        </div>

        {/* 2-Column Content Grid: Symptoms vs Laser Treatment */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">

          {/* Left Column: BPH Symptoms & Visual Anatomy Card */}
          <div className="lg:col-span-6 bg-slate-50/80 rounded-3xl p-6 sm:p-8 border border-slate-200/90 flex flex-col justify-between shadow-xs">
            <div>
              <div className="flex items-center gap-2.5 mb-5">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0">
                  <AlertCircle size={20} />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-[#012442] leading-tight">
                    Common Symptoms of BPH
                  </h3>
                  <span className="text-xs text-slate-500 font-medium">Do not ignore these early urinary warning signs</span>
                </div>
              </div>

              {/* Symptoms List */}
              <div className="space-y-3.5 mb-8">
                {bphSymptoms.map((symptom) => (
                  <div
                    key={symptom.title}
                    className="p-3.5 rounded-2xl bg-white border border-slate-200/80 hover:border-[#0FA8D6]/40 transition-colors shadow-2xs"
                  >
                    <div className="flex items-start gap-2.5">
                      <div className="w-2 h-2 rounded-full bg-[#0FA8D6] mt-1.5 shrink-0" />
                      <div>
                        <h4 className="text-xs sm:text-sm font-bold text-[#012442] leading-snug">
                          {symptom.title}
                        </h4>
                        <p className="text-[11.5px] sm:text-xs text-slate-500 mt-0.5 leading-relaxed m-0">
                          {symptom.desc}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Diagnostic Advice Callout */}
            <div className="p-4 rounded-2xl bg-cyan-50/60 border border-cyan-200/70 flex items-center gap-3">
              <Activity className="w-5 h-5 text-[#0FA8D6] shrink-0" />
              <p className="text-xs text-[#024363] font-medium leading-relaxed m-0">
                Early evaluation with in-house <strong>Uroflowmetry</strong> and <strong>Ultrasound (USG KUB)</strong> helps prevent urinary retention and kidney stress.
              </p>
            </div>
          </div>

          {/* Right Column: THUFLEP Laser Surgery Solution */}
          <div className="lg:col-span-6 bg-gradient-to-br from-[#012442] via-[#024363] to-[#012442] text-white rounded-3xl p-6 sm:p-8 border border-[#0FA8D6]/30 flex flex-col justify-between shadow-xl relative overflow-hidden">
            {/* Top decorative glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#0FA8D6]/20 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0FA8D6]/20 text-[#0FA8D6] text-[11px] font-bold uppercase tracking-wider border border-[#0FA8D6]/40">
                  <Zap size={13} />
                  Thulium Fiber Laser Prostatectomy
                </span>
                <span className="text-[10.5px] font-bold text-cyan-200 bg-white/10 px-2.5 py-0.5 rounded-md backdrop-blur-xs">
                  Daycare Procedure
                </span>
              </div>

              <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-3 tracking-tight leading-snug">
                THUFLEP — The Modern Standard in Prostate Enucleation
              </h3>

              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed mb-6">
                Using precision Thulium Fiber Laser energy, our surgical team enucleates the obstructive prostate adenoma along the natural anatomic plane with minimal thermal spread, ensuring preservation of surrounding tissue and rapid recovery.
              </p>

              {/* Benefits Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-8">
                {thuflepBenefits.map((benefit) => (
                  <div
                    key={benefit}
                    className="flex items-center gap-2 p-2.5 rounded-xl bg-white/10 backdrop-blur-xs border border-white/10"
                  >
                    <CheckCircle2 className="w-4 h-4 text-[#0FA8D6] shrink-0" />
                    <span className="text-xs font-semibold text-slate-100 leading-tight">
                      {benefit}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Bar */}
            <div className="relative z-10 pt-4 border-t border-white/15 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-left w-full sm:w-auto">
                <span className="text-[11px] text-cyan-200 block uppercase font-bold tracking-wider">
                  Lead Laser Surgeon
                </span>
                <span className="text-xs sm:text-sm font-bold text-white">
                  Dr. Sanjay Kumar Mahapatra (M.Ch AIIMS)
                </span>
              </div>

              <button
                onClick={() => dispatch(openAppointmentModal("Prostate Surgery", "Dr. Sanjay Kumar Mahapatra"))}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-[#0FA8D6] to-[#00b4ea] hover:from-[#00b4ea] hover:to-[#0FA8D6] text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all cursor-pointer border-none uppercase tracking-wider shrink-0"
              >
                <span>Consult For BPH</span>
                <ArrowRight size={15} />
              </button>
            </div>

          </div>

        </div>

      </div>
    </section >
  );
});

HomeProstateBPH.displayName = "HomeProstateBPH";
export default HomeProstateBPH;
