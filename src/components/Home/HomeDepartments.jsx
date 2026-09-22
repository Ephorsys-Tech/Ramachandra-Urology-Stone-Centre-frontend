import { useEffect, useState, memo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchAllFeatures } from '../../redux/features/feature/featureThunk';
import { fetchAllDepartments } from '../../redux/features/department/departmentThunk';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Sparkles,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
} from "lucide-react";
import { getDepartmentIcon } from '../../Helper/departmentIcon';
import { DepartmentCardSkeleton } from '../common/Skeletons';
import { openAppointmentModal } from '../../redux/features/patient/patientSlice';

const HomeDepartments = memo(() => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { features = [], loading: featuresLoading } = useSelector(
    (state) => state.feature || { features: [], loading: false }
  );
  const { departments = [], loading: deptLoading } = useSelector(
    (state) => state.department || { departments: [], loading: false }
  );

  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(4);

  useEffect(() => {
    dispatch(fetchAllFeatures());
    dispatch(fetchAllDepartments());
  }, [dispatch]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setVisibleCount(1);
      } else if (window.innerWidth < 1024) {
        setVisibleCount(2);
      } else if (window.innerWidth < 1280) {
        setVisibleCount(3);
      } else {
        setVisibleCount(4);
      }
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const loading = featuresLoading || deptLoading;

  // Prioritize active features (subdepartments / clinical care wings).
  const displayItems =
    features && features.length > 0
      ? features.filter((f) => f.isActive !== false)
      : departments && departments.length > 0
      ? departments
      : [];

  const maxIndex = Math.max(0, displayItems.length - visibleCount);

  const handlePrev = () => {
    if (displayItems.length === 0) return;
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : maxIndex));
  };

  const handleNext = () => {
    if (displayItems.length === 0) return;
    setCurrentIndex((prev) => (prev < maxIndex ? prev + 1 : 0));
  };

  if (!loading && displayItems.length === 0) {
    return null;
  }

  const totalWings = displayItems.length || 4;

  return (
    <section className="py-16 sm:py-24 bg-gradient-to-b from-slate-50/80 via-white to-slate-50/60 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-[#00B4EA]/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-0 w-96 h-96 bg-sky-100/40 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* ── HEADER SECTION ── */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="max-w-2xl text-left">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#0FA8D6]/15 border border-[#0FA8D6]/30 text-[#024363] text-xs font-medium uppercase tracking-wider mb-3 shadow-2xs">
              SUPER-SPECIALTY CLINICAL WINGS
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl  text-[#012442]">
              Specialized Urology Treatments
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm mt-3 leading-relaxed max-w-xl">
              From high-power laser stone surgeries to advanced laparoscopic interventions and pediatric urology, our specialized wings provide gold-standard healthcare in Sambalpur.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0 self-start md:self-end">
            <Link
              to="/urology-services"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-[#00B4EA] hover:bg-[#0096c4] text-white text-xs font-bold transition-all group no-underline shadow-md shadow-[#00B4EA]/20 uppercase tracking-wider"
            >
              <span>View All {totalWings}+ Wings</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            {displayItems.length > visibleCount && (
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrev}
                  className="w-11 h-11 rounded-2xl border border-slate-200/90 bg-white text-slate-700 hover:bg-slate-50 hover:border-[#00B4EA] hover:text-[#00B4EA] shadow-xs flex items-center justify-center transition-all cursor-pointer active:scale-95"
                  aria-label="Previous Specialty"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  onClick={handleNext}
                  className="w-11 h-11 rounded-2xl border border-slate-200/90 bg-white text-slate-700 hover:bg-slate-50 hover:border-[#00B4EA] hover:text-[#00B4EA] shadow-xs flex items-center justify-center transition-all cursor-pointer active:scale-95"
                  aria-label="Next Specialty"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ── CONTINUOUS SILKY-SMOOTH SLIDING TRACK CAROUSEL ── */}
        {loading && displayItems.length === 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, idx) => (
              <DepartmentCardSkeleton key={idx} />
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
              {displayItems.map((item, idx) => {
                const pageLink = item.slug ? `/${item.slug}` : `/urology-services/${item._id}`;
                const itemName = item.name || "Clinical Specialty";
                const itemDesc =
                  item.description ||
                  "Advanced urological evaluation, modern laser interventions, and comprehensive OPD care.";

                return (
                  <div
                    key={item._id || idx}
                    style={{ width: `${100 / visibleCount}%` }}
                    className="shrink-0 px-3 flex flex-col"
                  >
                    <div
                      onClick={() => navigate(pageLink)}
                      className="bg-white border border-slate-200/90 hover:border-[#00B4EA]/60 rounded-3xl p-6 sm:p-7 hover:-translate-y-1.5 shadow-[0_4px_24px_rgba(0,0,0,0.03)] hover:shadow-[0_16px_36px_rgba(0,180,234,0.12)] transition-all duration-300 group cursor-pointer flex flex-col justify-between h-full min-h-[300px] text-center"
                    >
                      <div className="flex flex-col items-center w-full">
                        {/* Centered Medical Icon Box at Top */}
                        <div className="w-14 h-14 rounded-2xl bg-sky-50 border border-sky-100 group-hover:border-[#00B4EA] group-hover:bg-[#00B4EA] text-[#00B4EA] group-hover:text-white flex items-center justify-center transition-all duration-300 shadow-2xs text-2xl mb-4">
                          {getDepartmentIcon(itemName, { size: 26 })}
                        </div>

                        {/* Subdepartment Title */}
                        <h3 className="text-base sm:text-lg font-bold text-[#012442] group-hover:text-[#00B4EA] transition-colors leading-snug mb-2">
                          {itemName}
                        </h3>

                        {/* Dynamic Description */}
                        <p className="text-slate-500 text-xs leading-relaxed line-clamp-3 mb-4">
                          {itemDesc}
                        </p>

                        {/* Clinical Feature Highlight */}
                        <div className="flex items-center justify-center gap-1.5 text-[11px] font-semibold text-slate-600 mb-2">
                          <CheckCircle2 size={12} className="text-[#00B4EA] shrink-0" />
                          <span className="truncate">Laser &amp; Minimally Invasive</span>
                        </div>
                      </div>

                      {/* Bottom Footer Action Strip */}
                      <div className="mt-4 pt-3.5 border-t border-slate-100/90 w-full flex items-center justify-center text-xs font-bold text-[#012442] group-hover:text-[#00B4EA] transition-colors">
                        <span className="inline-flex items-center gap-1.5">
                          <span>Explore More</span>
                          <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform text-[#00B4EA]" />
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </motion.div>
          </div>
        )}

        {/* Carousel Pagination dots */}
        {displayItems.length > visibleCount && (
          <div className="flex justify-center items-center gap-1.5 mt-8">
            {Array.from({ length: maxIndex + 1 }).map((_, dotIdx) => (
              <button
                key={dotIdx}
                onClick={() => setCurrentIndex(dotIdx)}
                className={`h-2 rounded-full transition-all duration-300 cursor-pointer border-none ${
                  currentIndex === dotIdx
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

HomeDepartments.displayName = "HomeDepartments";
export default HomeDepartments;

