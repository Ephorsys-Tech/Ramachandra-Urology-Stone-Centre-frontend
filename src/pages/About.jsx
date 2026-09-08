import AboutHero from "../components/About/AboutHero";
import AboutStory from "../components/About/AboutStory";
import AboutMisson from "../components/About/AboutMisson";
import AboutVission from "../components/About/AboutVission";
import AboutStats from "../components/About/AboutStats";
import AboutFacilities from "../components/About/AboutFacilities";

import AboutValues from "../components/About/AboutValues";
import HomeTestimonials from "../components/Home/HomeTestimonials"; const About = () => {
  return (
    <main className="bg-background min-h-screen pb-12">
      <AboutHero />
      <AboutStory />

      {/* Mission & Vision Section */}
      <section className="max-w-7xl mx-auto px-4 mb-32">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          <AboutMisson />
          <AboutVission />
        </div>
      </section>

      <AboutStats />
      <AboutFacilities />
      <AboutValues />
      <HomeTestimonials />

    </main>
  );
};

export default About;
