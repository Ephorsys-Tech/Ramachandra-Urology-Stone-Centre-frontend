import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import * as LucideIcons from "lucide-react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllDepartments } from "../../redux/features/department/departmentThunk";
import { Search } from "lucide-react";

import { getDepartmentIcon } from "../../Helper/departmentIcon";
import { DepartmentCardSkeleton } from "../common/Skeletons";

const DepartmentGrid = () => {
  const dispatch = useDispatch();
  const { departments, loading } = useSelector((state) => state.department);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (departments.length === 0) {
      dispatch(fetchAllDepartments());
    }
  }, [dispatch, departments.length]);

  const filteredDepartments = (departments || []).filter((dept) => {
    return (
      dept.name.toLowerCase().includes(search.toLowerCase()) ||
      dept.description.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <>
      <section className="max-w-7xl mx-auto px-4 mb-8">
        <div className="flex flex-col md:flex-row justify-end items-center gap-6">
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="w-full md:w-72 relative">
              <input
                type="text"
                placeholder="Search departments..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-white border border-slate-200 text-primary rounded-full pl-12 pr-5 py-3 focus:outline-none focus:border-secondary transition-colors shadow-sm"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-450" />
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 relative min-h-[300px]">
        {loading && departments.length === 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, idx) => (
              <DepartmentCardSkeleton key={idx} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredDepartments.length > 0 ? filteredDepartments.map((dept, i) => (
            <motion.div 
              key={dept._id}
              className="bg-white border border-slate-200 rounded-3xl p-8 hover:-translate-y-2 transition-all duration-400 flex flex-col group shadow-sm hover:shadow-lg hover:border-slate-350"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
            >
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${dept.color || 'from-blue-500/10 to-blue-600/5 text-secondary border-secondary/20'} border flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                {getDepartmentIcon(dept.name, { className: "w-8 h-8" })}
              </div>
              
              <h3 className="text-2xl font-bold text-primary mb-3 font-sans tracking-tight">{dept.name}</h3>
              <p className="text-slate-500 mb-8 leading-relaxed flex-grow line-clamp-3">
                {dept.description}
              </p>

              {dept.features && dept.features.length > 0 && (
                <div className="space-y-3 mb-8">
                  <p className="text-primary text-sm font-bold uppercase tracking-wider mb-2">Key Services</p>
                  <div className="flex flex-wrap gap-2">
                    {dept.features.map((feature, j) => (
                      <span key={j} className="text-xs text-slate-650 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-full">
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-auto flex flex-col gap-3">
                <Link 
                  to={`/departments/${dept.slug || dept._id}`} 
                  className="w-full text-center block bg-secondary/15 border border-secondary/20 text-secondary font-bold py-3.5 rounded-xl hover:bg-secondary hover:text-white transition-all duration-300 no-underline cursor-pointer"
                >
                  View Department
                </Link>
                <Link 
                  to={`/doctors?specialty=${dept.name}`} 
                  className="w-full text-center block border border-slate-200 text-slate-700 bg-slate-50 hover:bg-slate-100 hover:border-slate-300 font-bold py-3.5 rounded-xl transition-all duration-300 no-underline cursor-pointer"
                >
                  View Doctors
                </Link>
              </div>
            </motion.div>
          )) : (
            !loading && (
              <div className="col-span-1 md:col-span-2 lg:col-span-3 text-center py-20 text-slate-500">
                <h3 className="text-xl font-bold text-primary mb-2 font-sans">No departments found</h3>
                <p>Try adjusting your search criteria.</p>
              </div>
            )
          )}
        </div>
        )}
      </section>
    </>
  );
};

export default DepartmentGrid;
