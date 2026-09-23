import DepartmentHero from "../components/Department/DepartmentHero";
import DepartmentGrid from "../components/Department/DepartmentGrid";
import SEO from "../components/common/SEO";

const Department = () => {
  const departmentStructuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "MedicalBusiness",
        "@id": "https://ramachandraurology.com/urology-services#services",
        "name": "Urology Clinical Services & Laser Specialties | Ramachandra Urology & Stone Centre",
        "url": "https://ramachandraurology.com/urology-services",
        "description": "Comprehensive urology and kidney stone specialties including Endourology, Thulium Laser Lithotripsy, Laparoscopy, Uro-Oncology, Andrology, and Pediatric Urology in Burla, Sambalpur.",
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
              "name": "Urology Services",
              "item": "https://ramachandraurology.com/urology-services"
            }
          ]
        }
      }
    ]
  };

  return (
    <>
      <SEO
        title="Urology Services & Laser Kidney Stone Specialties in Sambalpur"
        description="Explore advanced urology services at Ramachandra Urology & Stone Centre, Burla, Sambalpur: Thulium Fiber Laser RIRS, Mini-PCNL, Prostate ThuFLEP, Laparoscopy & 24/7 Emergency Care."
        canonical="/urology-services"
        structuredData={departmentStructuredData}
      />
      <main className="bg-slate-50/50 min-h-screen pb-20">
        <DepartmentHero />
        <DepartmentGrid />
      </main>
    </>
  );
};

export default Department;
