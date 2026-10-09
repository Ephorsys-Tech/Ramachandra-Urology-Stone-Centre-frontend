import PageHero from "../common/PageHero";
import { Award, Building2, Sparkles, ShieldCheck } from "lucide-react";

const GalleryHero = () => {
  return (
    <PageHero
      badge="Hospital Infrastructure & Campus"
      breadcrumb="Gallery"
      title="A Visual Tour of Our"
      highlightTitle="Modern Hospital"
      subtitle="Take a look inside Ramachandra Urology & Stone Centre in Sambalpur — from our sterile modular operation suites and advanced Thulium laser units to comfortable patient recovery rooms."
      image="https://res.cloudinary.com/uvh9ozrt/image/upload/v1791368783/img_6651_1024.png"
      imageAlt="Hospital Infrastructure & Campus"
      imageTag="Modern OT & Infrastructure"
      theme="blue"
    >
      <div className="flex flex-wrap items-center gap-2.5 pt-2 text-xs font-bold text-slate-700">
        <div className="flex items-center gap-1.5 bg-white px-3.5 py-1.5 rounded-xl border border-slate-200/90 shadow-2xs">
          <Building2 size={14} className="text-[#0FA8D6]" />
          <span>Sambalpur Main Campus</span>
        </div>
        <div className="flex items-center gap-1.5 bg-white px-3.5 py-1.5 rounded-xl border border-slate-200/90 shadow-2xs">
          <ShieldCheck size={14} className="text-[#0FA8D6]" />
          <span>NABH Standard Modular OTs</span>
        </div>
        <div className="flex items-center gap-1.5 bg-white px-3.5 py-1.5 rounded-xl border border-slate-200/90 shadow-2xs">
        
          <span>Advanced Thulium Laser Center</span>
        </div>
      </div>
    </PageHero>
  );
};

export default GalleryHero;
