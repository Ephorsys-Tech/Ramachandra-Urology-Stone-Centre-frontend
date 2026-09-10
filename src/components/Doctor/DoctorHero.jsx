import PageHero from "../common/PageHero";
import { Search } from "lucide-react";

const DoctorHero = ({ searchQuery, setSearchQuery, totalDoctors }) => {
  return (
    <PageHero
      badge="Ramachandra Urology & Stone Centre • Sambalpur"
      breadcrumb="Our Doctors"
      title="World-Class Care by"
      highlightTitle="Leading Specialists"
      subtitle="Our team of seasoned urologists, surgeons, and medical consultants are dedicated to providing precision laser surgery, minimally invasive stone treatments, and compassionate clinical care."
      image="https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=1000&q=80"
      imageAlt="Medical Specialists & Surgeons"
      imageTag={totalDoctors > 0 ? `${totalDoctors}+ Super Specialists` : "15+ Super Specialists"}
      theme="blue"
    >
      {/* ── LIVE SEARCH INPUT IN HERO ── */}
      <div className="pt-2 max-w-xl">
        <div className="relative flex items-center bg-white border border-[#0FA8D6]/40 rounded-2xl p-1 shadow-md shadow-[#024363]/5 focus-within:border-[#0FA8D6] focus-within:ring-2 focus-within:ring-[#0FA8D6]/20 transition-all">
          <div className="pl-3.5 pr-2 text-[#0FA8D6]">
            <Search size={18} />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search doctors by name or specialty (e.g., Urology, Stones)..."
            className="w-full bg-transparent text-[#012442] placeholder-slate-400 text-xs sm:text-sm font-semibold py-2.5 pr-4 outline-none border-none"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="px-2.5 py-1 text-[11px] font-bold text-[#024363] hover:text-[#012442] bg-[#0FA8D6]/10 rounded-xl mr-1 cursor-pointer transition-colors border-none"
            >
              Clear
            </button>
          )}
        </div>
      </div>
    </PageHero>
  );
};

export default DoctorHero;
