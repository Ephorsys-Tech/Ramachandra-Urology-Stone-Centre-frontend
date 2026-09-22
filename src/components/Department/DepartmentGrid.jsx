import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllDepartments } from "../../redux/features/department/departmentThunk";
import {
  Search,
  ArrowRight,
  Stethoscope,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  X,
  Users
} from "lucide-react";
import { openAppointmentModal } from "../../redux/features/patient/patientSlice";
import { getDepartmentIcon } from "../../Helper/departmentIcon";
import { DepartmentCardSkeleton } from "../common/Skeletons";

const fallbackDepartments = [
  {
    _id: "urology-kidney-care",
    slug: "urology-kidney-care",
    name: "Urology & Kidney Care",
    description: "Advanced stone removal, laser lithotripsy, and renal care.",
  },
  {
    _id: "laser-surgery-endourology",
    slug: "laser-surgery-endourology",
    name: "Laser Surgery & Endourology",
    description: "Minimally invasive Thulium laser stone & prostate procedures.",
  },
  {
    _id: "laparoscopic-urology",
    slug: "laparoscopic-urology",
    name: "Laparoscopic Urology",
    description: "Precision keyhole surgery for reconstructive urology.",
  },
  {
    _id: "andrology-male-health",
    slug: "andrology-male-health",
    name: "Andrology & Men's Health",
    description: "Specialized male fertility and sexual health clinic.",
  },
  {
    _id: "pediatric-urology",
    slug: "pediatric-urology",
    name: "Pediatric Urology",
    description: "Dedicated congenital urinary tract care for children.",
  },
  {
    _id: "uro-oncology",
    slug: "uro-oncology",
    name: "Uro-Oncology & Reconstructive",
    description: "Comprehensive management for bladder, kidney & prostate health.",
  },
];

