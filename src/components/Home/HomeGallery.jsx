import { memo } from "react";
import { ZoomParallax } from "../ui/zoom-parallax";
import { Sparkles } from "lucide-react";

const images = [
  {
    src: "https://res.cloudinary.com/drqb4p2a2/image/upload/v1787555590/1I5A4502_1_wxjyz5.webp",
    alt: "Medical urology specialists at Sambalpur",
  },
  {
    src: "https://res.cloudinary.com/drqb4p2a2/image/upload/v1787555589/1I5A4479_1_tasiwo.webp",
    alt: "Advanced surgical planning and digital diagnostics",
  },
  {
    src: "https://res.cloudinary.com/drqb4p2a2/image/upload/v1783148317/ChatGPT_Image_Jul_4_2026_12_14_12_PM_eskwjx.png",
    alt: "Clinical pathology and stone analysis lab",
  },
  {
    src: "https://res.cloudinary.com/drqb4p2a2/image/upload/v1783148317/ChatGPT_Image_Jul_4_2026_12_16_38_PM_nslao3.png",
    alt: "Consultation and patient counseling",
  },
  {
    src: "https://res.cloudinary.com/drqb4p2a2/image/upload/v1787555589/1I5A4435_1_mbsm4v.webp",
    alt: "Modern clinic hall and patient reception",
  },
  {
    src: "https://res.cloudinary.com/drqb4p2a2/image/upload/v1787555589/1I5A4497_1_xbvypd.webp",
    alt: "Hygienic patient rooms and daycare wards",
  },
  {
    src: "https://res.cloudinary.com/drqb4p2a2/image/upload/v1783148587/WhatsApp_Image_2026-07-04_at_12.31.57_PM_kxun3d.jpg",
    alt: "Sambalpur campus reception area",
  },
  {
    src: "https://res.cloudinary.com/drqb4p2a2/image/upload/v1787555587/1I5A4332_1_cv9mgt.webp",
    alt: "Doctor consultation and diagnostic evaluation",
  },
];

const HomeGallery = memo(() => {
  return (
    <section className="bg-white relative py-12 font-sans">
      {/* Intro Header Section */}
      <div className="relative flex flex-col items-center justify-center text-center px-4 max-w-3xl mx-auto mb-8">
        <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#0FA8D6]/15 border border-[#0FA8D6]/30 text-[#024363] font-medium text-xs uppercase tracking-wider mb-3 shadow-2xs">
          <Sparkles size={12} className="text-[#0FA8D6]" />
          Hospital Infrastructure
        </span>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-medium text-[#012442] mb-3 tracking-tight">
          A Glimpse Inside <span className="text-[#0FA8D6]">Our Sambalpur Campus</span>
        </h2>
        <p className="text-slate-600 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
          Explore our sterile modular operation theatres, daycare recovery suites, high-power laser systems, and patient diagnostic facilities.
        </p>
      </div>

      {/* Zoom Parallax Container */}
      <div className="w-full relative overflow-visible">
        <ZoomParallax images={images} />
      </div>
    </section>
  );
});

HomeGallery.displayName = "HomeGallery";
export default HomeGallery;

