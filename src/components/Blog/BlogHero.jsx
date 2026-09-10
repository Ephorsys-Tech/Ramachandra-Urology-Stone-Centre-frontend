import PageHero from "../common/PageHero";
import { BookOpen, Sparkles, ShieldCheck } from "lucide-react";

const BlogHero = () => {
  return (
    <PageHero
      badge="Health Library & Clinical Insights"
      breadcrumb="Blog & Articles"
      title="Urological Knowledge &"
      highlightTitle="Health Guides"
      subtitle="Discover essential kidney stone prevention tips, minimally invasive laser surgery breakthroughs, prostate wellness guides, and recovery advice curated by our specialist surgeons in Sambalpur."
      image="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1000&q=80"
      imageAlt="Urology Health Library and Medical Insights"
      imageTag="Physician-Verified Guides"
      theme="blue"
    >
      <div className="flex flex-wrap items-center gap-2.5 pt-2 text-xs font-bold text-slate-700">
        <div className="flex items-center gap-1.5 bg-white px-3.5 py-1.5 rounded-xl border border-slate-200/90 shadow-2xs">
          <BookOpen size={14} className="text-[#0FA8D6]" />
          <span>Kidney & Laser Surgery Guides</span>
        </div>
        <div className="flex items-center gap-1.5 bg-white px-3.5 py-1.5 rounded-xl border border-slate-200/90 shadow-2xs">
          <Sparkles size={14} className="text-[#0FA8D6]" />
          <span>Proven Prevention Tips</span>
        </div>
        <div className="flex items-center gap-1.5 bg-white px-3.5 py-1.5 rounded-xl border border-slate-200/90 shadow-2xs">
          <ShieldCheck size={14} className="text-[#024363]" />
          <span>Reviewed by Specialists</span>
        </div>
      </div>
    </PageHero>
  );
};

export default BlogHero;
