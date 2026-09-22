import { useState, memo } from "react";
import { motion } from "framer-motion";
import { PhoneCall, ShieldCheck, Sparkles } from "lucide-react";

const faqs = [
  {
    question: "What are the advantages of Thulium Fiber LASER for kidney stone removal?",
    answer:
      "Thulium Fiber LASER (TFL) provides ultra-fine precision for RIRS (Retrograde Intrarenal Surgery), pulverizing kidney, ureteric, and bladder stones into fine dust with zero surgical cuts, negligible bleeding, and same-day daycare discharge.",
  },
  {
    question: "What are the signs of Enlarged Prostate (BPH) and how is THUFLEP better?",
    answer:
      "Common BPH symptoms include frequent urination, weak urine stream, nocturia (night-time urination), urgency, and feeling of incomplete emptying. THUFLEP (Thulium Fiber Laser Enucleation of Prostate) removes obstructive tissue with minimal blood loss and rapid recovery.",
  },
  {
    question: "How do I book an appointment with Dr. Sanjay Kumar Mahapatra?",
    answer:
      "You can book an appointment 24/7 directly through our website, call our Burla helpline at +91 88950 62072 / +91 99375 66625 / +91 76538 99199 / 0663-4075199, or visit our Sourav Vihar, Burla, Sambalpur clinic.",
  },
  {
    question: "Are Ayushman Bharat (PM-JAY) and GJAY schemes accepted?",
    answer:
      "Yes. Ramachandra Urology & Stone Centre is fully empaneled under Ayushman Bharat (PM-JAY), Gopabandhu Jan Arogya Yojana (GJAY), and private health insurance TPAs for 100% cashless hospitalization.",
  },
  {
    question: "What emergency support is available for acute renal colic / stone pain?",
    answer:
      "Our emergency triage unit in Sourav Vihar, Burla, Sambalpur operates 24/7 with immediate pain management, emergency ultrasound (USG), DJ stenting, and rapid laser stone clearance. Emergency hotline: +91 99375 66625.",
  },
  {
    question: "What in-house diagnostic facilities are available?",
    answer:
      "We have comprehensive NABH-certified in-house facilities including automated Pathology (Clinical Bio-Chemistry, Clinical Pathology, Haematology), Digital X-Ray, Ultrasound, Uroflowmetry, Urodynamic Studies, and Pharmacy.",
  },
];

const HomeFAQ = memo(() => {
  const [openIndex, setOpenIndex] = useState(0);

  const toggle = (index) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section className="py-12 sm:py-16 md:py-20 bg-slate-50/70 overflow-hidden" id="faq-section">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Balanced Grid: 1 col on mobile, 12 cols on tablet & desktop */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-8 lg:gap-12 items-start">

          {/* Left Column: Image & Quick Info Card (5 cols on tablet/PC) */}
          <motion.div
            className="w-full md:col-span-5 lg:col-span-5 md:sticky md:top-24"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="relative group overflow-hidden rounded-2xl sm:rounded-3xl shadow-lg border border-slate-200/80 bg-white">
              <img
                className="w-full h-[260px] sm:h-[300px] md:h-[360px] lg:h-[430px] object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
                src="https://cdn.21st.dev/assets/mirror/65/65dc784c8e67e24c04b277e285a1463bd4e0aca0c55bd11bf1ed1e71c32b1030.jpg"
                alt="Ramachandra Urology & Stone Centre FAQ Support"
                loading="lazy"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = "/contact-doctor.jpg";
                }}
              />

              {/* Subtle Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#012442]/90 via-[#012442]/20 to-transparent pointer-events-none" />
              {/* Floating Bottom Card */}
              <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4 md:bottom-4 md:left-4 md:right-4 lg:bottom-5 lg:left-5 lg:right-5 bg-white/95 backdrop-blur-md p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border border-white/60 shadow-md flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-[#0FA8D6] uppercase tracking-wider mb-0.5">
                    <ShieldCheck className="w-4 h-4 text-[#0FA8D6] shrink-0" />
                    <span className="truncate">NABH Certified Care</span>
                  </div>
                  <p className="text-xs sm:text-sm font-bold text-[#012442] leading-snug">
                    Still have questions? Call 24/7 Helpline
                  </p>
                </div>
                <a
                  href="tel:+918895062072"
                  className="shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#0FA8D6] hover:bg-[#024363] text-white flex items-center justify-center transition-colors shadow-sm"
                  aria-label="Call Helpline"
                >
                  <PhoneCall className="w-4.5 h-4.5" />
                </a>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Header & 21st.dev Style FAQ Accordion (7 cols on tablet/PC) */}
          <motion.div
            className="w-full md:col-span-7 lg:col-span-7"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {/* Header / Badge */}
            <div className="mb-6 sm:mb-7 text-left">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0FA8D6]/10 border border-[#0FA8D6]/30 text-[#024363] font-semibold text-xs uppercase tracking-wider mb-2.5">

                FAQ's
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-medium text-[#012442] tracking-tight">
                Looking for answers?
              </h2>
              <p className="text-xs sm:text-sm md:text-sm lg:text-base text-slate-600 mt-2 leading-relaxed">
                Find quick, expert answers regarding our advanced laser stone surgeries, prostate care, cashless insurance admissions, and diagnostic consultations.
              </p>
            </div>

            {/* Accordion List with 21st.dev Style borders */}
            <div className="divide-y divide-slate-200 border-t border-b border-slate-200">
              {faqs.map((faq, index) => {
                const isOpen = openIndex === index;
                return (
                  <div
                    key={index}
                    className="py-3.5 sm:py-4 md:py-4 lg:py-4.5 transition-colors duration-200 cursor-pointer"
                    onClick={() => toggle(index)}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <h3
                        className={`text-sm sm:text-base md:text-[15px] lg:text-base font-medium transition-colors duration-300 leading-snug ${isOpen ? "text-[#024363] font-semibold" : "text-[#012442] hover:text-[#0FA8D6]"
                          }`}
                      >
                        {faq.question}
                      </h3>
                      <span
                        className={`shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all duration-300 ${isOpen ? "bg-[#0FA8D6] text-white" : "bg-slate-100 text-slate-600"
                          }`}
                      >
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 18 18"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className={`w-4 h-4 transition-transform duration-500 ease-in-out ${isOpen ? "rotate-180" : ""
                            }`}
                        >
                          <path
                            d="m4.5 7.2 3.793 3.793a1 1 0 0 0 1.414 0L13.5 7.2"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </span>
                    </div>

                    <div
                      className={`text-xs sm:text-sm text-slate-600 leading-relaxed transition-all duration-500 ease-in-out overflow-hidden ${isOpen
                        ? "opacity-100 max-h-[350px] translate-y-0 pt-3"
                        : "opacity-0 max-h-0 -translate-y-1.5"
                        }`}
                    >
                      <p>{faq.answer}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
});

HomeFAQ.displayName = "HomeFAQ";
export default HomeFAQ;
