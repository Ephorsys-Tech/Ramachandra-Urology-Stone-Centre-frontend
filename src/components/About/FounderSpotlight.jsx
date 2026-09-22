import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import { FaLinkedinIn } from "react-icons/fa";

const FounderSpotlight = () => {
  return (
    <section className="py-16 sm:py-24 bg-white border-b border-slate-200/80 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header Pill */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0FA8D6]/10 border border-[#0FA8D6]/30 text-[#024363] text-xs font-medium uppercase tracking-wider mb-3">
            <span>FOUNDER & SURGICAL DIRECTOR SPOTLIGHT</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-medium text-[#012442] tracking-tight leading-tight m-0">
            Visionary Leadership in Super-Specialty Urology
          </h2>
          <p className="text-slate-600 text-sm sm:text-base font-medium mt-3 leading-relaxed">
            Bringing AIIMS-standard surgical precision, advanced laser science, and compassionate clinical care directly to the people of Western Odisha.
          </p>
        </div>

        {/* Main Founder Card — Reference Image Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">

          {/* ── LEFT COLUMN: Founder Photo Card ── */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5"
          >
            <div className="relative">
              {/* Photo — no wrapper, clean rounded card */}
              <div className="rounded-[28px] overflow-hidden aspect-[4/5] bg-slate-200 relative shadow-lg">
                <img
                  src="https://res.cloudinary.com/drqb4p2a2/image/upload/v1787555588/1I5A4339_1_kx1liu.webp"
                  alt="Dr. Sanjay Kumar Mahapatra - Founder & Surgical Director"
                  className="w-full h-full object-cover object-top"
                />
                {/* Gradient overlay at bottom for LinkedIn bar */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0d1f2d]/60 via-transparent to-transparent pointer-events-none" />

                {/* Inline LinkedIn bar at bottom of image */}
                <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between px-4 py-3">
                  <span className="text-xs sm:text-sm text-white font-medium drop-shadow-sm">
                    Follow Dr. Mahapatra on LinkedIn
                  </span>
                  <a
                    href="https://www.linkedin.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-xl bg-[#0A66C2] hover:bg-[#004182] flex items-center justify-center text-white transition-colors shadow-md shrink-0"
                    aria-label="LinkedIn"
                  >
                    <FaLinkedinIn size={16} />
                  </a>
                </div>
              </div>
            </div>
          </motion.div>

          {/* ── RIGHT COLUMN: Founder Vision & Message ── */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="lg:col-span-7 flex flex-col justify-center"
          >
            {/* Header */}
            <div className="mb-6">
              <h3 className="text-2xl sm:text-3xl lg:text-[2.5rem] font-normal text-[#012442] tracking-tight leading-tight m-0">
                From Dr. Sanjay Kumar Mahapatra
              </h3>
              <p className="text-sm sm:text-base font-bold text-[#0FA8D6] mt-1 m-0 tracking-wide">
                Founder & Surgical Director
              </p>
            </div>

            {/* Quote Content Block */}
            <div className="relative">
              {/* Large watermark quote icon */}
              <Quote
                size={48}
                strokeWidth={2.5}
                className="text-[#0FA8D6]/30 mb-4"
              />

              {/* Greeting */}
              <p className="text-base sm:text-lg font-semibold text-[#024363] mb-4 italic">
                Dear Patients & Families,
              </p>

              {/* Message Paragraphs */}
              <div className="space-y-4 text-sm sm:text-[15px] text-slate-600 leading-relaxed font-medium">
                <p className="m-0">
                  At Ramachandra Urology & Stone Centre, we understand that each diagnosis, each surgery, each patient's journey is deeply personal — and profoundly life-changing. Our ambition has always been to bring world-class, super-specialty urological care in a warm, reassuring environment right here in Western Odisha.
                </p>
                <p className="m-0">
                  What sets us apart is not just our clinical strength, but our commitment to ethics, transparency, and trust. From complex kidney stone extractions to advanced prostate surgeries, from laser lithotripsy to reconstructive urology, our goal is simple: to treat each patient like family.
                </p>
                <p className="m-0">
                  You entrust us during some of the most vulnerable moments of your life — and we do not take that lightly. Thank you for your trust and faith in Ramachandra Urology & Stone Centre.
                </p>
                <p className="m-0 font-semibold text-[#012442]">
                  Together, we will nurture healthy beginnings and brighter futures.
                </p>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default FounderSpotlight;
