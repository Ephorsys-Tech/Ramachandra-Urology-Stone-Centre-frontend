import PageHero from "../common/PageHero";
import { Stethoscope, ShieldCheck, Sparkles } from "lucide-react";

const DepartmentHero = () => {
  return (
    <PageHero
      badge="Clinical Specialties & Care Wings"
      breadcrumb="Specialties"
      title="Advanced Centers of"
      highlightTitle="Clinical Excellence"
      subtitle="Explore our specialized clinical divisions featuring Thulium Fiber Laser (TFL) stone surgery, RIRS, PCNL, advanced laparoscopic surgery, and comprehensive nephro-urology care in Sambalpur."
      image="https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1000&q=80"
      imageAlt="Laser Operation Theatre and Clinical Wings"
      imageTag="Thulium Laser & HD Laparoscopy"
      theme="blue"
    >
      <div className="flex flex-wrap items-center gap-2.5 pt-2 text-xs font-bold text-slate-700">
        <div className="flex items-center gap-1.5 bg-white px-3.5 py-1.5 rounded-xl border border-slate-200/90 shadow-2xs">
          <Stethoscope size={14} className="text-[#0FA8D6]" />
          <span>Multi-Specialty OPD & Daycare</span>
        </div>
        <div className="flex items-center gap-1.5 bg-white px-3.5 py-1.5 rounded-xl border border-slate-200/90 shadow-2xs">
          <ShieldCheck size={14} className="text-[#0FA8D6]" />
          <span>Ayushman Bharat & GJAY Cashless</span>
        </div>
        <div className="flex items-center gap-1.5 bg-white px-3.5 py-1.5 rounded-xl border border-slate-200/90 shadow-2xs">
        
          <span>Super-Specialist Surgeons</span>
        </div>
      </div>
    </PageHero>
  );
};

export default DepartmentHero;
