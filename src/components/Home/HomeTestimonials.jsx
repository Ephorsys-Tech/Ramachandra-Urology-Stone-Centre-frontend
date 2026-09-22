import { motion } from "framer-motion";
import { Star, Quote, ChevronLeft, ChevronRight, UserRound, Sparkles, CheckCircle2 } from "lucide-react";
import { useState, memo } from "react";

const testimonials = [
  {
    id: 1,
    name: "Pravakar Kalas",
    role: "Kidney Stone Laser (RIRS) Patient",
    rating: 5,
    text: "I was admitted with severe acute flank pain due to a 14mm kidney stone. The urologists performed laser RIRS stone dusting without any incision. I was completely pain-free and discharged the very next morning. Truly exceptional healthcare in Sambalpur!"
  },
  {
    id: 2,
    name: "Ariyan Mohanty",
    role: "PCNL Surgery Patient",
    rating: 5,
    text: "The doctors and clinical staff at Ramachandra Urology & Stone Centre are extremely knowledgeable. My father had a large staghorn stone treated with Mini-PCNL. The cashless claim under Ayushman / GJAY was approved in minutes with zero out-of-pocket hassle."
  },
  {
    id: 3,
    name: "Rajat Patel",
    role: "Laser Prostate (TURP) Patient",
    rating: 5,
    text: "Excellent urology institution with state-of-the-art OT facilities. The modular OT, hygienic daycare wards, and prompt attention by the resident doctors made my laser prostate surgery experience reassuring and seamless."
  },
  {
    id: 4,
    name: "Priyanka Sahoo",
    role: "Ureteric Colic Emergency",
    rating: 5,
    text: "Brought my mother at 2:00 AM in severe kidney colic agony. The 24/7 casualty urology unit triaged her immediately with emergency ultrasound and pain management. We are forever grateful to the Sambalpur team."
  },
  {
    id: 5,
    name: "Sanjay Behera",
    role: "General Urology Consultation",
    rating: 5,
    text: "Honest clinical guidance with no unnecessary procedures. The senior urologist patiently explained the dietary changes and medical management for recurrent calcium oxalate stones. Highly recommended!"
  }
];

const HomeTestimonials = memo(() => {
  const [current, setCurrent] = useState(0);

  const prev = () => setCurrent((p) => (p === 0 ? testimonials.length - 1 : p - 1));
  const next = () => setCurrent((p) => (p === testimonials.length - 1 ? 0 : p + 1));

  const visible = [
    testimonials[(current) % testimonials.length],
    testimonials[(current + 1) % testimonials.length],
    testimonials[(current + 2) % testimonials.length],
  ];

  return (
    <section className="py-16 sm:py-24 bg-white relative overflow-hidden ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          className="text-center mb-12 sm:mb-16"
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#0FA8D6]/15 border border-[#0FA8D6]/30 text-[#024363] text-xs font-medium uppercase tracking-wider mb-3 shadow-2xs">
            
            Real Patient Recoveries
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-medium text-[#012442] mb-3 tracking-tight">
            Trusted by Thousands Across Western Odisha
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto text-xs sm:text-sm leading-relaxed">
            Read first-hand accounts from patients who regained health through our specialized laser lithotripsy and daycare urology care.
          </p>
        </motion.div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 items-stretch">
          {visible.map((t, i) => (
            <motion.div
              key={t.id}
              className={`relative p-6 sm:p-8 rounded-3xl transition-all duration-300 flex flex-col justify-between ${i === 1
                ? "bg-gradient-to-br from-[#012442] via-[#024363] to-[#012442] text-white border border-[#0FA8D6]/40 shadow-xl lg:-translate-y-2"
                : "bg-slate-50/80 border border-slate-200/90 text-slate-800 shadow-xs hover:border-[#0FA8D6]/40"
                }`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: i * 0.08 }}
            >
              <div>
                <Quote className={`w-8 h-8 mb-3 flex-shrink-0 ${i === 1 ? "text-[#0FA8D6]/40" : "text-[#0FA8D6]/30"}`} />

                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, si) => (
                    <Star key={si} className={`w-4 h-4 fill-current ${i === 1 ? "text-[#0FA8D6]" : "text-amber-400"}`} />
                  ))}
                </div>

                <p className={`text-xs sm:text-sm leading-relaxed mb-6 ${i === 1 ? "text-slate-200 font-medium" : "text-slate-600"}`}>
                  "{t.text}"
                </p>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-slate-200/50">
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${i === 1
                  ? "border border-[#0FA8D6]/40 bg-[#0FA8D6]/20 text-[#0FA8D6]"
                  : "border border-slate-200 bg-white text-[#024363]"
                  }`}>
                  <UserRound className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <p className={`font-medium text-xs sm:text-sm truncate ${i === 1 ? "text-white" : "text-[#012442]"}`}>{t.name}</p>
                  <p className={`text-[11px] truncate ${i === 1 ? "text-cyan-300 font-medium" : "text-slate-500 font-medium"}`}>{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={prev}
            className="w-10 h-10 rounded-xl bg-slate-100 text-[#012442] hover:bg-[#0FA8D6] hover:text-white flex items-center justify-center transition-all duration-300 cursor-pointer border-none shadow-xs"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="flex gap-2 items-center">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`h-2 rounded-full transition-all duration-300 cursor-pointer border-none ${i === current ? "w-7 bg-[#0FA8D6]" : "w-2 bg-slate-300"
                  }`}
              />
            ))}
          </div>
          <button
            onClick={next}
            className="w-10 h-10 rounded-xl bg-slate-100 text-[#012442] hover:bg-[#0FA8D6] hover:text-white flex items-center justify-center transition-all duration-300 cursor-pointer border-none shadow-xs"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section >
  );
});

HomeTestimonials.displayName = "HomeTestimonials";
export default HomeTestimonials;
