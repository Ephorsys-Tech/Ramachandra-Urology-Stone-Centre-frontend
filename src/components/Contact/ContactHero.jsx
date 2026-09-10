import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Stethoscope, Users, ChevronRight, Clock } from "lucide-react";

/* ── Floating Card: Doctor Info ─────────────────────────────── */
const DoctorCard = () => (
  <motion.div
    className={[
      // base card shell
      "absolute flex items-center gap-[10px]",
      "bg-white rounded-[14px]",
      "border border-[rgba(0,135,90,0.12)]",
      "shadow-[0_6px_28px_rgba(0,75,75,0.08)]",
      "px-[14px] py-[10px] z-10",
      "cursor-default whitespace-nowrap",
      // hover
      "transition-[transform,box-shadow] duration-300 ease-in-out",
      "hover:-translate-y-[2px] hover:shadow-[0_10px_36px_rgba(0,75,75,0.12)]",
      // desktop position
      "top-[42px] -left-6",
      // tablet ≤1024px
      "max-[1024px]:top-8 max-[1024px]:-left-3",
      // mobile ≤768px
      "max-[768px]:top-[10px] max-[768px]:left-[10px]",
    ].join(" ")}
    initial={{ opacity: 0, x: -24, y: 10 }}
    animate={{ opacity: 1, x: 0, y: 0 }}
    transition={{ delay: 0.6, duration: 0.55, ease: "easeOut" }}
  >
    {/* Green gradient avatar bubble */}
    <div className="w-[34px] h-[34px] rounded-[10px] bg-gradient-to-br from-[#00875a] to-[#006F5B] text-white flex items-center justify-center shrink-0">
      <Stethoscope size={16} strokeWidth={2.2} />
    </div>

    {/* Text */}
    <div className="flex flex-col gap-[2px]">
      <p className="font-sans text-[12.5px] font-bold text-[#002B2B] m-0 leading-[1.3]">
        Dr. Sarah Johnson, MD
      </p>
      <div className="flex items-center gap-[4px] font-sans text-[10.5px] font-medium text-[#607373] leading-none">
        <span className="w-[6px] h-[6px] rounded-full bg-green-500 shrink-0" />
        <span>Available Now</span>
        <span className="text-[#C8EEE4] text-[12px]">·</span>
        <Clock size={11} />
        <span>10 min</span>
      </div>
    </div>
  </motion.div>
);

/* ── Floating Card: Happy Patients ──────────────────────────── */
const PatientsCard = () => (
  <motion.div
    className={[
      "absolute flex items-center gap-[10px]",
      "bg-white rounded-[14px]",
      "border border-[rgba(0,135,90,0.12)]",
      "shadow-[0_6px_28px_rgba(0,75,75,0.08)]",
      "px-[14px] py-[10px] z-10",
      "cursor-default whitespace-nowrap",
      "transition-[transform,box-shadow] duration-300 ease-in-out",
      "hover:-translate-y-[2px] hover:shadow-[0_10px_36px_rgba(0,75,75,0.12)]",
      // desktop position
      "bottom-[72px] -right-2",
      // tablet
      "max-[1024px]:-right-1",
      // mobile
      "max-[768px]:bottom-[44px] max-[768px]:right-[10px]",
    ].join(" ")}
    initial={{ opacity: 0, x: 24, y: 10 }}
    animate={{ opacity: 1, x: 0, y: 0 }}
    transition={{ delay: 0.75, duration: 0.55, ease: "easeOut" }}
  >
    {/* Mint icon bubble */}
    <div className="w-[38px] h-[38px] rounded-[10px] bg-[#EAF8F4] text-[#00875a] flex items-center justify-center shrink-0">
      <Users size={18} strokeWidth={2.2} />
    </div>

    <div className="flex flex-col gap-[2px]">
      <p className="font-sans font-extrabold text-[#002B2B] m-0 leading-[1.1] tracking-[-0.02em] ch-stat-number">
        1,500+
      </p>
      <p className="font-sans text-[11px] font-medium text-[#607373] m-0 leading-[1.2]">
        Happy Patients
      </p>
    </div>
  </motion.div>
);

