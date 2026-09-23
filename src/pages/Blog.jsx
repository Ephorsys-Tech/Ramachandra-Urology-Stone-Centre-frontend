import BlogHero from "../components/Blog/BlogHero";
import BlogList from "../components/Blog/BlogList";
import SEO from "../components/common/SEO";

const Blog = () => {
  const blogStructuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Blog",
        "@id": "https://ramachandraurology.com/blog#blog",
        "name": "Kidney Care & Urology Health Articles | Ramachandra Urology & Stone Centre",
        "url": "https://ramachandraurology.com/blog",
        "description": "Evidence-based health guides on kidney stone prevention, laser RIRS surgery, prostate health (BPH), urinary infections, and modern urological care.",
        "publisher": {
          "@type": "Hospital",
          "name": "Ramachandra Urology & Stone Centre",
          "url": "https://ramachandraurology.com/"
        },
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
              "name": "Blog",
              "item": "https://ramachandraurology.com/blog"
            }
          ]
        }
      }
    ]
  };

  return (
    <>
      <SEO
        title="Urology & Kidney Stone Health Blog | Expert Medical Insights"
        description="Read educational articles by expert urologists on kidney stone symptoms, laser lithotripsy (RIRS/PCNL), enlarged prostate (BPH) management, and renal health tips."
        canonical="/blog"
        structuredData={blogStructuredData}
      />
      <main className="bg-slate-50/50 min-h-screen pb-20">
        <BlogHero />
        <BlogList />
      </main>
    </>
  );
};

export default Blog;
