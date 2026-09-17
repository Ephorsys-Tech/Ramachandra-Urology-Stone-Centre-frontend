import { Link } from "react-router-dom";
import {
  Phone,
  Mail,
  MapPin,
  Heart,
  ArrowRight,
  Clock,
  Award,
  ShieldCheck,
  Calendar,
  Activity,
  Sparkles,
  Stethoscope,
  CheckCircle2,
  FileText,
  Microscope,
  Pill,
  Zap,
} from "lucide-react";
import { FaFacebook, FaInstagram, FaYoutube, FaLinkedin } from "react-icons/fa";
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
  const primaryPhone = "+91 88950 62072";
  const altPhones = ["+91 99375 66625", "+91 76538 99199", "0663-4075199"];
  const hospitalEmail = "ruasc.burla@gmail.com";
  const hospitalAddress = "Sourav Vihar, Burla, Sambalpur - 768017, Odisha";

  const quickLinks = [
    { to: "/", label: "Home" },
    { to: "/about", label: "About Us & Leadership" },
    { to: "/doctors", label: "Our Doctors & Specialists" },
    { to: "/departments", label: "Clinical Specialties" },
    { to: "/gallery", label: "Hospital Infrastructure" },
    { to: "/blog", label: "Health Library & Insights" },
    { to: "/contact", label: "Contact & Location" },
  ];

  const inhouseServices = [
    { label: "Renal Stone (RIRS / PCNL / Laser)", to: "/departments" },
    { label: "Thulium Fiber LASER Lithotripsy", to: "/departments" },
    { label: "Prostate Surgery (THUFLEP / Laser)", to: "/departments" },
    { label: "Urologic Cancer Surgery", to: "/departments" },
    { label: "Andrology & Male Infertility", to: "/departments" },
    { label: "Reconstructive Urology & Urethroplasty", to: "/departments" },
    { label: "Laparoscopic & Endo-Lap Surgery", to: "/departments" },
    { label: "Uro-Dynamics & Uroflowmetry", to: "/departments" },
    { label: "In-House Pathology, USG, X-Ray & Pharmacy", to: "/departments" },
  ];

  const govtSchemes = [
    "Treatment under Ayushman Bharat (PM-JAY)",
    "Gopabandhu Jan Arogya Yojana (GJAY)",
    "Cashless Mediclaim & Corporate TPA",
    "24/7 Laser Stone Emergency & Colic Relief",
  ];

  return (
    <footer className="bg-[#eaf4f9] text-[#1e293b]  select-none border-t border-[#0FA8D6]/20">
      
      {/* ── 1. TOP HEADER ROW: LOGO + ACCREDITATION BADGES + SOCIAL ICONS ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-[#0FA8D6]/20">
          
          {/* Left: Brand Logo */}
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="inline-flex items-center p-2 rounded-2xl bg-white/90 backdrop-blur-xs border border-[#0FA8D6]/25 shadow-xs hover:shadow-md transition-all group"
              aria-label={hospitalName}
            >
              <img
                src="/logo.png"
                alt={hospitalName}
                className="h-12 sm:h-14 md:h-16 w-auto object-contain group-hover:scale-[1.02] transition-transform"
              />
            </Link>
            <div className="hidden sm:block">
              <span className="text-xs font-medium text-[#012442] block tracking-tight">Reg No: 14/2024</span>
              <span className="text-[11px] font-medium text-[#024363]">Sourav Vihar, Burla, Sambalpur</span>
            </div>
          </div>

          {/* Center / Badges: NABH & Ayushman / GJAY badges */}
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-[#0FA8D6]/30 shadow-2xs text-xs font-bold text-[#012442]">
              <Award className="w-4 h-4 text-amber-500 shrink-0" />
              <span>NABH Entry Level SHCO (PESHCO-0306-13433)</span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-[#0FA8D6]/30 shadow-2xs text-xs font-bold text-[#012442]">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Ayushman Bharat / GJAY</span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-[#0FA8D6]/30 shadow-2xs text-xs font-bold text-[#012442]">
              <Zap className="w-4 h-4 text-[#0FA8D6] shrink-0" />
              <span>Thulium Fiber Laser</span>
            </div>
          </div>

          {/* Right: Circular White Social Icons */}
          <div className="flex items-center gap-2 self-start md:self-center">
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
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white text-[#012442] hover:bg-[#0FA8D6] hover:text-white flex items-center justify-center transition-all duration-300 shadow-xs hover:shadow-md hover:-translate-y-0.5 border border-[#0FA8D6]/20"
              >
                <Icon className="w-4 h-4" />
              </a>
            ))}
          </div>

        </div>
      </div>

      {/* ── 2. MULTI-COLUMN CONTENT SECTION ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8">
          
          {/* ── COLUMN 1: QUICK LINKS (lg:col-span-3) ── */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-sm font-medium text-[#012442] tracking-wider uppercase m-0 pb-1">
              Quick Links
            </h4>
            <ul className="space-y-2 m-0 p-0 list-none text-xs sm:text-sm">
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

          {/* ── COLUMN 2: OUR SPECIALTIES & INHOUSE SERVICES (lg:col-span-3) ── */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-sm font-medium text-[#012442] tracking-wider uppercase m-0 pb-1">
              Key Specialties & Tech
            </h4>
            <ul className="space-y-2 m-0 p-0 list-none text-xs sm:text-sm">
              {inhouseServices.map((item, idx) => (
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

          {/* ── COLUMN 3: GOVT. SCHEMES & IN-HOUSE LABS (lg:col-span-3) ── */}
          <div className="lg:col-span-3 space-y-3.5">
            <h4 className="text-sm font-medium text-[#012442] tracking-wider uppercase m-0 pb-1">
              Schemes & Facilities
            </h4>
            <ul className="space-y-2.5 m-0 p-0 list-none text-xs sm:text-sm">
              {govtSchemes.map((scheme, idx) => (
                <li key={idx} className="flex items-start gap-2 text-[#334155] font-medium text-xs leading-snug">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#0FA8D6] shrink-0 mt-0.5" />
                  <span>{scheme}</span>
                </li>
              ))}
            </ul>

            {/* In-house tags pill list */}
            <div className="pt-2">
              <span className="text-[11px] font-bold text-[#024363] uppercase tracking-wider block mb-1.5">
                In-House Diagnostics:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {["Pathology", "Digital X-Ray", "Ultrasound", "Pharmacy", "Uro-Dynamics"].map((tag, i) => (
                  <span
                    key={i}
                    className="text-[10px] font-semibold bg-white text-[#012442] px-2 py-0.5 rounded-md border border-[#0FA8D6]/20 shadow-2xs"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* ── COLUMN 4: CONTACT & EMERGENCY HELPLINE (lg:col-span-3) ── */}
          <div className="lg:col-span-3 space-y-3.5">
            <h4 className="text-sm font-medium text-[#012442] tracking-wider uppercase m-0 pb-1">
              Contact & Helplines
            </h4>

            {/* Location Address */}
            <div className="flex items-start gap-2.5 text-xs text-[#024363]">
              <MapPin className="w-4 h-4 text-[#0FA8D6] shrink-0 mt-0.5" />
              <div className="leading-snug font-medium">
                <span className="font-bold text-[#012442] block">Hospital Address:</span>
                {hospitalAddress}
              </div>
            </div>

            {/* Phone Numbers Card */}
            <div className="bg-white rounded-2xl p-3 border border-[#0FA8D6]/30 shadow-xs space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#024363]">
                  Primary Helpline
                </span>
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                </span>
              </div>
              <a
                href={`tel:${primaryPhone.replace(/\s+/g, "")}`}
                className="text-base font-medium text-[#012442] hover:text-[#0FA8D6] transition-colors no-underline block"
              >
                {primaryPhone}
              </a>
              <div className="text-[11px] text-slate-600 font-medium space-y-0.5 pt-0.5 border-t border-slate-100">
                <div className="font-semibold text-[#024363]">Other Helplines:</div>
                <div className="flex flex-wrap gap-x-2 gap-y-1">
                  {altPhones.map((ph, idx) => (
                    <a
                      key={idx}
                      href={`tel:${ph.replace(/\s+/g, "")}`}
                      className="text-slate-600 hover:text-[#0FA8D6] transition-colors"
                    >
                      {ph}
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Email Contact */}
            <div className="flex items-center gap-2 text-xs text-[#024363] font-medium">
              <Mail className="w-4 h-4 text-[#0FA8D6] shrink-0" />
              <a
                href={`mailto:${hospitalEmail}`}
                className="text-[#024363] hover:text-[#0FA8D6] transition-colors break-all"
              >
                {hospitalEmail}
              </a>
            </div>

            {/* Book Appointment CTA Button */}
            <button
              onClick={() => dispatch(openAppointmentModal())}
              className="w-full py-2.5 px-4 bg-[#00B4EA] hover:from-[#00b4ea] hover:to-[#013550] text-white font-extrabold text-xs rounded-xl shadow-xs transition-all cursor-pointer border-none flex items-center justify-center gap-2 uppercase tracking-wider"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Book Appointment</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

        </div>
      </div>

      {/* ── 3. BOTTOM COPYRIGHT & CREDITS BAR ── */}
      <div className="py-4 px-4 sm:px-6 lg:px-8 bg-[#d8ecf5] border-t border-[#0FA8D6]/20 text-xs text-[#024363]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 font-medium">
          <p className="m-0 text-xs text-[#012442] text-center sm:text-left">
            © {new Date().getFullYear()} {hospitalName}. All rights reserved.
          </p>
          <p className="m-0 text-xs text-[#024363] hidden md:block text-center font-semibold">
            Better Care • Healthier Lives &nbsp;|&nbsp; Flow Freely, Live Fully
          </p>
          <p className="flex items-center gap-1 m-0 text-xs text-[#024363]">
            Designed & Developed with <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500 mx-0.5" /> by{" "}
            <a
              href="https://ephorsys.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#024363] hover:text-[#0FA8D6] hover:underline font-bold"
            >
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