import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Calendar,
  User,
  Clock,
  Phone,
  Building,
  Mail,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  CalendarCheck
} from "lucide-react";
import { closeAppointmentModal } from "../redux/features/patient/patientSlice";
import { fetchAllDepartments } from "../redux/features/department/departmentThunk";
import { submitAppointmentRequest } from "../redux/features/appointmentRequest/appointmentRequestThunk";
import toast from "react-hot-toast";

const TIME_SLOTS = [
  "09:00 AM - 11:00 AM",
  "11:00 AM - 01:00 PM",
  "02:00 PM - 04:00 PM",
  "04:00 PM - 06:00 PM",
  "06:00 PM - 08:00 PM"
];

export default function AppointmentModal() {
  const dispatch = useDispatch();
  const { isAppointmentModalOpen, preselectedDepartment } = useSelector((state) => state.patient);
  const { departments } = useSelector((state) => state.department || { departments: [] });
  const { loading } = useSelector((state) => state.appointmentRequest || { loading: false });
  const { settings } = useSelector((state) => state.setting || { settings: null });

  const emergencyPhone = settings?.emergencyPhone || "9937566625";

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
        ...(isAppointmentModalOpen !== prevIsOpen
          ? {
              name: "",
              age: "",
              gender: "Male",
              phone: "",
              email: "",
              date: new Date().toISOString().split("T")[0],
              timeSlot: TIME_SLOTS[0],
              message: "",
            }
          : {}),
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
        toast.success("Appointment request submitted! Our care team will contact you shortly.");
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
            className="fixed inset-0 bg-[#012442]/75 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ scale: 0.92, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.92, opacity: 0, y: 20 }}
            transition={{ type: "spring", duration: 0.45, bounce: 0.12 }}
            className="relative w-full max-w-sm sm:max-w-lg md:max-w-xl bg-white rounded-3xl border border-slate-200/90 shadow-[0_25px_60px_rgba(1,36,66,0.25)] overflow-hidden z-10 p-5 sm:p-7 md:p-8 font-sans"
          >
            {/* Ambient Background Glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#0FA8D6]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#024363]/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />

            {/* Header */}
            <div className="flex items-start justify-between pb-4 mb-4 border-b border-slate-100 gap-3 relative z-10">
              <div className="flex-1">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#0FA8D6]/15 border border-[#0FA8D6]/30 rounded-full text-[11px] font-bold text-[#024363] uppercase tracking-wider mb-2 shadow-2xs">
                  <CalendarCheck size={12} className="text-[#0FA8D6]" />
                  <span>Ramachandra Urology & Stone Centre</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-medium text-[#012442] tracking-tight">
                  Book Clinical <span className="text-[#0FA8D6]">Appointment</span>
                </h3>
                <p className="text-xs sm:text-[13px] text-slate-500 mt-0.5 leading-snug">
                  Fill in your details below and our Sambalpur care coordinators will confirm your OPD slot.
                </p>
              </div>
              <button
                onClick={handleClose}
                className="w-9 h-9 flex items-center justify-center bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-[#012442] rounded-full transition-all cursor-pointer border-none shrink-0 active:scale-90"
                aria-label="Close modal"
              >
                <X size={18} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-3.5 max-h-[66vh] overflow-y-auto pr-1 relative z-10 scrollbar-thin">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-3.5">
                
                {/* Full Name */}
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-[11px] font-bold text-[#012442] uppercase tracking-wider block">
                    Patient Full Name *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#0FA8D6] shrink-0" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ramesh Kumar"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 hover:border-slate-300 focus:border-[#0FA8D6] focus:bg-white rounded-xl text-sm outline-none transition-all placeholder:text-slate-400 text-slate-800 shadow-xs focus:ring-2 focus:ring-[#0FA8D6]/15 font-medium"
                    />
                  </div>
                </div>

                {/* Age */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-[#012442] uppercase tracking-wider block">
                    Age *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    max="120"
                    placeholder="e.g. 35"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 hover:border-slate-300 focus:border-[#0FA8D6] focus:bg-white rounded-xl text-sm outline-none transition-all placeholder:text-slate-400 text-slate-800 shadow-xs focus:ring-2 focus:ring-[#0FA8D6]/15 font-medium"
                  />
                </div>

                {/* Gender */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-[#012442] uppercase tracking-wider block">
                    Gender *
                  </label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 hover:border-slate-300 focus:border-[#0FA8D6] focus:bg-white rounded-xl text-sm outline-none transition-all text-slate-700 cursor-pointer shadow-xs focus:ring-2 focus:ring-[#0FA8D6]/15 font-medium"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {/* Phone */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-[#012442] uppercase tracking-wider block">
                    Phone Number (10 Digits) *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#0FA8D6] shrink-0" />
                    <input
                      type="tel"
                      required
                      placeholder="98XXXXXXXX"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, "").slice(0, 10) })}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 hover:border-slate-300 focus:border-[#0FA8D6] focus:bg-white rounded-xl text-sm outline-none transition-all placeholder:text-slate-400 text-slate-800 shadow-xs focus:ring-2 focus:ring-[#0FA8D6]/15 font-medium"
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-[#012442] uppercase tracking-wider block">
                    Email Address (Optional)
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#0FA8D6] shrink-0" />
                    <input
                      type="email"
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 hover:border-slate-300 focus:border-[#0FA8D6] focus:bg-white rounded-xl text-sm outline-none transition-all placeholder:text-slate-400 text-slate-800 shadow-xs focus:ring-2 focus:ring-[#0FA8D6]/15 font-medium"
                    />
                  </div>
                </div>

                {/* Department */}
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-[11px] font-bold text-[#012442] uppercase tracking-wider block">
                    Clinical Department / Wing *
                  </label>
                  <div className="relative">
                    <Building className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#0FA8D6] shrink-0 pointer-events-none" />
                    <select
                      value={formData.department}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                      required
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 hover:border-slate-300 focus:border-[#0FA8D6] focus:bg-white rounded-xl text-sm outline-none transition-all text-slate-800 cursor-pointer shadow-xs focus:ring-2 focus:ring-[#0FA8D6]/15 font-semibold"
                    >
                      <option value="">Choose Clinical Department</option>
                      {departments.map((dept, idx) => (
                        <option key={dept._id || idx} value={dept.name}>
                          {dept.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Preferred Date */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-[#012442] uppercase tracking-wider block">
                    Preferred Date *
                  </label>
                  <input
                    type="date"
                    required
                    min={new Date().toISOString().split("T")[0]}
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 hover:border-slate-300 focus:border-[#0FA8D6] focus:bg-white rounded-xl text-sm outline-none transition-all text-slate-800 cursor-pointer shadow-xs focus:ring-2 focus:ring-[#0FA8D6]/15 font-medium"
                  />
                </div>

                {/* Preferred Time Slot */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-[#012442] uppercase tracking-wider block">
                    Preferred Time Slot *
                  </label>
                  <div className="relative">
                    <Clock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#0FA8D6] shrink-0 pointer-events-none" />
                    <select
                      value={formData.timeSlot}
                      onChange={(e) => setFormData({ ...formData, timeSlot: e.target.value })}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 hover:border-slate-300 focus:border-[#0FA8D6] focus:bg-white rounded-xl text-sm outline-none transition-all text-slate-800 cursor-pointer shadow-xs focus:ring-2 focus:ring-[#0FA8D6]/15 font-medium"
                    >
                      {TIME_SLOTS.map((slot) => (
                        <option key={slot} value={slot}>
                          {slot}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Symptoms / Note */}
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-[11px] font-bold text-[#012442] uppercase tracking-wider block">
                    Symptoms or Specific Medical Concern (Optional)
                  </label>
                  <textarea
                    rows="2"
                    placeholder="Briefly describe your symptoms (e.g., severe back pain, stone consultation, prostate checkup)..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 hover:border-slate-300 focus:border-[#0FA8D6] focus:bg-white rounded-xl text-sm outline-none transition-all placeholder:text-slate-400 text-slate-800 resize-none shadow-xs focus:ring-2 focus:ring-[#0FA8D6]/15 font-medium"
                  />
                </div>
              </div>

              {/* 24/7 Helpline Strip */}
              <div className="flex items-center justify-between bg-slate-50 border border-slate-200/90 rounded-xl p-3 text-xs">
                <div className="flex items-center gap-1.5 text-slate-600 font-medium">
                  <ShieldCheck size={14} className="text-[#0FA8D6]" />
                  <span>Immediate Assistance?</span>
                </div>
                <a
                  href={`tel:${emergencyPhone}`}
                  className="font-extrabold text-[#024363] hover:text-[#0FA8D6] no-underline transition-colors flex items-center gap-1"
                >
                  <Phone size={12} className="text-[#0FA8D6]" />
                  <span>Call +91 {emergencyPhone}</span>
                </a>
              </div>

              {/* Submit Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 flex-col-reverse sm:flex-row">
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
                  className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-[#0FA8D6] to-[#024363] hover:from-[#00b4ea] hover:to-[#013550] text-white rounded-full text-xs font-medium shadow-md hover:shadow-lg transition-all active:scale-95 cursor-pointer border-none disabled:opacity-70 uppercase tracking-wide flex items-center justify-center gap-2"
                >
                  <Calendar size={13} />
                  <span>{loading ? "Submitting..." : "Confirm & Book Slot"}</span>
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

