import React, { useState } from "react";
import { cn } from "@/lib/utils";

const defaultFaqs = [
  {
    question: "What are the advantages of Thulium Fiber LASER for kidney stone removal?",
    answer:
      "Thulium Fiber LASER (TFL) provides ultra-fine precision for RIRS (Retrograde Intrarenal Surgery), pulverizing kidney, ureteric, and bladder stones into fine dust with zero surgical cuts, negligible bleeding, and same-day daycare discharge.",
  },
  {
    question: "What are the signs of Enlarged Prostate (BPH) and how is THUFLEP better?",
    answer:
      "Common BPH symptoms include frequent urination, weak urine stream, nocturia (night-time urination), urgency, and feeling of incomplete emptying. THUFLEP removes obstructive prostate tissue with minimal blood loss and rapid recovery.",
  },
  {
    question: "How do I book an appointment with Dr. Sanjay Kumar Mahapatra?",
    answer:
      "You can book an appointment 24/7 directly through our website, call our Burla helpline at +91 88950 62072 / +91 99375 66625, or visit our Sourav Vihar clinic in Burla, Sambalpur.",
  },
  {
    question: "Are Ayushman Bharat (PM-JAY) and GJAY schemes accepted?",
    answer:
      "Yes. Ramachandra Urology & Stone Centre is fully empaneled under Ayushman Bharat (PM-JAY), Gopabandhu Jan Arogya Yojana (GJAY), and private health insurance TPAs for 100% cashless hospitalization.",
  },
  {
    question: "What emergency support is available for acute renal colic / stone pain?",
    answer:
      "Our emergency triage unit in Sourav Vihar, Burla operates 24/7 with immediate pain management, emergency ultrasound (USG), DJ stenting, and rapid laser stone clearance. Emergency hotline: +91 99375 66625.",
  },
  {
    question: "What in-house diagnostic facilities are available?",
    answer:
      "We have comprehensive NABH-certified in-house facilities including automated Pathology, Digital X-Ray, Ultrasound, Uroflowmetry, Urodynamic Studies, and Pharmacy.",
  },
];

export const FAQSections = ({
  badge = "PATIENT FAQ'S",
  title = "Frequently Asked Questions",
  description = "Find clear, expert answers regarding our advanced laser stone surgeries, prostate care, cashless insurance schemes, and doctor consultations.",
  imageSrc = "https://cdn.21st.dev/assets/mirror/65/65dc784c8e67e24c04b277e285a1463bd4e0aca0c55bd11bf1ed1e71c32b1030.jpg",
  imageAlt = "Ramachandra Urology & Stone Centre FAQ Support",
  items = defaultFaqs,
  className = "",
}) => {
  const [openIndex, setOpenIndex] = useState(0);

  const toggle = (index) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section className={cn("w-full py-12 sm:py-16 md:py-20 bg-slate-50/60 overflow-hidden", className)}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-8 lg:gap-12 items-start">
          {/* Responsive Image Container */}
          <div className="w-full md:col-span-5 lg:col-span-5 md:sticky md:top-24">
            <div className="relative group overflow-hidden rounded-2xl sm:rounded-3xl shadow-lg border border-slate-200/80 bg-white">
              <img
                className="w-full h-[260px] sm:h-[300px] md:h-[360px] lg:h-[430px] object-cover object-center transition-transform duration-500 group-hover:scale-105"
                src={imageSrc}
                alt={imageAlt}
                loading="lazy"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = "/contact-doctor.jpg";
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent pointer-events-none" />
            </div>
          </div>

          {/* FAQ Content Section */}
          <div className="w-full md:col-span-7 lg:col-span-7">
            <div className="mb-6 sm:mb-7 text-left">
              {badge && (
                <span className="inline-block text-xs font-semibold tracking-wider uppercase text-[#0FA8D6] bg-[#0FA8D6]/10 px-3 py-1 rounded-full border border-[#0FA8D6]/20 mb-2.5">
                  {badge}
                </span>
              )}
              <h2 className="text-2xl sm:text-3xl md:text-3xl lg:text-4xl font-bold text-[#012442] tracking-tight">
                {title}
              </h2>
              {description && (
                <p className="text-xs sm:text-sm md:text-sm lg:text-base text-slate-600 mt-2 leading-relaxed">
                  {description}
                </p>
              )}
            </div>

            {/* Accordion List */}
            <div className="divide-y divide-slate-200 border-t border-b border-slate-200">
              {items.map((faq, index) => {
                const isOpen = openIndex === index;
                return (
                  <div
                    key={index}
                    className="py-3.5 sm:py-4 md:py-4 lg:py-4.5 transition-colors duration-200 cursor-pointer"
                    onClick={() => toggle(index)}
                  >
                    <div className="flex items-center justify-between text-left gap-4">
                      <h3
                        className={cn(
                          "text-sm sm:text-base md:text-[15px] lg:text-base font-medium transition-colors duration-200 leading-snug",
                          isOpen ? "text-[#024363] font-semibold" : "text-[#012442] hover:text-[#0FA8D6]"
                        )}
                      >
                        {faq.question || faq.q}
                      </h3>
                      <span
                        className={cn(
                          "shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all duration-300",
                          isOpen
                            ? "bg-[#0FA8D6] text-white rotate-180"
                            : "bg-slate-100 text-slate-600"
                        )}
                      >
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 18 18"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-4 h-4"
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
                      className={cn(
                        "grid transition-all duration-300 ease-in-out overflow-hidden text-slate-600 text-xs sm:text-sm leading-relaxed",
                        isOpen
                          ? "grid-rows-[1fr] opacity-100 pt-3"
                          : "grid-rows-[0fr] opacity-0 pt-0"
                      )}
                    >
                      <div className="overflow-hidden">
                        <p className="pb-1">{faq.answer || faq.a}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQSections;
