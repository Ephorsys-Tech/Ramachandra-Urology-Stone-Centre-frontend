import { memo } from "react";
import { motion } from "framer-motion";
import { Sparkles, Images, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const images = [
  {
    src: "https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&w=900&q=80",
    alt: "Doctor consulting with a patient",
    span: "col-span-2 row-span-2",
  },
  {
    src: "https://images.unsplash.com/photo-1584982751601-97dcc096659c?auto=format&fit=crop&w=600&q=80",
    alt: "Medical doctor working in hospital",
    span: "",
  },
  {
    src: "https://images.unsplash.com/photo-1538108149393-fbbd81895907?auto=format&fit=crop&w=600&q=80",
    alt: "Modern hospital interior",
    span: "",
  },
  {
    src: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=600&q=80",
    alt: "Medical team working together",
    span: "",
  },
  {
    src: "https://images.unsplash.com/photo-1516841273335-e39b37888115?auto=format&fit=crop&w=600&q=80",
    alt: "Doctor examining a patient",
    span: "",
  },
  {
    src: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=900&q=80",
    alt: "Hospital corridor and healthcare facility",
    span: "col-span-2",
  },
];

const HomeGallery = memo(() => {
  return (
    <section className="py-16 sm:py-24 bg-white relative overflow-hidden">

      {/* Header */}
      <div className="relative flex flex-col items-center justify-center text-center px-4 max-w-3xl mx-auto mb-12">
        <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#0FA8D6]/15 border border-[#0FA8D6]/30 text-[#024363] font-medium text-xs uppercase tracking-wider mb-3 shadow-2xs">
          <Sparkles size={12} className="text-[#0FA8D6]" />
          Hospital Infrastructure
        </span>
        <h2 className="text-3xl sm:text-4xl font-medium text-[#012442] mb-3 tracking-tight">
          A Glimpse Inside Our Sambalpur Campus
        </h2>
        <p className="text-slate-600 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
          Explore our sterile modular operation theatres, daycare recovery suites, high-power laser systems, and patient diagnostic facilities.
        </p>
      </div>

      {/* Gallery Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 auto-rows-[220px] gap-4">
          {images.map((img, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: idx * 0.07 }}
              className={`relative rounded-2xl overflow-hidden group cursor-pointer shadow-sm hover:shadow-xl transition-shadow duration-300 ${img.span}`}
            >
              <img
                src={img.src}
                alt={img.alt}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
              />
              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#012442]/80 via-[#00B4EA]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400 flex items-end p-4">
                <p className="text-white text-xs sm:text-sm font-medium leading-snug translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                  {img.alt}
                </p>
              </div>
              {/* Corner accent */}
              <div className="absolute top-3 right-3 w-7 h-7 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Images size={13} className="text-white" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <div className="flex justify-center mt-10">
          <Link
            to="/gallery"
            className="inline-flex items-center gap-2 px-7 py-3 rounded-2xl bg-[#00B4EA] text-white text-xs sm:text-sm font-extrabold uppercase tracking-wider shadow-md hover:shadow-lg hover:bg-[#0FA8D6] transition-all duration-300"
          >
            <span>View Full Gallery</span>
            <ArrowRight size={15} />
          </Link>
        </div>
      </div>

    </section>
  );
});

HomeGallery.displayName = "HomeGallery";
export default HomeGallery;
