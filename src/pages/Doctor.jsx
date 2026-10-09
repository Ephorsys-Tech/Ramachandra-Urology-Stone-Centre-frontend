import { useSelector } from "react-redux";
import DoctorHero from "../components/Doctor/DoctorHero";
import DoctorGrid from "../components/Doctor/DoctorGrid";
import SEO from "../components/common/SEO";

const Doctor = () => {
  const { doctors = [] } = useSelector((state) => state.doctor || {});

  const doctorsStructuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "MedicalBusiness",
        "@id": "https://ramachandraurology.com/doctors#directory",
        "name": "Urology Doctors & Laser Surgeons | Ramachandra Urology & Stone Centre",
        "url": "https://ramachandraurology.com/doctors",
        "description": "Meet our team of leading urologists, laser surgeons, and renal specialists led by Dr. Sanjay Kumar Mahapatra (M.Ch AIIMS New Delhi) in Burla, Sambalpur.",
        "breadcrumb": {
          "@type": "BreadcrumbList",
          "itemListElement": [
            {
              "@type": "ListItem",
              "position": 1,
              "name": "Home",
              "item": "https://ramachandraurology.com/"
            },
            {
              "@type": "ListItem",
              "position": 2,
              "name": "Our Doctors",
              "item": "https://ramachandraurology.com/doctors"
            }
          ]
        },
        "hasOfferCatalog": {
          "@type": "OfferCatalog",
          "name": "Clinical Specialists",
          "itemListElement": doctors.map((doc, idx) => ({
            "@type": "Physician",
            "position": idx + 1,
            "name": doc.name,
            "jobTitle": doc.designation || "Urology Specialist",
            "medicalSpecialty": doc.specialization || "Urology & Laser Surgery"
          }))
        }
      }
    ]
  };

  return (
    <>
      <SEO
        title="Our Expert Urology Doctors & Surgeons in Sambalpur"
        description="Consult top urologists and laser surgeons at Ramachandra Urology & Stone Centre, Burla, Sambalpur. Led by Dr. Sanjay Kumar Mahapatra (M.Ch AIIMS New Delhi) for advanced kidney and prostate care."
        canonical="/doctors"
        structuredData={doctorsStructuredData}
      />
      <main className="bg-[#f8fafc] min-h-screen pb-16">
        <DoctorHero totalDoctors={doctors.length} />
        <DoctorGrid />
      </main>
    </>
  );
};

export default Doctor;
