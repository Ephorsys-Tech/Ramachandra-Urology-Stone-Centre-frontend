import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, User, Clock, Phone, Building, Mail } from "lucide-react";
import { closeAppointmentModal } from "../redux/features/patient/patientSlice";
import { fetchAllDepartments } from "../redux/features/department/departmentThunk";
import { submitAppointmentRequest } from "../redux/features/appointmentRequest/appointmentRequestThunk";
import toast from "react-hot-toast";

const TIME_SLOTS = [
  "09:00 AM - 11:00 AM",
  "11:00 AM - 01:00 PM",
  "02:00 PM - 04:00 PM",
  "04:00 PM - 06:00 PM",
];

export default function AppointmentModal() {
  const dispatch = useDispatch();
  const { isAppointmentModalOpen, preselectedDepartment } = useSelector((state) => state.patient);
  const { departments } = useSelector((state) => state.department);
  const { loading } = useSelector((state) => state.appointmentRequest);

  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "Male",
    phone: "",
    email: "",
    department: "",
    date: "",
    timeSlot: "09:00 AM - 11:00 AM",
    message: "",
  });

  // Fetch departments if not already loaded
  useEffect(() => {
    if (isAppointmentModalOpen && departments.length === 0) {
      dispatch(fetchAllDepartments());
    }
  }, [isAppointmentModalOpen, departments.length, dispatch]);

  // Sync preselected department if modal opens with one
  const [prevIsOpen, setPrevIsOpen] = useState(false);
  const [prevDeptsLength, setPrevDeptsLength] = useState(0);

  if (isAppointmentModalOpen !== prevIsOpen || departments.length !== prevDeptsLength) {
    setPrevIsOpen(isAppointmentModalOpen);
    setPrevDeptsLength(departments.length);
    if (isAppointmentModalOpen) {
      setFormData((prev) => ({
        ...prev,
        ...(isAppointmentModalOpen !== prevIsOpen ? {
          name: "",
          age: "",
          gender: "Male",
          phone: "",
          email: "",
          date: new Date().toISOString().split("T")[0],
          timeSlot: TIME_SLOTS[0],
          message: "",
        } : {}),
        department: preselectedDepartment || prev.department || (departments.length > 0 ? departments[0].name : ""),
      }));
    }
  }

  const handleClose = () => {
    dispatch(closeAppointmentModal());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, age, gender, phone, department, date, timeSlot } = formData;

    if (!name || !age || !phone || !department || !date || !timeSlot) {
      toast.error("Please fill in all required fields.");
      return;
    }

    if (name.trim().length < 3) {
      toast.error("Name must be at least 3 characters.");
      return;
    }

    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phone)) {
      toast.error("Phone number must be exactly 10 digits.");
      return;
    }

    const requestPayload = {
      name: name.trim(),
      age: parseInt(age),
      gender,
      phone: phone.trim(),
      email: formData.email?.trim() || undefined,
      department,
      preferredDate: date,
      preferredTimeSlot: timeSlot,
      message: formData.message?.trim() || undefined,
    };

    try {
      const result = await dispatch(submitAppointmentRequest(requestPayload));
      if (submitAppointmentRequest.fulfilled.match(result)) {
        toast.success("Appointment request submitted! Our team will contact you shortly.");
        handleClose();
      } else {
        toast.error(result.payload || "Failed to submit appointment request.");
      }
    } catch {
      toast.error("An unexpected error occurred.");
    }
  };

  return (
    <AnimatePresence>
      {isAppointmentModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto">
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-[#040d1a]/70 backdrop-blur-md"
          />

          {/* Modal Container (Next-Gen Frosted Glass Capsule Card) */}
          <motion.div
            initial={{ scale: 0.92, opacity: 0, y: 25 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.92, opacity: 0, y: 25 }}
            transition={{ type: "spring", duration: 0.45, bounce: 0.15 }}
            className="relative w-full max-w-sm sm:max-w-lg md:max-w-xl bg-white/95 backdrop-blur-2xl rounded-3xl border border-white/80 shadow-[0_25px_60px_rgba(11,92,158,0.22),0_4px_16px_rgba(0,0,0,0.06)] overflow-hidden z-10 p-5 sm:p-7 md:p-8"
          >
            {/* Ambient Background Glow */}
            <div className="absolute top-0 right-0 w-52 h-52 bg-[#07a7a5]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-52 h-52 bg-[#0b5c9e]/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />

            {/* Header */}
            <div className="flex items-start justify-between pb-3 sm:pb-4 mb-4 border-b border-slate-100/80 gap-3 relative z-10">
              <div className="flex-1">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-teal-50 border border-teal-200/60 rounded-full text-[11px] font-bold text-[#07a7a5] uppercase tracking-wider mb-2">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Usthi Hospital</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-extrabold text-slate-800 tracking-tight">
                  Book Your <span className="text-[#0b5c9e]">Appointment</span>
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Fill in your details below and our medical coordinators will confirm your slot.
                </p>
              </div>
              <button
                onClick={handleClose}
                className="w-9 h-9 flex items-center justify-center bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 rounded-full transition-all cursor-pointer border-none flex-shrink-0 active:scale-90"
                aria-label="Close modal"
              >
                <X size={18} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4 max-h-[68vh] overflow-y-auto pr-1 relative z-10 scrollbar-thin">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-3.5">
                {/* Full Name */}
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#07a7a5] flex-shrink-0" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. John Doe"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50/80 border border-slate-200 hover:border-slate-300 focus:border-[#07a7a5] focus:bg-white rounded-xl text-sm outline-none transition-all placeholder:text-slate-400 text-slate-800 shadow-xs focus:shadow-[0_0_0_3px_rgba(7,167,165,0.15)]"
                    />
                  </div>
                </div>

                {/* Age */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                    Age *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    max="120"
                    placeholder="e.g. 28"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50/80 border border-slate-200 hover:border-slate-300 focus:border-[#07a7a5] focus:bg-white rounded-xl text-sm outline-none transition-all placeholder:text-slate-400 text-slate-800 shadow-xs focus:shadow-[0_0_0_3px_rgba(7,167,165,0.15)]"
                  />
                </div>

                {/* Gender */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                    Gender
                  </label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50/80 border border-slate-200 hover:border-slate-300 focus:border-[#07a7a5] focus:bg-white rounded-xl text-sm outline-none transition-all text-slate-700 cursor-pointer shadow-xs focus:shadow-[0_0_0_3px_rgba(7,167,165,0.15)]"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {/* Phone */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                    Phone Number *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#07a7a5] flex-shrink-0" />
                    <input
                      type="tel"
                      required
                      placeholder="90XXXXXXXX"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, "").slice(0, 10) })}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50/80 border border-slate-200 hover:border-slate-300 focus:border-[#07a7a5] focus:bg-white rounded-xl text-sm outline-none transition-all placeholder:text-slate-400 text-slate-800 shadow-xs focus:shadow-[0_0_0_3px_rgba(7,167,165,0.15)]"
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                    Email (Optional)
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#07a7a5] flex-shrink-0" />
                    <input
                      type="email"
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50/80 border border-slate-200 hover:border-slate-300 focus:border-[#07a7a5] focus:bg-white rounded-xl text-sm outline-none transition-all placeholder:text-slate-400 text-slate-800 shadow-xs focus:shadow-[0_0_0_3px_rgba(7,167,165,0.15)]"
                    />
                  </div>
                </div>

                {/* Department */}
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                    Select Department *
                  </label>
                  <div className="relative">
                    <Building className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#07a7a5] flex-shrink-0 pointer-events-none" />
                    <select
                      value={formData.department}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                      required
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50/80 border border-slate-200 hover:border-slate-300 focus:border-[#07a7a5] focus:bg-white rounded-xl text-sm outline-none transition-all text-slate-700 cursor-pointer shadow-xs focus:shadow-[0_0_0_3px_rgba(7,167,165,0.15)]"
                    >
                      <option value="">Choose Department</option>
                      {departments.map((dept, idx) => (
                        <option key={dept._id || idx} value={dept.name}>
                          {idx + 1}. {dept.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Preferred Date */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                    Preferred Date *
                  </label>
                  <input
                    type="date"
                    required
                    min={new Date().toISOString().split("T")[0]}
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50/80 border border-slate-200 hover:border-slate-300 focus:border-[#07a7a5] focus:bg-white rounded-xl text-sm outline-none transition-all text-slate-700 cursor-pointer shadow-xs focus:shadow-[0_0_0_3px_rgba(7,167,165,0.15)]"
                  />
                </div>

                {/* Preferred Time Slot */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                    Preferred Time Slot *
                  </label>
                  <div className="relative">
                    <Clock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#07a7a5] flex-shrink-0 pointer-events-none" />
                    <select
                      value={formData.timeSlot}
                      onChange={(e) => setFormData({ ...formData, timeSlot: e.target.value })}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50/80 border border-slate-200 hover:border-slate-300 focus:border-[#07a7a5] focus:bg-white rounded-xl text-sm outline-none transition-all text-slate-700 cursor-pointer shadow-xs focus:shadow-[0_0_0_3px_rgba(7,167,165,0.15)]"
                    >
                      {TIME_SLOTS.map((slot) => (
                        <option key={slot} value={slot}>
                          {slot}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Message */}
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                    Message / Symptoms (Optional)
                  </label>
                  <textarea
                    rows="2"
                    placeholder="Describe your health concern or symptoms..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50/80 border border-slate-200 hover:border-slate-300 focus:border-[#07a7a5] focus:bg-white rounded-xl text-sm outline-none transition-all placeholder:text-slate-400 text-slate-800 resize-none shadow-xs focus:shadow-[0_0_0_3px_rgba(7,167,165,0.15)]"
                  />
                </div>
              </div>

              {/* Submit Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 sm:pt-4 border-t border-slate-100 mt-4 flex-col-reverse sm:flex-row">
                <button
                  type="button"
                  onClick={handleClose}
                  className="w-full sm:w-auto px-5 py-2.5 border border-slate-200 hover:bg-slate-100 rounded-full text-xs font-bold text-slate-600 transition-all cursor-pointer bg-transparent uppercase tracking-wider"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:w-auto px-7 py-2.5 bg-gradient-to-r from-[#07a7a5] to-[#0b5c9e] hover:opacity-95 text-white rounded-full text-xs font-extrabold shadow-[0_4px_16px_rgba(7,167,165,0.35)] transition-all active:scale-95 cursor-pointer border-none disabled:opacity-70 uppercase tracking-wider"
                >
                  {loading ? "Submitting..." : "Confirm & Submit"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
