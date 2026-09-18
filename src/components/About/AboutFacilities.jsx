import { motion } from "framer-motion";
import { Shield, Clock, HeartPulse, Stethoscope, Award, Microscope } from "lucide-react";

const features = [
  {
    icon: <Shield className="w-8 h-8" />,
    title: "Uncompromised Safety",
    description: "We follow the highest international standards for patient safety and infection control."
  },
  {
    icon: <Clock className="w-8 h-8" />,
    title: "24/7 Availability",
    description: "Our emergency services and critical care units are operational round the clock."
  },
  {
    icon: <HeartPulse className="w-8 h-8" />,
    title: "Advanced Technology",
    description: "Equipped with state-of-the-art diagnostic and surgical equipment."
  },
  {
    icon: <Stethoscope className="w-8 h-8" />,
    title: "Expert Specialists",
    description: "A multidisciplinary team of renowned doctors covering all major specialties."
  },
  {
    icon: <Award className="w-8 h-8" />,
    title: "Award Winning Care",
    description: "Recognized nationally for excellence in healthcare and patient satisfaction."
  },
  {
    icon: <Microscope className="w-8 h-8" />,
    title: "Modern Labs",
    description: "In-house fully automated laboratories ensuring accurate and rapid test results."
  }
];

const AboutFacilities = () => {
  return (
    <section className="bg-slate-50 py-20 md:py-24 mb-32 border-y border-slate-200/50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12 sm:mb-16">
          <span className="inline-block text-secondary font-bold text-xs sm:text-sm tracking-widest uppercase mb-3 sm:mb-4">Why Choose Us</span>
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4  tracking-tight">World-Class Healthcare <span className="text-secondary">Facilities</span></h2>
          <p className="text-slate-600 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed">We combine cutting-edge technology with compassionate care to provide the best possible outcomes for our patients.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {features.map((feature, index) => (
            <motion.div 
              key={index}
              className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-xl transition-shadow duration-300 group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-5 sm:mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                {feature.icon}
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-primary mb-2 sm:mb-3">{feature.title}</h3>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutFacilities;
