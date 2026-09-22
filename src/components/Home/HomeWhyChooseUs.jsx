import { memo } from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Stethoscope, Clock, HeartHandshake, CheckCircle2, Sparkles, Building2 } from "lucide-react";
import { Link } from "react-router-dom";

const reasons = [
  {
    icon: Stethoscope,
    title: "Fellowship-Trained Urologists",
    description: "Led by senior urologists with decades of super-specialized expertise in kidney stone removal, laser prostate, and andrology.",
  },
  {
    icon: Clock,
    title: "Daycare Same-Day Discharge",
    description: "Laser RIRS and mini-invasive procedures enable 90% of our stone patients to return home comfortably on the same or next day.",
  },
  {
    icon: ShieldCheck,
    title: "100% Cashless Govt & TPA Schemes",
    description: "Empaneled with Ayushman Bharat (PM-JAY), Gopabandhu Jan Arogya Yojana (GJAY), and all major corporate insurance TPAs with zero-hassle desk approval.",
  },
  {
    icon: HeartHandshake,
    title: "Transparent & Patient-First Care",
    description: "Honest clinical opinions, zero hidden costs, dedicated patient counselors, and 24/7 post-discharge clinical follow-ups.",
  },
];

const HomeWhyChooseUs = memo(() => {
  return (
    <section className="py-16 sm:py-20 bg-white relative overflow-hidden ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">

          {/* Left info column */}
          <div className="lg:col-span-5 space-y-6">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#0FA8D6]/15 border border-[#0FA8D6]/30 text-[#024363] text-xs font-medium uppercase tracking-wider shadow-2xs">
              
              The Sambalpur Advantage
            </span>

            <h2 className="text-3xl sm:text-4xl font-medium text-[#012442] tracking-tight leading-tight">
              Why Patients Trust <br />
              Ramachandra Urology
            </h2>

            <p className="text-sm text-slate-600 leading-relaxed">
              We combine deep surgical competence with cutting-edge laser technologies to ensure rapid, stitch-free relief from kidney stones and urological ailments in Western Odisha.
            </p>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/90 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#0FA8D6]/15 border border-[#0FA8D6]/30 flex items-center justify-center text-[#024363] shrink-0">
                <Building2 size={24} className="text-[#0FA8D6]" />
              </div>
              <div>
                <p className="text-xs font-extrabold text-[#012442]">NABH-Standard Clinical Protocols</p>
                <p className="text-[11.5px] text-slate-500 mt-0.5">Strict infection control, modular OT standards, and rapid diagnostics.</p>
              </div>
            </div>

            <div>
              <Link
                to="/about"
                className="inline-flex items-center gap-2 text-xs sm:text-sm font-extrabold text-[#024363] hover:text-[#0FA8D6] transition-colors no-underline"
              >
                <span>Read Full Hospital Background & Philosophy →</span>
              </Link>
            </div>
          </div>

          {/* Right 4-card grid */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-5">
            {reasons.map((reason, idx) => {
              const Icon = reason.icon;
              return (
                <motion.div
                  key={reason.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.08 }}
                  className="p-6 rounded-3xl bg-slate-50/80 hover:bg-white border border-slate-200/80 hover:border-[#0FA8D6]/40 hover:shadow-lg transition-all duration-300 group"
                >
                  <div className="w-11 h-11 rounded-2xl bg-[#0FA8D6]/15 border border-[#0FA8D6]/30 text-[#024363] flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                    <Icon size={20} className="text-[#0FA8D6]" />
                  </div>

                  <h3 className="text-base font-medium text-[#012442] mb-2 group-hover:text-[#024363] transition-colors">
                    {reason.title}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {reason.description}
                  </p>
                </motion.div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
});

HomeWhyChooseUs.displayName = "HomeWhyChooseUs";
export default HomeWhyChooseUs;
