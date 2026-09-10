import { Link } from "react-router-dom";
import {
  Phone,
  Mail,
  MapPin,
  Heart,
  ArrowRight,
  ExternalLink,
  Clock,
  Award,
  ChevronRight,
  ShieldCheck,
  Calendar,
  Ambulance,
  Activity,
  Sparkles,
  Stethoscope,
  CheckCircle2,
} from "lucide-react";
import { FaFacebook, FaTwitter, FaInstagram, FaYoutube, FaLinkedin } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
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
  }, [dispatch, departments?.length]);

  const hospitalName = "Ramachandra Urology & Stone Centre";
  const emergencyPhone = settings?.emergencyPhone || "9090963722";
  const generalPhone = settings?.phone || "8065906200";
  const hospitalEmail = settings?.email || "contact@ramachandraurology.com";
  const hospitalAddress = "VSS Marg / Farm Road, Sambalpur, Odisha, India 768001";

  const quickLinks = [
    { to: "/", label: "Home" },
    { to: "/about", label: "About us" },
    { to: "/doctors", label: "Find a Doctor" },
    { to: "/departments", label: "Clinical Centers" },
    { to: "/gallery", label: "Infrastructure & Gallery" },
    { to: "/blog", label: "Health Library & Blog" },
    { to: "/contact", label: "Contact Us" },
  ];

  const additionalLinks = [
    { to: "/contact", label: "Cashless Insurance & TPA" },
    { to: "/contact", label: "24/7 Laser Stone OPD" },
    { to: "/contact", label: "Patient Admission Guide" },
    { to: "/contact", label: "Visiting Hours & Guidelines" },
    { to: "/contact", label: "Ayushman Bharat (PM-JAY)" },
    { to: "/contact", label: "Biju Swasthya Kalyan (BSKY)" },
    { to: "/contact", label: "FAQs & Patient Support" },
  ];

  // Dynamic specialties / centers from backend departments
  const displaySpecialtiesCol1 = (departments && departments.length > 0)
    ? departments.slice(0, 4).map((dept) => ({
        to: `/departments/${dept.slug || dept._id}`,
        label: dept.name,
      }))
    : [
        { to: "/departments", label: "Advanced Laser Urology" },
        { to: "/departments", label: "Kidney Stone & RIRS / PCNL" },
        { to: "/departments", label: "Nephrology & Renal Care" },
        { to: "/departments", label: "Laparoscopic Keyhole Surgery" },
      ];

  const displaySpecialtiesCol2 = (departments && departments.length > 4)
    ? departments.slice(4, 8).map((dept) => ({
        to: `/departments/${dept.slug || dept._id}`,
        label: dept.name,
      }))
    : [
        { to: "/departments", label: "Uro-Oncology & Prostate Care" },
        { to: "/departments", label: "Andrology & Men's Health" },
        { to: "/departments", label: "24/7 Emergency & ICU Trauma" },
        { to: "/departments", label: "In-House Lab & Diagnostics" },
      ];

  return (
    <footer className="bg-[#eaf4f9] text-[#1e293b] font-sans select-none border-t border-[#0FA8D6]/20">
      
      {/* ── 1. ANKURA-STYLE TOP HEADER ROW: LOGO + REGISTERED ADDRESS + CIRCULAR SOCIAL ICONS ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-[#0FA8D6]/20">
          
          {/* Left: Logo & Registered Address */}
          <div className="flex items-start sm:items-center gap-4">
            <Link to="/" className="w-14 h-14 rounded-2xl bg-white p-1.5 flex items-center justify-center shadow-sm shrink-0 border border-[#0FA8D6]/30 group">
              <img
                src="/logo.png"
                alt="Ramachandra Hospital Logo"
                className="w-full h-full object-contain group-hover:scale-105 transition-transform"
              />
            </Link>

            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="text-base sm:text-lg font-black text-[#012442] tracking-tight">
                  {hospitalName}
                </span>
                <span className="text-[10px] bg-[#024363] text-white px-2 py-0.5 rounded-full font-extrabold uppercase tracking-widest hidden sm:inline-block">
                  Sambalpur
                </span>
              </div>
              <div className="text-xs text-[#024363] font-medium leading-relaxed max-w-xl">
                <span className="font-bold text-[#012442]">Registered Address: </span>
                {hospitalAddress}
              </div>
            </div>
          </div>

          {/* Right: Circular White Social Icons */}
          <div className="flex items-center gap-2.5 self-start lg:self-center">
            {[
              { icon: FaXTwitter, href: "https://twitter.com", label: "X (Twitter)" },
              { icon: FaFacebook, href: "https://facebook.com", label: "Facebook" },
              { icon: FaInstagram, href: "https://instagram.com", label: "Instagram" },
              { icon: FaLinkedin, href: "https://linkedin.com", label: "LinkedIn" },
              { icon: FaYoutube, href: "https://youtube.com", label: "YouTube" },
            ].map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="w-10 h-10 rounded-full bg-white text-[#012442] hover:bg-[#0FA8D6] hover:text-white flex items-center justify-center transition-all duration-300 shadow-xs hover:shadow-md hover:-translate-y-0.5 border border-[#0FA8D6]/20"
              >
                <Icon className="w-4 h-4" />
              </a>
            ))}
          </div>

        </div>
      </div>

      {/* ── 2. ANKURA-STYLE MULTI-COLUMN CONTENT SECTION ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-8">
          
          {/* ── COLUMN 1: QUICK LINKS (lg:col-span-3) ── */}
          <div className="lg:col-span-3 space-y-3.5">
            <h4 className="text-sm font-black text-[#012442] tracking-wider uppercase m-0 pb-1">
              Quick Links
            </h4>
            <ul className="space-y-2.5 m-0 p-0 list-none text-xs sm:text-sm">
              {quickLinks.map((item, idx) => (
                <li key={idx}>
                  <Link
                    to={item.to}
                    className="text-[#334155] hover:text-[#0FA8D6] transition-colors no-underline font-medium block leading-normal"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── COLUMN 2: CENTERS & SPECIALTIES (lg:col-span-4) ── */}
          <div className="lg:col-span-4 space-y-3.5">
            <h4 className="text-sm font-black text-[#012442] tracking-wider uppercase m-0 pb-1">
              Clinical Centers & Wings
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Sub-column A */}
              <div className="space-y-2.5 text-xs sm:text-sm">
                <span className="text-xs font-black text-[#024363] block font-sans uppercase tracking-wide">
                  Surgical Wings
                </span>
                <ul className="space-y-2 m-0 p-0 list-none">
                  {displaySpecialtiesCol1.map((dept, idx) => (
                    <li key={`col1-${idx}`}>
                      <Link
                        to={dept.to}
                        className="text-[#334155] hover:text-[#0FA8D6] transition-colors no-underline font-medium block leading-normal truncate"
                      >
                        {dept.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Sub-column B */}
              <div className="space-y-2.5 text-xs sm:text-sm">
                <span className="text-xs font-black text-[#024363] block font-sans uppercase tracking-wide">
                  Care & Support
                </span>
                <ul className="space-y-2 m-0 p-0 list-none">
                  {displaySpecialtiesCol2.map((dept, idx) => (
                    <li key={`col2-${idx}`}>
                      <Link
                        to={dept.to}
                        className="text-[#334155] hover:text-[#0FA8D6] transition-colors no-underline font-medium block leading-normal truncate"
                      >
                        {dept.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* ── COLUMN 3: ADDITIONAL LINKS (lg:col-span-2) ── */}
          <div className="lg:col-span-2 space-y-3.5">
            <h4 className="text-sm font-black text-[#012442] tracking-wider uppercase m-0 pb-1">
              Additional Links
            </h4>
            <ul className="space-y-2.5 m-0 p-0 list-none text-xs sm:text-sm">
              {additionalLinks.map((item, idx) => (
                <li key={idx}>
                  <Link
                    to={item.to}
                    className="text-[#334155] hover:text-[#0FA8D6] transition-colors no-underline font-medium block leading-normal"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── COLUMN 4: 24/7 HELPLINE, ACCREDITATIONS & APPOINTMENTS (lg:col-span-3) ── */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-sm font-black text-[#012442] tracking-wider uppercase m-0 pb-1">
              Accreditations & Help
            </h4>

            {/* Accreditation Badges */}
            <div className="flex flex-wrap gap-2">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-[#0FA8D6]/30 shadow-2xs text-[11px] font-bold text-[#012442]">
                <Award size={14} className="text-amber-500 shrink-0" />
                <span>NABH Accredited</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-[#0FA8D6]/30 shadow-2xs text-[11px] font-bold text-[#012442]">
                <ShieldCheck size={14} className="text-emerald-600 shrink-0" />
                <span>ISO 9001:2015</span>
              </div>
            </div>

            {/* Helpline Call Card */}
            <div className="bg-white rounded-2xl p-3.5 border border-[#0FA8D6]/30 shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#024363]">
                  24x7 Emergency SOS
                </span>
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                </span>
              </div>
              <a
                href={`tel:${emergencyPhone}`}
                className="text-base font-black text-[#012442] hover:text-[#0FA8D6] transition-colors no-underline block"
              >
                +91 {emergencyPhone}
              </a>
              <div className="text-[11px] text-slate-500 font-medium">
                OPD Helpline: +91 {generalPhone}
              </div>
            </div>

            {/* Book Appointment CTA Button */}
            <button
              onClick={() => dispatch(openAppointmentModal())}
              className="w-full py-2.5 px-4 bg-gradient-to-r from-[#0FA8D6] to-[#024363] hover:from-[#00b4ea] hover:to-[#013550] text-white font-extrabold text-xs rounded-xl shadow-xs transition-all cursor-pointer border-none flex items-center justify-center gap-2 uppercase tracking-wider"
            >
              <Calendar size={13} />
              <span>Book Appointment</span>
              <ArrowRight size={12} />
            </button>
          </div>

        </div>
      </div>

      {/* ── 3. BOTTOM COPYRIGHT & CREDITS BAR ── */}
      <div className="py-4 px-4 sm:px-6 lg:px-8 bg-[#d8ecf5] border-t border-[#0FA8D6]/20 text-xs text-[#024363]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 font-medium">
          <p className="m-0 text-xs text-[#012442]">
            © {new Date().getFullYear()} {hospitalName}. All rights reserved.
          </p>
          <p className="flex items-center gap-1 m-0 text-xs text-[#024363]">
            Designed & Developed with <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500 mx-0.5" /> by{" "}
            <a href="https://ephorsys.com/" target="_blank" rel="noopener noreferrer" className="text-[#024363] hover:text-[#0FA8D6] hover:underline font-bold">
              Ephorsys Tech
            </a>
          </p>
        </div>
      </div>

    </footer>
  );
});

Footer.displayName = "Footer";
export default Footer;