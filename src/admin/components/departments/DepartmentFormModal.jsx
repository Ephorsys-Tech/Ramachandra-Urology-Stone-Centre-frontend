import { motion } from "framer-motion";
import { X } from "lucide-react";

const DepartmentFormModal = ({
  isEditModalOpen,
  closeModal,
  formTab,
  setFormTab,
  formData,
  setFormData,
  handleImageUpload,
  handleSubmit,
  loading
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={closeModal} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
      <motion.div initial={{ scale: 0.95, opacity: 0, y: 15 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 15 }} transition={{ duration: 0.25 }} className="relative w-full max-w-2xl bg-white rounded-2xl border border-slate-100 shadow-2xl overflow-hidden z-10 flex flex-col max-h-[90vh]">
        
        <div className="flex items-center justify-between border-b border-slate-100 p-6 pb-4 bg-white shrink-0">
          <div>
            <h3 className="text-lg font-bold text-slate-800">{isEditModalOpen ? "Edit Department" : "Add New Department"}</h3>
            <p className="text-xs text-slate-450">Configure department details, media, and visibility settings.</p>
          </div>
          <button onClick={closeModal} className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"><X size={18} className="text-slate-400" /></button>
        </div>

        {/* Tabs header */}
        <div className="flex border-b border-slate-200 px-6 shrink-0 bg-slate-50/50">
          {["basic", "media", "settings"].map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setFormTab(tab)}
              className={`py-3 px-4 text-sm font-semibold capitalize transition-colors relative ${formTab === tab ? "text-blue-600" : "text-slate-500 hover:text-slate-700"}`}
            >
              {tab === "basic" ? "Basic Info" : tab === "media" ? "Media & Content" : "Display Settings"}
              {formTab === tab && <motion.div layoutId="deptTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-t-full" />}
            </button>
          ))}
        </div>

        <div className="p-6 overflow-y-auto">
          <form id="departmentForm" onSubmit={handleSubmit} className="space-y-4">
            
            {/* BASIC INFO TAB */}
            {formTab === "basic" && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-500 uppercase block">Name *</label>
                    <input type="text" required placeholder="Cardiology" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-blue-500 rounded-xl text-sm outline-none transition" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-500 uppercase block">Category</label>
                    <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-blue-500 rounded-xl text-sm outline-none transition">
                      <option value="General">General</option>
                      <option value="Specialized">Specialized</option>
                    </select>
                  </div>
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500 uppercase block">Short Description *</label>
                  <textarea rows="2" required placeholder="Brief summary (used in cards)..." value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-blue-500 rounded-xl text-sm outline-none transition resize-none" />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500 uppercase block">Features / Treatments (Comma separated)</label>
                  <textarea rows="2" placeholder="ECG, Angiography, Pacemaker..." value={formData.features} onChange={(e) => setFormData({ ...formData, features: e.target.value })} className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-blue-500 rounded-xl text-sm outline-none transition resize-none" />
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500 uppercase block">Diseases Treated (Comma separated)</label>
                  <textarea rows="2" placeholder="Heart Attack, Arrhythmia..." value={formData.diseases} onChange={(e) => setFormData({ ...formData, diseases: e.target.value })} className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-blue-500 rounded-xl text-sm outline-none transition resize-none" />
                </div>
              </div>
            )}

            {/* MEDIA & CONTENT TAB */}
            {formTab === "media" && (
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500 uppercase block">Main Image *</label>
                  <div className="flex items-center gap-3">
                    {formData.image && (
                      <img src={formData.image} alt="Preview" className="w-10 h-10 rounded-lg object-cover border border-slate-200" />
                    )}
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500 uppercase block">Brand Color (Hex)</label>
                  <div className="flex items-center gap-2">
                    <input type="color" value={formData.color} onChange={(e) => setFormData({ ...formData, color: e.target.value })} className="w-10 h-10 rounded cursor-pointer border-0 p-0" />
                    <input type="text" value={formData.color} onChange={(e) => setFormData({ ...formData, color: e.target.value })} className="flex-1 px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-blue-500 rounded-xl text-sm outline-none transition" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500 uppercase block">Full Page Content *</label>
                  <textarea rows="6" required placeholder="Detailed description for the department's dedicated page..." value={formData.content} onChange={(e) => setFormData({ ...formData, content: e.target.value })} className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-blue-500 rounded-xl text-sm outline-none transition resize-none" />
                </div>
              </div>
            )}

            {/* SETTINGS TAB */}
            {formTab === "settings" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-500 uppercase block">OPD Timings</label>
                    <input type="text" placeholder="Mon-Sat, 9AM-5PM" value={formData.opdTime} onChange={(e) => setFormData({ ...formData, opdTime: e.target.value })} className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-blue-500 rounded-xl text-sm outline-none transition" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-500 uppercase block">Display Order Index</label>
                    <input type="number" placeholder="0" value={formData.orderIndex} onChange={(e) => setFormData({ ...formData, orderIndex: e.target.value })} className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-blue-500 rounded-xl text-sm outline-none transition" />
                  </div>
                </div>

                <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 space-y-3">
                  <h4 className="text-sm font-bold text-slate-800 border-b border-slate-200 pb-2">Visibility Options</h4>
                  
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" checked={formData.published} onChange={(e) => setFormData({ ...formData, published: e.target.checked })} className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500" />
                    <span className="text-sm text-slate-700 font-medium">Published (Visible to public)</span>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" checked={formData.showInHomePage} onChange={(e) => setFormData({ ...formData, showInHomePage: e.target.checked })} className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500" />
                    <span className="text-sm text-slate-700 font-medium">Show in Home Page Carousel</span>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" checked={formData.showInServicesPage} onChange={(e) => setFormData({ ...formData, showInServicesPage: e.target.checked })} className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500" />
                    <span className="text-sm text-slate-700 font-medium">Show in Services/Treatments Page</span>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer pt-2 border-t border-slate-200 mt-2">
                    <input type="checkbox" checked={formData.emergencyAvailable} onChange={(e) => setFormData({ ...formData, emergencyAvailable: e.target.checked })} className="w-4 h-4 text-rose-500 rounded border-slate-300 focus:ring-rose-500" />
                    <span className="text-sm text-rose-600 font-semibold">24/7 Emergency Available</span>
                  </label>
                </div>
              </div>
            )}
          </form>
        </div>

        <div className="flex items-center justify-end gap-3 p-6 pt-4 border-t border-slate-100 bg-slate-50 shrink-0">
          <button type="button" onClick={closeModal} className="px-4 py-2.5 border border-slate-200 bg-white rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50 transition cursor-pointer">Cancel</button>
          <button type="submit" form="departmentForm" disabled={loading} className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-semibold shadow-md shadow-blue-500/10 transition cursor-pointer disabled:opacity-70">
            {loading ? "Saving..." : (isEditModalOpen ? "Save Changes" : "Add Department")}
          </button>
        </div>

      </motion.div>
    </div>
  );
};

export default DepartmentFormModal;
