import { memo } from "react";
import { ZoomParallax } from "../ui/zoom-parallax";

const images = [
 
  {
    src: "https://res.cloudinary.com/drqb4p2a2/image/upload/v1787555590/1I5A4502_1_wxjyz5.webp",
    alt: "Professional medical photography of a diverse team of doctors",
  },
  {
    src: "https://res.cloudinary.com/drqb4p2a2/image/upload/v1787555589/1I5A4479_1_tasiwo.webp",
    alt: "Close up of a doctor's hands holding a digital tablet",
  },
  {
    src: "https://res.cloudinary.com/drqb4p2a2/image/upload/v1783148317/ChatGPT_Image_Jul_4_2026_12_14_12_PM_eskwjx.png",
    alt: "Medical laboratory setting with a scientist looking through a microscope",
  },
  {
    src: "https://res.cloudinary.com/drqb4p2a2/image/upload/v1783148317/ChatGPT_Image_Jul_4_2026_12_16_38_PM_nslao3.png",
    alt: "Friendly female doctor in a white coat smiling and talking",
  },
  {
    src: "https://res.cloudinary.com/drqb4p2a2/image/upload/v1787555589/1I5A4435_1_mbsm4v.webp",
    alt: "Professional medical announcement banner of a modern clinic hall",
  },
  {
    src: "https://res.cloudinary.com/drqb4p2a2/image/upload/v1787555589/1I5A4497_1_xbvypd.webp",
    alt: "Comfortable and clean patient room in a modern hospital",
  },
  {
    src: "https://res.cloudinary.com/drqb4p2a2/image/upload/v1783148587/WhatsApp_Image_2026-07-04_at_12.31.57_PM_kxun3d.jpg",
    alt: "Modern hospital reception area with minimalist design",
  },
  {
    src: "https://res.cloudinary.com/drqb4p2a2/image/upload/v1787555587/1I5A4332_1_cv9mgt.webp",
    alt: "Pediatrician holding a stethoscope and smiling at a child patient",
  },
  // {
  //   src: "https://res.cloudinary.com/drqb4p2a2/image/upload/q_auto/f_auto/v1780483503/detailed_shot_of_a_stethoscope_resting_on_a_clean_white_med_idsfzs.png",
  //   alt: "Detailed shot of a stethoscope resting on a clean white medical surface",
  // },
];

const HomeGallery = memo(() => {
  return (
    <section className="bg-background relative">
      {/* Intro Header Section */}
      <div className="relative flex h-[40vh] flex-col items-center justify-center text-center px-4">
        <span className="inline-block text-tertiary font-bold text-sm tracking-widest uppercase mb-3">
          Our Facilities
        </span>
        <h2 className="text-4xl md:text-5xl font-black text-primary mb-4 font-sans">
          A Glimpse Inside <span className="text-secondary">Usthi Hospital</span>
        </h2>
        <p className="text-slate-600 max-w-xl mx-auto text-sm sm:text-base">
          World-class infrastructure designed for patient comfort, safety, and cutting-edge medical care. Scroll down to explore our space.
        </p>
      </div>

      {/* Zoom Parallax Container */}
      <div className="w-full relative overflow-visible">
        <ZoomParallax images={images} />
      </div>
    </section>
  );
});

export default HomeGallery;

