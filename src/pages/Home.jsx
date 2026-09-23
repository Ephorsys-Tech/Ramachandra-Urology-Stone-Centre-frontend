import { lazy, Suspense } from "react";
import HeroSection from "../components/HeroSection";
import QuickSearch from "../components/Home/QuickSearch";
import HomeStatsCounter from "../components/Home/HomeStatsCounter";
import SEO from "../components/common/SEO";

const homeStructuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Hospital",
      "@id": "https://ramachandraurology.com/#hospital",
      "name": "Ramachandra Urology & Stone Centre",
      "alternateName": ["Ramachandra Urology Stone Centre", "Ramachandra Hospital Burla"],
      "url": "https://ramachandraurology.com/",
      "logo": "https://ramachandraurology.com/logo.png",
      "image": "https://ramachandraurology.com/logo.png",
      "description": "Centre for Advanced Kidney Care & Laparoscopic Surgeries. NABH Accredited Entry Level SHCO (PESHCO-0306-13433), Reg No. 14/2024.",
      "medicalSpecialty": [
        "Urology",
        "Endourology",
        "Lithotripsy",
        "Laser Surgery",
        "Andrology",
        "Uro-Oncology",
        "Pediatric Urology",
        "Laparoscopic Surgery"
      ],
      "telephone": ["+918895062072", "+919937566625", "+917653899199", "0663-4075199"],
      "email": "ruasc.burla@gmail.com",
      "priceRange": "$$",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Sourav Vihar, Burla",
        "addressLocality": "Sambalpur",
        "addressRegion": "Odisha",
        "postalCode": "768017",
        "addressCountry": "IN"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": 21.4984,
        "longitude": 83.8715
      },
      "openingHoursSpecification": [
        {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
          "opens": "00:00",
          "closes": "23:59"
        }
      ],
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Urology & Kidney Care Services",
        "itemListElement": [
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "MedicalProcedure",
              "name": "Thulium Fiber Laser RIRS (Retrograde Intrarenal Surgery)"
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "MedicalProcedure",
              "name": "Mini-PCNL (Percutaneous Nephrolithotomy)"
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "MedicalProcedure",
              "name": "Laser THUFLEP & Enucleation of Prostate (BPH)"
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "MedicalProcedure",
              "name": "Laparoscopic Urological Surgeries"
            }
          }
        ]
      }
    },
    {
      "@type": "WebSite",
      "@id": "https://ramachandraurology.com/#website",
      "url": "https://ramachandraurology.com/",
      "name": "Ramachandra Urology & Stone Centre",
      "description": "Western Odisha’s Premier Hospital for Advanced Kidney Stone Laser Surgery and Urology Care",
      "publisher": {
        "@id": "https://ramachandraurology.com/#hospital"
      }
    },
    {
      "@type": "Physician",
      "@id": "https://ramachandraurology.com/#founder",
      "name": "Dr. Sanjay Kumar Mahapatra",
      "jobTitle": "Senior Consultant Urologist & Laser Surgeon",
      "medicalSpecialty": "Urology & Kidney Stone Laser Surgery",
      "worksFor": {
        "@id": "https://ramachandraurology.com/#hospital"
      },
      "alumniOf": {
        "@type": "EducationalOrganization",
        "name": "AIIMS New Delhi (M.Ch Urology)"
      }
    }
  ]
};

const HomeAbout = lazy(() => import("../components/Home/HomeAbout"));
const HomeTechnology = lazy(() => import("../components/Home/HomeTechnology"));
const HomeProstateBPH = lazy(
  () => import("../components/Home/HomeProstateBPH"),
);
const HomeDepartments = lazy(
  () => import("../components/Home/HomeDepartments"),
);
const HomeDoctors = lazy(() => import("../components/Home/HomeDoctors"));
const HomeDiagnosticsStrip = lazy(
  () => import("../components/Home/HomeDiagnosticsStrip"),
);
const NABHAccreditationSection = lazy(
  () => import("../components/Home/NABHAccreditationSection"),
);

const HomeWhyChooseUs = lazy(
  () => import("../components/Home/HomeWhyChooseUs"),
);
const HomeTestimonials = lazy(
  () => import("../components/Home/HomeTestimonials"),
);

const HomeBlog = lazy(() => import("../components/Home/HomeBlog"));
const HomeFAQ = lazy(() => import("../components/Home/HomeFAQ"));
const ContactSection = lazy(
  () => import("../components/Contact/ContactSection"),
);

const Home = () => {
  return (
    <>
      <SEO
        title="Best Urology & Kidney Stone Hospital in Burla, Sambalpur"
        description="Ramachandra Urology & Stone Centre (NABH Accredited SHCO, Reg No. 14/2024) in Sourav Vihar, Burla, Sambalpur. Led by Dr. Sanjay Kumar Mahapatra (M.Ch AIIMS New Delhi) for advanced Thulium Fiber Laser RIRS, PCNL, THUFLEP prostate surgery, and Ayushman/GJAY cashless treatment."
        canonical="/"
        structuredData={homeStructuredData}
      />
      <main className="min-h-screen bg-slate-50/40">
        <HeroSection />
        <QuickSearch />
        <HomeStatsCounter />

      <Suspense
        fallback={
          <div className="flex items-center justify-center py-20 bg-white">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#0FA8D6]" />
          </div>
        }
      >
        <HomeDepartments />
        <HomeDoctors />
        <HomeAbout />
        <HomeTechnology />
        <HomeProstateBPH />
        <HomeDiagnosticsStrip />
        <NABHAccreditationSection />

        <HomeWhyChooseUs />
        <HomeTestimonials />

        <HomeBlog />
        <HomeFAQ />
        <ContactSection />
      </Suspense>
    </main>
    </>
  );
};

export default Home;
