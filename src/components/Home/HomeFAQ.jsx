import { motion, AnimatePresence } from "framer-motion";
import { useState, memo } from "react";
import { ChevronDown, ChevronUp, Sparkles, HelpCircle } from "lucide-react";

const faqs = [
  {
    q: "What are the advantages of Laser RIRS for kidney stone removal?",
    a: "RIRS (Retrograde Intrarenal Surgery) is completely incision-free. A flexible digital ureteroscope is passed through natural urinary passages, and high-energy laser fibers pulverize stones into dust. Patients experience minimal discomfort and are usually discharged within 24 hours.",
  },
  {
    q: "How do I book an OPD consultation with a senior urologist?",
    a: "You can book appointments 24/7 directly via our website booking button, call our reception helpline at +91 9090963722 / +91 8065906200, or walk into our Budharaja, Sambalpur OPD desk (08:00 AM - 08:00 PM).",
  },
  {
    q: "Are Ayushman Bharat (PM-JAY) and BSKY / Gopabandhu cards accepted?",
    a: "Yes. Ramachandra Urology & Stone Centre is fully empaneled with Ayushman Bharat (PM-JAY), Odisha BSKY / Gopabandhu Swasthya Bima, and all major corporate insurance TPAs for 100% cashless hospitalization.",
  },
  {
    q: "What should I do in case of severe, acute kidney stone pain (Renal Colic)?",
    a: "Immediately visit our 24/7 Casualty and Emergency Unit in Budharaja, Sambalpur or call +91 9090963722. Our medical team provides immediate intravenous analgesia, emergency ultrasonography, and urgent DJ stenting/laser intervention if needed.",
  },
  {
    q: "Is daycare discharge possible after laser prostate or stone surgery?",
    a: "Yes. Over 90% of our minimally invasive laser stone (RIRS/URS) and select prostate procedures qualify for daycare or 24-hour discharge protocols, allowing quick return to work and routine life.",
  },
  {
    q: "How can I prevent recurrent kidney stones?",
    a: "Our urology department offers metabolic stone evaluation and chemical stone analysis to identify dietary triggers. Drinking 2.5 to 3 liters of water daily, moderating sodium intake, and following personalized dietary guidance significantly reduces recurrence.",
  },
];

const HomeFAQ = memo(() => {
  const [openIndex, setOpenIndex] = useState(0);

  const toggle = (i) => setOpenIndex(openIndex === i ? null : i);

  return (
    <section className="py-16 sm:py-24 bg-slate-50/70 font-sans">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="text-center mb-12 sm:mb-16"
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#0FA8D6]/15 border border-[#0FA8D6]/30 text-[#024363] font-black text-xs uppercase tracking-wider mb-3 shadow-2xs">
            <Sparkles size={12} className="text-[#0FA8D6]" />
            Patient Help & Clarity
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#012442] tracking-tight">
            Frequently Asked <span className="text-[#0FA8D6]">Questions</span>
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
              className={`rounded-2xl sm:rounded-3xl overflow-hidden transition-all duration-300 border ${
                openIndex === i
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
                <span className={`font-black text-xs sm:text-sm transition-colors ${openIndex === i ? "text-[#024363]" : "text-[#012442]"}`}>
                  {faq.q}
                </span>
                <span className={`flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center transition-colors ${
                  openIndex === i ? "bg-[#0FA8D6] text-white" : "bg-slate-100 text-slate-500"
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
    </section>
  );
});

HomeFAQ.displayName = "HomeFAQ";
export default HomeFAQ;
