import { memo } from "react";
import { motion } from "framer-motion";
import { Zap, Sparkles, Activity, ShieldCheck, Microscope, Layers, ArrowRight } from "lucide-react";
import { useDispatch } from "react-redux";
import { openAppointmentModal } from "../../redux/features/patient/patientSlice";

const technologies = [
  {
    title: "Thulium Fiber LASER Lithotripsy",
    category: "Laser Kidney & Stone Care",
    description: "Advanced fiber laser energy for RIRS & PCNL, pulverizing hard renal, ureteric, and bladder stones into dust with minimal retropulsion.",
    highlight: "Kidney, Ureter & Bladder",
    badge: "Thulium Fiber Laser",
  },
  {
    title: "Digital Flexible RIRS & Endopyelotomy",
    category: "Retrograde Intrarenal Surgery",
    description: "Direct endoscopic access to renal calyces for stitchless stone clearance and laser endopyelotomy for Pelvi-Ureteric Junction Obstruction (PUJO).",
    highlight: "PUJO & Caliceal Stones",
    badge: "Daycare Surgery",
  },
  {
    title: "Modular OT & High-End Laparoscopy",
    category: "Surgical Infrastructure",
    description: "MODULAR OT WITH HIGH END LAPAROSCOPY & LASER INSTRUMENTS — HEPA-filtered laminar airflow for infection-free surgical safety.",
    highlight: "Modular OT Standard",
    badge: "NABH Protocol",
  },
  {
    title: "THUFLEP & Laser Prostatectomy",
    category: "Prostate / BPH Surgery",
    description: "Thulium Fiber Laser enucleation of enlarged prostate (BPH) with minimal bleeding, rapid 24-hour catheter removal, and quick discharge.",
    highlight: "Enlarged Prostate (BPH)",
    badge: "Laser Enucleation",
  },
];

const HomeTechnology = memo(() => {
  const dispatch = useDispatch();

  return (
    <section className="py-16 sm:py-24 bg-slate-50/70 relative overflow-hidden ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#0FA8D6]/15 border border-[#0FA8D6]/30 text-[#024363] text-xs font-bold uppercase tracking-wider mb-3 shadow-2xs">
         
              Modular OT with High End Laparoscopy & Laser Instruments
            </span>
            <h2 className="text-3xl sm:text-4xl font-medium text-[#012442] tracking-tight">
              Thulium Fiber LASER & Advanced Technologies
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed m-0">
              Transforming kidney stone and prostate surgery through state-of-the-art Thulium Fiber Laser systems and infection-controlled modular operation suites.
            </p>
          </div>

          <button
            onClick={() => dispatch(openAppointmentModal())}
            className="self-start md:self-auto inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#00B4EA] hover:from-[#00b4ea] hover:to-[#013550] text-white text-xs sm:text-sm font-extrabold shadow-md hover:shadow-lg transition-all cursor-pointer border-none uppercase tracking-wider"
          >
            <span>Consult a Laser Specialist</span>
            <ArrowRight size={15} />
          </button>
        </div>

        {/* Tech Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {technologies.map((tech, idx) => (
            <motion.div
              key={tech.title}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: idx * 0.08 }}
              className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs hover:shadow-xl hover:border-[#00B4EA] hover:bg-[#00B4EA] transition-all duration-300 flex flex-col justify-between group relative overflow-hidden"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10.5px] font-medium uppercase tracking-wider text-[#0FA8D6] bg-[#0FA8D6]/10 group-hover:text-white group-hover:bg-white/20 px-2.5 py-1 rounded-full transition-colors duration-300">
                    {tech.category}
                  </span>
                  <span className="text-[10px] font-bold text-slate-500 bg-slate-100 group-hover:text-white group-hover:bg-white/20 px-2 py-0.5 rounded-md transition-colors duration-300">
                    {tech.badge}
                  </span>
                </div>

                <h3 className="text-base sm:text-lg font-medium text-[#012442] mb-2.5 group-hover:text-white transition-colors duration-300 leading-snug">
                  {tech.title}
                </h3>

                <p className="text-xs text-slate-600 leading-relaxed mb-6 group-hover:text-white/85 transition-colors duration-300">
                  {tech.description}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 group-hover:border-white/30 flex items-center justify-between text-xs transition-colors duration-300">
                <span className="font-extrabold text-[#024363] group-hover:text-white flex items-center gap-1.5 transition-colors duration-300">
            
                  {tech.highlight}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
});

HomeTechnology.displayName = "HomeTechnology";
export default HomeTechnology;
