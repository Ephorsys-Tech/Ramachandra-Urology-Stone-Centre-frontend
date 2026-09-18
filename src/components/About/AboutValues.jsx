import { motion } from "framer-motion";
import { Shield, Award, Users, HeartPulse } from "lucide-react";

const values = [
  { icon: Shield, title: "Excellence in Care", desc: "We adhere to the highest standards of medical practice." },
  { icon: HeartPulse, title: "Compassion", desc: "Every patient is treated with dignity, respect, and empathy." },
  { icon: Users, title: "Collaboration", desc: "Our specialists work as a team to provide holistic treatment." },
  { icon: Award, title: "Innovation", desc: "We continually invest in the latest medical technology." },
];

const AboutValues = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 mb-32">
      <div className="text-center mb-16">
        <span className="inline-block text-secondary font-bold text-sm tracking-widest uppercase mb-4">
          Core Principles
        </span>
        <h2 className="text-3xl md:text-4xl font-bold text-primary  tracking-tight">Our <span className="text-secondary">Values</span></h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {values.map((val, i) => (
          <motion.div 
            key={i}
            className="bg-white border border-slate-200 rounded-2xl p-8 hover:shadow-md transition-all duration-300 group"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
          >
            <div className="w-14 h-14 rounded-xl bg-secondary/10 flex items-center justify-center mb-6 group-hover:scale-105 transition-transform duration-300">
              <val.icon className="w-7 h-7 text-secondary" />
            </div>
            <h3 className="text-xl font-bold text-primary mb-3">{val.title}</h3>
            <p className="text-slate-500 leading-relaxed text-sm">{val.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default AboutValues;
