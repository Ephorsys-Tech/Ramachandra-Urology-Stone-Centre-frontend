import { motion } from "framer-motion";

const DepartmentHero = () => {
  return (
    <div className="w-full bg-background mb-12">
      {/* ── TOP HERO IMAGE BANNER ── */}
      <div 
        className="w-full h-[220px] md:h-[440px] bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url('https://res.cloudinary.com/drqb4p2a2/image/upload/q_auto/f_auto/v1780483508/close_up_of_medical_icons_or_a_signage_board_in_a_hospital_blelg8.png')` }}
      />

      {/* ── HEADER BOX ── */}
      <div className="max-w-7xl mx-auto px-6 mt-8">
        <motion.div 
          className="border-2 border-[#e2e8f0] rounded-2xl p-6 text-center shadow-[0_8px_30px_rgba(0,0,0,0.015)] bg-white max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#0b5c9e] tracking-tight font-sans">
            Centers of Excellence
          </h1>
          <p className="text-sm md:text-base font-black text-slate-800 mt-2 font-sans tracking-wide">
            Specialized Medical Departments at Usthi Hospital
          </p>
          <div className="w-16 h-0.5 bg-[#07a7a5] mx-auto my-3" />
          <p className="text-xs md:text-sm text-slate-650 leading-relaxed font-sans max-w-3xl mx-auto">
            Usthi Hospital houses dedicated, state-of-the-art departments equipped with modern technology and leading medical experts. We offer specialized diagnostics, advanced treatments, and customized patient recovery plans designed to ensure optimal care and healing across all major medical disciplines.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default DepartmentHero;
