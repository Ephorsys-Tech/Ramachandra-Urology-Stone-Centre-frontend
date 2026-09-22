import { motion } from "framer-motion";
import { useEffect, useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllFeatures } from "../../redux/features/feature/featureThunk";
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
  Phone,
  Layers,
  Award,
} from "lucide-react";
import { openAppointmentModal } from "../../redux/features/patient/patientSlice";
import { getDepartmentIcon } from "../../Helper/departmentIcon";
import { DepartmentCardSkeleton } from "../common/Skeletons";

const DepartmentGrid = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { features = [], loading: featuresLoading } = useSelector(
    (state) => state.feature || { features: [], loading: false }
  );
  const { departments = [], loading: deptLoading } = useSelector(
    (state) => state.department || { departments: [], loading: false }
  );
  const { settings } = useSelector((state) => state.setting || {});
  const emergencyPhone = settings?.emergencyPhone || "+91 99375 66625";

  const [search, setSearch] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");

  useEffect(() => {
    dispatch(fetchAllFeatures());
    dispatch(fetchAllDepartments());
  }, [dispatch]);

  const loading = featuresLoading || deptLoading;

  // Prioritize active features (subdepartments / clinical care wings).
  const allWings = useMemo(() => {
    if (features && features.length > 0) {
      return features.filter((f) => f.isActive !== false);
    }
    return departments && departments.length > 0 ? departments : [];
  }, [features, departments]);

  // Dynamic filter chips derived from data
  const filterChips = useMemo(() => {
    const chips = [{ id: "all", label: "All Specialities" }];
    const lowerNames = allWings.map((w) => (w.name || "").toLowerCase());

    if (lowerNames.some((n) => n.includes("stone") || n.includes("litho"))) {
      chips.push({ id: "stone", label: "Laser & Stone Surgery" });
    }
    if (lowerNames.some((n) => n.includes("endo") || n.includes("rirs"))) {
      chips.push({ id: "endo", label: "Endourology & RIRS" });
    }
    if (lowerNames.some((n) => n.includes("kidney") || n.includes("renal") || n.includes("nephro"))) {
      chips.push({ id: "kidney", label: "Kidney & Renal Care" });
    }
    if (lowerNames.some((n) => n.includes("prostate") || n.includes("bph"))) {
      chips.push({ id: "prostate", label: "Prostate Health" });
    }
    if (lowerNames.some((n) => n.includes("functional") || n.includes("urodynamic") || n.includes("reconstructive"))) {
      chips.push({ id: "functional", label: "Functional & Reconstructive" });
    }
    return chips;
  }, [allWings]);

  // Filter & search logic
  const filteredWings = useMemo(() => {
    return allWings.filter((wing) => {
      const name = (wing.name || "").toLowerCase();
      const desc = (wing.description || "").toLowerCase();
      const query = search.toLowerCase().trim();

      const matchesSearch = !query || name.includes(query) || desc.includes(query);

      let matchesFilter = true;
      if (selectedFilter === "stone") {
        matchesFilter = name.includes("stone") || desc.includes("stone") || desc.includes("litho") || desc.includes("pcnl");
      } else if (selectedFilter === "endo") {
        matchesFilter = name.includes("endo") || desc.includes("endo") || desc.includes("rirs");
      } else if (selectedFilter === "kidney") {
        matchesFilter = name.includes("kidney") || desc.includes("kidney") || desc.includes("renal");
      } else if (selectedFilter === "prostate") {
        matchesFilter = name.includes("prostate") || desc.includes("prostate") || desc.includes("bph");
      } else if (selectedFilter === "functional") {
        matchesFilter = name.includes("functional") || desc.includes("uro-dynamics") || desc.includes("reconstructive");
      }

      return matchesSearch && matchesFilter;
    });
  }, [allWings, search, selectedFilter]);

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* ── SEARCH & FILTER TOOLBAR ── */}
      <div className="rounded-3xl p-5 sm:p-7 shadow-[0_4px_24px_rgba(0,0,0,0.03)] mb-10 text-left">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-100">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 text-[#00B4EA] text-[11px] font-bold uppercase tracking-wider mb-2 border border-sky-100">
              
              CLINICAL SPECIALITIES DIRECTORY
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#012442] tracking-tight">
              Specialized Care Wings &amp; Divisions
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl">
              Showing {filteredWings.length} of {allWings.length} dedicated urological care wings with high-precision laser &amp; daycare procedures in Sambalpur.
            </p>
          </div>

          {/* Search Box */}
          <div className="relative w-full lg:w-80 shrink-0">
            <input
              type="text"
              placeholder="Search specialty, procedure, or condition..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-[#012442] rounded-2xl pl-10 pr-9 py-3 text-xs font-semibold focus:outline-none focus:border-[#00B4EA] focus:bg-white focus:ring-2 focus:ring-[#00B4EA]/15 transition-all placeholder:text-slate-400 shadow-2xs"
            />
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 border-none bg-transparent cursor-pointer p-0.5"
                title="Clear Search"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Filter Chips
        <div className="pt-5 flex items-center gap-2 overflow-x-auto no-scrollbar">
          {filterChips.map((chip) => (
            <button
              key={chip.id}
              onClick={() => setSelectedFilter(chip.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border-none shrink-0 ${
                selectedFilter === chip.id
                  ? "bg-[#00B4EA] text-white shadow-sm shadow-[#00B4EA]/25"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900"
              }`}
            >
              {chip.label}
            </button>
          ))}
        </div> */}
      </div>

      {/* ── CLINICAL WINGS GRID ── */}
      <section className="relative min-h-[400px]">
        {loading && allWings.length === 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {Array.from({ length: 6 }).map((_, idx) => (
              <DepartmentCardSkeleton key={idx} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {filteredWings.length > 0 ? (
              filteredWings.map((wing, i) => {
                const pageLink = wing.slug ? `/${wing.slug}` : `/urology-services/${wing._id}`;
                const wingName = wing.name || "Specialized Care Wing";
                const wingDesc =
                  wing.description ||
                  "Advanced clinical diagnosis, high-precision daycare laser procedures, and dedicated post-operative care.";

                return (
                  <motion.div
                    key={wing._id || i}
                    onClick={() => navigate(pageLink)}
                    className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-7 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between group shadow-[0_4px_24px_rgba(0,0,0,0.03)] hover:shadow-[0_16px_36px_rgba(0,180,234,0.12)] hover:border-[#00B4EA]/60 relative overflow-hidden text-center cursor-pointer"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.35, delay: i * 0.04 }}
                  >
                    <div className="flex flex-col items-center w-full">
                      {/* Centered Medical Icon Box */}
                      <div className="w-14 h-14 rounded-2xl bg-sky-50 border border-sky-100 group-hover:border-[#00B4EA] group-hover:bg-[#00B4EA] text-[#00B4EA] group-hover:text-white flex items-center justify-center transition-all duration-300 shadow-2xs text-2xl mb-4">
                        {getDepartmentIcon(wingName, { size: 26 })}
                      </div>

                      {/* Wing Title */}
                      <h3 className="text-lg sm:text-xl font-bold text-[#012442] mb-2.5 tracking-tight group-hover:text-[#00B4EA] transition-colors leading-snug">
                        {wingName}
                      </h3>

                      {/* Description */}
                      <p className="text-slate-600 text-xs sm:text-[13px] leading-relaxed mb-5 line-clamp-3">
                        {wingDesc}
                      </p>

                      {/* Capability Highlights */}
                      <div className="space-y-2 mb-6 pt-4 border-t border-slate-100 w-full">
                        <div className="flex items-center justify-center gap-2 text-[11px] font-semibold text-slate-700">
                          <CheckCircle2 size={13} className="text-[#00B4EA] shrink-0" />
                          <span>Thulium Fiber Laser &amp; Endo-Lap Interventions</span>
                        </div>
                        <div className="flex items-center justify-center gap-2 text-[11px] font-semibold text-slate-700">
                          <ShieldCheck size={13} className="text-emerald-600 shrink-0" />
                          <span>Ayushman Bharat / Cashless Covered</span>
                        </div>
                      </div>
                    </div>

                    {/* Action Button: Explore More */}
                    <div className="pt-4 border-t border-slate-100 w-full flex items-center justify-center">
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#012442] group-hover:text-[#00B4EA] transition-colors uppercase tracking-wider">
                        <span>Explore More</span>
                        <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform text-[#00B4EA]" />
                      </span>
                    </div>
                  </motion.div>
                );
              })
            ) : (
              !loading && (
                <div className="col-span-1 md:col-span-2 lg:col-span-3 text-center py-16 bg-white border border-slate-200 rounded-3xl p-8 shadow-xs">
                  <Stethoscope size={40} className="text-[#00B4EA] mx-auto mb-3" />
                  <h4 className="text-lg font-bold text-[#012442] mb-1">No specialities found</h4>
                  <p className="text-slate-500 text-xs max-w-sm mx-auto">
                    {search
                      ? `No clinical wing matched "${search}". Try searching for terms like "Stone", "Laser", or "Kidney".`
                      : "There are currently no specialties matching the selected filter."}
                  </p>
                  {(search || selectedFilter !== "all") && (
                    <button
                      onClick={() => {
                        setSearch("");
                        setSelectedFilter("all");
                      }}
                      className="mt-4 px-4 py-2 bg-[#00B4EA] text-white rounded-xl text-xs font-bold hover:bg-[#0096c4] cursor-pointer border-none"
                    >
                      Reset All Filters
                    </button>
                  )}
                </div>
              )
            )}
          </div>
        )}
      </section>

      {/* ── FAST-TRACK OPD ASSISTANCE BANNER ── */}
      <div className="mt-14 bg-gradient-to-r from-[#012442] via-[#024363] to-[#012442] rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 border border-[#00B4EA]/20 text-left">
        <div className="space-y-1 text-center md:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#00B4EA]/20 text-cyan-200 text-[11px] font-bold uppercase tracking-wider mb-1 border border-[#00B4EA]/30">
            
            Same-Day Clinical OPD &amp; Emergency
          </div>
          <h4 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            Need Expert Urology Consultation in Sambalpur?
          </h4>
          <p className="text-xs sm:text-sm text-slate-300">
            Get comprehensive diagnostic workup, uroflowmetry, and surgical opinions with senior urologists.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
          <button
            onClick={() => dispatch(openAppointmentModal())}
            className="inline-flex items-center gap-2 bg-[#00B4EA] hover:bg-[#0096c4] text-white font-bold text-xs px-6 py-3.5 rounded-xl shadow-md transition-all cursor-pointer border-none uppercase tracking-wide"
          >
            <Calendar size={14} />
            <span>Book Clinical Visit</span>
          </button>
          <a
            href={`tel:${emergencyPhone}`}
            className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-bold text-xs px-5 py-3.5 rounded-xl border border-white/20 transition-colors no-underline"
          >
            <Phone size={14} className="text-[#00B4EA]" />
            <span>Call OPD Desk</span>
          </a>
        </div>
      </div>

    </div>
  );
};

export default DepartmentGrid;

