import { lazy, Suspense } from "react";
import HeroSection from "../components/HeroSection";
import QuickSearch from "../components/Home/QuickSearch";
import HomeEmergency from "../components/Home/HomeEmergency";
import PopupBanner from "../components/PopupBanner";

const HomeAbout = lazy(() => import("../components/Home/HomeAbout"));
const HomeDepartments = lazy(() => import("../components/Home/HomeDepartments"));
const HomeDoctors = lazy(() => import("../components/Home/HomeDoctors"));
const HomeTestimonials = lazy(() => import("../components/Home/HomeTestimonials"));
const HomeVideoReviews = lazy(() => import("../components/Home/HomeVideoReviews"));
const HomeGallery = lazy(() => import("../components/Home/HomeGallery"));
const HomeFAQ = lazy(() => import("../components/Home/HomeFAQ"));
const HomeBlog = lazy(() => import("../components/Home/HomeBlog"));
const HomeContact = lazy(() => import("../components/Home/HomeContact"));

const Home = () => {
  return (
    <main className="min-h-screen bg-background">
      <PopupBanner />
      <HeroSection />
      <QuickSearch />
      <HomeEmergency />
      <Suspense fallback={
        <div className="flex items-center justify-center py-24 bg-background">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-secondary" />
        </div>
      }>
        <HomeAbout />
        <HomeDoctors />
        <HomeDepartments />
        <HomeTestimonials />
        <HomeVideoReviews />
        <HomeGallery />
        <HomeBlog />
        <HomeFAQ />
        <HomeContact />
      </Suspense>
    </main>
  );
};

export default Home;