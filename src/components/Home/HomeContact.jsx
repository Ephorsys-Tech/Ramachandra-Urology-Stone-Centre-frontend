import { useState, useEffect, memo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { Phone, Mail, MapPin, Send, MessageSquare } from "lucide-react";
import { sendMessage } from "../../redux/features/message/messageThunk";
import { fetchAllDepartments } from "../../redux/features/department/departmentThunk";
import toast from "react-hot-toast";

const HomeContact = memo(() => {
  const dispatch = useDispatch();
  const { departments = [] } = useSelector((state) => state.department || {});

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    department: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    console.log("Home contact form submit triggered. Data:", formData);

    // Validations
    if (!formData.name || formData.name.trim().length < 3) {
      console.warn("Validation failed: name is less than 3 chars");
      toast.error("Name must be at least 3 characters");
      return;
    }
    if (!formData.phone) {
      console.warn("Validation failed: phone is empty");
      toast.error("Phone number is required");
      return;
    }

    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(formData.phone)) {
      console.warn("Validation failed: phone format is invalid", formData.phone);
      toast.error("Phone number must be exactly 10 digits");
      return;
    }
    if (!formData.email) {
      console.warn("Validation failed: email is empty");
      toast.error("Email address is required");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      console.warn("Validation failed: email format is invalid", formData.email);
      toast.error("Invalid email format");
      return;
    }
    if (!formData.message || formData.message.trim().length < 3) {
      console.warn("Validation failed: message length is less than 3 chars");
      toast.error("Message must be at least 3 characters");
      return;
    }

    try {
      setIsSubmitting(true);
      const payload = {
        name: formData.name,
        phone: formData.phone.trim(),
        email: formData.email.trim(),
        subject: formData.department ? `Dept Inquiry: ${formData.department}` : "General Inquiry",
        message: formData.message.trim()
      };

      console.log("Dispatching sendMessage thunk with payload:", payload);
      const result = await dispatch(sendMessage(payload)).unwrap();
      console.log("sendMessage thunk succeeded. Result:", result);

      toast.success("Thank you! Your message has been sent successfully.");
      setFormData({
        name: "",
        phone: "",
        email: "",
        department: "",
        message: ""
      });
    } catch (err) {
      console.error("sendMessage thunk rejected with error:", err);
      toast.error(err || "Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-24 bg-background relative overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute top-1/2 left-1/4 w-[600px] h-[600px] bg-secondary/5 rounded-full blur-3xl -translate-y-1/2"></div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row gap-16">

          {/* Left: Contact Info */}
          <motion.div
            className="w-full lg:w-5/12"
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block text-tertiary font-bold text-sm tracking-widest uppercase mb-4">
              Get In Touch
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-primary mb-6 font-sans">
              Contact <span className="text-secondary">Us</span>
            </h2>
            <p className="text-slate-600 mb-10 text-lg leading-relaxed">
              Whether you need to book an appointment, have a medical inquiry, or need emergency assistance, our team is always here for you.
            </p>

            <div className="space-y-8">
              {/* Phone Numbers Block */}
              <div className="flex items-start gap-5 group">
                <div className="w-14 h-14 rounded-2xl bg-secondary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-secondary transition-all duration-300 shadow-sm group-hover:shadow-[0_10px_20px_rgba(37,99,235,0.25)]">
                  <Phone className="w-6 h-6 text-secondary group-hover:text-white transition-colors" />
                </div>
                <div className="space-y-2">
                  <h4 className="text-primary font-bold text-lg mb-1">Call Us 24/7</h4>
                  
                  <div>
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Primary Appointment Helpline</span>
                    <a href="tel:+918895062072" className="text-slate-700 font-bold hover:text-secondary transition-colors inline-block mr-3">+91 88950 62072</a>
                  </div>

                  <div className="pt-1">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Emergency & OPD Helplines</span>
                    <div className="flex flex-wrap gap-x-4 gap-y-1">
                      <a href="tel:+919937566625" className="text-slate-700 hover:text-secondary font-medium transition-colors">+91 99375 66625</a>
                      <a href="tel:+917653899199" className="text-slate-700 hover:text-secondary font-medium transition-colors">+91 76538 99199</a>
                      <a href="tel:06634075199" className="text-slate-700 hover:text-secondary font-medium transition-colors">0663-4075199</a>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-5 group">
                <div className="w-14 h-14 rounded-2xl bg-secondary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-secondary transition-all duration-300 shadow-sm group-hover:shadow-[0_10px_20px_rgba(37,99,235,0.25)]">
                  <Mail className="w-6 h-6 text-secondary group-hover:text-white transition-colors" />
                </div>
                <div>
                  <h4 className="text-primary font-bold text-lg mb-1">Email Us</h4>
                  <a href="mailto:ruasc.burla@gmail.com" className="text-slate-600 block hover:text-secondary transition-colors font-medium">ruasc.burla@gmail.com</a>
                </div>
              </div>

              <div className="flex items-start gap-5 group">
                <div className="w-14 h-14 rounded-2xl bg-secondary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-secondary transition-all duration-300 shadow-sm group-hover:shadow-[0_10px_20px_rgba(37,99,235,0.25)]">
                  <MapPin className="w-6 h-6 text-secondary group-hover:text-white transition-colors" />
                </div>
                <div>
                  <h4 className="text-primary font-bold text-lg mb-1">Our Location</h4>
                  <p className="text-slate-600 leading-relaxed font-medium">
                    Sourav Vihar, Burla, Sambalpur - 768017, Odisha
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right: Contact Form (Next-Gen Glassmorphic Card) */}
          <motion.div
            className="w-full lg:w-7/12"
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="bg-white/95 backdrop-blur-2xl border border-white/80 rounded-3xl p-6 sm:p-8 md:p-10 shadow-[0_20px_50px_rgba(11,92,158,0.1),0_4px_16px_rgba(0,0,0,0.04)] relative overflow-hidden">
              {/* Ambient background glow */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#07a7a5]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#0b5c9e]/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />

              <div className="flex items-center gap-3 mb-6 sm:mb-8 relative z-10">
                <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200/60 flex items-center justify-center text-[#07a7a5] shadow-xs">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-slate-800 tracking-tight">Send Us a <span className="text-[#0b5c9e]">Message</span></h3>
                  <p className="text-xs text-slate-400">Our patient relation team usually responds within a few hours.</p>
                </div>
              </div>

              <form className="space-y-4 sm:space-y-5 relative z-10" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider pl-1 block">Full Name *</label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="e.g. John Doe"
                      className="w-full bg-slate-50/80 border border-slate-200 hover:border-slate-300 focus:border-[#07a7a5] focus:bg-white text-slate-800 rounded-xl px-4 py-3 text-sm outline-none transition-all placeholder:text-slate-400 shadow-xs focus:shadow-[0_0_0_3px_rgba(7,167,165,0.15)]"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider pl-1 block">Phone Number *</label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="90XXXXXXXX"
                      className="w-full bg-slate-50/80 border border-slate-200 hover:border-slate-300 focus:border-[#07a7a5] focus:bg-white text-slate-800 rounded-xl px-4 py-3 text-sm outline-none transition-all placeholder:text-slate-400 shadow-xs focus:shadow-[0_0_0_3px_rgba(7,167,165,0.15)]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider pl-1 block">Email Address (Optional)</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="your.email@example.com"
                      className="w-full bg-slate-50/80 border border-slate-200 hover:border-slate-300 focus:border-[#07a7a5] focus:bg-white text-slate-800 rounded-xl px-4 py-3 text-sm outline-none transition-all placeholder:text-slate-400 shadow-xs focus:shadow-[0_0_0_3px_rgba(7,167,165,0.15)]"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider pl-1 block">Department (Optional)</label>
                    <select
                      name="department"
                      value={formData.department}
                      onChange={handleChange}
                      className="w-full bg-slate-50/80 border border-slate-200 hover:border-slate-300 focus:border-[#07a7a5] focus:bg-white text-slate-800 rounded-xl px-4 py-3 text-sm outline-none transition-all cursor-pointer shadow-xs focus:shadow-[0_0_0_3px_rgba(7,167,165,0.15)]"
                    >
                      <option value="" className="bg-white text-slate-800">Select Department</option>
                      {departments && departments.length > 0 ? (
                        departments.map((dept, index) => (
                          <option key={dept._id || index} value={dept.name} className="bg-white text-slate-800">
                            {index + 1}. {dept.name}
                          </option>
                        ))
                      ) : (
                        <>
                          <option value="Cardiology" className="bg-white text-slate-800">1. Cardiology</option>
                          <option value="Neurology" className="bg-white text-slate-800">2. Neurology</option>
                          <option value="Orthopedics" className="bg-white text-slate-800">3. Orthopedics</option>
                          <option value="General" className="bg-white text-slate-800">4. General Consultation</option>
                        </>
                      )}
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider pl-1 block">Your Message *</label>
                  <textarea
                    name="message"
                    required
                    value={formData.message}
                    onChange={handleChange}
                    rows="3"
                    placeholder="How can we help you today?"
                    className="w-full bg-slate-50/80 border border-slate-200 hover:border-slate-300 focus:border-[#07a7a5] focus:bg-white text-slate-800 rounded-xl px-4 py-3 text-sm outline-none transition-all placeholder:text-slate-400 resize-none shadow-xs focus:shadow-[0_0_0_3px_rgba(7,167,165,0.15)]"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex cursor-pointer items-center justify-center gap-2 bg-gradient-to-r from-[#07a7a5] to-[#0b5c9e] hover:opacity-95 text-white font-extrabold py-3.5 rounded-full shadow-[0_6px_20px_rgba(7,167,165,0.35)] transition-all duration-300 active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider text-xs sm:text-sm border-none"
                >
                  {isSubmitting ? "Sending..." : "Send Inquiry"} <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
});

export default HomeContact;
