import PageHero from "../common/PageHero";
import { Phone, MapPin, Clock, ShieldCheck, Sparkles, Stethoscope } from "lucide-react";

const ContactHero = () => {
  return (
    <PageHero
      badge="24/7 Patient Helpdesk & Inquiries"
      breadcrumb="Contact Us"
      title="Connect with Our"
      highlightTitle="Clinical Team"
      subtitle="Have questions about stone treatments, laser surgery, or OPD doctor availability? Reach out to our dedicated care coordinators in Sambalpur for swift medical assistance."
      image="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1000&q=80"
      imageAlt="Hospital Helpdesk and Care Team"
      imageTag="24/7 Clinical Helpdesk"
      theme="blue"
    >
      <div className="flex flex-wrap items-center gap-2.5 pt-2 text-xs font-bold text-slate-700">
        <div className="flex items-center gap-1.5 bg-white px-3.5 py-1.5 rounded-xl border border-slate-200/90 shadow-2xs">
          <Phone size={14} className="text-[#0FA8D6]" />
          <span>24/7 Emergency & Stone Helpline</span>
        </div>
        <div className="flex items-center gap-1.5 bg-white px-3.5 py-1.5 rounded-xl border border-slate-200/90 shadow-2xs">
          <Clock size={14} className="text-[#0FA8D6]" />
          <span>OPD: 08:00 AM - 08:00 PM</span>
        </div>
        <div className="flex items-center gap-1.5 bg-white px-3.5 py-1.5 rounded-xl border border-slate-200/90 shadow-2xs">
          <ShieldCheck size={14} className="text-[#024363]" />
          <span>Sambalpur Main Campus</span>
        </div>
      </div>
    </PageHero>
  );
};

export default ContactHero;

