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
        className: "md:col-span-2 bg-white text-primary border border-slate-200 shadow-[0_8px_30px_rgba(0,0,0,0.03)]",
        iconBg: "bg-slate-100",
        iconColor: "text-primary",
        descColor: "text-slate-600",
        showTags: true,
      };
    case 1:
      return {
        className: "md:col-span-1 bg-secondary text-white shadow-[0_8px_30px_rgba(37,99,235,0.25)]",
        iconBg: "bg-white/10",
        iconColor: "text-white",
        descColor: "text-blue-100",
        showLink: true,
      };
    case 2:
      return {
        className: "md:col-span-1 bg-white text-primary border border-slate-200 shadow-[0_8px_30px_rgba(0,0,0,0.03)]",
        iconBg: "bg-slate-100",
        iconColor: "text-secondary",
        descColor: "text-slate-600",
      };
    case 3:
      return {
        className: "md:col-span-1 bg-tertiary-container text-on-tertiary-container shadow-[0_8px_30px_rgba(5,150,105,0.1)] border border-tertiary/10",
        iconBg: "bg-tertiary/10",
        iconColor: "text-tertiary",
        descColor: "text-on-tertiary-container/85",
      };
    default:
      return {
        className: "bg-white text-primary border border-slate-200",
        iconBg: "bg-slate-100",
        iconColor: "text-primary",
        descColor: "text-slate-500",
      };
  }
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" }
  }
};

const HomeDepartments = memo(() => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { departments } = useSelector((state) => state.department);

  useEffect(() => {
    if (departments.length === 0) {
      dispatch(fetchAllDepartments());
    }
  }, [dispatch, departments.length]);

  // We need exactly 4 dynamic departments for the bento layout
  const displayDepartments = departments.slice(0, 4);

  return (
    <section className="py-24 bg-background relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        
        {/* Header section matching the design */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <motion.h2 
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-primary mb-6 font-sans tracking-tight"
          >
            Our Medical <span className='text-secondary'>Specialties</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-slate-650 text-lg leading-relaxed"
          >
            We provide comprehensive healthcare solutions through our highly specialized
            departments equipped with state-of-the-art medical technology.
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
                onClick={() => navigate(`/departments/${dept.slug || dept._id}`)}
                className={`rounded-3xl p-8 md:p-10 cursor-pointer transition-transform duration-300 hover:-translate-y-2 group relative overflow-hidden flex flex-col justify-between ${config.className}`}
              >
                <div>
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${config.iconBg} ${config.iconColor} group-hover:scale-110 transition-transform duration-300 text-2xl`}>
                    {getDepartmentIcon(dept.name, { size: 30 })}
                  </div>
                  
                  <h3 className="text-2xl font-bold mb-4">{dept.name}</h3>
                  <p className={`${config.descColor} text-[15px] leading-relaxed line-clamp-3 mb-6`}>
                    {dept.description}
                  </p>
                </div>

                {config.showTags && (
                  <div className="flex gap-3 mt-auto">
                    <span className="px-4 py-1.5 bg-slate-100 text-slate-650 text-xs font-semibold rounded-full">Counseling</span>
                    <span className="px-4 py-1.5 bg-slate-100 text-slate-650 text-xs font-semibold rounded-full">Diagnostics</span>
                  </div>
                )}

                {config.showLink && (
                  <div className="mt-auto flex items-center text-sm font-bold text-white group-hover:opacity-80">
                    Learn More <LucideIcons.ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                  </div>
                )}
                
                {/* Top-right subtle arrow for card 0 */}
                {index === 0 && (
                  <div className="absolute top-8 right-8 text-slate-400 group-hover:text-primary transition-colors">
                    <LucideIcons.ArrowUpRight size={24} />
                  </div>
                )}
              </motion.div>
            );
          })}

          {/* View All Card - 5th slot */}
          <motion.div
            variants={itemVariants}
            onClick={() => navigate('/departments')}
            className="md:col-span-1 bg-slate-100 border border-slate-200/80 rounded-3xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 hover:bg-slate-200 hover:shadow-inner group"
          >
            <div className="w-12 h-12 flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform">
              <LucideIcons.LayoutGrid size={28} />
            </div>
            <span className="text-primary font-bold text-center">
              View All {departments.length > 0 ? departments.length : 24} Specialties
            </span>
          </motion.div>

        </motion.div>
        )}
      </div>
    </section>
  );
});

export default HomeDepartments;
