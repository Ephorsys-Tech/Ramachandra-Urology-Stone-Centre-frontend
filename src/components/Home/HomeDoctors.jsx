import { useEffect, useState, memo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Share2, MapPin, Phone, ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { openAppointmentModal } from '../../redux/features/patient/patientSlice';
import { fetchHomePageDoctors } from '../../redux/features/doctor/doctorThunk';
import toast from 'react-hot-toast';
import { getDoctorSlug } from '../../Helper/slugify';
import { HomeDoctorCardSkeleton } from '../common/Skeletons';

const HomeDoctors = memo(() => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { doctors = [], homeDoctors = [], loading } = useSelector((state) => state.doctor || {});

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

  const displayDoctors =
    homeDoctors && homeDoctors.length > 0
      ? homeDoctors
      : doctors && doctors.length > 0
      ? doctors
      : [];

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
    <section className="py-24 bg-background text-on-background relative overflow-hidden">
      {/* Background soft gradients */}
      <div className="absolute top-1/4 left-10 w-96 h-96 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-secondary/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-14">
          <div className="max-w-xl">
            <h2 className="text-4xl md:text-5xl font-sans tracking-tight text-primary leading-tight">
              <span className="font-light block">Care Led By Experts</span>
              <span className="font-extrabold italic block mt-1">Driven By Compassion</span>
            </h2>
          </div>
          <div className="max-w-md lg:-ml-8">
            <p className="text-on-surface-variant text-sm md:text-base leading-relaxed">
              At Usthi Hospital, our world-class doctors combine deep expertise with compassion to deliver exceptional patient care and outcomes.
            </p>
          </div>
          <div className="flex items-center gap-4 shrink-0 mt-4 lg:mt-0">
            <button
              onClick={() => navigate('/doctors')}
              className="bg-primary hover:bg-primary/90 text-white px-8 py-3.5 rounded-full text-sm font-bold transition-all shadow-md hover:shadow-lg flex items-center gap-2 cursor-pointer border-none"
            >
              View All <ArrowRight size={16} />
            </button>
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrev}
                disabled={displayDoctors.length === 0}
                className="w-11 h-11 rounded-full border border-outline-variant/50 bg-white text-on-surface hover:bg-slate-50 shadow-sm flex items-center justify-center transition cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                aria-label="Previous Doctor"
              >
                <ChevronLeft size={20} className="text-slate-650" />
              </button>
              <button
                onClick={handleNext}
                disabled={displayDoctors.length === 0}
                className="w-11 h-11 rounded-full border border-outline-variant/50 bg-white text-on-surface hover:bg-slate-50 shadow-sm flex items-center justify-center transition cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                aria-label="Next Doctor"
              >
                <ChevronRight size={20} className="text-slate-655" />
              </button>
            </div>
          </div>
        </div>

        {/* Carousel Grid */}
        {loading || displayDoctors.length === 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 3 }).map((_, idx) => (
              <HomeDoctorCardSkeleton key={idx} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence mode="popLayout" initial={false}>
              {getVisibleDoctors().map((doc, idx) => {
                const docImage = doc.photo || doc.image;
                const docSpecialization = doc.specialization || doc.specialty || doc.department?.name || "Specialist";
                const hasValidImage = docImage && !docImage.includes('👨‍⚕️') && !docImage.includes('👩‍⚕️');

                return (
                  <motion.div
                    key={doc._id + "-" + idx}
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    transition={{ duration: 0.35, ease: "easeOut" }}
                    onClick={() => navigate(`/doctors/${getDoctorSlug(doc.name)}`)}
                    className="bg-white border border-outline-variant/40 rounded-2xl overflow-hidden shadow-sm hover:shadow-[0_12px_36px_rgba(0,0,0,0.06)] transition-all duration-300 flex flex-row h-[235px] w-full group relative cursor-pointer"
                  >
                    {/* Left Column (w-[44%]): Image & Book Appointment */}
                    <div className="w-[44%] flex flex-col h-full bg-surface-container-low shrink-0 relative overflow-hidden">
                      <div className="flex-1 overflow-hidden relative">
                        {hasValidImage ? (
                          <img
                            src={docImage}
                            alt={doc.name}
                            loading="lazy"
                            decoding="async"
                            className="w-full h-full object-cover object-top group-hover:scale-[1.03] transition-transform duration-500"
                            draggable={false}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-7xl select-none bg-surface-container">
                            👨‍⚕️
                          </div>
                        )}
                      </div>
                      {/* Yellow Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          dispatch(openAppointmentModal());
                        }}
                        className="w-full py-3 bg-[#eeb024] hover:bg-[#d89e1b] text-[#002e3b] font-extrabold text-[12px] tracking-wider flex items-center justify-center gap-1 cursor-pointer transition-colors shrink-0 select-none border-none outline-none"
                      >
                        Book Appointment <span className="font-bold text-[14px]">&#8599;</span>
                      </button>
                    </div>

                    {/* Right Column (w-[56%]): Details */}
                    <div className="w-[56%] p-4 flex flex-col justify-between h-full bg-white relative text-left">
                      <div className="flex-1 min-w-0">
                        {/* Name, Specialty & Share */}
                        <div className="flex justify-between items-start gap-1">
                          <div className="min-w-0 flex-1">
                            <h3 className="text-[15px] font-bold text-slate-800 truncate group-hover:text-primary transition-colors leading-snug">
                              {doc.name.startsWith("Dr") || doc.name.startsWith("Ms") ? doc.name : `Dr. ${doc.name}`}
                            </h3>
                            <span className="text-[11px] text-slate-500 font-semibold block mt-0.5 tracking-wide">
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
                            <Share2 className="w-3.5 h-3.5 text-slate-400 hover:text-primary transition-colors shrink-0" />
                          </button>
                        </div>

                        {/* Qualification/Degree */}
                        <div className="mt-2.5 text-xs font-bold text-primary-container leading-snug line-clamp-3">
                          {doc.experience ? `${doc.experience} Years Experience • ` : ""} {doc.degrees || doc.qualification || ""}
                        </div>

                        {/* Location Pin */}
                        <div className="mt-3 flex items-start gap-1 text-[11px] text-slate-500">
                          <MapPin className="w-3.5 h-3.5 text-secondary shrink-0 mt-0.5" />
                          <span className="truncate leading-tight">Usthi Hospitals, Bhubaneswar</span>
                        </div>
                      </div>

                      {/* Call Now Button */}
                      <a
                        href="tel:+919090963722"
                        onClick={(e) => e.stopPropagation()}
                        className="w-full py-2 bg-white border border-[#436182] hover:bg-[#436182]/5 text-[#436182] font-bold text-[12px] rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer no-underline shrink-0"
                      >
                        <Phone className="w-3.5 h-3.5 text-[#436182]" /> Call Now
                      </a>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </section>
  );
});

export default HomeDoctors;