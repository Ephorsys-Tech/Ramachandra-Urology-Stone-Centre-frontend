import { motion } from "framer-motion";
import { Eye } from "lucide-react";

export default function AboutVission() {
  return (
    <motion.div 
      className="bg-gradient-to-br from-primary to-blue-900 p-8 sm:p-10 rounded-3xl shadow-xl relative overflow-hidden text-white h-full"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div className="absolute top-0 right-0 p-8 opacity-10">
        <Eye size={120} />
      </div>
      <div className="w-14 h-14 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-6 text-blue-200">
        <Eye size={32} />
      </div>
      <h3 className="text-2xl md:text-3xl font-bold mb-4 font-sans tracking-tight">Our Vision</h3>
      <p className="text-blue-100 text-lg leading-relaxed relative z-10">
        Our vision at Ramachandra Urology & Stone Centre is to be the premier urological and kidney care centre recognized for clinical excellence, advanced laser surgical innovations, and unwavering commitment to the community.
      </p>
    </motion.div>
  );
}