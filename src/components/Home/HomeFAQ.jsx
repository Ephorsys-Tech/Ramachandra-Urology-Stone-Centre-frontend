import { motion, AnimatePresence } from "framer-motion";
import { useState, memo } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const faqs = [
  {
    q: "What are the visiting hours at Usthi Hospital?",
    a: "General visiting hours are 10:00 AM – 12:00 PM and 5:00 PM – 7:00 PM daily. ICU and special wards may have restricted hours. Please contact the ward directly for specific information.",
  },
  {
    q: "How do I book an appointment with a specialist?",
    a: "You can book appointments online via our website, call our helpline at +919090963722, or walk into the OPD registration desk. Online booking is available 24/7 for your convenience.",
  },
  {
    q: "Does Usthi Hospital accept health insurance?",
    a: "Yes, we accept all major government and private health insurance schemes including Ayushman Bharat, ECHS, CGHS, and all major private insurers. Our billing team will assist you with cashless claims.",
  },
  {
    q: "What emergency services are available?",
    a: "Our 24/7 emergency department handles all trauma, cardiac, neurological, and pediatric emergencies. We have a dedicated ambulance fleet. Call 9090963722 for immediate assistance.",
  },
  {
    q: "Are telemedicine / online consultation services available?",
    a: "Yes! We offer video consultations with our specialist doctors from the comfort of your home. Book a teleconsultation online and receive a prescription and follow-up plan digitally.",
  },
  {
    q: "How do I access my medical reports and records?",
    a: "Patients can access their digital health records, lab results, and discharge summaries through our secure online patient portal. Ask our front desk to register you for portal access.",
  },
  {
    q: "Does Usthi Hospital have a blood bank?",
    a: "Yes, we maintain a fully equipped 24/7 blood bank and component therapy unit. Blood and blood products are available to patients in critical need. Contact the blood bank at extension 245.",
  },
];

const HomeFAQ = memo(() => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (i) => setOpenIndex(openIndex === i ? null : i);

  return (
    <section className="py-24 bg-slate-50">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block text-secondary font-bold text-sm tracking-widest uppercase mb-4">
            FAQs
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-primary mb-4 font-sans tracking-tight">
            Frequently Asked{" "}
            <span className="text-secondary">
              Questions
            </span>
          </h2>
          <p className="text-slate-650 max-w-xl mx-auto">
            Got questions? We've got clear, honest answers. Can't find what you need? Contact our team directly.
          </p>
        </motion.div>

        {/* Accordion */}
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              className={`border rounded-2xl overflow-hidden transition-all duration-300 ${openIndex === i
                ? "border-secondary/30 bg-secondary/5 shadow-sm"
                : "border-slate-200 bg-white hover:border-slate-300 shadow-[0_2px_8px_rgba(0,0,0,0.01)] hover:shadow-md"
                }`}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
            >
              <button
                onClick={() => toggle(i)}
                className="w-full flex items-center justify-between gap-4 p-5 text-left cursor-pointer"
              >
                <span className={`font-semibold text-base transition-colors ${openIndex === i ? "text-secondary" : "text-primary"}`}>
                  {faq.q}
                </span>
                <span className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${openIndex === i ? "bg-secondary text-white" : "bg-slate-100 text-slate-500 hover:bg-slate-200"
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
                    transition={{ duration: 0.3 }}
                  >
                    <p className="px-5 pb-5 text-slate-650 text-sm leading-relaxed border-t border-slate-100 pt-3">{faq.a}</p>
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

export default HomeFAQ;
