import GalleryHero from "../components/Gallery/GalleryHero";
import GalleryGrid from "../components/Gallery/GalleryGrid";

const Gallery = () => {
  return (
    <main className="bg-slate-50/50 min-h-screen pb-20">
      <GalleryHero />
      <GalleryGrid />
    </main>
  );
};

export default Gallery;
