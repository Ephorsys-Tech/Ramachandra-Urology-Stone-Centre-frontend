import { memo } from "react";
import { ZoomParallax } from "../ui/zoom-parallax";
import { Sparkles } from "lucide-react";

const images = [
  {
    src: "https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&w=1200&q=80",
    alt: "Doctor consulting with a patient in a hospital",
  },
  {
    src: "https://images.unsplash.com/photo-1584982751601-97dcc096659c?auto=format&fit=crop&w=1200&q=80",
    alt: "Medical doctor working in a hospital",
  },
  {
    src: "https://images.unsplash.com/photo-1538108149393-fbbd81895907?auto=format&fit=crop&w=1200&q=80",
    alt: "Modern hospital interior",
  },
  {
    src: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1200&q=80",
    alt: "Medical team working together",
  },
  {
    src: "https://images.unsplash.com/photo-1516841273335-e39b37888115?auto=format&fit=crop&w=1200&q=80",
    alt: "Doctor examining a patient",
  },
  {
    src: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1200&q=80",
    alt: "Hospital corridor and healthcare facility",
  },
  {
    src: "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=1200&q=80",
    alt: "Modern hospital building and healthcare facility",
  },
  {
    src: "https://images.unsplash.com/photo-1666887360938-9b4e2f2e8e6e?auto=format&fit=crop&w=1200&q=80",
    alt: "Urology doctor consultation",
  },
];

const HomeGallery = memo(() => {
  return (
    <section className="bg-white relative py-12 ">
      {/* Intro Header Section */}
      <div className="relative flex flex-col items-center justify-center text-center px-4 max-w-3xl mx-auto mb-8">
        <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#0FA8D6]/15 border border-[#0FA8D6]/30 text-[#024363] font-medium text-xs uppercase tracking-wider mb-3 shadow-2xs">
          <Sparkles size={12} className="text-[#0FA8D6]" />
          Hospital Infrastructure
        </span>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-medium text-[#012442] mb-3 tracking-tight">
          A Glimpse Inside Our Sambalpur Campus
        </h2>
        <p className="text-slate-600 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
          Explore our sterile modular operation theatres, daycare recovery suites, high-power laser systems, and patient diagnostic facilities.
        </p>
      </div>

      {/* Zoom Parallax Container */}
      <div className="w-full relative overflow-visible">
        <ZoomParallax images={images} />
      </div>
    </section >
  );
});

HomeGallery.displayName = "HomeGallery";
export default HomeGallery;

