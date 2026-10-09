import { motion } from "framer-motion";

const stats = [
  { value: "25+", label: "Years Experience" },
  { value: "150+", label: "Specialist Doctors" },
  { value: "50k+", label: "Happy Patients" },
  { value: "100%", label: "Patient Satisfaction" },
];

const AboutStats = () => {
  return (
    <section
      className="relative bg-fixed bg-cover bg-center bg-no-repeat border-y border-slate-200/10 py-5 mb-32"
      style={{ backgroundImage: `url('https://images.unsplash.com/photo-1516549655169-df83a0774514?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')` }}
    >
      <div className="absolute inset-0 bg-primary/85 mix-blend-multiply"></div>
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x-0 md:divide-x divide-white/10">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              className="text-center px-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <p className="text-4xl md:text-5xl font-medium text-white mb-2">{stat.value}</p>
              <p className="text-emerald-400 font-semibold tracking-wider uppercase text-sm">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutStats;
