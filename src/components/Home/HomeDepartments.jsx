import { useEffect, memo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchAllDepartments } from '../../redux/features/department/departmentThunk';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as LucideIcons from "lucide-react";
import { getDepartmentIcon } from '../../Helper/departmentIcon';
import { DepartmentCardSkeleton } from '../common/Skeletons';

const getCardConfig = (index) => {
  switch (index) {
    case 0:
      return {
        className: "md:col-span-2 bg-white text-[#012442] border border-slate-200/90 shadow-xs hover:border-[#0FA8D6]/40",
        iconBg: "bg-[#0FA8D6]/15",
        iconColor: "text-[#024363]",
        descColor: "text-slate-600",
        showTags: true,
      };
    case 1:
      return {
        className: "md:col-span-1 bg-gradient-to-br from-[#012442] via-[#024363] to-[#012442] text-white shadow-md border border-[#0FA8D6]/30",
        iconBg: "bg-[#0FA8D6]/20",
        iconColor: "text-[#0FA8D6]",
        descColor: "text-slate-200",
        showLink: true,
      };
    case 2:
      return {
        className: "md:col-span-1 bg-white text-[#012442] border border-slate-200/90 shadow-xs hover:border-[#0FA8D6]/40",
        iconBg: "bg-[#0FA8D6]/15",
        iconColor: "text-[#024363]",
        descColor: "text-slate-600",
      };
    case 3:
      return {
        className: "md:col-span-1 bg-white text-[#012442] border border-slate-200/90 shadow-xs hover:border-[#0FA8D6]/40",
        iconBg: "bg-[#0FA8D6]/15",
        iconColor: "text-[#024363]",
        descColor: "text-slate-600",
      };
    default:
      return {
        className: "bg-white text-[#012442] border border-slate-200/90 hover:border-[#0FA8D6]/40",
        iconBg: "bg-[#0FA8D6]/15",
        iconColor: "text-[#024363]",
        descColor: "text-slate-600",
      };
  }
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 25 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" }
  }
};

const HomeDepartments = memo(() => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { departments = [] } = useSelector((state) => state.department || {});

  useEffect(() => {
    if (departments.length === 0) {
      dispatch(fetchAllDepartments());
    }
  }, [dispatch, departments.length]);

  const displayDepartments = departments.slice(0, 4);

  return (
    <section className="py-16 sm:py-24 bg-slate-50/60 relative overflow-hidden ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Header section */}
        <div className="text-center mb-12 sm:mb-16 max-w-3xl mx-auto">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#0FA8D6]/15 border border-[#0FA8D6]/30 text-[#024363] text-xs font-medium uppercase tracking-wider mb-3 shadow-2xs">
            <LucideIcons.Sparkles size={12} className="text-[#0FA8D6]" />
            Comprehensive Clinical Wings
          </span>
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl md:text-5xl font-medium text-[#012442] mb-4 tracking-tight"
          >
            Specialized Clinical Departments
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-slate-600 text-xs sm:text-sm sm:leading-relaxed"
          >
            From high-power laser stone surgeries to advanced nephrology and pediatric urology, our specialized wings provide gold-standard healthcare in Sambalpur.
          </motion.p>
        </div>

        {/* Bento Grid */}
        {displayDepartments.length === 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, idx) => (
              <DepartmentCardSkeleton key={idx} />
            ))}
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {displayDepartments.map((dept, index) => {
              const config = getCardConfig(index);

              return (
                <motion.div
                  key={dept._id || index}
                  variants={itemVariants}
                  onClick={() => navigate(`/urology-services/${dept.slug || dept._id}`)}
                  className={`rounded-3xl p-7 md:p-8 cursor-pointer transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl group relative overflow-hidden flex flex-col justify-between ${config.className}`}
                >
                  <div>
                    <div className={`w-13 h-13 rounded-2xl flex items-center justify-center mb-5 ${config.iconBg} ${config.iconColor} group-hover:scale-108 transition-transform duration-300 text-2xl`}>
                      {getDepartmentIcon(dept.name, { size: 28 })}
                    </div>

                    <h3 className="text-xl font-medium mb-3 group-hover:text-[#0FA8D6] transition-colors">{dept.name}</h3>
                    <p className={`${config.descColor} text-xs leading-relaxed line-clamp-3 mb-6`}>
                      {dept.description}
                    </p>
                  </div>

                  {config.showTags && (
                    <div className="flex flex-wrap gap-2 mt-auto">
                      <span className="px-3 py-1 bg-slate-100 text-slate-700 text-[11px] font-bold rounded-full">Laser Surgery</span>
                      <span className="px-3 py-1 bg-slate-100 text-slate-700 text-[11px] font-bold rounded-full">Daycare Procedures</span>
                    </div>
                  )}

                  {config.showLink && (
                    <div className="mt-auto flex items-center text-xs font-medium text-[#0FA8D6] group-hover:text-white transition-colors">
                      Explore Department <LucideIcons.ArrowRight size={14} className="ml-1.5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  )}

                  {index === 0 && (
                    <div className="absolute top-7 right-7 text-slate-400 group-hover:text-[#0FA8D6] transition-colors">
                      <LucideIcons.ArrowUpRight size={22} />
                    </div>
                  )}
                </motion.div>
              );
            })}

            {/* View All Card - 5th slot */}
            <motion.div
              variants={itemVariants}
              onClick={() => navigate('/urology-services')}
              className="md:col-span-1 bg-white border border-slate-200/90 rounded-3xl p-7 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 hover:border-[#0FA8D6]/60 hover:shadow-md group"
            >
              <div className="w-12 h-12 rounded-2xl bg-[#0FA8D6]/15 flex items-center justify-center text-[#024363] mb-3 group-hover:scale-110 transition-transform">
                <LucideIcons.LayoutGrid size={24} className="text-[#0FA8D6]" />
              </div>
              <span className="text-[#012442] font-medium text-sm text-center group-hover:text-[#0FA8D6] transition-colors">
                View All {departments.length > 0 ? departments.length : 12}+ Clinical Wings →
              </span>
            </motion.div>

          </motion.div>
        )}
      </div>
    </section >
  );
});

HomeDepartments.displayName = "HomeDepartments";
export default HomeDepartments;
