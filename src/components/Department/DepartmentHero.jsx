import PageHero from "../common/PageHero";
import { Stethoscope, ShieldCheck, Sparkles, Award, Phone } from "lucide-react";

const DepartmentHero = () => {
  return (
    <PageHero
      badge="Clinical Specialties & Care Wings"
      breadcrumb="Urology Services"
      title="Urology Services & Specialized"
      highlightTitle="Clinical Wings"
      subtitle="Discover world-class urological care in Sambalpur — from high-precision Thulium Fiber Laser (TFL) stone surgery, RIRS, and PCNL to advanced prostate therapy, reconstructive urology, and pediatric care."
      image="https://res.cloudinary.com/uvh9ozrt/image/upload/v1791368685/img_6655_1024.png"
      imageAlt="Ramachandra Urology & Stone Centre OT & Clinical Wings"
      imageTag="Thulium Laser & HD Endo-Lap"
      theme="blue"
    >
      <div className="flex flex-wrap items-center gap-2.5 pt-3 text-xs font-bold text-slate-700">
        <div className="flex items-center gap-1.5 bg-white px-3.5 py-1.5 rounded-xl border border-slate-200/90 shadow-2xs">
          <Award size={14} className="text-[#00B4EA]" />
          <span>NABH SHCO Accredited</span>
        </div>
        <div className="flex items-center gap-1.5 bg-white px-3.5 py-1.5 rounded-xl border border-slate-200/90 shadow-2xs">
          <ShieldCheck size={14} className="text-emerald-600" />
          <span>Ayushman Bharat &amp; GJAY Cashless</span>
        </div>
        <div className="flex items-center gap-1.5 bg-white px-3.5 py-1.5 rounded-xl border border-slate-200/90 shadow-2xs">
          <Sparkles size={14} className="text-[#00B4EA]" />
          <span>Thulium Fiber Laser Lithotripsy</span>
        </div>
        <div className="flex items-center gap-1.5 bg-white px-3.5 py-1.5 rounded-xl border border-slate-200/90 shadow-2xs">
          <Phone size={14} className="text-rose-500" />
          <span>24/7 Emergency &amp; OPD Desk</span>
        </div>
      </div>
    </PageHero>
  );
};

export default DepartmentHero;