const DepartmentGrid = () => {
  const dispatch = useDispatch();
  const { departments = [], loading } = useSelector((state) => state.department || { departments: [], loading: false });
  const [search, setSearch] = useState("");

  useEffect(() => {
    dispatch(fetchAllDepartments());
  }, [dispatch]);

  const displayList = departments && departments.length > 0 ? departments : fallbackDepartments;

  const filteredDepartments = displayList.filter((dept) => {
    return (
      (dept.name || "").toLowerCase().includes(search.toLowerCase()) ||
      (dept.description || "").toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <div className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8 py-10 ">
      
      {/* ── SEARCH & SUMMARY BAR ── */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-8 mb-8 border-b border-slate-200/80">
        <div>
          <h3 className="text-xl font-extrabold text-[#012442] tracking-tight">
            Specialized Care Wings & Divisions
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Discover advanced surgical interventions, laser treatments, and OPD services in Sambalpur.
          </p>
        </div>

        <div className="relative w-full sm:w-80">
          <input
            type="text"
            placeholder="Search department or specialty..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 text-[#012442] rounded-full pl-10 pr-8 py-2.5 text-xs font-semibold focus:outline-none focus:border-[#0FA8D6] focus:bg-white focus:ring-2 focus:ring-[#0FA8D6]/15 transition-all placeholder:text-slate-400"
          />
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 border-none bg-transparent cursor-pointer p-0.5"
            >
              <X size={13} />
            </button>
          )}
        </div>
      </div>

      {/* ── CLINICAL WINGS GRID ── */}
      <section className="relative min-h-[400px]">
        {loading && (!departments || departments.length === 0) ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {Array.from({ length: 6 }).map((_, idx) => (
              <DepartmentCardSkeleton key={idx} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {filteredDepartments.length > 0 ? (
              filteredDepartments.map((dept, i) => (
                <motion.div
                  key={dept._id || i}
                  className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-7 hover:-translate-y-1.5 transition-all duration-300 flex flex-col group shadow-xs hover:shadow-xl hover:border-[#0FA8D6]/40 relative overflow-hidden"
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.04 }}
                >
                  {/* Subtle top ambient bar */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-[#00B4EA] opacity-0 group-hover:opacity-100 transition-opacity" />

                  {/* Header: Department Icon + Specialization Badge */}
                  <div className="flex items-start justify-between gap-4 mb-5">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#0FA8D6]/15 via-[#0FA8D6]/5 to-[#024363]/10 border border-[#0FA8D6]/30 text-[#024363] flex items-center justify-center group-hover:scale-105 group-hover:bg-[#024363] group-hover:text-white transition-all duration-300 shadow-2xs">
                      {getDepartmentIcon(dept.name, { size: 24 })}
                    </div>
                    <span className="text-[11px] font-extrabold px-3 py-1 rounded-full bg-[#0FA8D6]/10 text-[#024363] border border-[#0FA8D6]/20 shadow-2xs">
                      Specialty Care
                    </span>
                  </div>

                  {/* Department Title */}
                  <h3 className="text-xl font-medium text-[#012442] mb-2.5 tracking-tight group-hover:text-[#0FA8D6] transition-colors">
                    {dept.name}
                  </h3>

                  {/* Department Description */}
                  <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-6 flex-grow line-clamp-3">
                    {dept.description || "Comprehensive clinical diagnosis, daycare services, and laser surgical interventions by specialized surgeons."}
                  </p>

                  {/* Key Services Tags */}
                  {dept.features && dept.features.length > 0 && (
                    <div className="space-y-2 mb-6 pt-4 border-t border-slate-100">
                      <p className="text-[11px] font-bold text-[#012442] uppercase tracking-wider flex items-center gap-1">
                        <CheckCircle2 size={12} className="text-[#0FA8D6]" />
                        Key Clinical Services
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {dept.features.slice(0, 3).map((feature, j) => (
                          <span
                            key={j}
                            className="text-[11px] font-semibold text-slate-700 bg-slate-50 border border-slate-200/80 px-2.5 py-1 rounded-lg"
                          >
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="mt-auto pt-4 border-t border-slate-100 flex flex-col sm:flex-row gap-2.5">
                    <Link
                      to={`/urology-services/${dept.slug || dept._id}`}
                      className="flex-1 text-center inline-flex items-center justify-center gap-1.5 bg-[#00B4EA] hover:from-[#00b4ea] hover:to-[#013550] text-white font-bold text-xs py-3 rounded-xl transition-all shadow-xs hover:shadow-md no-underline tracking-wide uppercase"
                    >
                      <span>Explore Wing</span>
                      <ArrowRight size={13} />
                    </Link>
                    <Link
                      to={`/doctors?specialty=${encodeURIComponent(dept.name)}`}
                      className="flex-1 text-center inline-flex items-center justify-center gap-1.5 border border-slate-200 text-[#012442] bg-slate-50 hover:bg-slate-100 font-bold text-xs py-3 rounded-xl transition-colors no-underline"
                    >
                      <Users size={13} className="text-[#0FA8D6]" />
                      <span>Doctors</span>
                    </Link>
                  </div>
                </motion.div>
              ))
            ) : (
              !loading && (
                <div className="col-span-1 md:col-span-2 lg:col-span-3 text-center py-20 bg-white border border-slate-200 rounded-3xl p-8 shadow-xs">
                  <Stethoscope size={36} className="text-[#0FA8D6] mx-auto mb-3" />
                  <h4 className="text-lg font-bold text-[#012442] mb-1">No departments found</h4>
                  <p className="text-slate-500 text-xs max-w-sm mx-auto">
                    {search
                      ? `No clinical wing matched "${search}". Try searching for terms like "Urology", "Stone", or "Laser".`
                      : "There are currently no departments registered."}
                  </p>
                  {search && (
                    <button
                      onClick={() => setSearch("")}
                      className="mt-4 text-xs font-bold text-[#0FA8D6] hover:underline cursor-pointer border-none bg-transparent"
                    >
                      Clear Search Filter
                    </button>
                  )}
                </div>
              )
            )}
          </div>
        )}
      </section>

      {/* ── BOTTOM ASSISTANCE BANNER ── */}
      <div className="mt-14 bg-gradient-to-r from-[#012442] via-[#024363] to-[#012442] rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 border border-[#0FA8D6]/20">
        <div className="space-y-1 text-center md:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0FA8D6]/20 text-cyan-200 text-[11px] font-extrabold uppercase tracking-wider mb-1 border border-[#0FA8D6]/30">
            
            Fast-Track Clinical OPD
          </div>
          <h4 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            Need Expert Urology Guidance in Sambalpur?
          </h4>
          <p className="text-xs sm:text-sm text-slate-300">
            Book an in-person clinical consultation with our consultant urologists today.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
          <button
            onClick={() => dispatch(openAppointmentModal())}
            className="inline-flex items-center gap-2 bg-[#0FA8D6] hover:bg-[#00b4ea] text-[#012442] font-medium text-xs px-6 py-3.5 rounded-full shadow-md hover:shadow-lg transition-all cursor-pointer border-none uppercase tracking-wide"
          >
            <Calendar size={14} />
            <span>Book Clinical Visit</span>
          </button>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-bold text-xs px-5 py-3.5 rounded-full border border-white/20 transition-colors no-underline"
          >
            <span>Contact Helpdesk</span>
          </Link>
        </div>
      </div>

    </div>
  );
};

export default DepartmentGrid;

