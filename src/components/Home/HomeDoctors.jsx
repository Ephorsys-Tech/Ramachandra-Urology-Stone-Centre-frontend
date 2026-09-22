import { useEffect, useState, memo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Share2,
  MapPin,
  Phone,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Sparkles,
  Stethoscope,
  Calendar,
  Clock,
  Award,
  CheckCircle2,
} from 'lucide-react';
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

  const displayDoctors =
    homeDoctors && homeDoctors.length > 0
      ? homeDoctors
      : doctors && doctors.length > 0
        ? doctors
        : [];

  const maxIndex = Math.max(0, displayDoctors.length - visibleCount);

  const handlePrev = () => {
    if (displayDoctors.length === 0) return;
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : Math.max(0, displayDoctors.length - visibleCount)));
  };

  const handleNext = () => {
    if (displayDoctors.length === 0) return;
    setCurrentIndex((prev) => (prev < displayDoctors.length - visibleCount ? prev + 1 : 0));
  };

  const getVisibleDoctors = () => {
    if (displayDoctors.length === 0) return [];
    if (displayDoctors.length <= visibleCount) return displayDoctors;
    const items = [];
    for (let i = 0; i < visibleCount; i++) {
      items.push(displayDoctors[(currentIndex + i) % displayDoctors.length]);
    }
    return items;
  };

  const handleShare = (e, doctorName) => {
    e.stopPropagation();
    navigator.clipboard.writeText(`${window.location.origin}/doctors/${getDoctorSlug(doctorName)}`);
    toast.success(`Profile link of ${doctorName} copied!`);
  };

  if (!loading && displayDoctors.length === 0) {
    return null;
  }

  return (
    <section className="py-16 sm:py-24 bg-gradient-to-b from-white via-slate-50/50 to-white relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-[#00B4EA]/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-10 w-96 h-96 bg-sky-100/30 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* ── Section Header ── */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
          <div className="max-w-2xl text-left">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#0FA8D6]/15 border border-[#0FA8D6]/30 text-[#024363] text-xs font-medium uppercase tracking-wider mb-3 shadow-2xs">

              SUPER-SPECIALIST CLINICAL FACULTY
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-4xl font-medium text-[#012442] ">
              Experienced Urologists & Specialists
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm mt-3 leading-relaxed max-w-xl">
              Our surgical faculty brings decades of high-volume laser lithotripsy, laparoscopic, and kidney stone management expertise to Sambalpur.
            </p>
          </div>

          {/* Actions & Carousel Navigation */}
          <div className="flex items-center gap-3 shrink-0 self-start lg:self-end">
            <button
              onClick={() => navigate('/doctors')}
              className="bg-[#00B4EA] hover:bg-[#0096c4] text-white px-5 py-3 rounded-2xl text-xs font-bold transition-all shadow-md shadow-[#00B4EA]/20 hover:shadow-lg flex items-center gap-2 cursor-pointer border-none uppercase tracking-wider"
            >
              <span>View All Specialists</span>
              <ArrowRight size={14} />
            </button>

            {displayDoctors.length > visibleCount && (
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrev}
                  className="w-11 h-11 rounded-2xl border border-slate-200/90 bg-white text-slate-700 hover:bg-slate-50 hover:border-[#00B4EA] hover:text-[#00B4EA] shadow-xs flex items-center justify-center transition-all cursor-pointer active:scale-95"
                  aria-label="Previous Doctor"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  onClick={handleNext}
                  className="w-11 h-11 rounded-2xl border border-slate-200/90 bg-white text-slate-700 hover:bg-slate-50 hover:border-[#00B4EA] hover:text-[#00B4EA] shadow-xs flex items-center justify-center transition-all cursor-pointer active:scale-95"
                  aria-label="Next Doctor"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ── CONTINUOUS SILKY-SMOOTH DOCTORS SLIDING TRACK ── */}
        {loading && displayDoctors.length === 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, idx) => (
              <HomeDoctorCardSkeleton key={idx} />
            ))}
          </div>
        ) : (
          <div className="overflow-hidden -mx-3 py-2">
            <motion.div
              className="flex"
              animate={{
                x: `-${currentIndex * (100 / visibleCount)}%`,
              }}
              transition={{
                duration: 0.5,
                ease: [0.25, 1, 0.5, 1],
              }}
            >
              {displayDoctors.map((doc, idx) => {
                const docImage = doc.photo || doc.image;
                const docSpecialization = doc.specialization || doc.specialty || doc.department?.name || "Urology Specialist";
                const hasValidImage = docImage && !docImage.includes('👨‍⚕️') && !docImage.includes('👩‍⚕️');
                const doctorSlug = getDoctorSlug(doc.name);
                const doctorDisplayName = doc.name.startsWith("Dr") || doc.name.startsWith("Ms") ? doc.name : `Dr. ${doc.name}`;

                // Extract expertise items if present
                const expertiseList = Array.isArray(doc.expertise)
                  ? doc.expertise.filter(Boolean).slice(0, 3)
                  : [];

                return (
                  <div
                    key={doc._id || idx}
                    style={{ width: `${100 / visibleCount}%` }}
                    className="shrink-0 px-3 flex flex-col"
                  >
                    <div
                      onClick={() => navigate(`/doctors/${doctorSlug}`)}
                      className="bg-white border border-slate-200/90 hover:border-[#00B4EA]/60 rounded-3xl overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.03)] hover:shadow-[0_16px_36px_rgba(0,180,234,0.12)] transition-all duration-300 flex flex-col justify-between group cursor-pointer text-left h-full"
                    >
                      <div>
                        {/* Top Header Row with Avatar & Badges */}
                        <div className="p-5 pb-3">
                          <div className="flex items-start gap-4">
                            {/* Doctor Avatar */}
                            <div className="relative w-20 h-24 sm:w-24 sm:h-28 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200/80 shrink-0 shadow-inner group-hover:border-[#00B4EA]/40 transition-colors">
                              {hasValidImage ? (
                                <img
                                  src={docImage}
                                  alt={doctorDisplayName}
                                  loading="lazy"
                                  decoding="async"
                                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                                  draggable={false}
                                />
                              ) : (
                                <div className="w-full h-full flex flex-col items-center justify-center bg-slate-100 text-slate-400">
                                  <Stethoscope size={32} className="text-[#00B4EA]/50 mb-1" />
                                  <span className="text-[9px] font-bold text-slate-400 uppercase">Specialist</span>
                                </div>
                              )}

                              {/* Live status dot */}
                              <div className="absolute bottom-1.5 left-1.5">
                                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white block shadow-xs" />
                              </div>
                            </div>

                            {/* Info Column */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-1">
                                <div className="min-w-0 flex-1">
                                  <span className="inline-block px-2.5 py-0.5 rounded-md bg-sky-50 text-[#00B4EA] text-[10.5px] font-bold tracking-wide uppercase border border-sky-100/80 mb-1">
                                    {docSpecialization}
                                  </span>
                                  <h3 className="text-base font-bold text-[#012442] truncate group-hover:text-[#00B4EA] transition-colors leading-snug">
                                    {doctorDisplayName}
                                  </h3>
                                </div>

                                <button
                                  onClick={(e) => handleShare(e, doc.name)}
                                  className="p-1.5 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer border-none bg-transparent text-slate-400 hover:text-[#00B4EA] shrink-0"
                                  title="Share Profile"
                                >
                                  <Share2 size={14} />
                                </button>
                              </div>

                              {/* Qualifications & Experience */}
                              <p className="text-[11.5px] font-semibold text-slate-600 mt-1 truncate">
                                {doc.qualifications || doc.degrees || "Senior Consultant Surgeon"}
                              </p>

                              <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-medium mt-1">
                                <Award size={12} className="text-[#00B4EA] shrink-0" />
                                <span>{doc.experience ? `${doc.experience}+ Yrs Clinical Experience` : "Senior Consultant"}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Expertise / Clinical highlights pill row */}
                        {expertiseList.length > 0 && (
                          <div className="px-5 pt-1 pb-2">
                            <div className="flex flex-wrap gap-1.5">
                              {expertiseList.map((exp, i) => (
                                <span
                                  key={i}
                                  className="inline-flex items-center gap-1 text-[10px] font-medium bg-slate-50 hover:bg-sky-50 text-slate-700 hover:text-[#00B4EA] px-2 py-0.5 rounded-lg border border-slate-200/70 transition-colors"
                                >
                                  <CheckCircle2 size={10} className="text-[#00B4EA]" />
                                  <span className="truncate max-w-[140px]">{exp}</span>
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Location & Timings Details Strip */}
                        <div className="px-5 py-2.5 mt-1 border-t border-slate-100/80 grid grid-cols-2 gap-2 text-[11px] text-slate-500">
                          <div className="flex items-center gap-1.5 truncate">
                            <MapPin size={12} className="text-[#00B4EA] shrink-0" />
                            <span className="truncate">Sourav Vihar, Burla</span>
                          </div>
                          <div className="flex items-center gap-1.5 truncate">
                            <Clock size={12} className="text-[#00B4EA] shrink-0" />
                            <span className="truncate">{doc.timing || "OPD: 10 AM - 2 PM"}</span>
                          </div>
                        </div>
                      </div>

                      {/* Footer Actions */}
                      <div className="p-4 pt-3 bg-slate-50/70 border-t border-slate-100 grid grid-cols-2 gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            dispatch(openAppointmentModal(doc.department?.name || "", doc.name));
                          }}
                          className="py-2.5 px-3 bg-[#00B4EA] hover:bg-[#0096c4] text-white font-bold text-[11px] tracking-wider uppercase rounded-xl flex items-center justify-center gap-1.5 cursor-pointer transition-all shadow-xs border-none outline-none group/btn"
                        >
                          <Calendar size={12} />
                          <span>Book Visit ↗</span>
                        </button>

                        <a
                          href={`tel:${doc.phone || emergencyPhone}`}
                          onClick={(e) => e.stopPropagation()}
                          className="py-2.5 px-3 bg-white hover:bg-slate-100 border border-slate-200 hover:border-slate-300 text-slate-700 font-bold text-[11px] rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer no-underline text-center shadow-2xs"
                        >
                          <Phone size={12} className="text-[#00B4EA]" />
                          <span>Call OPD Desk</span>
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}
            </motion.div>
          </div>
        )}

        {/* Carousel Pagination dots */}
        {displayDoctors.length > visibleCount && (
          <div className="flex justify-center items-center gap-1.5 mt-8">
            {Array.from({ length: displayDoctors.length - visibleCount + 1 }).map((_, dotIdx) => (
              <button
                key={dotIdx}
                onClick={() => setCurrentIndex(dotIdx)}
                className={`h-2 rounded-full transition-all cursor-pointer border-none ${currentIndex === dotIdx
                    ? 'w-7 bg-[#00B4EA]'
                    : 'w-2 bg-slate-300 hover:bg-slate-400'
                  }`}
                aria-label={`Go to slide ${dotIdx + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
});

HomeDoctors.displayName = "HomeDoctors";
export default HomeDoctors;