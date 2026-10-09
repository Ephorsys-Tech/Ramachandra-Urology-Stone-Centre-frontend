import { motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";

const DepartmentDeleteModal = ({
  selectedDept,
  closeModal,
  handleDeleteConfirm,
  loading
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={closeModal} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
      <motion.div initial={{ scale: 0.95, opacity: 0, y: 15 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 15 }} transition={{ duration: 0.2 }} className="relative w-full max-w-md bg-white rounded-2xl border border-slate-150 shadow-2xl overflow-hidden z-10 p-6">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl text-rose-600 shrink-0"><AlertTriangle size={24} /></div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-800">Confirm Deletion</h3>
            <p className="text-sm text-slate-500 leading-normal">
              Are you sure you want to delete the <span className="font-semibold text-slate-700">{selectedDept?.name}</span> department?
            </p>
          </div>
        </div>
        <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-100 mt-6">
          <button type="button" onClick={closeModal} className="px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold text-slate-650 hover:bg-slate-50 transition cursor-pointer">Cancel</button>
          <button type="button" disabled={loading} onClick={handleDeleteConfirm} className="px-4 py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-sm font-semibold shadow-md shadow-rose-600/10 transition cursor-pointer disabled:opacity-70">
            {loading ? "Deleting..." : "Delete Department"}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default DepartmentDeleteModal;
