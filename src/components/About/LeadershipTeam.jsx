import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ShieldCheck, Stethoscope, GraduationCap, Clock, Calendar, ArrowRight, Sparkles, Award } from "lucide-react";
import { useDispatch } from "react-redux";
import { openAppointmentModal } from "../../redux/features/patient/patientSlice";

const LeadershipTeam = () => {
  const dispatch = useDispatch();

  const leaders = [
    {
      name: "Dr. Sanjay Kumar Mahapatra",
      title: "Founder & Chief Medical Director",
      qualifications: "M.S. (Surgery), M.Ch (Urology, AIIMS, New Delhi)",
      designation: "Consultant Urologist, Andrologist & Advanced Endo-Lap Surgeon",
      specialty: "AIIMS Alumnus & Surgical Director",
      experience: "20+ Years Experience",
      timing: "Mon – Sat: 10:00 AM – 4:00 PM",
      image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=800&q=80",
      featured: true,
    },
    {
      name: "Dr. Sovan Hota",
      title: "Senior Consultant Urologist",
      qualifications: "M.S. (Surgery), M.Ch (Urology)",
      designation: "Specialist in Laser Stone Care, RIRS & Endourology",
      specialty: "Endourology & Lithotripsy Specialist",
      experience: "14+ Years Experience",
      timing: "Mon – Sat: 9:00 AM – 2:00 PM",
      image: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=800&q=80",
      featured: false,
    },
    {
      name: "Dr. Kiran Negi",
      title: "Specialist Consultant Urologist",
      qualifications: "M.S. (Gen Surgery), M.Ch (Urology)",
      designation: "Specialist in 3D Laparoscopy & Reconstructive Urology",
      specialty: "Laparoscopy & Reconstructive Surgery",
      experience: "12+ Years Experience",
      timing: "Mon – Sat: 2:00 PM – 7:00 PM",
      image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=800&q=80",
      featured: false,
    },
  ];

  return (
    <section className="py-16 sm:py-24 bg-[#f8fafc] border-b border-slate-200/80  ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-14">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0FA8D6]/10 border border-[#0FA8D6]/30 text-[#024363] text-xs font-medium uppercase tracking-wider mb-3">

              <span>CLINICAL & SURGICAL FACULTY</span>
            </div>
            <h2 className="text-2xl sm:text-4xl lg:text-4xl font-medium text-[#012442] tracking-tight leading-tight m-0">
              Our Medical Leadership Team
            </h2>
            <p className="text-slate-600 text-sm sm:text-base font-medium mt-3 leading-relaxed max-w-2xl">
              Distinguished surgeons and clinical consultants dedicated to international treatment protocols, ethical practices, and rapid recovery.
            </p>
          </div>

          <Link
            to="/doctors"
            className="px-5 py-3 rounded-2xl bg-white border border-[#0FA8D6]/30 hover:border-[#0FA8D6] text-[#012442] hover:text-[#024363] font-bold text-xs uppercase tracking-wider transition-all shadow-xs hover:shadow-md no-underline flex items-center gap-2 shrink-0"
          >
            <span>Explore All Specialists</span>
            <ArrowRight size={14} className="text-[#0FA8D6]" />
          </Link>
        </div>

        {/* Leadership Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {leaders.map((doc, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              className={`bg-white rounded-3xl overflow-hidden border transition-all duration-300 flex flex-col justify-between group shadow-sm hover:shadow-xl ${doc.featured
                ? "border-[#0FA8D6] ring-2 ring-[#0FA8D6]/20"
                : "border-slate-200/90 hover:border-[#0FA8D6]/80"
                }`}
            >
              <div>
                {/* Doctor Photo Banner */}
                <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden">
                  <img
                    src={doc.image}
                    alt={`${doc.name} - ${doc.title}`}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#012442]/80 via-transparent to-transparent opacity-80" />

                </div>

                {/* Details Content */}
                <div className="p-6 space-y-3">
                  <div>
                    <h3 className="text-xl font-medium text-[#012442] group-hover:text-[#024363] transition-colors tracking-tight line-clamp-1">
                      {doc.name}
                    </h3>
                    <p className="text-xs font-bold text-[#024363] mt-0.5">
                      {doc.title}
                    </p>
                  </div>

                  <div className="space-y-1.5 pt-1 text-xs text-slate-600">
                    <div className="flex items-start gap-2">
                      <GraduationCap size={15} className="text-[#0FA8D6] shrink-0 mt-0.5" />
                      <span className="text-slate-700 font-semibold line-clamp-1">
                        {doc.qualifications}
                      </span>
                    </div>

                    <div className="flex items-start gap-2">
                      <Stethoscope size={14} className="text-[#0FA8D6] shrink-0 mt-0.5" />
                      <span className="text-slate-600 font-medium line-clamp-2">
                        {doc.designation}
                      </span>
                    </div>

                    <div className="flex items-start gap-2 pt-1 border-t border-slate-100">
                      <Clock size={14} className="text-[#0FA8D6] shrink-0 mt-0.5" />
                      <span className="text-slate-600 font-medium">
                        {doc.timing}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="p-6 pt-0">
                <button
                  onClick={() => dispatch(openAppointmentModal("Urology", doc.name))}
                  className="w-full py-2.5 bg-[#00B4EA] hover:from-[#00b4ea] hover:to-[#013550] text-white font-extrabold text-xs rounded-xl shadow-xs transition-all cursor-pointer border-none flex items-center justify-center gap-2 uppercase tracking-wider"
                >
                  <Calendar size={13} />
                  <span>Book Consultation</span>
                </button>
              </div>

            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default LeadershipTeam;
