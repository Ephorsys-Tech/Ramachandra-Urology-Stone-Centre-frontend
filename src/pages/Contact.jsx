import ContactHero from "../components/Contact/ContactHero";
import ContactSection from "../components/Contact/ContactSection";
import ContactMap from "../components/Contact/ContactMap";
import SEO from "../components/common/SEO";

const Contact = () => {
  const contactStructuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ContactPage",
        "@id": "https://ramachandraurology.com/contact#webpage",
        "url": "https://ramachandraurology.com/contact",
        "name": "Contact Ramachandra Urology & Stone Centre | Burla, Sambalpur",
        "description": "Reach out to Ramachandra Urology & Stone Centre in Sourav Vihar, Burla, Sambalpur. 24/7 emergency colic desk, OPD appointments, and hospital directions.",
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
              "name": "Contact Us",
              "item": "https://ramachandraurology.com/contact"
            }
          ]
        },
        "mainEntity": {
          "@type": "Hospital",
          "name": "Ramachandra Urology & Stone Centre",
          "telephone": ["+918895062072", "+919937566625", "+917653899199", "0663-4075199"],
          "email": "ruasc.burla@gmail.com",
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
          "openingHours": "Mo-Su 00:00-23:59"
        }
      }
    ]
  };

  return (
    <>
      <SEO
        title="Contact Us & Emergency Helpline in Burla, Sambalpur"
        description="Contact Ramachandra Urology & Stone Centre in Burla, Sambalpur. Call +91 88950 62072 or 0663-4075199 for 24/7 laser kidney stone emergencies, OPD bookings, and hospital location."
        canonical="/contact"
        structuredData={contactStructuredData}
      />
      <main className="bg-slate-50/50 min-h-screen pb-16">
        <ContactHero />
        <ContactSection />
        <ContactMap />
      </main>
    </>
  );
};

export default Contact;