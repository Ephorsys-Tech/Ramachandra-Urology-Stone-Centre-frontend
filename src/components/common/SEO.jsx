import { useEffect } from "react";

const SITE_URL = "https://ramachandraurology.com";
const DEFAULT_IMAGE = `${SITE_URL}/logo.png`;
const DEFAULT_TITLE = "Ramachandra Urology & Stone Centre | Advanced Kidney Care | Burla, Sambalpur";
const DEFAULT_DESCRIPTION = "Ramachandra Urology & Stone Centre (NABH Accredited SHCO, Reg No. 14/2024) in Sourav Vihar, Burla, Sambalpur. Led by Dr. Sanjay Kumar Mahapatra (M.Ch AIIMS New Delhi) for advanced laser kidney stone removal (RIRS/PCNL), prostate surgery (THUFLEP), and Ayushman/GJAY cashless care.";

/**
 * Production-ready SEO Component for React 19 / Vite SPA
 * Dynamically updates document.title, canonical link, meta tags, OpenGraph, Twitter cards, and JSON-LD schemas.
 */
const SEO = ({
  title,
  description = DEFAULT_DESCRIPTION,
  canonical,
  ogType = "website",
  ogImage = DEFAULT_IMAGE,
  ogImageAlt = "Ramachandra Urology & Stone Centre Burla Sambalpur",
  keywords = "Ramachandra Urology, Urology Sambalpur, Kidney Stone Hospital Burla, Dr Sanjay Kumar Mahapatra, Laser Lithotripsy Sambalpur, RIRS Burla, PCNL, Ayushman Bharat Hospital Sambalpur, GJAY Hospital",
  noindex = false,
  structuredData = null,
}) => {
  useEffect(() => {
    // 1. Set Title
    const fullTitle = title ? `${title} | Ramachandra Urology & Stone Centre` : DEFAULT_TITLE;
    document.title = fullTitle;

    // Helper to update or create meta tag
    const setMetaTag = (attributeName, attributeValue, content) => {
      if (!content) return;
      let element = document.querySelector(`meta[${attributeName}="${attributeValue}"]`);
      if (!element) {
        element = document.createElement("meta");
        element.setAttribute(attributeName, attributeValue);
        document.head.appendChild(element);
      }
      element.setAttribute("content", content);
    };

    // Helper to update or create link tag
    const setLinkTag = (rel, href) => {
      if (!href) return;
      let element = document.querySelector(`link[rel="${rel}"]`);
      if (!element) {
        element = document.createElement("link");
        element.setAttribute("rel", rel);
        document.head.appendChild(element);
      }
      element.setAttribute("href", href);
    };

    // 2. Standard Meta Tags
    setMetaTag("name", "description", description);
    setMetaTag("name", "keywords", keywords);
    setMetaTag("name", "robots", noindex ? "noindex, nofollow" : "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1");

    // 3. Canonical Link
    const currentUrl = canonical
      ? (canonical.startsWith("http") ? canonical : `${SITE_URL}${canonical}`)
      : (typeof window !== "undefined" ? window.location.href.split("?")[0].split("#")[0] : SITE_URL);
    setLinkTag("canonical", currentUrl);

    // 4. Open Graph Meta Tags
    setMetaTag("property", "og:title", fullTitle);
    setMetaTag("property", "og:description", description);
    setMetaTag("property", "og:type", ogType);
    setMetaTag("property", "og:url", currentUrl);
    setMetaTag("property", "og:site_name", "Ramachandra Urology & Stone Centre");
    const fullOgImage = ogImage.startsWith("http") ? ogImage : `${SITE_URL}${ogImage.startsWith("/") ? "" : "/"}${ogImage}`;
    setMetaTag("property", "og:image", fullOgImage);
    setMetaTag("property", "og:image:alt", ogImageAlt);

    // 5. Twitter Card Meta Tags
    setMetaTag("name", "twitter:card", "summary_large_image");
    setMetaTag("name", "twitter:title", fullTitle);
    setMetaTag("name", "twitter:description", description);
    setMetaTag("name", "twitter:image", fullOgImage);
    setMetaTag("name", "twitter:image:alt", ogImageAlt);

    // 6. JSON-LD Dynamic Structured Data
    const scriptId = "dynamic-seo-jsonld";
    let scriptElement = document.getElementById(scriptId);

    if (structuredData) {
      if (!scriptElement) {
        scriptElement = document.createElement("script");
        scriptElement.id = scriptId;
        scriptElement.type = "application/ld+json";
        document.head.appendChild(scriptElement);
      }
      scriptElement.textContent = JSON.stringify(structuredData);
    } else if (scriptElement) {
      scriptElement.remove();
    }

    return () => {
      // Cleanup on unmount if needed
    };
  }, [title, description, canonical, ogType, ogImage, ogImageAlt, keywords, noindex, structuredData]);

  return null;
};

export default SEO;
