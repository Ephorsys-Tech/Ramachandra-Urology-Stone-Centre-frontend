import { useEffect, memo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchAllDepartments } from '../../redux/features/department/departmentThunk';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Sparkles,
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Stethoscope,
  Building2,
  PhoneCall,
  Calendar,
  Zap,
  Activity,
  CreditCard,
  ChevronRight
} from "lucide-react";
import { getDepartmentIcon } from '../../Helper/departmentIcon';
import { DepartmentCardSkeleton } from '../common/Skeletons';
import { openAppointmentModal } from '../../redux/features/patient/patientSlice';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" }
  }
};

const fallbackDepartments = [
  {
    _id: "urology-kidney-care",
    slug: "urology-kidney-care",
    name: "Urology & Kidney Care",
    description: "Advanced stone removal, laser lithotripsy, and comprehensive renal care for all age groups.",
    tags: ["Laser Lithotripsy", "Stone Removal", "Renal Care"],
    opdTime: "Daily 9:00 AM - 7:00 PM",
  },
  {
    _id: "laser-surgery-endourology",
    slug: "laser-surgery-endourology",
    name: "Laser Surgery & Endourology",
    description: "Minimally invasive Thulium fiber laser procedures for stones and enlarged prostate (BPH) with same-day discharge.",
    tags: ["Thulium Laser", "BPH Enucleation", "Daycare Surgery"],
    opdTime: "Daily 9:00 AM - 6:00 PM",
  },
  {
    _id: "laparoscopic-urology",
    slug: "laparoscopic-urology",
    name: "Laparoscopic Urology",
    description: "Precision keyhole surgery for reconstructive urology, pyeloplasty, and kidney interventions.",
    tags: ["3D HD Keyhole", "Pyeloplasty", "Minimal Scarring"],
    opdTime: "Mon - Sat 10:00 AM - 5:00 PM",
  },
  {
    _id: "andrology-male-health",
    slug: "andrology-male-health",
    name: "Andrology & Men's Health",
    description: "Specialized clinical clinic for male fertility, microsurgery, hormonal health, and wellness.",
    tags: ["Male Infertility", "Microsurgery", "Confidential Care"],
    opdTime: "Mon - Sat 11:00 AM - 6:00 PM",
  },
];

const subSpecialtyPills = [
  { name: "Pediatric Urology", slug: "pediatric-urology" },
  { name: "Uro-Oncology & Bladder", slug: "uro-oncology" },
  { name: "Female Urology & Incontinence", slug: "female-urology" },
  { name: "Reconstructive Urethra", slug: "reconstructive-urology" },
  { name: "Prostate Health (BPH)", slug: "prostate-bph" },
  { name: "Endourology & Lithotripsy", slug: "laser-surgery-endourology" },
];

const HomeDepartments = memo(() => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { departments = [], loading } = useSelector((state) => state.department || {});
  const { settings } = useSelector((state) => state.setting || {});
  const emergencyPhone = settings?.emergencyPhone || "9937566625";

  useEffect(() => {
    dispatch(fetchAllDepartments());
  }, [dispatch]);

  const displayList = departments && departments.length > 0 ? departments : fallbackDepartments;
  const displayDepartments = displayList.slice(0, 4);

  return (
    <section className="py-16 sm:py-24 bg-gradient-to-b from-slate-50/70 via-white to-slate-50/50 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-[#0FA8D6]/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-[#00875a]/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* ── HEADER SECTION ── */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#0FA8D6]/15 border border-[#0FA8D6]/30 text-[#024363] text-xs font-medium uppercase tracking-wider mb-3 shadow-2xs">
              
              Super-Specialty Clinical Wings
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-medium text-[#012442] tracking-tight">
              Specialized Clinical Departments
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm mt-2 leading-relaxed">
              From high-power laser stone surgeries to advanced laparoscopic interventions and pediatric urology, our specialized wings provide gold-standard healthcare in Sambalpur.
            </p>
          </div>

          <Link
            to="/urology-services"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-[#024363] hover:text-[#0FA8D6] transition-colors group cursor-pointer no-underline shrink-0"
          >
            <span>View All {departments.length > 0 ? departments.length : 12}+ Clinical Wings</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* ── DEPARTMENT CARDS (Exact match to Reference UI) ── */}
        {loading && (!departments || departments.length === 0) ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, idx) => (
              <DepartmentCardSkeleton key={idx} />
            ))}
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
          >
            {displayDepartments.map((dept, index) => {
              return (
                <motion.div
                  key={dept._id || index}
                  variants={itemVariants}
                  onClick={() => navigate(`/urology-services/${dept.slug || dept._id}`)}
                  className="bg-white border border-slate-200/80 hover:border-[#0FA8D6]/50 rounded-2xl sm:rounded-3xl p-6 sm:p-7 hover:-translate-y-1.5 hover:shadow-xl transition-all duration-300 group cursor-pointer flex flex-col items-center text-center justify-between min-h-[260px] relative overflow-hidden"
                >
                  {/* Subtle top indicator on hover */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#0FA8D6] via-[#024363] to-[#0FA8D6] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  <div className="flex flex-col items-center w-full">
                    {/* Outline Icon Box (Matching Reference Design) */}
                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl border-1.5 border-[#024363]/30 group-hover:border-[#0FA8D6] group-hover:bg-[#024363] text-[#024363] group-hover:text-white flex items-center justify-center mb-5 transition-all duration-300 shadow-2xs text-2xl sm:text-3xl bg-slate-50/50">
                      {getDepartmentIcon(dept.name, { size: 28 })}
                    </div>

                    {/* Department Title */}
                    <h3 className="text-base sm:text-lg font-medium text-[#012442] group-hover:text-[#0FA8D6] transition-colors leading-snug mb-2.5 px-1">
                      {dept.name}
                    </h3>

                    {/* Centered Description */}
                    <p className="text-slate-500 text-xs sm:text-[13px] leading-relaxed line-clamp-3">
                      {dept.description}
                    </p>
                  </div>

                  {/* Bottom subtle text & arrow */}
                  <div className="mt-4 pt-3 border-t border-slate-100 w-full flex items-center justify-center gap-1.5 text-xs font-medium text-[#024363] group-hover:text-[#0FA8D6] transition-colors">
                    <span>Learn More</span>
                    <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}

        

      </div>
    </section>
  );
});

HomeDepartments.displayName = "HomeDepartments";
export default HomeDepartments;

