import { lazy, Suspense } from "react";
import HeroSection from "../components/HeroSection";
import QuickSearch from "../components/Home/QuickSearch";
import HomeStatsCounter from "../components/Home/HomeStatsCounter";

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
  );
};

export default Home;
