import { Edit, Trash2, CheckCircle, XCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { getDepartmentIcon } from "../../../Helper/departmentIcon";

const DepartmentTable = ({
  loading,
  currentItems,
  doctors,
  openEditModal,
  openDeleteModal,
  openViewModal,
  indexOfFirstItem,
  indexOfLastItem,
  filteredDeptsLength,
  totalPages,
  currentPage,
  handlePageChange
}) => {
  const renderIcon = (name) => {
    return getDepartmentIcon(name, { className: "w-5 h-5 text-blue-600 animate-pulse" });
  };
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden relative min-h-[300px]">
      {loading && (
        <div className="absolute inset-0 bg-white/60 backdrop-blur-sm z-10 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200/80 text-xs font-bold text-slate-450 uppercase tracking-wider">
              <th className="px-6 py-4 w-16">Icon</th>
              <th className="px-6 py-4">Department Info</th>
              <th className="px-6 py-4">Assigned Doctors</th>
              <th className="px-6 py-4">Visibility</th>
              <th className="px-6 py-4">Emergency</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-150 text-sm text-slate-650">
            {currentItems.length > 0 ? (
              currentItems.map((dept) => (
                <tr 
                  key={dept._id} 
                  onClick={() => openViewModal(dept)}
                  className="hover:bg-slate-50/80 active:bg-slate-100/50 transition-all cursor-pointer border-l-2 border-l-transparent hover:border-l-blue-600 group"
                >
                  <td className="px-6 py-4">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center border border-blue-100 transition-transform group-hover:scale-105">
                      {renderIcon(dept.name)}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-semibold text-slate-805 group-hover:text-blue-600 transition-colors">{dept.name}</div>
                    <div className="text-xs text-slate-500 font-semibold">{dept.category || "General"}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1 max-w-[200px]">
                      {doctors && doctors.filter(d => (d.department?._id || d.department) === dept._id).length > 0 ? (
                        doctors.filter(d => (d.department?._id || d.department) === dept._id).map((doc, i) => (
                          <span key={i} className="text-[10px] px-2 py-0.5 bg-blue-50 text-blue-700 rounded border border-blue-100 whitespace-nowrap font-medium">
                            Dr. {doc.name}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-slate-400 italic">No doctors assigned</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1 text-xs font-semibold">
                      {dept.published ? <span className="text-emerald-600 flex items-center gap-1"><CheckCircle size={12}/> Published</span> : <span className="text-slate-450 flex items-center gap-1"><XCircle size={12}/> Draft</span>}
                      {dept.showInHomePage && <span className="text-blue-600 flex items-center gap-1"><CheckCircle size={12}/> Home Page</span>}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${dept.emergencyAvailable ? 'bg-rose-50 text-rose-600 border-rose-200/60' : 'bg-slate-100 text-slate-655 border-slate-200'}`}>
                      {dept.emergencyAvailable ? "Available" : "No"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={(e) => { e.stopPropagation(); openEditModal(dept); }} className="p-2 hover:bg-blue-50 text-blue-600 hover:text-blue-700 rounded-xl transition-all cursor-pointer border border-transparent hover:border-blue-100 shadow-sm hover:shadow-md" title="Edit department">
                        <Edit size={14} />
                      </button>
                      <button onClick={(e) => { e.stopPropagation(); openDeleteModal(dept); }} className="p-2 hover:bg-rose-50 text-rose-600 hover:text-rose-700 rounded-xl transition-all cursor-pointer border border-transparent hover:border-rose-100 shadow-sm hover:shadow-md" title="Delete department">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="px-6 py-12 text-center text-slate-400 font-medium bg-slate-50/30">
                  No departments found matching your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="px-6 py-4 border-t border-slate-200/80 flex items-center justify-between">
          <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
            Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredDeptsLength)} of {filteredDeptsLength}
          </span>
          <div className="flex items-center gap-1.5">
            <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className="p-1.5 border border-slate-200 rounded-lg text-slate-500 hover:bg-slate-50 disabled:opacity-40 transition cursor-pointer"><ChevronLeft size={16} /></button>
            {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((page) => (
              <button key={page} onClick={() => handlePageChange(page)} className={`w-8 h-8 rounded-lg text-xs font-semibold transition ${currentPage === page ? "bg-blue-600 text-white shadow-md shadow-blue-500/20" : "border border-slate-200 text-slate-600 hover:bg-slate-50"} cursor-pointer`}>{page}</button>
            ))}
            <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} className="p-1.5 border border-slate-200 rounded-lg text-slate-500 hover:bg-slate-50 disabled:opacity-40 transition cursor-pointer"><ChevronRight size={16} /></button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DepartmentTable;
