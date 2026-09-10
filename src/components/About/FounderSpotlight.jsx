import { motion } from "framer-motion";
import { Award, GraduationCap, ShieldCheck, Stethoscope, ArrowRight, Quote, Sparkles, Calendar, CheckCircle2 } from "lucide-react";
import { useDispatch } from "react-redux";
import { openAppointmentModal } from "../../redux/features/patient/patientSlice";

const FounderSpotlight = () => {
  const dispatch = useDispatch();

  return (
    <section className="py-16 sm:py-24 bg-white border-b border-slate-200/80 font-sans select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header Pill */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0FA8D6]/10 border border-[#0FA8D6]/30 text-[#024363] text-xs font-black uppercase tracking-wider mb-3">
            <Sparkles size={14} className="text-[#0FA8D6]" />
            <span>FOUNDER & SURGICAL DIRECTOR SPOTLIGHT</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#012442] tracking-tight leading-tight m-0">
            Visionary Leadership in Super-Specialty Urology
          </h2>
          <p className="text-slate-600 text-sm sm:text-base font-medium mt-3 leading-relaxed">
            Bringing AIIMS-standard surgical precision, advanced laser science, and compassionate clinical care directly to the people of Western Odisha.
          </p>
        </div>

        {/* Main Founder Card */}
        <div className="bg-gradient-to-br from-[#012442] via-[#024363] to-[#012442] text-white rounded-3xl p-6 sm:p-10 lg:p-14 border border-[#0FA8D6]/30 shadow-2xl relative overflow-hidden">
          
          {/* Subtle decorative glow */}
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#0FA8D6]/15 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-black/20 rounded-full blur-2xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center relative z-10">
            
            {/* Left Column: Founder Photo & Credentials Badge (lg:col-span-5) */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="lg:col-span-5 relative"
            >
              <div className="relative rounded-3xl p-2.5 bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl">
                <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-slate-800 relative">
                  <img
                    src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=1000&q=80"
                    alt="Dr. Sanjay Kumar Mahapatra - Founder & Chief Urologist"
                    className="w-full h-full object-cover object-top hover:scale-104 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#012442]/90 via-transparent to-transparent" />
                </div>

                {/* Floating AIIMS Alumnus Badge */}
                <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-md p-3 rounded-2xl border border-slate-200 text-[#012442] shadow-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#0FA8D6] block">
                        Super Specialist
                      </span>
                      <span className="text-sm font-black text-[#012442] block">
                        AIIMS, New Delhi Alumnus
                      </span>
                    </div>
                    <div className="w-9 h-9 rounded-xl bg-[#024363] text-white flex items-center justify-center">
                      <GraduationCap size={18} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Stat Pill */}
              <div className="absolute -top-3 -right-3 bg-gradient-to-r from-[#0FA8D6] to-[#00b4ea] text-[#012442] px-3.5 py-1.5 rounded-full font-black text-xs shadow-md border border-white/40 flex items-center gap-1.5">
                <Award size={14} />
                <span>15,000+ Surgeries</span>
              </div>
            </motion.div>

            {/* Right Column: Founder Vision & Message (lg:col-span-7) */}
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="lg:col-span-7 space-y-5 text-left"
            >
              
              <div className="space-y-1">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[#0FA8D6] text-xs font-mono font-bold tracking-wider uppercase border border-white/20">
                  <Stethoscope size={13} />
                  <span>FOUNDER & CHIEF MEDICAL DIRECTOR</span>
                </div>
                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight m-0 pt-1">
                  Dr. Sanjay Kumar Mahapatra
                </h3>
                <p className="text-xs sm:text-sm font-mono text-[#0FA8D6] font-bold">
                  M.S. (Surgery), M.Ch (Urology, AIIMS, New Delhi)
                </p>
                <p className="text-xs text-slate-300 font-medium">
                  Senior Consultant Urologist, Andrologist & Advanced Endo-Laparoscopic Surgeon
                </p>
              </div>

              {/* Message Quote Box */}
              <div className="p-5 sm:p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 relative">
                <Quote size={28} className="text-[#0FA8D6]/40 absolute top-3 right-3 pointer-events-none" />
                <p className="text-xs sm:text-sm text-slate-100 leading-relaxed italic m-0 font-medium">
                  &quot;When we established Ramachandra Urology & Stone Centre in Sambalpur, our mission was resolute: no patient in Western Odisha should have to travel hundreds of kilometers to metropolitan cities for advanced kidney stone, prostate, or urological surgeries. By integrating next-generation Thulium Fiber Laser (TFL) technology, modular operation theatres, and compassionate care, we provide gold-standard surgical treatments right here at home.&quot;
                </p>
              </div>

              {/* Core Achievements / Clinical Focus */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1 text-xs">
                {[
                  "Pioneered Thulium Laser (TFL) in Western Odisha",
                  "Expert in RIRS, Mini-PCNL & Laser Lithotripsy",
                  "Advanced Laparoscopic Uro-Oncology & Reconstruction",
                  "100% Cashless PM-JAY & BSKY Surgical Access"
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-slate-200 font-medium">
                    <CheckCircle2 size={15} className="text-[#0FA8D6] shrink-0" />
                    <span className="truncate">{item}</span>
                  </div>
                ))}
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-3 pt-3">
                <button
                  onClick={() => dispatch(openAppointmentModal("Urology", "Dr. Sanjay Kumar Mahapatra"))}
                  className="px-6 py-3 bg-gradient-to-r from-[#0FA8D6] to-[#00b4ea] hover:brightness-110 active:scale-95 text-[#012442] font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-md cursor-pointer border-none flex items-center gap-2"
                >
                  <Calendar size={14} />
                  <span>Consult Dr. Mahapatra</span>
                  <ArrowRight size={13} />
                </button>

                <a
                  href="/doctors"
                  className="px-5 py-3 bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-colors border border-white/20 no-underline flex items-center gap-1.5"
                >
                  <span>View All Specialists</span>
                </a>
              </div>

            </motion.div>

          </div>

        </div>

      </div>
    </section>
  );
};

export default FounderSpotlight;
