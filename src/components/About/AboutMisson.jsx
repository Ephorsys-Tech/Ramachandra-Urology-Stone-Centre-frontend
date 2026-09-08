import { motion } from "framer-motion";
import { Target } from "lucide-react";

export default function AboutMisson() {
  return (
    <motion.div 
      className="bg-white p-8 sm:p-10 rounded-3xl shadow-xl border border-slate-100 relative overflow-hidden h-full"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <div className="absolute top-0 right-0 p-8 opacity-5">
        <Target size={120} />
      </div>
      <div className="w-14 h-14 bg-secondary/10 rounded-2xl flex items-center justify-center mb-6 text-secondary">
        <Target size={32} />
      </div>
      <h3 className="text-2xl md:text-3xl font-bold text-primary mb-4 font-sans tracking-tight">Our Mission</h3>
      <p className="text-slate-600 text-lg leading-relaxed relative z-10">
        At Usthi Hospital, our mission is to deliver comprehensive, high-quality, and affordable healthcare services to our community. We are dedicated to improving the health and well-being of our patients by blending advanced medical technology with compassionate, patient-centered care.
      </p>
    </motion.div>
  );
}