import { useState, useEffect, useMemo, memo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Phone,
  Mail,
  MapPin,
  Send,
  MessageSquare,
  Clock,
  ShieldCheck,
  Building2,
  Calendar,
  Sparkles,
  CheckCircle2
} from "lucide-react";
import { sendMessage } from "../../redux/features/message/messageThunk";
import { fetchAllDepartments } from "../../redux/features/department/departmentThunk";
import { openAppointmentModal } from "../../redux/features/patient/patientSlice";
import toast from "react-hot-toast";

const ContactSection = memo(() => {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const location = useLocation();

  const { departments = [], loading: deptsLoading } = useSelector((state) => state.department || {});
  const { settings } = useSelector((state) => state.setting || { settings: null });
  const emergencyPhone = settings?.emergencyPhone || "9937566625";
  const generalPhone = settings?.phone || "8895062072";
  const altPhones = ["7653899199", "0663-4075199"];
  const emailAddress = settings?.email || "ruasc.burla@gmail.com";
  const hospitalAddress = settings?.address || "Sourav Vihar, Burla, Sambalpur - 768017, Odisha";

  // Filter published/active departments from Redux store dynamically
  const activeDepartments = useMemo(() => {
    return (departments || []).filter(
      (dept) => dept && dept.published !== false && dept.name
    );
  }, [departments]);

  const queryDept = searchParams.get("department") || searchParams.get("service") || location.state?.department || "";

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    department: queryDept,
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!departments || departments.length === 0) {
      dispatch(fetchAllDepartments());
    }
  }, [dispatch, departments?.length]);

  useEffect(() => {
    if (queryDept) {
      setFormData((prev) => ({ ...prev, department: queryDept }));
    }
  }, [queryDept]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "phone") {
      const sanitized = value.replace(/\D/g, "").slice(0, 10);
      setFormData((prev) => ({ ...prev, phone: sanitized }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || formData.name.trim().length < 3) {
      toast.error("Name must be at least 3 characters");
      return;
    }
    if (!formData.phone) {
      toast.error("Phone number is required");
      return;
    }

    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(formData.phone)) {
      toast.error("Phone number must be exactly 10 digits");
      return;
    }

    if (formData.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        toast.error("Invalid email format");
        return;
      }
    }

    if (!formData.message || formData.message.trim().length < 3) {
      toast.error("Message must be at least 3 characters");
      return;
    }

    try {
      setIsSubmitting(true);
      const payload = {
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        email: formData.email?.trim() || undefined,
        subject: formData.department ? `Dept Inquiry: ${formData.department}` : "General Patient Inquiry",
        message: formData.message.trim()
      };

      await dispatch(sendMessage(payload)).unwrap();
      toast.success("Thank you! Your message has been sent to our Sambalpur care team.");
      setFormData({
        name: "",
        phone: "",
        email: "",
        department: "",
        message: ""
      });
    } catch (err) {
      toast.error(err || "Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-12 sm:py-16 ">
      <div className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8">

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">

          {/* ── LEFT COLUMN: CONTACT DETAILS & 24/7 HELPLINES ── */}
          <div className="lg:col-span-5 space-y-6">

            {/* Header pill */}
            <div>
             
              <h2 className="text-2xl sm:text-3xl font-medium text-[#012442] tracking-tight">
                Get in Touch with Our Team
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                Whether you need priority stone surgery counseling, OPD doctor schedules, or urgent helpline assistance in Sambalpur, we are here to support you.
              </p>
            </div>

            {/* Card 1: 24/7 Emergency & Stone Helpline (High-Contrast Navy Card) */}
            <div className="bg-gradient-to-br from-[#012442] via-[#024363] to-[#012442] text-white rounded-3xl p-6 sm:p-7 shadow-lg border border-[#0FA8D6]/25 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#0FA8D6]/15 rounded-full blur-2xl pointer-events-none" />

              <div className="flex items-start gap-4 mb-4 relative z-10">
                <div className="w-12 h-12 rounded-2xl bg-[#0FA8D6]/20 border border-[#0FA8D6]/40 text-[#0FA8D6] flex items-center justify-center shrink-0 shadow-xs">
                  <Phone size={22} />
                </div>
                <div>
                  <span className="text-[10.5px] font-extrabold text-[#0FA8D6] uppercase tracking-wider block">
                    Immediate Care
                  </span>
                  <h4 className="text-base sm:text-lg font-medium text-white">
                    24/7 Stone & Urology Helpline
                  </h4>
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-white/10 relative z-10 text-xs sm:text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Priority Helpline:</span>
                  <a
                    href={`tel:${generalPhone}`}
                    className="font-extrabold text-[#0FA8D6] hover:text-white transition-colors no-underline"
                  >
                    +91 {generalPhone}
                  </a>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">24/7 Emergency:</span>
                  <a
                    href={`tel:${emergencyPhone}`}
                    className="font-extrabold text-white hover:text-[#0FA8D6] transition-colors no-underline"
                  >
                    +91 {emergencyPhone}
                  </a>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-300">
                  <span>Other Phone Lines:</span>
                  <div className="flex gap-2 font-bold text-slate-200">
                    <a href="tel:7653899199" className="hover:text-[#0FA8D6] transition-colors">+91 7653899199</a>
                    <span>•</span>
                    <a href="tel:06634075199" className="hover:text-[#0FA8D6] transition-colors">0663-4075199</a>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-white/10 flex items-center gap-2 text-[11px] text-cyan-200">
                <ShieldCheck size={14} className="text-[#0FA8D6]" />
                <span>NABH SHCO Certified • Ayushman & GJAY Cashless</span>
              </div>
            </div>

            {/* Card 2: OPD Timing & Patient Inquiries */}
            <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xs">
              <div className="flex items-start gap-4 mb-3">
                <div className="w-11 h-11 rounded-2xl bg-[#0FA8D6]/10 border border-[#0FA8D6]/20 text-[#024363] flex items-center justify-center shrink-0">
                  <Clock size={20} className="text-[#0FA8D6]" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-[#012442]">OPD & Consultation Hours</h4>
                  <p className="text-xs text-slate-500">Monday to Saturday: 08:00 AM – 08:00 PM</p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 space-y-2 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <Mail size={13} className="text-[#0FA8D6]" />
                  <a href={`mailto:${emailAddress}`} className="text-slate-700 hover:text-[#0FA8D6] font-semibold no-underline">
                    {emailAddress}
                  </a>
                </div>
              </div>
            </div>

            {/* Card 3: Hospital Campus Location */}
            <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xs">
              <div className="flex items-start gap-4 mb-3">
                <div className="w-11 h-11 rounded-2xl bg-[#0FA8D6]/10 border border-[#0FA8D6]/20 text-[#024363] flex items-center justify-center shrink-0">
                  <MapPin size={20} className="text-[#0FA8D6]" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-[#012442]">Hospital Campus</h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    {hospitalAddress}
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-500 font-medium">Accessible via NH-53 / Budharaja Bridge</span>
                <button
                  onClick={() => dispatch(openAppointmentModal())}
                  className="text-xs font-bold text-[#024363] hover:text-[#0FA8D6] cursor-pointer border-none bg-transparent"
                >
                  Book Visit →
                </button>
              </div>
            </div>

          </div>

          {/* ── RIGHT COLUMN: INTERACTIVE INQUIRY FORM ── */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 md:p-10 shadow-xs relative overflow-hidden">

              {/* Subtle top ambient bar */}


              <div className="flex items-center gap-3 mb-6 sm:mb-8">
                <div className="w-11 h-11 rounded-2xl bg-[#0FA8D6]/15 border border-[#0FA8D6]/30 flex items-center justify-center text-[#024363] shadow-xs">
                  <MessageSquare size={20} className="text-[#0FA8D6]" />
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-medium text-[#012442] tracking-tight">
                    Start a Conversation
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Our patient relations coordinators in Sambalpur typically respond within a few hours.
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Full Name */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-[#012442] uppercase tracking-wider block">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="e.g. Ankit Sharma"
                      className="w-full bg-slate-50 border border-slate-200 hover:border-slate-300 focus:border-[#0FA8D6] focus:bg-white text-slate-800 rounded-xl px-4 py-3 text-xs sm:text-sm outline-none transition-all placeholder:text-slate-400 shadow-xs focus:ring-2 focus:ring-[#0FA8D6]/15 font-medium"
                    />
                  </div>

                  {/* Phone */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-[#012442] uppercase tracking-wider block">
                      Phone Number (10 Digits) *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="98XXXXXXXX"
                      className="w-full bg-slate-50 border border-slate-200 hover:border-slate-300 focus:border-[#0FA8D6] focus:bg-white text-slate-800 rounded-xl px-4 py-3 text-xs sm:text-sm outline-none transition-all placeholder:text-slate-400 shadow-xs focus:ring-2 focus:ring-[#0FA8D6]/15 font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Email */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-[#012442] uppercase tracking-wider block">
                      Email Address (Optional)
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      className="w-full bg-slate-50 border border-slate-200 hover:border-slate-300 focus:border-[#0FA8D6] focus:bg-white text-slate-800 rounded-xl px-4 py-3 text-xs sm:text-sm outline-none transition-all placeholder:text-slate-400 shadow-xs focus:ring-2 focus:ring-[#0FA8D6]/15 font-medium"
                    />
                  </div>

                  {/* Department / Urology Service select */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-[#012442] uppercase tracking-wider block">
                      Choose a Department / Service (Optional)
                    </label>
                    <select
                      name="department"
                      value={formData.department}
                      onChange={handleChange}
                      className="w-full bg-slate-50 border border-slate-200 hover:border-slate-300 focus:border-[#0FA8D6] focus:bg-white text-slate-800 rounded-xl px-4 py-3 text-xs sm:text-sm outline-none transition-all cursor-pointer shadow-xs focus:ring-2 focus:ring-[#0FA8D6]/15 font-medium"
                    >
                      <option value="">Select Urology Service / Department</option>
                      {activeDepartments.length > 0 ? (
                        activeDepartments.map((dept) => (
                          <option key={dept._id || dept.name} value={dept.name}>
                            {dept.name}
                          </option>
                        ))
                      ) : deptsLoading ? (
                        <option value="" disabled>Loading Urology Services...</option>
                      ) : null}
                    </select>
                  </div>
                </div>

                {/* Message */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-[#012442] uppercase tracking-wider block">
                    Your Message or Health Inquiry *
                  </label>
                  <textarea
                    name="message"
                    required
                    rows="4"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Describe how we can help you with appointments, treatment details, or doctor consultations..."
                    className="w-full bg-slate-50 border border-slate-200 hover:border-slate-300 focus:border-[#0FA8D6] focus:bg-white text-slate-800 rounded-xl px-4 py-3 text-xs sm:text-sm outline-none transition-all placeholder:text-slate-400 resize-none shadow-xs focus:ring-2 focus:ring-[#0FA8D6]/15 font-medium"
                  />
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 bg-[#00B4EA] hover:from-[#00b4ea] hover:to-[#013550] text-white font-medium py-4 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 active:scale-98 disabled:opacity-60 cursor-pointer uppercase tracking-wider text-xs sm:text-sm border-none"
                >
                  <Send size={15} />
                  <span>{isSubmitting ? "Sending Inquiry..." : "Submit "}</span>
                </button>
              </form>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
});

ContactSection.displayName = "ContactSection";
export default ContactSection;
