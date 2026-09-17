import { motion } from "framer-motion";
import { Award, ShieldCheck, HeartPulse, Stethoscope, Sparkles, Target, Eye, Compass } from "lucide-react";

const VisionMissionValues = () => {
  const pillars = [
    {
      title: "QUALITY — Excellence in Every Step",
      desc: "Practicing evidence-based medicine, strict NABH protocol adherence, and precision Thulium Fiber Laser surgical interventions.",
      icon: Award,
      num: "01",
    },
    {
      title: "SAFETY — Your Safety is Our Priority",
      desc: "Uncompromising infection control, HEPA-filtered modular OT cleanrooms, and stringent clinical safety protocols.",
      icon: ShieldCheck,
      num: "02",
    },
    {
      title: "TRUST — Built on Trust, Driven by Care",
      desc: "Ethical counseling, transparent treatment pathways, zero unnecessary procedures, and 100% cashless scheme support (Ayushman / GJAY).",
      icon: HeartPulse,
      num: "03",
    },
    {
      title: "WE CARE — Compassion in Everything",
      desc: "Treating every patient with dignity, empathy, and patient-centric dedication throughout OPD, daycare, and post-discharge recovery.",
      icon: Stethoscope,
      num: "04",
    },
  ];

  return (
    <section className="py-16 sm:py-24 bg-[#f8fafc] border-b border-slate-200/80 font-sans select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ── 1. VISION & MISSION DUAL CARDS ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          
          {/* Vision Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="p-8 sm:p-10 rounded-3xl bg-white border border-[#0FA8D6]/30 shadow-md space-y-4 relative overflow-hidden group hover:border-[#0FA8D6] transition-colors"
          >
            <div className="w-12 h-12 rounded-2xl bg-[#0FA8D6]/10 text-[#024363] border border-[#0FA8D6]/30 flex items-center justify-center shadow-xs">
              <Eye size={24} className="text-[#0FA8D6]" />
            </div>

            <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#0FA8D6] block">
              OUR GUIDING VISION
            </span>

            <h3 className="text-2xl sm:text-3xl font-medium text-[#012442] tracking-tight leading-snug m-0">
              Transforming Western Odisha into a Healthcare Beacon
            </h3>

            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed font-medium m-0">
              To be recognized as Eastern India&apos;s most trusted and technologically advanced super-specialty centre in Laser Urology, Stone Management, and Laparoscopic Surgery — empowering every patient with accessible, gold-standard clinical outcomes.
            </p>
          </motion.div>

          {/* Mission Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="p-8 sm:p-10 rounded-3xl bg-white border border-[#0FA8D6]/30 shadow-md space-y-4 relative overflow-hidden group hover:border-[#0FA8D6] transition-colors"
          >
            <div className="w-12 h-12 rounded-2xl bg-[#0FA8D6]/10 text-[#024363] border border-[#0FA8D6]/30 flex items-center justify-center shadow-xs">
              <Target size={24} className="text-[#0FA8D6]" />
            </div>

            <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#0FA8D6] block">
              OUR CLINICAL MISSION
            </span>

            <h3 className="text-2xl sm:text-3xl font-medium text-[#012442] tracking-tight leading-snug m-0">
              Precision Laser Surgery with Human Compassion
            </h3>

            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed font-medium m-0">
              To deliver world-class surgical care utilizing cutting-edge Thulium Fiber Laser systems and 3D laparoscopy, led by top AIIMS-trained faculty, while maintaining universal affordability through government cashless healthcare partnerships.
            </p>
          </motion.div>

        </div>

        {/* ── 2. FOUR FOUNDATIONAL CORE PILLARS ── */}
        <div>
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#0FA8D6] block mb-2">
              FOUNDATIONAL ETHOS
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-medium text-[#012442] tracking-tight m-0">
              Our Core Principles of Practice
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {pillars.map((item, idx) => {
              const IconComp = item.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.08 }}
                  className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/90 hover:border-[#0FA8D6] hover:shadow-lg transition-all duration-300 flex flex-col justify-between group"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-extrabold text-[#024363] bg-[#0FA8D6]/10 px-2.5 py-1 rounded-lg border border-[#0FA8D6]/30">
                        {item.num}
                      </span>
                      <div className="w-10 h-10 rounded-xl bg-slate-50 text-[#024363] group-hover:bg-[#024363] group-hover:text-white transition-colors duration-300 flex items-center justify-center border border-slate-200">
                        <IconComp size={18} />
                      </div>
                    </div>

                    <h4 className="text-lg font-medium text-[#012442] group-hover:text-[#024363] transition-colors m-0">
                      {item.title}
                    </h4>

                    <p className="text-slate-600 text-xs leading-relaxed font-medium m-0">
                      {item.desc}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-[10px] font-mono font-bold text-slate-400 uppercase">
                    <span>Verified Ethos</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#0FA8D6]" />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
};

export default VisionMissionValues;
