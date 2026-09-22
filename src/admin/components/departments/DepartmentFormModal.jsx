import { motion } from "framer-motion";
import { X, Sparkles, Activity, User, Check } from "lucide-react";

const DepartmentFormModal = ({
  isEditModalOpen,
  closeModal,
  formTab,
  setFormTab,
  formData,
  setFormData,
  handleSubmit,
  loading,
  allFeatures = [],
  allDiseases = [],
  allDoctors = [],
}) => {
  const toggleSelection = (key, id) => {
    const current = Array.isArray(formData[key]) ? formData[key] : [];
    if (current.includes(id)) {
      setFormData({
        ...formData,
        [key]: current.filter((item) => item !== id),
      });
    } else {
      setFormData({
        ...formData,
        [key]: [...current, id],
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={closeModal}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
      />
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 15 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 15 }}
        transition={{ duration: 0.25 }}
        className="relative w-full max-w-2xl bg-white rounded-2xl border border-slate-100 shadow-2xl overflow-hidden z-10 flex flex-col max-h-[90vh]"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-100 p-6 pb-4 bg-white shrink-0">
          <div>
            <h3 className="text-lg font-bold text-slate-800">
              {isEditModalOpen ? "Edit Department" : "Add New Department"}
            </h3>
            <p className="text-xs text-slate-400">
              Configure department schema properties matching the backend database model.
            </p>
          </div>
          <button
            onClick={closeModal}
            className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          >
            <X size={18} className="text-slate-400" />
          </button>
        </div>

        {/* Tabs Header */}
        <div className="flex border-b border-slate-200 px-6 shrink-0 bg-slate-50/50 overflow-x-auto">
          {[
            { id: "basic", label: "Basic Info" },
            { id: "timings", label: "Timings & Status" },
            { id: "assignments", label: "Linked Assignments" },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFormTab(tab.id)}
              className={`py-3 px-4 text-sm font-semibold whitespace-nowrap transition-colors relative cursor-pointer ${
                formTab === tab.id ? "text-blue-600" : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {tab.label}
              {formTab === tab.id && (
                <motion.div
                  layoutId="deptTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-t-full"
                />
              )}
            </button>
          ))}
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1">
          <form id="departmentForm" onSubmit={handleSubmit} className="space-y-4">
            {/* 1. BASIC INFO TAB */}
            {formTab === "basic" && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-500 uppercase block">
                      Name (`name`) *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Urology & Kidney Care"
                      value={formData.name || ""}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-blue-500 rounded-xl text-sm outline-none transition font-medium"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-500 uppercase block">
                      Category (`category`)
                    </label>
                    <select
                      value={formData.category || "General"}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-blue-500 rounded-xl text-sm outline-none transition text-slate-700 font-medium"
                    >
                      <option value="General">General</option>
                      <option value="Specialized">Specialized</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500 uppercase block">
                    URL Slug (`slug`)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. urology-kidney-care (auto-generated if empty)"
                    value={formData.slug || ""}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-blue-500 rounded-xl text-sm outline-none transition font-mono text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500 uppercase block">
                    Description (`description`) *
                  </label>
                  <textarea
                    rows="3"
                    required
                    placeholder="Brief description of the department..."
                    value={formData.description || ""}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-blue-500 rounded-xl text-sm outline-none transition resize-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500 uppercase block">
                    Full Content (`content`) *
                  </label>
                  <textarea
                    rows="5"
                    required
                    placeholder="Detailed explanation of services and procedures for the department page..."
                    value={formData.content || ""}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-blue-500 rounded-xl text-sm outline-none transition resize-none"
                  />
                </div>
              </div>
            )}

            {/* 2. TIMINGS & STATUS TAB */}
            {formTab === "timings" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-500 uppercase block">
                      OPD Time (`opdTime`)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Mon-Sat, 9:00 AM - 5:00 PM"
                      value={formData.opdTime || ""}
                      onChange={(e) => setFormData({ ...formData, opdTime: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-blue-500 rounded-xl text-sm outline-none transition"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-500 uppercase block">
                      Order Index (`orderIndex`)
                    </label>
                    <input
                      type="number"
                      min="0"
                      placeholder="0"
                      value={formData.orderIndex ?? 0}
                      onChange={(e) =>
                        setFormData({ ...formData, orderIndex: Number(e.target.value) })
                      }
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-blue-500 rounded-xl text-sm outline-none transition"
                    />
                  </div>
                </div>

                <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 space-y-3">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200 pb-2">
                    Visibility & Availability Flags
                  </h4>

                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={Boolean(formData.published)}
                      onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                      className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                    />
                    <span className="text-sm text-slate-700 font-medium">
                      `published` — Visible to public users
                    </span>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={Boolean(formData.showInHomePage)}
                      onChange={(e) =>
                        setFormData({ ...formData, showInHomePage: e.target.checked })
                      }
                      className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                    />
                    <span className="text-sm text-slate-700 font-medium">
                      `showInHomePage` — Feature on homepage
                    </span>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={Boolean(formData.showInServicesPage)}
                      onChange={(e) =>
                        setFormData({ ...formData, showInServicesPage: e.target.checked })
                      }
                      className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                    />
                    <span className="text-sm text-slate-700 font-medium">
                      `showInServicesPage` — Show in services list
                    </span>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer pt-2 border-t border-slate-200 mt-2">
                    <input
                      type="checkbox"
                      checked={Boolean(formData.emergencyAvailable)}
                      onChange={(e) =>
                        setFormData({ ...formData, emergencyAvailable: e.target.checked })
                      }
                      className="w-4 h-4 text-rose-500 rounded border-slate-300 focus:ring-rose-500"
                    />
                    <span className="text-sm text-rose-600 font-semibold">
                      `emergencyAvailable` — 24/7 Emergency Available
                    </span>
                  </label>
                </div>
              </div>
            )}

            {/* 3. LINKED ASSIGNMENTS TAB */}
            {formTab === "assignments" && (
              <div className="space-y-6">
                {/* Features (`features`) */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles size={14} className="text-blue-600" />
                    `features` ({formData.features?.length || 0} selected)
                  </label>
                  {allFeatures.length > 0 ? (
                    <div className="max-h-36 overflow-y-auto p-3 bg-slate-50 border border-slate-200 rounded-xl grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {allFeatures.map((f) => {
                        const isSelected = formData.features?.includes(f._id);
                        return (
                          <div
                            key={f._id}
                            onClick={() => toggleSelection("features", f._id)}
                            className={`p-2 rounded-lg border text-xs font-medium cursor-pointer transition flex items-center justify-between ${
                              isSelected
                                ? "bg-blue-50 border-blue-300 text-blue-800"
                                : "bg-white border-slate-200 text-slate-600 hover:bg-slate-100"
                            }`}
                          >
                            <span className="truncate">{f.name}</span>
                            {isSelected && <Check size={14} className="text-blue-600 shrink-0" />}
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400 italic bg-slate-50 p-3 rounded-xl border border-slate-200">
                      No features registered yet.
                    </p>
                  )}
                </div>

                {/* Diseases (`diseases`) */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
                    <Activity size={14} className="text-rose-600" />
                    `diseases` ({formData.diseases?.length || 0} selected)
                  </label>
                  {allDiseases.length > 0 ? (
                    <div className="max-h-36 overflow-y-auto p-3 bg-slate-50 border border-slate-200 rounded-xl grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {allDiseases.map((d) => {
                        const isSelected = formData.diseases?.includes(d._id);
                        return (
                          <div
                            key={d._id}
                            onClick={() => toggleSelection("diseases", d._id)}
                            className={`p-2 rounded-lg border text-xs font-medium cursor-pointer transition flex items-center justify-between ${
                              isSelected
                                ? "bg-rose-50 border-rose-300 text-rose-800"
                                : "bg-white border-slate-200 text-slate-600 hover:bg-slate-100"
                            }`}
                          >
                            <span className="truncate">{d.name}</span>
                            {isSelected && <Check size={14} className="text-rose-600 shrink-0" />}
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400 italic bg-slate-50 p-3 rounded-xl border border-slate-200">
                      No diseases registered yet.
                    </p>
                  )}
                </div>

                {/* Doctors (`doctors`) */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
                    <User size={14} className="text-purple-600" />
                    `doctors` ({formData.doctors?.length || 0} selected)
                  </label>
                  {allDoctors.length > 0 ? (
                    <div className="max-h-36 overflow-y-auto p-3 bg-slate-50 border border-slate-200 rounded-xl grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {allDoctors.map((doc) => {
                        const isSelected = formData.doctors?.includes(doc._id);
                        return (
                          <div
                            key={doc._id}
                            onClick={() => toggleSelection("doctors", doc._id)}
                            className={`p-2 rounded-lg border text-xs font-medium cursor-pointer transition flex items-center justify-between ${
                              isSelected
                                ? "bg-purple-50 border-purple-300 text-purple-800"
                                : "bg-white border-slate-200 text-slate-600 hover:bg-slate-100"
                            }`}
                          >
                            <span className="truncate">Dr. {doc.name}</span>
                            {isSelected && <Check size={14} className="text-purple-600 shrink-0" />}
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400 italic bg-slate-50 p-3 rounded-xl border border-slate-200">
                      No doctors registered yet.
                    </p>
                  )}
                </div>
              </div>
            )}
          </form>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end gap-3 p-6 pt-4 border-t border-slate-100 bg-slate-50 shrink-0">
          <button
            type="button"
            onClick={closeModal}
            className="px-4 py-2.5 border border-slate-200 bg-white rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50 transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="departmentForm"
            disabled={loading}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-semibold shadow-md shadow-blue-500/10 transition cursor-pointer disabled:opacity-70"
          >
            {loading ? "Saving..." : isEditModalOpen ? "Save Changes" : "Add Department"}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default DepartmentFormModal;
