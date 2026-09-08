import GalleryHero from "../components/Gallery/GalleryHero";
import GalleryGrid from "../components/Gallery/GalleryGrid";

const Gallery = () => {
  return (
    <main className="bg-background min-h-screen pb-24">
      <GalleryHero />
      <GalleryGrid />
    </main>
  );
};

export default Gallery;
