import { motion } from "framer-motion";
import { Star, Quote, ChevronLeft, ChevronRight, UserRound } from "lucide-react";
import { useState, memo } from "react";

const testimonials = [
  {
    id: 1,
    name: "Pravakar Kalas",
    role: "Hospital Patient",
    rating: 5,
    text: "My experience at Usthi Hospital was excellent. The attentive staff made me feel cared for right from the start. Regular doctor visits ensured consistent monitoring of my health, and their commitment to providing excellent treatment was evident. I appreciated the accurate diagnosis that led to an effective care plan."
  },
  {
    id: 2,
    name: "Ariyan Mohanty",
    role: "Hospital Patient",
    rating: 5,
    text: "I had a great experience at Usthi Hospital. The facilities are excellent and very well maintained. I was impressed by how clean and hygienic everything was, which made me feel safe. The staff provided good supervision during my stay, ensuring I got the care I needed."
  },
  {
    id: 3,
    name: "Rajat",
    role: "Hospital Patient",
    rating: 5,
    text: "Usthi Hospital is excellent! The facilities are very good and clean. Booking an appointment is easy and quick. I love that the equipment is always sterilised, which makes me feel safe. The wait time is short, so I do not have to sit for long."
  },
  {
    id: 4,
    name: "Priyanka Sahoo",
    role: "Hospital Patient",
    rating: 5,
    text: "Usthi Hospital is truly a gem in healthcare. The caring staff goes above and beyond to ensure patients feel comfortable and supported. Their organised system makes appointments and treatments smooth and hassle-free. The attentive staff are always ready to answer questions."
  },
  {
    id: 5,
    name: "Sanjay Behera",
    role: "Hospital Patient",
    rating: 5,
    text: "I had a great experience at Usthi Hospital. The place is very clean and hygienic, which made me feel safe. They have good facilities that make visits comfortable. The treatment I received was excellent, and the staff was gentle and caring."
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
    <section className="py-24 bg-background relative overflow-hidden">
      {/* Decorative blob */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-tertiary/5 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-secondary/5 rounded-full blur-3xl -translate-x-1/3 translate-y-1/3"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block text-secondary font-bold text-sm tracking-widest uppercase mb-4">
            Patient Stories
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-primary mb-4 font-sans tracking-tight">
            What Our{" "}
            <span className="text-secondary">
              Patients Say
            </span>
          </h2>
          <p className="text-slate-655 max-w-2xl mx-auto text-lg leading-relaxed">
            Real stories from real patients who trusted Usthi Hospital with their health and their lives.
          </p>
        </motion.div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {visible.map((t, i) => (
            <motion.div
              key={t.id}
              className={`relative p-8 rounded-2xl transition-all duration-500 flex flex-col ${
                i === 1
                  ? "bg-primary text-white border border-primary shadow-[0_20px_40px_rgba(15,23,42,0.15)] scale-105"
                  : "bg-white border border-slate-200 shadow-sm hover:border-slate-300"
              }`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
            >
              <Quote className={`w-8 h-8 mb-4 flex-shrink-0 ${i === 1 ? "text-white/20" : "text-secondary/20"}`} />

              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, si) => (
                  <Star key={si} className={`w-4 h-4 fill-current ${i === 1 ? "text-yellow-350" : "text-yellow-400"}`} />
                ))}
              </div>

              <p className={`text-sm leading-relaxed mb-6 flex-grow ${i === 1 ? "text-white/95 italic font-medium" : "text-slate-600 italic"}`}>
                "{t.text}"
              </p>

              <div className="flex items-center gap-3 mt-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 shrink-0 ${
                  i === 1
                    ? "border-white/40 bg-white/10 text-white"
                    : "border-secondary/30 bg-[#07a7a5]/10 text-secondary"
                }`}>
                  <UserRound className="w-5 h-5" />
                </div>
                <div>
                  <p className={`font-bold text-sm ${i === 1 ? "text-white" : "text-primary"}`}>{t.name}</p>
                  <p className={`text-xs ${i === 1 ? "text-sky-300" : "text-slate-500"}`}>{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={prev}
            className="w-11 h-11 rounded-full bg-secondary/10 text-secondary hover:bg-secondary hover:text-white flex items-center justify-center transition-all duration-300 cursor-pointer border-none"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="flex gap-2">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`h-2 rounded-full transition-all duration-300 cursor-pointer border-none ${
                  i === current ? "w-8 bg-secondary" : "w-2 bg-secondary/20"
                }`}
              />
            ))}
          </div>
          <button
            onClick={next}
            className="w-11 h-11 rounded-full bg-secondary/10 text-secondary hover:bg-secondary hover:text-white flex items-center justify-center transition-all duration-300 cursor-pointer border-none"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
});

export default HomeTestimonials;
