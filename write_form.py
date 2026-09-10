
content = r"""import { useState, useEffect, memo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { Send } from "lucide-react";
import { sendMessage } from "../../redux/features/message/messageThunk";
import { fetchAllDepartments } from "../../redux/features/department/departmentThunk";
import toast from "react-hot-toast";

/* ── Label helper ─────────────────────────────────────────── */
const FieldLabel = ({ children }) => (
  <label className="block text-[11px] font-bold text-[#607373] uppercase tracking-[0.06em] mb-[9px]">
    {children}
  </label>
);

/* ── Shared input / select / textarea base classes ────────── */
const inputBase = [
  "w-full h-[58px] bg-[#F7FAFA] border border-[#DDE7E7]",
  "rounded-[12px] px-5 text-[15px] font-medium text-[#263B3B]",
  "placeholder:text-[#9BB5B5] placeholder:font-normal",
  "outline-none appearance-none",
  "transition-[border-color,box-shadow] duration-200",
  "hover:border-[#A8C8C0]",
  "focus:border-[#00875a] focus:ring-2 focus:ring-[#00875a]/10 focus:bg-white",
].join(" ");

/* ── ContactForm Component ──────────────────────────────────── */
const ContactForm = memo(() => {
  const dispatch = useDispatch();
  const { departments = [] } = useSelector((state) => state.department || {});

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    department: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  /* Load departments for select */
  useEffect(() => {
    if (!departments || departments.length === 0) {
      dispatch(fetchAllDepartments());
    }
  }, [dispatch, departments.length]);

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

    /* — Validation — */
    if (!formData.name || formData.name.trim().length < 2) {
      toast.error("Please enter your full name");
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
        toast.error("Please enter a valid email address");
        return;
      }
    }
    if (!formData.message || formData.message.trim().length < 3) {
      toast.error("Please enter your message (at least 3 characters)");
      return;
    }

    try {
      setIsSubmitting(true);
      const payload = {
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim() || "not-provided@contact.form",
        subject: formData.department
          ? `Dept Inquiry: ${formData.department}`
          : "General Contact Inquiry",
        message: formData.message.trim(),
      };

      await dispatch(sendMessage(payload)).unwrap();
      toast.success("Thank you! Your message has been sent successfully.");
      setFormData({ name: "", phone: "", email: "", department: "", message: "" });
    } catch (err) {
      toast.error(err || "Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  /* — Fallback department list when API returns nothing — */
  const deptOptions =
    departments && departments.length > 0
      ? departments
      : [
          { _id: "u", name: "Urology" },
          { _id: "gm", name: "General Medicine" },
          { _id: "gs", name: "General Surgery" },
          { _id: "r", name: "Radiology" },
          { _id: "p", name: "Pathology" },
          { _id: "o", name: "Other" },
        ];

  return (
    /* ── Outer wrapper: pulls the card up over the hero bottom ── */
    <section
      className="relative z-10 -mt-12 pb-16 px-4 sm:px-6"
      aria-label="Contact inquiry form"
    >
      <motion.div
        className={[
          /* Card container */
          "max-w-[1100px] mx-auto",
          "bg-white rounded-[24px]",
          "border border-[#E5EFED]",
          "shadow-[0_12px_48px_rgba(0,75,75,0.10),0_2px_8px_rgba(0,75,75,0.05)]",
          /* Generous desktop padding */
          "px-8 py-10 sm:px-12 sm:py-12 md:px-16 md:py-14",
        ].join(" ")}
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, delay: 0.1, ease: "easeOut" }}
      >
        <form onSubmit={handleSubmit} noValidate>
          {/* ── ROW 1: Full Name + Phone ─────────────────────── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8 mb-7">
            {/* Full Name */}
            <div>
              <FieldLabel>Full Name *</FieldLabel>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. John Doe"
                className={inputBase}
              />
            </div>

            {/* Phone Number */}
            <div>
              <FieldLabel>Phone Number *</FieldLabel>
              <input
                type="tel"
                name="phone"
                required
                value={formData.phone}
                onChange={handleChange}
                placeholder="90XXXXXXXX"
                inputMode="numeric"
                maxLength={10}
                className={inputBase}
              />
            </div>
          </div>

          {/* ── ROW 2: Email + Department ────────────────────── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8 mb-7">
            {/* Email */}
            <div>
              <FieldLabel>Email Address (Optional)</FieldLabel>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your.email@example.com"
                className={inputBase}
              />
            </div>

            {/* Department select */}
            <div>
              <FieldLabel>Department (Optional)</FieldLabel>
              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
                className={[
                  inputBase,
                  "cursor-pointer pr-10",
                  /* Custom caret color */
                  "bg-[image:url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23607373' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E\")]",
                  "bg-no-repeat bg-[right_16px_center]",
                ].join(" ")}
              >
                <option value="" className="text-[#9BB5B5]">
                  Select Department
                </option>
                {deptOptions.map((dept, i) => (
                  <option key={dept._id || i} value={dept.name}>
                    {dept.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* ── ROW 3: Message (full width) ──────────────────── */}
          <div className="mb-9">
            <FieldLabel>Your Message *</FieldLabel>
            <textarea
              name="message"
              required
              value={formData.message}
              onChange={handleChange}
              rows={5}
              placeholder="How can we help you today?"
              className={[
                "w-full bg-[#F7FAFA] border border-[#DDE7E7]",
                "rounded-[12px] px-5 py-4",
                "text-[15px] font-medium text-[#263B3B]",
                "placeholder:text-[#9BB5B5] placeholder:font-normal",
                "outline-none resize-none",
                "transition-[border-color,box-shadow] duration-200",
                "hover:border-[#A8C8C0]",
                "focus:border-[#00875a] focus:ring-2 focus:ring-[#00875a]/10 focus:bg-white",
                "leading-relaxed align-top",
              ].join(" ")}
            />
          </div>

          {/* ── ROW 4: Submit button ─────────────────────────── */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={[
              "w-full flex items-center justify-center gap-3",
              "bg-gradient-to-r from-[#00875a] to-[#006F5B]",
              "hover:from-[#007a50] hover:to-[#006050]",
              "active:scale-[0.99]",
              "text-white font-bold uppercase tracking-[0.08em] text-[13px]",
              "h-[58px] rounded-[12px]",
              "shadow-[0_6px_24px_rgba(0,135,90,0.28)]",
              "hover:shadow-[0_8px_32px_rgba(0,135,90,0.38)]",
              "transition-all duration-300 cursor-pointer border-none",
              "disabled:opacity-55 disabled:cursor-not-allowed",
            ].join(" ")}
          >
            {isSubmitting ? (
              <>Sending...</>
            ) : (
              <>
                Send Inquiry
                <Send className="w-[16px] h-[16px] shrink-0" strokeWidth={2.2} />
              </>
            )}
          </button>
        </form>
      </motion.div>
    </section>
  );
});

ContactForm.displayName = "ContactForm";
export default ContactForm;
"""

import os
out = os.path.join("src", "components", "Contact", "ContactForm.jsx")
with open(out, "w", encoding="utf-8", newline="\n") as f:
    f.write(content.lstrip("\n"))
print(f"Written {len(content)} chars → {out}")
