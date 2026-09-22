import { Outlet } from "react-router-dom"
import Navbar from "./Navbar"
import Footer from "./Footer"
import AppointmentModal from "../components/AppointmentModal"
import FloatingSidebar from "../components/FloatingSidebar"
import ScrollFeatures from "../components/ScrollFeatures"
import MobileNavigationDock from "../components/MobileNavigationDock"

const MainLayouts = () => {
  return (
    <div className="pb-16 lg:pb-0 min-h-screen overflow-x-clip w-full relative">
      <ScrollFeatures />
      <Navbar />
      <AppointmentModal />
      <FloatingSidebar />
      <main>
        <Outlet />
      </main>
      <Footer />
      <MobileNavigationDock />
    </div>
  )
}

export default MainLayouts