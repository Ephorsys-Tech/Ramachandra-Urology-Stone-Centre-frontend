import PageHero from "../common/PageHero";
import { Phone, MapPin } from "lucide-react";

const ContactHero = () => {
  return (
    <PageHero
      badge="24/7 Patient Support & Appointments"
      breadcrumb="Contact Us"
      title="Get in Touch &"
      highlightTitle="Visit Our Hospital"
      subtitle="We are conveniently situated at VSS Marg / Farm Road in Sambalpur, Odisha. Contact our care team for 24/7 emergency care, specialist OPD consultations, or cashless insurance inquiries."
      image="https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=1000&q=80"
      imageAlt="Hospital Reception and Patient Support"
      imageTag="24/7 Trauma & OPD Open"
    >
      <div className="flex flex-wrap items-center gap-2.5 pt-2 text-xs font-bold text-slate-700">
        <a
          href="tel:9090963722"
          className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl font-bold transition-colors no-underline shadow-xs"
        >
          <Phone size={14} />
          <span>Emergency: +91 90909 63722</span>
        </a>
        <div className="flex items-center gap-1.5 bg-white px-3.5 py-2 rounded-xl border border-slate-200/90 shadow-2xs">
          <MapPin size={14} className="text-emerald-600" />
          <span>Sambalpur, Odisha</span>
        </div>
      </div>
    </PageHero>
  );
};

export default ContactHero;