/* ── Main Component ─────────────────────────────────────────── */
const ContactHero = () => {
  return (
    <>
      {/*
        Minimal residual CSS — only pseudo-elements, clamp, blend-mode, and
        the child-anchor hover that cannot cleanly be expressed with Tailwind.
      */}
      <style>{`
        /* Hero background gradient */
        .ch-hero {
          background: linear-gradient(135deg, #EAF8F4 0%, #F2FBF8 55%, #E6F7F1 100%);
        }

        /* Bottom arc pseudo-element — impossible with Tailwind alone */
        .ch-hero::after {
          content: "";
          position: absolute;
          bottom: -1px;
          left: 0;
          right: 0;
          height: 56px;
          background: #f0fbf7;
          border-radius: 50% 50% 0 0 / 28px 28px 0 0;
          pointer-events: none;
          z-index: 1;
        }
        @media (max-width: 768px) {
          .ch-hero::after {
            height: 36px;
            border-radius: 50% 50% 0 0 / 20px 20px 0 0;
          }
        }

        /* clamp() font-size — no Tailwind equivalent */
        .ch-hero-heading {
          font-size: clamp(32px, 4vw, 52px);
        }

        /* mix-blend-mode — no Tailwind utility */
        .ch-doctor-img {
          mix-blend-mode: multiply;
        }

        /* Child <a> hover inside breadcrumb nav */
        .ch-breadcrumb a {
          color: #607373;
          text-decoration: none;
          transition: color 0.2s;
        }
        .ch-breadcrumb a:hover {
          color: #00875a;
        }

        /* Stat number font-size clamp */
        .ch-stat-number {
          font-size: clamp(15px, 2vw, 18px);
        }
      `}</style>

      <section
        className={[
          "ch-hero relative w-full min-h-[340px] overflow-visible pb-14",
          "max-[768px]:min-h-0 max-[768px]:pb-10",
        ].join(" ")}
        aria-label="Contact Us hero"
      >
        {/* Decorative radial blob 1 — top right */}
        <div
          className="absolute rounded-full pointer-events-none z-0 w-[320px] h-[320px] -top-[60px] right-[10%]"
          style={{ background: "radial-gradient(circle, rgba(0,135,90,0.07) 0%, transparent 70%)" }}
          aria-hidden="true"
        />
        {/* Decorative radial blob 2 — bottom left */}
        <div
          className="absolute rounded-full pointer-events-none z-0 w-[220px] h-[220px] bottom-0 left-[4%]"
          style={{ background: "radial-gradient(circle, rgba(0,122,135,0.055) 0%, transparent 70%)" }}
          aria-hidden="true"
        />

        {/* ── Inner two-column grid ──────────────────────────── */}
        <div
          className={[
            "relative z-[2] max-w-[1200px] mx-auto",
            "px-8 pt-9",
            "grid grid-cols-2 items-center min-h-[340px] gap-0",
            // tablet
            "max-[1024px]:px-6 max-[1024px]:pt-7",
            // mobile — single column
            "max-[768px]:grid-cols-1 max-[768px]:px-5 max-[768px]:pt-6 max-[768px]:min-h-0",
          ].join(" ")}
        >
          {/* ── LEFT: Text content ────────────────────────────── */}
          <motion.div
            className={[
              "flex flex-col justify-center pr-6 z-[2]",
              "max-[768px]:pr-0 max-[768px]:pb-5",
            ].join(" ")}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            {/* Breadcrumb */}
            <nav
              className="ch-breadcrumb flex items-center gap-[6px] font-sans text-[12.5px] font-medium text-[#607373] mb-[18px] tracking-[0.01em] list-none p-0"
              aria-label="Breadcrumb"
            >
              <Link to="/">Home</Link>
              <ChevronRight
                size={13}
                className="text-[#C8EEE4] flex items-center"
                aria-hidden="true"
              />
              <span className="text-[#00875a] font-semibold">Contact Us</span>
            </nav>

            {/* Main heading */}
            <h1
              className="ch-hero-heading font-sans font-extrabold leading-[1.08] text-[#002B2B] tracking-[-0.025em] mb-[14px]"
            >
              Contact Us
            </h1>

            {/* Green accent underline */}
            <div
              className="w-[52px] h-[3.5px] rounded-full mb-[18px] bg-gradient-to-r from-[#00875a] to-[#006F5B]"
              aria-hidden="true"
            />

            {/* Subtitle */}
            <p
              className={[
                "font-sans text-[15px] font-normal leading-[1.65] text-[#263B3B]",
                "max-w-[340px] m-0 opacity-[0.88]",
                "max-[768px]:max-w-full max-[768px]:text-[14px]",
              ].join(" ")}
            >
              Kindly reach out to us for faster response and assistance
            </p>
          </motion.div>

          {/* ── RIGHT: Doctor image + floating cards ─────────── */}
          <div
            className={[
              "relative flex items-end justify-center min-h-[340px] z-[2]",
              "max-[768px]:min-h-[260px]",
            ].join(" ")}
          >
            <DoctorCard />

            <motion.img
              src="/contact-doctor.jpg"
              alt="Friendly healthcare professional ready to assist you"
              className={[
                "ch-doctor-img relative w-auto object-contain object-bottom",
                "drop-shadow-[0_18px_32px_rgba(0,75,75,0.10)] z-[3] block",
                "h-[370px]",
                "max-[1024px]:h-[310px]",
                "max-[768px]:h-[250px]",
              ].join(" ")}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
              loading="eager"
            />

            <PatientsCard />
          </div>
        </div>
      </section>
    </>
  );
};

export default ContactHero;
