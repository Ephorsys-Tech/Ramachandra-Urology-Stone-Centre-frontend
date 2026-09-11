import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

const AboutStory = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 mb-20 md:mb-32">
      <div className="flex flex-col lg:flex-row gap-10 md:gap-16 items-center">
        <motion.div 
          className="w-full lg:w-1/2 relative"
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="relative rounded-2xl md:rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
            <img 
              src="https://res.cloudinary.com/drqb4p2a2/image/upload/v1783148317/PXL_20260701_144557189.jpg_i7iqlz.jpg" 
              alt="Hospital Building" 
              className="w-full h-[300px] sm:h-[400px] lg:h-[500px] object-cover"
            />
            <div className="absolute inset-0 bg-blue-900/20 mix-blend-multiply"></div>
          </div>
          {/* Experience Box */}
          <div className="absolute bottom-4 right-4 sm:-bottom-8 sm:-right-8 bg-gradient-to-br from-secondary to-blue-600 p-4 sm:p-8 rounded-xl sm:rounded-2xl border border-blue-400/30 shadow-[0_10px_30px_rgba(37,99,235,0.25)]">
            <p className="text-3xl sm:text-5xl font-black text-white mb-0 sm:mb-1">25<span className="text-blue-200">+</span></p>
            <p className="text-white font-medium text-xs sm:text-base">Years of Trust</p>
          </div>
        </motion.div>

        <motion.div 
          className="w-full lg:w-1/2 mt-6 lg:mt-0"
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <span className="inline-block text-secondary font-bold text-xs sm:text-sm tracking-widest uppercase mb-3 sm:mb-4">
            Our Story
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary mb-4 sm:mb-6 leading-tight font-sans tracking-tight">
            A Journey of Compassion and Healing Since 1999
          </h2>
          <div className="space-y-4 sm:space-y-6 text-slate-650 text-base sm:text-lg leading-relaxed mb-6 sm:mb-8">
            <p>
              Ramachandra Urology & Stone Centre was established with a dedicated mission: to bring world-class super-specialty urological care, advanced laser kidney stone management, and minimally invasive surgeries to Sambalpur and Western Odisha.
            </p>
            <p>
              We believe that true healing happens when advanced medical technology meets genuine human compassion. Our dedicated team of specialists works tirelessly to ensure every patient receives personalized care.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {[
              "Modern Infrastructure", 
              "Advanced Technology", 
              "Experienced Specialists", 
              "24/7 Emergency Care"
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2 sm:gap-3">
                <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-tertiary flex-shrink-0" />
                <span className="text-primary font-medium text-sm sm:text-base">{item}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutStory;
