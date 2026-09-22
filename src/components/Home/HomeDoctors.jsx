import { useEffect, useState, memo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Share2, MapPin, Phone, ChevronLeft, ChevronRight, ArrowRight, Sparkles, Stethoscope, ShieldCheck, Calendar } from 'lucide-react';
import { openAppointmentModal } from '../../redux/features/patient/patientSlice';
import { fetchHomePageDoctors } from '../../redux/features/doctor/doctorThunk';
import toast from 'react-hot-toast';
import { getDoctorSlug } from '../../Helper/slugify';
import { HomeDoctorCardSkeleton } from '../common/Skeletons';

const HomeDoctors = memo(() => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { doctors = [], homeDoctors = [], loading = false } = useSelector((state) => state.doctor || {});
  const { settings } = useSelector((state) => state.setting || { settings: null });
  const emergencyPhone = settings?.emergencyPhone || "9937566625";

  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(3);

  useEffect(() => {
    dispatch(fetchHomePageDoctors());
  }, [dispatch]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setVisibleCount(1);
      } else if (window.innerWidth < 1024) {
        setVisibleCount(2);
      } else {
        setVisibleCount(3);
      }
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const fallbackDoctors = [
    {
      _id: "dr-sanjay-mahapatra",
      name: "Dr. Sanjay Kumar Mahapatra",
      degrees: "M.S. (Surgery), M.Ch. (Urology, AIIMS New Delhi)",
      specialization: "Consultant Senior Urologist, Andrologist & Endo-Lap Surgeon",
      department: { name: "Urology & Kidney Care" },
      image: "",
      /* TODO: confirm with client — registration number and years of experience */
    },
    {
      _id: "dr-sovan-hota",
      name: "Dr. Sovan Hota",
      degrees: "M.S., M.Ch. (Urology)",
      specialization: "Consultant Urologist",
      department: { name: "Urology & Endourology" },
      image: "",
      /* TODO: confirm with client — full degrees and registration number */
    },
    {
      _id: "dr-kiran-negi",
      name: "Dr. Kiran Negi",
      degrees: "M.S., D.N.B. / M.Ch. (Urology)",
      specialization: "Urologist",
      department: { name: "Urology" },
      image: "",
      /* TODO: confirm with client — full qualifications and registration number */
    },
  ];

  const displayDoctors =
    homeDoctors && homeDoctors.length > 0
      ? homeDoctors
      : doctors && doctors.length > 0
        ? doctors
        : fallbackDoctors;

  const handlePrev = () => {
    if (displayDoctors.length === 0) return;
    setCurrentIndex((prev) => (prev - 1 + displayDoctors.length) % displayDoctors.length);
  };

  const handleNext = () => {
    if (displayDoctors.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % displayDoctors.length);
  };

  const getVisibleDoctors = () => {
    if (displayDoctors.length === 0) return [];
    const items = [];
    for (let i = 0; i < Math.min(visibleCount, displayDoctors.length); i++) {
      items.push(displayDoctors[(currentIndex + i) % displayDoctors.length]);
    }
    return items;
  };

  const handleShare = (doctorName) => {
    navigator.clipboard.writeText(`${window.location.origin}/doctors/${getDoctorSlug(doctorName)}`);
    toast.success(`Link copied! Shared profile of ${doctorName}.`);
  };

  return (
    <section className="py-16 sm:py-24 bg-white relative overflow-hidden ">
      {/* Background soft ambient glows */}
      <div className="absolute top-1/4 left-10 w-96 h-96 bg-[#0FA8D6]/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-[#024363]/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
          <div className="max-w-xl">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#0FA8D6]/15 border border-[#0FA8D6]/30 text-[#024363] text-xs font-medium uppercase tracking-wider mb-3 shadow-2xs">
              
              Super-Specialist Clinical Faculty
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight text-[#012442] leading-tight">
              Experienced Urologists & Specialists
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm mt-2 leading-relaxed">
              Our surgical faculty brings decades of high-volume laser lithotripsy, laparoscopic, and kidney stone management expertise to Sambalpur.
            </p>
          </div>

          <div className="flex items-center gap-4 shrink-0 mt-4 lg:mt-0">
            <button
              onClick={() => navigate('/doctors')}
              className="bg-[#00B4EA] hover:from-[#00b4ea] hover:to-[#013550] text-white px-6 py-3 rounded-2xl text-xs sm:text-sm font-extrabold transition-all shadow-md hover:shadow-lg flex items-center gap-2 cursor-pointer border-none uppercase tracking-wider"
            >
              <span>View All Specialists</span> <ArrowRight size={15} />
            </button>
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrev}
                disabled={displayDoctors.length === 0}
                className="w-10 h-10 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:border-[#0FA8D6]/40 shadow-xs flex items-center justify-center transition cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                aria-label="Previous Doctor"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={handleNext}
                disabled={displayDoctors.length === 0}
                className="w-10 h-10 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:border-[#0FA8D6]/40 shadow-xs flex items-center justify-center transition cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                aria-label="Next Doctor"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Carousel Grid */}
        {loading || displayDoctors.length === 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, idx) => (
              <HomeDoctorCardSkeleton key={idx} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout" initial={false}>
              {getVisibleDoctors().map((doc, idx) => {
                const docImage = doc.photo || doc.image;
                const docSpecialization = doc.specialization || doc.specialty || doc.department?.name || "Urology Specialist";
                const hasValidImage = docImage && !docImage.includes('👨‍⚕️') && !docImage.includes('👩‍⚕️');

                return (
                  <motion.div
                    key={doc._id + "-" + idx}
                    initial={{ opacity: 0, x: 25 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -25 }}
                    transition={{ duration: 0.35, ease: "easeOut" }}
                    onClick={() => navigate(`/doctors/${getDoctorSlug(doc.name)}`)}
                    className="bg-white border border-slate-200/90 rounded-3xl overflow-hidden shadow-xs hover:shadow-xl hover:border-[#0FA8D6]/40 transition-all duration-300 flex flex-row h-[240px] w-full group relative cursor-pointer"
                  >
                    {/* Left Column (w-[44%]): Image & Book Appointment */}
                    <div className="w-[44%] flex flex-col h-full bg-slate-100 shrink-0 relative overflow-hidden">
                      <div className="flex-1 overflow-hidden relative">
                        {hasValidImage ? (
                          <img
                            src={docImage}
                            alt={doc.name}
                            loading="lazy"
                            decoding="async"
                            className="w-full h-full object-cover object-top group-hover:scale-[1.04] transition-transform duration-500"
                            draggable={false}
                          />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center select-none bg-slate-100 text-slate-400">
                            <Stethoscope size={36} className="text-[#024363]/40 mb-1" />
                            <span className="text-[10px] font-bold text-slate-400">Specialist</span>
                          </div>
                        )}
                      </div>
                      {/* Gradient Booking Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          dispatch(openAppointmentModal(doc.department?.name || "", doc.name));
                        }}
                        className="w-full py-2.5 bg-[#00B4EA] hover:from-[#00b4ea] hover:to-[#013550] text-white font-extrabold text-[11px] tracking-wider uppercase flex items-center justify-center gap-1 cursor-pointer transition-colors shrink-0 select-none border-none outline-none"
                      >
                        Book Visit ↗
                      </button>
                    </div>

                    {/* Right Column (w-[56%]): Details */}
                    <div className="w-[56%] p-4 flex flex-col justify-between h-full bg-white relative text-left">
                      <div className="flex-1 min-w-0">
                        {/* Name, Specialty & Share */}
                        <div className="flex justify-between items-start gap-1">
                          <div className="min-w-0 flex-1">
                            <h3 className="text-sm font-medium text-[#012442] truncate group-hover:text-[#0FA8D6] transition-colors leading-snug">
                              {doc.name.startsWith("Dr") || doc.name.startsWith("Ms") ? doc.name : `Dr. ${doc.name}`}
                            </h3>
                            <span className="text-[10.5px] text-[#024363] font-bold block mt-0.5 tracking-wide truncate">
                              {docSpecialization}
                            </span>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleShare(doc.name);
                            }}
                            className="p-1 hover:bg-slate-100 rounded-full transition-colors cursor-pointer border-none bg-transparent"
                            title="Share Profile"
                          >
                            <Share2 className="w-3.5 h-3.5 text-slate-400 hover:text-[#0FA8D6] transition-colors shrink-0" />
                          </button>
                        </div>

                        {/* Qualification/Degree */}
                        <div className="mt-2 text-[11px] font-bold text-slate-600 leading-snug line-clamp-2">
                          {doc.experience ? `${doc.experience} Yrs Exp • ` : ""} {doc.degrees || doc.qualification || "Senior Consultant"}
                        </div>

                        {/* Location Pin */}
                        <div className="mt-2.5 flex items-center gap-1 text-[10.5px] text-slate-500">
                          <MapPin className="w-3 h-3 text-[#0FA8D6] shrink-0" />
                          <span className="truncate leading-tight">Sourav Vihar, Burla</span>
                        </div>
                      </div>

                      {/* Call Now Button */}
                      <a
                        href={`tel:${emergencyPhone}`}
                        onClick={(e) => e.stopPropagation()}
                        className="w-full py-2 bg-slate-50 border border-slate-200 hover:bg-[#0FA8D6]/10 hover:border-[#0FA8D6]/40 text-[#012442] font-extrabold text-[11px] rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer no-underline shrink-0"
                      >
                        <Phone className="w-3 h-3 text-[#0FA8D6]" /> Call OPD Desk
                      </a>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </section >
  );
});

HomeDoctors.displayName = "HomeDoctors";
export default HomeDoctors;