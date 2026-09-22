import { motion } from "framer-motion";
import { Award, ShieldCheck, CheckCircle2, Sparkles, Building2, CreditCard } from "lucide-react";

const AccreditationPartners = () => {
  const schemes = [
    {
      title: "NABH Entry Level SHCO Accreditation",
      category: "Certificate: PESHCO-0306-13433",
      desc: "National Accreditation Board for Hospitals & Healthcare Providers certified (Valid 30 June 2025 – 29 June 2028) for Urology, Diagnostics, Pathology & Pharmacy.",
      badge: "NABH Accredited",
    },
    {
      title: "Ayushman Bharat (PM-JAY)",
      category: "Central Govt. Scheme",
      desc: "100% cashless inpatient admission, specialized laser stone lithotripsy, and surgical procedures for all eligible Golden Card holders.",
      badge: "Cashless Empanelled",
    },
    {
      title: "Gopabandhu Jan Arogya Yojana (GJAY)",
      category: "Odisha State Scheme",
      desc: "Comprehensive cashless coverage for advanced urology surgeries, Thulium laser stone removal, modular OT procedures, and inpatient care.",
      badge: "State Govt. Empanelled",
    },
    {
      title: "Private TPA & Cashless Mediclaim",
      category: "All Major Insurers",
      desc: "Hassle-free pre-authorization with Star Health, HDFC ERGO, ICICI Lombard, MediAssist, Vidal Health, FHPL, and corporate TPAs.",
      badge: "24x7 TPA Desk",
    },
  ];

  return (
    <section className="py-16 sm:py-24 bg-white border-b border-slate-200/80  select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0FA8D6]/10 border border-[#0FA8D6]/30 text-[#024363] text-xs font-medium uppercase tracking-wider mb-3">
        
            <span>UNIVERSAL ACCESS & CERTIFICATIONS</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-medium text-[#012442] tracking-tight leading-tight m-0">
            Accreditations & Government Schemes
          </h2>
          <p className="text-slate-600 text-sm sm:text-base font-medium mt-3 leading-relaxed">
            We are committed to delivering zero-barrier healthcare through national accreditations and premier cashless government health schemes.
          </p>
        </div>

        {/* 4 Scheme & Accreditation Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {schemes.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.08 }}
              className="p-6 sm:p-7 rounded-3xl bg-[#f8fafc] border border-slate-200/90 hover:bg-[#0FA8D6] hover:border-[#0FA8D6] hover:shadow-xl transition-all duration-300 flex flex-col justify-between group cursor-pointer"
            >
              <div className="space-y-3">


                <h3 className="text-base sm:text-lg font-medium text-[#012442] group-hover:text-white transition-colors duration-300 leading-snug m-0">
                  {item.title}
                </h3>

                <p className="text-slate-600 group-hover:text-white/85 text-xs leading-relaxed font-medium m-0 transition-colors duration-300">
                  {item.desc}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-200/80 group-hover:border-white/20 flex items-center justify-between transition-all duration-300">
                <span className="text-[11px] font-bold text-[#024363] group-hover:text-white transition-colors duration-300">
                  {item.badge}
                </span>
                <CheckCircle2 size={15} className="text-emerald-600 group-hover:text-white transition-colors duration-300" />
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default AccreditationPartners;
