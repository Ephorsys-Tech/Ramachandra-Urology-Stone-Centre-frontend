import { Link } from "react-router-dom";
import { ArrowRight, Home as HomeIcon } from "lucide-react";

function BgHero({
  imgSrc = "https://images.unsplash.com/photo-1576091160399-11cbbe12ce75?q=80&w=2070&auto=format&fit=crop",
  imgAlt = "Medical Background",      
  heading = "About Us",
  subtitle = "Premium Medical Equipment & Healthcare Solutions",
  homePath = "/",
  homeLabel = "Home",
  service = "About Us",
  showButtons = true,
  exploreLabel = "Explore Services",
  contactLabel = "Contact Us",
}) {
  return (
    <section className="relative w-full">

      {/* IMAGE BLOCK */}
      <div
        className="
          relative w-full overflow-hidden
          h-[50vh]
          sm:h-[55vh]
          md:h-[60vh]
          lg:h-[65vh]
          xl:h-[70vh]
        "
      >
        {/* Background Image */}
        <img
          src={imgSrc}
          alt={imgAlt}
          className="absolute inset-0 w-full h-full object-cover object-center"
        />

        {/* Overlay (Neutral tint) */}
        <div className="absolute inset-0 bg-black/40" />

        {/* Top accent line */}
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-blue-700 via-teal-400 to-blue-700 z-10" />

        {/* Content */}
        <div className="relative z-10 h-full flex flex-col justify-center">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">

          {/* Tag */}
          <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            <span className="block w-5 sm:w-7 h-[2px] bg-teal-400 shrink-0" />
            <span
              className="
                font-bold uppercase text-teal-400
                tracking-[0.18em] sm:tracking-[0.22em]
                text-[9px] sm:text-[10px]
              "
            >
              Ramachandra Urology & Stone Centre
            </span>
          </div>

          {/* Heading */}
          <h1
            className="
              font-medium text-white leading-tight tracking-tight
              text-3xl
              sm:text-4xl
              md:text-5xl
              lg:text-6xl
              xl:text-7xl
              max-w-xs sm:max-w-sm md:max-w-xl lg:max-w-2xl
            "
          >
            {heading}
          </h1>

          {/* Subtitle */}
          {subtitle && (
            <p
              className="
                leading-relaxed text-white/90
                mt-3 sm:mt-4
                text-xs sm:text-sm md:text-base
                max-w-xs sm:max-w-sm md:max-w-md
              "
            >
              {subtitle}
            </p>
          )}

          {/* Buttons */}
          {showButtons && (
            <div className="flex flex-wrap gap-2 sm:gap-3 mt-4 sm:mt-6">
              <button
                className="
                  flex items-center gap-2
                  rounded-full bg-blue-600 text-white font-bold
                  shadow-[0_4px_22px_rgba(37,99,235,0.45)]
                  hover:bg-blue-700 hover:scale-105 active:scale-95
                  transition-all duration-200
                  px-4 py-2 text-xs
                  sm:px-6 sm:py-2.5 sm:text-sm
                  md:px-7 md:py-3 md:text-sm
                "
              >
                {exploreLabel} <ArrowRight size={14} className="sm:hidden" />
                <ArrowRight size={16} className="hidden sm:block" />
              </button>

              <Link
                to="/contact"
                className="
                  flex items-center gap-2
                  rounded-full text-white font-bold
                  border-2 border-white/50
                  bg-white/10 backdrop-blur-sm
                  hover:bg-white hover:text-blue-900 hover:scale-105 active:scale-95
                  transition-all duration-200
                  px-4 py-2 text-xs
                  sm:px-6 sm:py-2.5 sm:text-sm
                  md:px-7 md:py-3 md:text-sm
                "
              >
                {contactLabel}
              </Link>
            </div>
          )}

          {/* Breadcrumb */}
          <div
            className="
              flex items-center gap-1.5 sm:gap-2
              mt-6 sm:mt-8 md:mt-10
              text-xs sm:text-sm
            "
          >
            <Link
              to={homePath}
              className="flex items-center gap-1 sm:gap-1.5 text-white/70 hover:text-white transition-colors font-medium"
            >
              <HomeIcon size={12} className="sm:hidden" />
              <HomeIcon size={14} className="hidden sm:block" />
              {homeLabel}
            </Link>
            <span className="text-white/40">/</span>
            <span className="font-semibold text-teal-400">{service}</span>
          </div>

          </div>
        </div>
      </div>

    </section>
  );
}

export default BgHero;
