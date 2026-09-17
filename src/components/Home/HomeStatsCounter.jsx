import { memo, useState } from "react";
import { motion } from "framer-motion";
import {
  Zap,
  Award,
  Users,
  CheckCircle2,
  Crosshair,
  ShieldCheck,
  Clock,
  UserCheck,
} from "lucide-react";

const hospitalStats = [
  {
    id: 1,
    value: "15,000+",
    label: "Laser Surgeries",
    icon: Zap,
    color: "text-purple-600",
    bg: "bg-purple-50",
  },
  {
    id: 2,
    value: "25+",
    label: "Years of Excellence",
    icon: Award,
    color: "text-amber-500",
    bg: "bg-amber-50",
  },
  {
    id: 3,
    value: "50,000+",
    label: "Satisfied Patients",
    icon: Users,
    color: "text-pink-500",
    bg: "bg-pink-50",
  },
  {
    id: 4,
    value: "99.4%",
    label: "Surgical Success",
    icon: CheckCircle2,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
  },
  {
    id: 5,
    value: "8,500+",
    label: "Prostate Surgeries",
    icon: Crosshair,
    color: "text-indigo-600",
    bg: "bg-indigo-50",
  },
  {
    id: 6,
    value: "100%",
    label: "Cashless Ayushman & GJAY",
    icon: ShieldCheck,
    color: "text-sky-600",
    bg: "bg-sky-50",
  },
  {
    id: 7,
    value: "24/7",
    label: "Renal Emergency",
    icon: Clock,
    color: "text-rose-600",
    bg: "bg-rose-50",
  },
  {
    id: 8,
    value: "100+",
    label: "Doctors & Clinical Staff",
    icon: UserCheck,
    color: "text-teal-600",
    bg: "bg-teal-50",
  },
];

const HomeStatsCounter = memo(() => {
  const [isPaused, setIsPaused] = useState(false);

  // Duplicate list for infinite seamless loop
  const infiniteStats = [...hospitalStats, ...hospitalStats, ...hospitalStats];

  return (
    <section className="bg-white py-12 sm:py-16 font-sans select-none overflow-hidden border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ── HEADER TITLE & SUBTITLE ── */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-[#012442] mb-2.5">
            Ramachandra <span className="text-[#0FA8D6]">At A Glance</span>
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm leading-relaxed max-w-2xl mx-auto m-0 font-normal">
            Specialised healthcare for urology and kidney care, delivered through advanced laser technology and multidisciplinary clinical teams.
          </p>
        </div>

        {/* ── INFINITE SMOOTH SLIDING STATS CAROUSEL ── */}
        <div 
          className="relative w-full overflow-hidden py-2"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Gradient Masks for Seamless Edge Fading */}
          <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-24 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-24 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

          {/* Sliding Track */}
          <motion.div
            className="flex items-center gap-6 sm:gap-8 w-max cursor-grab active:cursor-grabbing"
            animate={{
              x: isPaused ? undefined : ["0%", "-33.333%"],
            }}
            transition={{
              x: {
                repeat: Infinity,
                repeatType: "loop",
                duration: 25,
                ease: "linear",
              },
            }}
          >
            {infiniteStats.map((stat, idx) => {
              const IconComponent = stat.icon;
              return (
                <div
                  key={`${stat.id}-${idx}`}
                  className="flex flex-col items-center text-center p-3 sm:p-4 rounded-2xl transition-transform duration-300 hover:-translate-y-1 w-[160px] sm:w-[185px] flex-shrink-0 group"
                >
                  {/* Distinct Colored Icon with Soft Tinted Badge */}
                  <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center mb-3 shadow-xs group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className="w-6 h-6 sm:w-7 sm:h-7 stroke-[2.2]" />
                  </div>

                  {/* Stat Value */}
                  <h3 className="text-xl sm:text-2xl font-black text-[#012442] tracking-tight mb-1 leading-tight group-hover:text-[#0FA8D6] transition-colors">
                    {stat.value}
                  </h3>

                  {/* Stat Subtitle */}
                  <p className="text-xs sm:text-[13px] text-slate-500 font-medium leading-snug m-0">
                    {stat.label}
                  </p>
                </div>
              );
            })}
          </motion.div>
        </div>

      </div>
    </section>
  );
});

HomeStatsCounter.displayName = "HomeStatsCounter";
export default HomeStatsCounter;

