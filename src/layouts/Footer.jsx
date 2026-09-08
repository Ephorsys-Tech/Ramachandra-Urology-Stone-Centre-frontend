import { Link } from "react-router-dom";
import {
  Phone, Mail, MapPin, Heart, ArrowRight, ExternalLink,
  Clock, ShieldAlert, Award, ChevronRight, Shield
} from "lucide-react";
import { FaFacebook, FaTwitter, FaInstagram, FaYoutube, FaLinkedin } from "react-icons/fa";
import { memo, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { openAppointmentModal } from "../redux/features/patient/patientSlice";
import { fetchAllDepartments } from "../redux/features/department/departmentThunk";

const Footer = memo(() => {
  const dispatch = useDispatch();
  const { settings } = useSelector((state) => state.setting || {});
  const { departments } = useSelector((state) => state.department || {});

  useEffect(() => {
    if (!departments || departments.length === 0) {
      dispatch(fetchAllDepartments());
    }
  }, [dispatch, departments]);

  const quickLinks = [
    { to: "/", label: "Home" },
    { to: "/about", label: "About Us" },
    { to: "/doctors", label: "Our Doctors" },
    { to: "/departments", label: "Specialties" },
    { to: "/gallery", label: "Gallery" },
    { to: "/blog", label: "Health Library" },
    { to: "/contact", label: "Contact Us" },
  ];

  // Dynamic specialties from backend departments, fall back to static list if none
  const specialties = (departments && departments.length > 0)
    ? departments.map((dept) => ({
        to: `/departments/${dept.slug || dept._id}`,
        label: dept.name,
      }))
    : [
        { to: "/departments", label: "Orthopedics" },
        { to: "/departments", label: "Radiology" },
        { to: "/departments", label: "Pathology Department" },
        { to: "/departments", label: "General Medicine Department" },
        { to: "/departments", label: "Dermatology Department" },
        { to: "/departments", label: "Cardiology" },
        { to: "/departments", label: "Pediatrics" },
        { to: "/departments", label: "ENT" },
        { to: "/departments", label: "Plastic Surgery Department" },
        { to: "/departments", label: "Gynecology" },
        { to: "/departments", label: "Urology" },
        { to: "/departments", label: "Surgery Department" },
        { to: "/departments", label: "Pulmonology" },
        { to: "/departments", label: "Advanced Laser Surgery Department" },
      ];

  const patientResources = [
    { to: "/doctors", label: "Find a Doctor" },
    { to: "/contact", label: "Health Checkup Packages" },
    { to: "/contact", label: "OPD Schedules" },
    { to: "/contact", label: "FAQs" },
    { to: "/contact", label: "Feedback & Grievances" },
  ];

  return (
    <footer className="bg-[#091e36] text-slate-300 font-sans border-t border-slate-800">

      {/* ── TOP EMERGENCY & BOOKING CTA STRIP ── */}
      <div className="bg-gradient-to-r from-[#006972] to-[#0b5c9e] py-8 px-6 relative overflow-hidden shadow-inner">
        <div className="absolute inset-0 bg-black/10 pointer-events-none" />
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-6 relative z-10">
          <div className="text-center lg:text-left">
            <h3 className="text-xl md:text-2xl font-black text-white flex items-center justify-center lg:justify-start gap-2.5">
              <ShieldAlert className="w-6 h-6 animate-pulse text-red-400 shrink-0" />
              <span>Need Emergency Medical Assistance?</span>
            </h3>
            <p className="text-white/80 text-sm mt-1 max-w-2xl">
              Our trauma center and ambulance services are fully operational 24/7 for critical care and emergencies.
            </p>
          </div>
          <div className="w-full lg:w-auto flex flex-col xs:flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 lg:gap-4 shrink-0 px-2 sm:px-0">
            <a
              href="tel:9090963722"
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#ce2127] hover:bg-[#b01c21] text-white font-extrabold px-3 sm:px-6 py-2.5 sm:py-3.5 rounded-lg sm:rounded-xl transition-all shadow-md no-underline active:scale-95 text-xs sm:text-sm uppercase tracking-wider animate-shimmer text-center whitespace-nowrap"
            >
              <Phone className="w-4 h-4 sm:w-4.5 sm:h-4.5 animate-bounce shrink-0" /> <span>Emergency: 9090963722</span>
            </a>
            <button
              onClick={() => dispatch(openAppointmentModal())}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-[#0b5c9e] font-extrabold px-3 sm:px-6 py-2.5 sm:py-3.5 rounded-lg sm:rounded-xl transition-all shadow-md border-none cursor-pointer active:scale-95 text-xs sm:text-sm uppercase tracking-wider text-center whitespace-nowrap"
            >
              <span>Book Now</span> <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#07a7a5]" />
            </button>
          </div>
        </div>
      </div>

      {/* ── MAIN FOOTER CONTENT ── */}
      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">

        {/* Column 1: Hospital Brand & Accreditation (lg:col-span-4) */}
        <div className="lg:col-span-4 md:col-span-2 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-xl bg-white flex items-center justify-center shadow-md overflow-hidden shrink-0 border border-slate-750">
              <img
                src={settings?.logo || "https://res.cloudinary.com/dk03rjvzz/image/upload/v1781075359/Usthi_Banner_z40chg.png"}
                alt="Usthi Hospital"
                className="w-full h-full object-contain p-1.5"
              />
            </div>
            <div>
              <div className="text-lg font-black text-white tracking-tight font-sans leading-tight">
                {settings?.hospitalName || "Usthi Hospital"}
              </div>
              <div className="text-[10px] text-[#07a7a5] font-extrabold uppercase tracking-widest mt-0.5">
                {settings?.tagline || "Caring For Life"}
              </div>
            </div>
          </div>

          <p className="text-slate-400 text-[13.5px] leading-relaxed">
            Usthi Hospital is a state-of-the-art multi-specialty healthcare institution dedicated to providing international standard clinical care with compassion, ethics, and advanced diagnostics.
          </p>

          {/* Accreditation Badges */}
          <div className="flex flex-wrap gap-2 pt-2">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/60 border border-slate-700/50 text-[10px] font-bold text-slate-300 uppercase tracking-wider">
              <Award className="w-3.5 h-3.5 text-[#07a7a5]" />
              <span>NABH Guidelines Compliant</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/60 border border-slate-700/50 text-[10px] font-bold text-slate-300 uppercase tracking-wider">
              <Shield className="w-3.5 h-3.5 text-[#07a7a5]" />
              <span>24/7 ICU & Critical Care</span>
            </div>
          </div>

          {/* Social Media Links */}
          <div className="flex gap-2.5 pt-2">
            {[
              { icon: FaFacebook, href: "https://facebook.com", label: "Facebook" },
              { icon: FaTwitter, href: "https://twitter.com", label: "Twitter" },
              { icon: FaInstagram, href: "https://instagram.com", label: "Instagram" },
              { icon: FaYoutube, href: "https://youtube.com", label: "YouTube" },
              { icon: FaLinkedin, href: "https://linkedin.com", label: "LinkedIn" },
            ].map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="w-9 h-9 rounded-lg bg-slate-850 hover:bg-[#07a7a5] hover:text-white flex items-center justify-center transition-all duration-300 hover:-translate-y-0.5 border border-slate-700/40 text-slate-400"
              >
                <Icon className="w-4.5 h-4.5" />
              </a>
            ))}
          </div>
        </div>

        {/* Column 2: Clinical Specialties (lg:col-span-2) */}
        <div className="lg:col-span-2 md:col-span-1 space-y-6">
          <h4 className="text-white font-extrabold text-sm uppercase tracking-wider relative pb-3 border-b border-slate-800 flex items-center gap-2">
            <span className="w-1.5 h-4 bg-[#07a7a5] rounded-full" />
            Specialties
          </h4>
          <ul className="space-y-3.5 m-0 p-0 list-none text-sm">
            {specialties.map((dept, index) => (
              <li key={index}>
                <Link
                  to={dept.to}
                  className="text-slate-400 hover:text-[#07a7a5] flex items-center gap-1 transition-colors group no-underline"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-[#07a7a5] transition-colors" />
                  <span>{dept.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 3: Patient Resources (lg:col-span-2) */}
        <div className="lg:col-span-2 md:col-span-1 space-y-6">
          <h4 className="text-white font-extrabold text-sm uppercase tracking-wider relative pb-3 border-b border-slate-800 flex items-center gap-2">
            <span className="w-1.5 h-4 bg-[#07a7a5] rounded-full" />
            Patient Care
          </h4>
          <ul className="space-y-3.5 m-0 p-0 list-none text-sm">
            {patientResources.map((res, index) => (
              <li key={index}>
                <Link
                  to={res.to}
                  className="text-slate-400 hover:text-[#07a7a5] flex items-center gap-1 transition-colors group no-underline"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-[#07a7a5] transition-colors" />
                  <span>{res.label}</span>
                </Link>
              </li>
            ))}
            {/* Quick links addition */}
            {quickLinks.slice(0, 3).map((link, idx) => (
              <li key={`qk-${idx}`}>
                <Link
                  to={link.to}
                  className="text-slate-400 hover:text-[#07a7a5] flex items-center gap-1 transition-colors group no-underline"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-[#07a7a5] transition-colors" />
                  <span>{link.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 4: Reach Us / Location Info (lg:col-span-4) */}
        <div className="lg:col-span-4 md:col-span-2 space-y-6">
          <h4 className="text-white font-extrabold text-sm uppercase tracking-wider relative pb-3 border-b border-slate-800 flex items-center gap-2">
            <span className="w-1.5 h-4 bg-[#07a7a5] rounded-full" />
            Reach Us
          </h4>
          <div className="space-y-4.5 text-sm">

            {/* Address */}
            <div className="flex items-start gap-3">
              <MapPin className="w-4.5 h-4.5 text-[#07a7a5] shrink-0 mt-0.5" />
              <div className="space-y-1.5">
                <p className="m-0 text-slate-300 leading-relaxed">
                  Plot No: N4-1/1, IRC Village, Nayapalli, Bhubaneswar, Odisha 751015
                </p>
                <a
                  href="https://maps.google.com/?q=Usthi+Hospital+Nayapalli+Bhubaneswar"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-bold text-[#07a7a5] hover:text-[#0b5c9e] transition-colors no-underline uppercase tracking-wider"
                >
                  <span>Get Directions</span>
                  <ExternalLink size={11} />
                </a>
              </div>
            </div>

            {/* Phone lines */}
            <div className="flex items-start gap-3">
              <Phone className="w-4.5 h-4.5 text-[#07a7a5] shrink-0 mt-0.5" />
              <div className="space-y-2">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">24/7 Helpline & Emergency</span>
                  <a href="tel:+919090963722" className="text-white hover:text-[#07a7a5] transition-colors no-underline font-bold block">
                    +91 90909 63722
                  </a>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">Helpdesk / Reception</span>
                  <div className="flex flex-wrap gap-x-3 gap-y-0.5">
                    <a href="tel:06742556223" className="text-slate-300 hover:text-[#07a7a5] transition-colors no-underline font-semibold">
                      0674-2556223
                    </a>
                    <span className="text-slate-600">|</span>
                    <a href="tel:06743583753" className="text-slate-300 hover:text-[#07a7a5] transition-colors no-underline font-semibold">
                      0674-3583753
                    </a>
                  </div>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">OPD Appointments & Inquiries</span>
                  <div className="flex flex-wrap gap-x-3 gap-y-0.5">
                    <a href="tel:06742550312" className="text-slate-300 hover:text-[#07a7a5] transition-colors no-underline font-semibold">
                      0674-2550312
                    </a>
                    <span className="text-slate-600">|</span>
                    <a href="tel:06742556267" className="text-slate-300 hover:text-[#07a7a5] transition-colors no-underline font-semibold">
                      0674-2556267
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-center gap-3">
              <Mail className="w-4.5 h-4.5 text-[#07a7a5] shrink-0" />
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-500 block">General Enquiries</span>
                <a href="mailto:info@usthihospital.com" className="text-slate-300 hover:text-[#07a7a5] transition-colors no-underline block">
                  info@usthihospital.com
                </a>
              </div>
            </div>

            {/* OPD Timings */}
            <div className="flex items-start gap-3 pt-2">
              <Clock className="w-4.5 h-4.5 text-[#07a7a5] shrink-0 mt-0.5" />
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-500 block">OPD Timings</span>
                <span className="text-slate-300 text-xs leading-normal block">
                  Mon – Sat: 8:00 AM – 9:00 PM <br />
                  Sun: 9:00 AM – 2:00 PM
                </span>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* ── MEDICAL DISCLAIMER PANEL ── */}
      <div className="border-t border-slate-800/80 bg-black/10 py-6 px-6 text-center">
        <div className="max-w-4xl mx-auto space-y-2.5">
          <p className="text-[11px] text-slate-500 leading-relaxed m-0 text-justify md:text-center">
            <span className="font-bold text-slate-400 block mb-1">MEDICAL DISCLAIMER:</span>
            The health and medical information provided on this website is for educational and general knowledge purposes only and must not be taken as professional medical advice, diagnosis, or treatment. Always consult a licensed healthcare physician or qualified medical professional regarding any clinical queries or conditions. Never disregard or delay seeking professional advice due to content read on this portal.
          </p>
        </div>
      </div>

      {/* ── COPYRIGHT & DEVELOPER CREDITS BOTTOM BAR ── */}
      <div className="border-t border-slate-800/80 py-5 px-6 bg-black/20 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-450">
          <p className="m-0 text-slate-400">
            © {new Date().getFullYear()} {settings?.hospitalName || "Usthi Hospital"}. All rights reserved.
          </p>
          <p className="flex items-center gap-1 m-0 text-slate-400">
            Developed with <Heart className="w-3 h-3 text-[#ce2127] fill-[#ce2127] mx-0.5" /> by <a href="https://ephorsys.com/" target="_blank" rel="noopener noreferrer" className="text-[#07a7a5] hover:underline font-bold">Ephorsys Tech</a>
          </p>
        </div>
      </div>
    </footer>
  );
});

Footer.displayName = "Footer";
export default Footer;