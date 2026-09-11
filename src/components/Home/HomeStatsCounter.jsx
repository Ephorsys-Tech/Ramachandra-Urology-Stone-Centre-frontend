import { memo } from "react";
import { motion } from "framer-motion";
import { Award, Users, CheckCircle2, ShieldCheck, HeartPulse, Activity } from "lucide-react";

const stats = [
  {
    icon: Award,
    value: "25+",
    unit: "Years",
    title: "Clinical Heritage",
    subtitle: "Urological excellence in Western Odisha",
  },
  {
    icon: HeartPulse,
    value: "15,000+",
    unit: "Surgeries",
    title: "Stone Procedures",
    subtitle: "Laser RIRS, PCNL & URS completed",
  },
  {
    icon: CheckCircle2,
    value: "99.4%",
    unit: "Rate",
    title: "Surgical Success",
    subtitle: "Minimally invasive rapid recovery",
  },
  {
    icon: ShieldCheck,
    value: "100%",
    unit: "Cashless",
    title: "Ayushman & GJAY",
    subtitle: "Approved for all major govt schemes & private TPAs",
  },
];

const HomeStatsCounter = memo(() => {
  return (
    <section className="relative -mt-4 mb-8 z-20 max-w-7xl mx-auto px-4 font-sans">
      <div className="bg-gradient-to-br from-[#012442] via-[#024363] to-[#012442] rounded-3xl p-6 sm:p-8 lg:p-10 shadow-xl border border-[#0FA8D6]/30 relative overflow-hidden text-white">
        
        {/* Ambient glow effects */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#0FA8D6]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-[#0FA8D6]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 divide-y sm:divide-y-0 sm:divide-x divide-white/10 relative z-10">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className={`flex flex-col ${idx > 0 ? "pt-6 sm:pt-0 sm:pl-6 lg:pl-8" : ""}`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-11 h-11 rounded-2xl bg-[#0FA8D6]/20 border border-[#0FA8D6]/40 text-[#0FA8D6] flex items-center justify-center shadow-xs">
                    <Icon size={22} />
                  </div>
                  <span className="text-[11px] font-black uppercase tracking-wider text-cyan-300">
                    {stat.title}
                  </span>
                </div>

                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                    {stat.value}
                  </span>
                </div>

                <p className="text-xs text-slate-300 font-medium leading-relaxed">
                  {stat.subtitle}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
});

HomeStatsCounter.displayName = "HomeStatsCounter";
export default HomeStatsCounter;
