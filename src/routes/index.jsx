import { Suspense } from "react";
import { BrowserRouter, Routes } from "react-router-dom";
import AdminRoutes from "./admin.routes";
import PublicRoutes from "./public.routes";
import ScrollToTop from "../Helper/ScrollToTop";
import LoadingScreen from "../components/LoadingScreen";
import SmoothScroll from "../components/SmoothScroll";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <SmoothScroll>
        <ScrollToTop />
        <Suspense fallback={<LoadingScreen />}>
          <Routes>
            {AdminRoutes}
            {PublicRoutes}
          </Routes>
        </Suspense>
      </SmoothScroll>
    </BrowserRouter>
  );
};

export default AppRoutes;