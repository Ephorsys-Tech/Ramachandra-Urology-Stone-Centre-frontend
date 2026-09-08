import { memo } from "react";
import { Link } from "react-router-dom";
import {
  Phone,
  Ambulance,
  Clock,
  ShieldCheck,
  ArrowRight,
  AlertTriangle,
} from "lucide-react";

const stats = [
  {
    icon: Clock,
    value: "< 5 min",
    label: "Avg Response Time",
  },
  {
    icon: Ambulance,
    value: "20+",
    label: "Ambulances Ready",
  },
  {
    icon: ShieldCheck,
    value: "24/7",
    label: "Emergency Coverage",
  },
  {
    icon: Phone,
    value: "9090963722",
    label: "Emergency Hotline",
  },
];

const HomeEmergency = memo(() => {
  return (
    <section className="relative py-20 lg:py-24 bg-linear-to-b from-[#07A7A5] to-[#003284]  overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/4 w-[400px] h-[400px] bg-yellow-600/10 rounded-full blur-3xl -translate-y-1/2 pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* LEFT CONTENT */}
          <div>
            {/* Emergency Badge */}
            <div className="inline-flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/20 rounded-full px-5 py-2 text-yellow-400 mb-6">
              <AlertTriangle size={16} className="text-yellow-500 animate-pulse" />
              <span className="font-semibold text-sm tracking-wide">
                Emergency Response Unit
              </span>
            </div>

            {/* Live Status */}
            <div className="flex items-center gap-3 mb-6">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500"></span>
              </span>
              <p className="text-emerald-400 text-sm font-semibold tracking-wide">
                Active 24 Hours / 7 Days
              </p>
            </div>

            {/* Heading */}
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight tracking-tight">
              When Every Second{" "}
              <span className="block text-yellow-500">
                Matters Most
              </span>
            </h2>

            <p className="mt-6 text-base text-slate-300 max-w-xl leading-relaxed">
              Our advanced emergency department operates around the clock with
              trauma specialists, rapid response teams, life-support systems,
              and fully equipped ambulances ready for immediate deployment.
            </p>

            {/* Buttons */}
            <div className="flex flex-wrap gap-4 mt-8">
              <a
                href="tel:9090963722"
                className="inline-flex items-center gap-3 bg-yellow-600 hover:bg-yellow-700 text-white px-8 py-4 rounded-xl font-bold transition-all shadow-[0_4px_20px_rgba(220,38,38,0.35)] hover:scale-105 active:scale-95 cursor-pointer"
              >
                <Phone size={18} />
                Call Emergency Hotline
              </a>

              <Link
                to="https://maps.google.com/?q=Usthi+Hospital+Nayapalli+Bhubaneswar"
                className="inline-flex items-center gap-3 border border-white/10 bg-white/5 hover:bg-white/10 text-white px-8 py-4 rounded-xl font-semibold transition-all hover:scale-105 active:scale-95"
              >
                Get Directions
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>

          {/* RIGHT SIDE (Stats Grid) */}
          <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {stats.map(({ icon: Icon, value, label }) => (
                <div
                  key={label}
                  className="bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-6 shadow-md hover:border-yellow-500/30 transition-all duration-300 group"
                >
                  <div className="w-12 h-12 rounded-xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center mb-4 transition-colors group-hover:bg-yellow-500/20">
                    <Icon className="w-6 h-6 text-yellow-500" />
                  </div>

                  <h3 className="text-3xl font-extrabold text-white">
                    {value}
                  </h3>

                  <p className="text-slate-400 mt-1 text-sm font-medium">
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});

export default HomeEmergency;