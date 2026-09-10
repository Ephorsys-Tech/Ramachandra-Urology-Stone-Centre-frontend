import { memo } from "react";
import { motion } from "framer-motion";
import { Zap, Sparkles, Activity, ShieldCheck, Microscope, Layers, ArrowRight } from "lucide-react";
import { useDispatch } from "react-redux";
import { openAppointmentModal } from "../../redux/features/patient/patientSlice";

const technologies = [
  {
    title: "Thulium Fiber & Holmium Laser",
    category: "Laser Lithotripsy",
    description: "Ultra-fine laser energy pulverizes hard kidney & ureteric stones into microscopic dust with zero incisions.",
    highlight: "Dusting & Popcorning Tech",
    badge: "Gold Standard",
  },
  {
    title: "Digital Flexible Ureteroscopy (RIRS)",
    category: "Retrograde Intrarenal Surgery",
    description: "Navigates tortuous renal anatomy using high-definition flexible digital endoscopes for complex upper-pole stones.",
    highlight: "No Cut, No Scar",
    badge: "Daycare Surgery",
  },
  {
    title: "Mini & Ultra-Mini PCNL",
    category: "Percutaneous Nephrolithotomy",
    description: "Micro-puncture access under ultrasonic and fluoroscopic guidance for large staghorn stones (>2cm) with minimal blood loss.",
    highlight: "Keyhole Precision",
    badge: "Rapid Recovery",
  },
  {
    title: "Bipolar TURP & Laser Prostate",
    category: "Prostate Health",
    description: "Advanced surgical resection and laser enucleation of enlarged prostate gland (BPH) ensuring smooth urinary flow.",
    highlight: "Safe for High-Risk Patients",
    badge: "Minimal Hospital Stay",
  },
];

const HomeTechnology = memo(() => {
  const dispatch = useDispatch();

  return (
    <section className="py-16 sm:py-20 bg-slate-50/70 relative overflow-hidden font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#0FA8D6]/15 border border-[#0FA8D6]/30 text-[#024363] text-xs font-black uppercase tracking-wider mb-3 shadow-2xs">
              <Zap size={13} className="text-[#0FA8D6]" />
              State-of-the-Art Clinical Infrastructure
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#012442] tracking-tight">
              Advanced <span className="text-[#0FA8D6]">Laser & Stone</span> Technologies
            </h2>
            <p className="text-sm text-slate-600 mt-2 leading-relaxed">
              We leverage the latest global advances in endourology and laser technology to deliver stitchless, painless, and daycare surgical outcomes in Sambalpur.
            </p>
          </div>

          <button
            onClick={() => dispatch(openAppointmentModal())}
            className="self-start md:self-auto inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-[#0FA8D6] to-[#024363] hover:from-[#00b4ea] hover:to-[#013550] text-white text-xs sm:text-sm font-extrabold shadow-md hover:shadow-lg transition-all cursor-pointer border-none"
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
              className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs hover:shadow-xl hover:border-[#0FA8D6]/50 transition-all duration-300 flex flex-col justify-between group relative overflow-hidden"
            >
              {/* Subtle top indicator bar */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#0FA8D6] to-[#024363] opacity-0 group-hover:opacity-100 transition-opacity" />

              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10.5px] font-black uppercase tracking-wider text-[#0FA8D6] bg-[#0FA8D6]/10 px-2.5 py-1 rounded-full">
                    {tech.category}
                  </span>
                  <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                    {tech.badge}
                  </span>
                </div>

                <h3 className="text-base sm:text-lg font-black text-[#012442] mb-2.5 group-hover:text-[#024363] transition-colors leading-snug">
                  {tech.title}
                </h3>

                <p className="text-xs text-slate-600 leading-relaxed mb-6">
                  {tech.description}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="font-extrabold text-[#024363] flex items-center gap-1.5">
                  <Sparkles size={13} className="text-[#0FA8D6]" />
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
