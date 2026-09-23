import GalleryHero from "../components/Gallery/GalleryHero";
import GalleryGrid from "../components/Gallery/GalleryGrid";
import SEO from "../components/common/SEO";

const Gallery = () => {
  const galleryStructuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": "https://ramachandraurology.com/gallery#webpage",
        "url": "https://ramachandraurology.com/gallery",
        "name": "Hospital Gallery & Operation Theatres | Ramachandra Urology & Stone Centre",
        "description": "View photos of our modular operation theatres, Thulium Fiber Laser systems, patient care rooms, and modern diagnostic facilities in Burla, Sambalpur.",
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
              "name": "Gallery",
              "item": "https://ramachandraurology.com/gallery"
            }
          ]
        }
      }
    ]
  };

  return (
    <>
      <SEO
        title="Hospital Gallery, Laser Theatres & Facilities in Sambalpur"
        description="Take a visual tour of Ramachandra Urology & Stone Centre in Burla, Sambalpur. Explore our modular laser OTs, recovery suites, and cutting-edge medical infrastructure."
        canonical="/gallery"
        structuredData={galleryStructuredData}
      />
      <main className="bg-slate-50/50 min-h-screen pb-20">
        <GalleryHero />
        <GalleryGrid />
      </main>
    </>
  );
};

export default Gallery;
