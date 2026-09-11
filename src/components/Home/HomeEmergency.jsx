import { memo } from "react";
import { useSelector } from "react-redux";
import {
  Phone,
  Ambulance,
  Clock,
  ShieldCheck,
  ArrowRight,
  AlertTriangle,
  Activity,
  HeartPulse
} from "lucide-react";

const stats = [
  {
    icon: Clock,
    value: "< 5 min",
    label: "Emergency Triage",
  },
  {
    icon: HeartPulse,
    value: "24/7",
    label: "Laser & Stone OT",
  },
  {
    icon: ShieldCheck,
    value: "100%",
    label: "Ayushman / GJAY",
  },
  {
    icon: Phone,
    value: "9937566625",
    label: "Emergency Hotline",
  },
];

const HomeEmergency = memo(() => {
  const { settings } = useSelector((state) => state.setting || { settings: null });
  const emergencyPhone = settings?.emergencyPhone || "9937566625";

  return (
    <section className="relative py-16 lg:py-20 bg-gradient-to-br from-[#012442] via-[#024363] to-[#012442] overflow-hidden font-sans border-y border-[#0FA8D6]/20">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/4 w-[450px] h-[450px] bg-[#0FA8D6]/15 rounded-full blur-3xl -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-[#024363]/40 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          {/* LEFT CONTENT */}
          <div>
            {/* Emergency Badge */}
            <div className="inline-flex items-center gap-2 bg-[#0FA8D6]/15 border border-[#0FA8D6]/30 rounded-full px-4 py-1.5 text-cyan-300 mb-5 shadow-2xs">
              <AlertTriangle size={15} className="text-[#0FA8D6] animate-pulse" />
              <span className="font-extrabold text-xs tracking-wider uppercase">
                24/7 Urology & Stone Emergency
              </span>
            </div>

            {/* Live Status */}
            <div className="flex items-center gap-2.5 mb-5">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500"></span>
              </span>
              <p className="text-emerald-400 text-xs font-bold tracking-wide uppercase">
                Sambalpur Trauma & Daycare Unit Active
              </p>
            </div>

            {/* Heading */}
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight tracking-tight">
              Severe Renal Colic or Acute Pain?{" "}
              <span className="block text-[#0FA8D6] mt-1">
                We Are Ready 24/7.
              </span>
            </h2>

            <p className="mt-5 text-sm sm:text-base text-slate-300 max-w-xl leading-relaxed">
              Immediate pain relief, rapid ultrasound diagnostics, and emergency laser lithotripsy for acute ureteric colic, stone blockages, urinary retention, and trauma in Sambalpur.
            </p>

            {/* Buttons */}
            <div className="flex flex-wrap gap-4 mt-8">
              <a
                href={`tel:${emergencyPhone}`}
                className="inline-flex items-center gap-3 bg-gradient-to-r from-[#0FA8D6] to-[#024363] hover:from-[#00b4ea] hover:to-[#013550] text-white px-7 py-3.5 rounded-xl font-black transition-all shadow-lg hover:shadow-[#0FA8D6]/30 hover:scale-102 active:scale-98 cursor-pointer no-underline text-xs sm:text-sm uppercase tracking-wider"
              >
                <Phone size={16} />
                <span>Call Hotline: +91 {emergencyPhone}</span>
              </a>

              <a
                href="https://www.google.com/maps/search/?api=1&query=Ramachandra+Urology+and+Stone+Centre+Sambalpur+Odisha"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 border border-white/20 bg-white/5 hover:bg-white/10 text-white px-6 py-3.5 rounded-xl font-bold transition-all hover:scale-102 active:scale-98 text-xs sm:text-sm no-underline"
              >
                <span>Campus Location</span>
                <ArrowRight size={15} />
              </a>
            </div>
          </div>

          {/* RIGHT SIDE (Stats Grid) */}
          <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {stats.map(({ icon: Icon, value, label }) => (
                <div
                  key={label}
                  className="bg-white/5 border border-white/10 backdrop-blur-md rounded-3xl p-6 shadow-md hover:border-[#0FA8D6]/40 transition-all duration-300 group"
                >
                  <div className="w-11 h-11 rounded-2xl bg-[#0FA8D6]/15 border border-[#0FA8D6]/30 flex items-center justify-center mb-4 transition-transform group-hover:scale-110">
                    <Icon className="w-5 h-5 text-[#0FA8D6]" />
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-black text-white">
                    {value}
                  </h3>

                  <p className="text-slate-300 mt-1 text-xs font-semibold">
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

HomeEmergency.displayName = "HomeEmergency";
export default HomeEmergency;