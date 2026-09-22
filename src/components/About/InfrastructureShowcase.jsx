import { motion } from "framer-motion";
import { Zap, Activity, Microscope, ShieldCheck, CheckCircle2, Sparkles, Building2, HeartPulse } from "lucide-react";

const InfrastructureShowcase = () => {
  const facilities = [
    {
      title: "Thulium Fiber Laser (TFL) Workstation",
      tag: "Advanced Laser Lithotripsy",
      desc: "Next-generation ultra-precise laser technology for dust-free vaporization of kidney, ureteric, and bladder stones, as well as bloodless ThuFLEP prostate enucleation.",
      features: ["Dust-free stone fragmentation", "Minimal bleeding & tissue trauma", "Day-care discharge capability"],
      image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80",
      icon: Zap,
    },
    {
      title: "State-of-the-Art Modular OT Suites",
      tag: "Surgical Hygiene & Safety",
      desc: "Laminar airflow with HEPA filtration (Class 10,000 cleanroom standards), HD 3D laparoscopic towers, and harmonic energy delivery systems for sterile surgical outcomes.",
      features: ["Ultra-clean HEPA filtration", "3D Keyhole Laparoscopy", "Zero-infection surgical protocols"],
      image: "https://res.cloudinary.com/drqb4p2a2/image/upload/v1783339988/WhatsApp_Image_2026-07-06_at_5.40.57_PM_1_vjgpse.jpg",
      icon: Building2,
    },
    {
      title: "24x7 Diagnostic Pathology & USG Lab",
      tag: "Rapid Precision Diagnostics",
      desc: "Fully automated biochemistry and hematology analyzers, digital X-ray, high-frequency ultrasonography (USG), and specialized computer uroflowmetry.",
      features: ["Instant emergency lab reports", "High-resolution Doppler USG", "Urodynamic pressure studies"],
      image: "https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=800&q=80",
      icon: Microscope,
    },
    {
      title: "24x7 Trauma & Critical Care ICU",
      tag: "Round-the-Clock Emergency",
      desc: "Dedicated intensive care beds with multi-channel hemodynamic monitors, mechanical ventilators, and immediate acute renal colic emergency management.",
      features: ["24/7 dedicated intensivist on duty", "Immediate acute stone relief", "Multi-parameter ICU beds"],
      image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80",
      icon: HeartPulse,
    },
  ];

  return (
    <section className="py-16 sm:py-24 bg-white border-b border-slate-200/80  select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
 
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-medium text-[#012442] tracking-tight leading-tight m-0">
            Advanced Medical Infrastructure
          </h2>
          <p className="text-slate-600 text-sm sm:text-base font-medium mt-3 leading-relaxed">
            Engineered with high-end laser technology, modular cleanroom theatres, and automated diagnostic suites for precision, safety, and rapid patient recovery.
          </p>
        </div>

        {/* 4 Infrastructure Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {facilities.map((fac, idx) => {
            const IconComp = fac.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                className="bg-[#f8fafc] rounded-3xl overflow-hidden border border-slate-200/90 hover:border-[#0FA8D6] transition-all duration-300 shadow-xs hover:shadow-xl flex flex-col justify-between group"
              >
                <div>
                  {/* Card Image */}
                  <div className="relative aspect-[16/9] overflow-hidden bg-slate-200">
                    <img
                      src={fac.image}
                      alt={fac.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#012442]/80 via-transparent to-transparent opacity-80" />

                  </div>

                  {/* Card Content */}
                  <div className="p-6 sm:p-8 space-y-4">
                    <h3 className="text-xl sm:text-2xl font-medium text-[#012442] group-hover:text-[#024363] transition-colors tracking-tight leading-snug m-0">
                      {fac.title}
                    </h3>
                    
                    <p className="text-slate-600 text-xs sm:text-sm leading-relaxed font-medium m-0">
                      {fac.desc}
                    </p>

                    {/* Features List */}
                    <div className="space-y-2 pt-2 border-t border-slate-200/80">
                      {fac.features.map((feat, fIdx) => (
                        <div key={fIdx} className="flex items-center gap-2 text-xs font-semibold text-[#024363]">
                          <CheckCircle2 size={14} className="text-[#0FA8D6] shrink-0" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="px-6 sm:px-8 pb-6 pt-0">
                  <div className="p-3 bg-white rounded-2xl border border-slate-200 flex items-center justify-between text-xs font-bold text-[#012442]">
                    <span className="text-slate-500 font-medium">Standards Verified</span>
                    <span className="text-[#0FA8D6] font-extrabold flex items-center gap-1">
                      <ShieldCheck size={14} />
                      <span>NABH Compliant</span>
                    </span>
                  </div>
                </div>

              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default InfrastructureShowcase;
