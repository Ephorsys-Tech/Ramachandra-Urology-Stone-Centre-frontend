import { useState, useEffect, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { submitAppointmentRequest } from "../redux/features/appointmentRequest/appointmentRequestThunk";
import { sendMessage } from "../redux/features/message/messageThunk";
import { openAppointmentModal } from "../redux/features/patient/patientSlice";
import toast from "react-hot-toast";
import {
  ChevronLeft,
  ChevronRight,
  Stethoscope,
  Building2,
  Calendar,
  HeartHandshake,
  X
} from "lucide-react";

const slides = [
  {
    img: "https://res.cloudinary.com/drqb4p2a2/image/upload/v1787568072/dj_inb2ih.png",
    mobileImg: "https://res.cloudinary.com/drqb4p2a2/image/upload/v1787568923/ChatGPT_Image_Aug_24_2026_04_25_05_PM_torwta.png", // Mobile image url here
    alt: "Usthi Hospital Banner 1",
  },
  {
    img: "https://res.cloudinary.com/drqb4p2a2/image/upload/v1787555588/1I5A4339_1_kx1liu.webp",
    mobileImg: "https://res.cloudinary.com/drqb4p2a2/image/upload/v1787555588/1I5A4339_1_kx1liu.webp", // Mobile image url here
    alt: "Usthi Hospital Advanced Operation Theatre & Diagnostics",
  },
  {
    img: "https://res.cloudinary.com/drqb4p2a2/image/upload/v1787555589/1I5A4435_1_mbsm4v.webp",
    mobileImg: "https://res.cloudinary.com/drqb4p2a2/image/upload/v1787555589/1I5A4435_1_mbsm4v.webp", // Mobile image url here
    alt: "Usthi Hospital Healthcare Specialists",
  },
];

export default function HeroSection() {
  const dispatch = useDispatch();
  const { departments } = useSelector((state) => state.department || { departments: [] });
  const { loading } = useSelector((state) => state.appointmentRequest || { loading: false });

  const [cur, setCur] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [isFormVisible, setIsFormVisible] = useState(true);
  const trackRef = useRef(null);
  const timerRef = useRef(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    department: "",
  });

  const handleBookingSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      if (!formData.name || !formData.phone || !formData.department) {
        toast.error("Please fill in all required fields");
        return;
      }

      const phoneRegex = /^[0-9]{10}$/;
      if (!phoneRegex.test(formData.phone)) {
        toast.error("Phone number must be exactly 10 digits");
        return;
      }

      const payload = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        department: formData.department,
        age: 25,
        gender: "Other",
        preferredDate: new Date().toISOString().split("T")[0],
        preferredTimeSlot: "09:00 AM - 11:00 AM",
        message: "Booked from Hero Quick Form",
      };

      try {
        const result = await dispatch(submitAppointmentRequest(payload));

        const messagePayload = {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          subject: formData.department
            ? `Appointment Request: ${formData.department}`
            : "Appointment Request",
          message: "Booked from Hero Quick Form",
        };
        await dispatch(sendMessage(messagePayload));

        if (submitAppointmentRequest.fulfilled.match(result)) {
          toast.success("Appointment request submitted successfully!");
          setFormData({ name: "", email: "", phone: "", department: "" });
        } else {
          toast.error(result.payload || "Failed to submit request.");
        }
      } catch {
        toast.error("An unexpected error occurred.");
      }
    },
    [dispatch, formData]
  );

  const goTo = useCallback(
    (next) => {
      if (animating || next === cur) return;
      setAnimating(true);
      if (trackRef.current) {
        trackRef.current.style.transition = "transform 0.75s cubic-bezier(0.77,0,0.18,1)";
        trackRef.current.style.transform = `translateX(-${next * (100 / slides.length)}%)`;
      }
      setTimeout(() => {
        setCur(next);
        setAnimating(false);
      }, 760);
    },
    [animating, cur]
  );

  const resetTimer = useCallback(() => {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCur((c) => {
        const next = (c + 1) % slides.length;
        if (trackRef.current) {
          trackRef.current.style.transition = "transform 0.75s cubic-bezier(0.77,0,0.18,1)";
          trackRef.current.style.transform = `translateX(-${next * (100 / slides.length)}%)`;
        }
        return next;
      });
    }, 5500);
  }, []);

  useEffect(() => {
    resetTimer();
    return () => clearInterval(timerRef.current);
  }, [resetTimer]);

  const nextSlide = useCallback(() => {
    const next = (cur + 1) % slides.length;
    goTo(next);
    resetTimer();
  }, [cur, goTo, resetTimer]);

  const prevSlide = useCallback(() => {
    const prev = cur === 0 ? slides.length - 1 : cur - 1;
    goTo(prev);
    resetTimer();
  }, [cur, goTo, resetTimer]);

  return (
    <section className="flex flex-col w-full font-sans select-none">
      {/* ── 1. MAIN HERO BANNER CAROUSEL ── */}
      <div className="relative w-full overflow-hidden h-[42vh] sm:h-[60vh] lg:h-[calc(100vh-115px)] min-h-[300px] sm:min-h-[460px] lg:min-h-[600px] bg-slate-900">
        {/* Horizontal Track */}
        <div
          ref={trackRef}
          className="absolute top-0 left-0 h-full flex"
          style={{ width: `${slides.length * 100}%`, transform: "translateX(0%)" }}
        >
          {slides.map((slide, i) => (
            <div
              key={i}
              className="relative h-full"
              style={{ width: `${100 / slides.length}%` }}
            >
              <picture className="w-full h-full block">
                {slide.mobileImg && (
                  <source media="(max-width: 768px)" srcSet={slide.mobileImg} />
                )}
                <img
                  src={slide.img}
                  alt={slide.alt}
                  loading={i === 0 ? "eager" : "lazy"}
                  className="w-full h-full object-cover object-center brightness-[0.98]"
                />
              </picture>
            </div>
          ))}
        </div>

        {/* Ambient Subtle Gradients */}
        <div className="absolute inset-0 z-[2] pointer-events-none bg-gradient-to-r from-black/25 via-transparent to-black/15" />
        <div className="absolute bottom-0 left-0 right-0 h-24 z-[2] pointer-events-none bg-gradient-to-t from-black/30 to-transparent" />

        {/* Swipe Navigation Buttons (Glass Pill) */}
        {slides.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                prevSlide();
              }}
              className="absolute left-12 sm:left-14 lg:left-16 top-1/2 -translate-y-1/2 z-[8] w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center bg-white/20 hover:bg-white/40 active:scale-95 text-white backdrop-blur-md border border-white/30 shadow-md cursor-pointer transition-all duration-300 group"
              aria-label="Previous banner"
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 transition-transform group-hover:-translate-x-0.5" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                nextSlide();
              }}
              className="absolute right-12 sm:right-14 lg:right-16 top-1/2 -translate-y-1/2 z-[8] w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center bg-white/20 hover:bg-white/40 active:scale-95 text-white backdrop-blur-md border border-white/30 shadow-md cursor-pointer transition-all duration-300 group"
              aria-label="Next banner"
            >
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 transition-transform group-hover:translate-x-0.5" />
            </button>
          </>
        )}

        {/* Pill Indicators */}
        {slides.length > 1 && (
          <div className="absolute bottom-5 left-0 right-0 z-[7] flex items-center justify-center gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  goTo(i);
                  resetTimer();
                }}
                className={`h-2 rounded-full border-none cursor-pointer p-0 transition-all duration-300 ${
                  cur === i
                    ? "w-8 bg-emerald-400 shadow-sm"
                    : "w-2.5 bg-white/50 hover:bg-white/80"
                }`}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── 2. 4-COLUMN QUICK FEATURES CARD (BELOW HERO, NO OVERLAY) ── */}
      <div className="max-w-7xl mx-auto px-4 w-full py-6 sm:py-8 relative z-10">
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-[0_15px_40px_rgba(0,0,0,0.06)] p-3 sm:p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-100/90">
          {/* Card 1: Book Appointment */}
          <div
            onClick={() => dispatch(openAppointmentModal())}
            className="flex items-center justify-between p-3 sm:p-4 hover:bg-slate-50/80 rounded-2xl transition-all cursor-pointer group"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100 group-hover:scale-105 transition-transform">
                <Calendar className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                  Book Appointment
                </h4>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Schedule your visit
                </p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 group-hover:text-emerald-600 transition-all shrink-0" />
          </div>

          {/* Card 2: Find a Doctor */}
          <Link
            to="/doctors"
            className="flex items-center justify-between p-3 sm:p-4 hover:bg-slate-50/80 rounded-2xl transition-all cursor-pointer group no-underline"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100 group-hover:scale-105 transition-transform">
                <Stethoscope className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                  Find a Doctor
                </h4>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Connect with experts
                </p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 group-hover:text-emerald-600 transition-all shrink-0" />
          </Link>

          {/* Card 3: Our Departments */}
          <Link
            to="/departments"
            className="flex items-center justify-between p-3 sm:p-4 hover:bg-slate-50/80 rounded-2xl transition-all cursor-pointer group no-underline"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100 group-hover:scale-105 transition-transform">
                <Building2 className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                  Our Departments
                </h4>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Comprehensive care
                </p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 group-hover:text-emerald-600 transition-all shrink-0" />
          </Link>

          {/* Card 4: Patient Support */}
          <Link
            to="/contact"
            className="flex items-center justify-between p-3 sm:p-4 hover:bg-slate-50/80 rounded-2xl transition-all cursor-pointer group no-underline"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100 group-hover:scale-105 transition-transform">
                <HeartHandshake className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                  Patient Support
                </h4>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  We are here to help
                </p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 group-hover:text-emerald-600 transition-all shrink-0" />
          </Link>
        </div>
      </div>

      {/* ── 3. MOBILE APPOINTMENT QUICK CARD ── */}
      {isFormVisible && (
        <div className="w-full bg-slate-50 py-10 px-4 sm:px-6 lg:hidden flex justify-center border-b border-slate-200 mt-6">
          <div className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-7 shadow-[0_15px_40px_rgba(0,0,0,0.06)] border border-slate-200/90">
            <button
              onClick={() => setIsFormVisible(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 transition-colors p-1 bg-transparent border-none cursor-pointer"
              aria-label="Close"
            >
              <X size={20} />
            </button>
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 uppercase tracking-wider mb-1">
              <Calendar size={15} /> Quick Booking
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-4 font-sans tracking-tight">
              Book an Appointment
            </h3>
            <form onSubmit={handleBookingSubmit} className="space-y-3.5">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. John Doe"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-emerald-600 focus:bg-white transition text-sm text-slate-800 placeholder:text-slate-400 font-medium"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="10-digit mobile number"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value.replace(/\D/g, "").slice(0, 10) })
                  }
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-emerald-600 focus:bg-white transition text-sm text-slate-800 placeholder:text-slate-400 font-medium"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Department *
                </label>
                <select
                  required
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-emerald-600 focus:bg-white transition text-sm text-slate-800 font-medium cursor-pointer"
                >
                  <option value="">Select Clinical Department</option>
                  {departments.map((d) => (
                    <option key={d._id} value={d.name}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-gradient-to-r from-[#00875a] to-[#007a87] hover:opacity-95 text-white font-bold rounded-xl transition-all shadow-sm mt-3 disabled:opacity-60 cursor-pointer border-none uppercase tracking-wider text-xs"
              >
                {loading ? "Submitting..." : "Submit Appointment Request"}
              </button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
