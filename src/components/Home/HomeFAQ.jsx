import { motion, AnimatePresence } from "framer-motion";
import { useState, memo } from "react";
import { ChevronDown, ChevronUp, Sparkles, HelpCircle } from "lucide-react";

const faqs = [
  {
    q: "What are the advantages of Thulium Fiber LASER for kidney stone removal?",
    a: "Thulium Fiber LASER (TFL) provides ultra-fine precision for RIRS (Retrograde Intrarenal Surgery), pulverizing kidney, ureteric, and bladder stones into fine dust with zero surgical cuts, negligible bleeding, and same-day daycare discharge.",
  },
  {
    q: "What are the signs of Enlarged Prostate (BPH) and how is THUFLEP better?",
    a: "Common BPH symptoms include frequent urination, weak urine stream, nocturia (night-time urination), urgency, and feeling of incomplete emptying. THUFLEP (Thulium Fiber Laser Enucleation of Prostate) removes obstructive tissue with minimal blood loss and rapid recovery.",
  },
  {
    q: "How do I book an appointment with Dr. Sanjay Kumar Mahapatra?",
    a: "You can book an appointment 24/7 directly through our website, call our Burla helpline at +91 88950 62072 / +91 99375 66625 / +91 76538 99199 / 0663-4075199, or visit our Sourav Vihar, Burla, Sambalpur clinic.",
  },
  {
    q: "Are Ayushman Bharat (PM-JAY) and GJAY schemes accepted?",
    a: "Yes. Ramachandra Urology & Stone Centre is fully empaneled under Ayushman Bharat (PM-JAY), Gopabandhu Jan Arogya Yojana (GJAY), and private health insurance TPAs for 100% cashless hospitalization.",
  },
  {
    q: "What emergency support is available for acute renal colic / stone pain?",
    a: "Our emergency triage unit in Sourav Vihar, Burla, Sambalpur operates 24/7 with immediate pain management, emergency ultrasound (USG), DJ stenting, and rapid laser stone clearance. Emergency hotline: +91 99375 66625.",
  },
  {
    q: "What in-house diagnostic facilities are available?",
    a: "We have comprehensive NABH-certified in-house facilities including automated Pathology (Clinical Bio-Chemistry, Clinical Pathology, Haematology), Digital X-Ray, Ultrasound, Uroflowmetry, Urodynamic Studies, and Pharmacy.",
  },
];

const HomeFAQ = memo(() => {
  const [openIndex, setOpenIndex] = useState(0);

  const toggle = (i) => setOpenIndex(openIndex === i ? null : i);

  return (
    <section className="py-16 sm:py-24 bg-slate-50/70 ">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="text-center mb-12 sm:mb-16"
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#0FA8D6]/15 border border-[#0FA8D6]/30 text-[#024363] font-medium text-xs uppercase tracking-wider mb-3 shadow-2xs">
            <Sparkles size={12} className="text-[#0FA8D6]" />
            Patient Help & Clarity
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-medium text-[#012442] tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-slate-600 max-w-xl mx-auto text-xs sm:text-sm mt-2 leading-relaxed">
            Have questions regarding stone treatments, laser surgery, or cashless admissions? Find clear answers below.
          </p>
        </motion.div>

        {/* Accordion */}
        <div className="space-y-3.5">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              className={`rounded-2xl sm:rounded-3xl overflow-hidden transition-all duration-300 border ${openIndex === i
                ? "border-[#0FA8D6]/50 bg-white shadow-md"
                : "border-slate-200/90 bg-white hover:border-slate-300 shadow-xs"
                }`}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: i * 0.05 }}
            >
              <button
                onClick={() => toggle(i)}
                className="w-full flex items-center justify-between gap-4 p-5 sm:p-6 text-left cursor-pointer border-none bg-transparent"
              >
                <span className={`font-medium text-xs sm:text-sm transition-colors ${openIndex === i ? "text-[#024363]" : "text-[#012442]"}`}>
                  {faq.q}
                </span>
                <span className={`flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center transition-colors ${openIndex === i ? "bg-[#0FA8D6] text-white" : "bg-slate-100 text-slate-500"
                  }`}>
                  {openIndex === i ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </span>
              </button>

              <AnimatePresence>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    <p className="px-5 sm:px-6 pb-6 text-slate-600 text-xs sm:text-sm leading-relaxed border-t border-slate-100 pt-3">{faq.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section >
  );
});

HomeFAQ.displayName = "HomeFAQ";
export default HomeFAQ;
