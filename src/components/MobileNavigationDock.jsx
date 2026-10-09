import React, { memo } from "react";
import { Link, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { motion } from "framer-motion";
import { Home, Stethoscope, Calendar, Building2, Phone } from "lucide-react";
import { openAppointmentModal } from "../redux/features/patient/patientSlice";

const MobileNavigationDock = memo(() => {
  const location = useLocation();
  const dispatch = useDispatch();

  const currentPath = location.pathname;

  const navItems = [
    {
      id: "home",
      label: "Home",
      to: "/",
      icon: Home,
      isActive: currentPath === "/",
    },
    {
      id: "doctors",
      label: "Doctors",
      to: "/doctors",
      icon: Stethoscope,
      isActive: currentPath.startsWith("/doctors"),
    },
    {
      id: "appointment",
      label: "Book",
      isAction: true,
      icon: Calendar,
      onClick: () => dispatch(openAppointmentModal()),
    },
    {
      id: "departments",
      label: "Services",
      to: "/urology-services",
      icon: Building2,
      isActive: currentPath.startsWith("/urology-services"),
    },
    {
      id: "contact",
      label: "Contact",
      to: "/contact",
      icon: Phone,
      isActive: currentPath === "/contact",
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 w-full flex justify-center lg:hidden pointer-events-none ">
      <motion.nav
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="pointer-events-auto relative w-full max-w-lg bg-white/95 backdrop-blur-2xl border-t border-slate-200/90 shadow-[0_-8px_30px_rgba(0,0,0,0.08)] rounded-t-[30px] px-3 pt-2 pb-2.5 flex items-center justify-between"
      >
        {navItems.map((item) => {
          const Icon = item.icon;

          // Center Elevated Quick-Book Action
          if (item.isAction) {
            return (
              <motion.button
                key={item.id}
                onClick={item.onClick}
                whileTap={{ scale: 0.9 }}
                whileHover={{ scale: 1.04 }}
                className="relative -mt-6 flex flex-col items-center justify-center cursor-pointer border-none bg-transparent outline-none group px-2"
                aria-label="Book Appointment"
              >
                {/* Elevated Center Orb */}
                <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-[#0FA8D6] to-[#024363] shadow-[0_8px_22px_rgba(15,168,214,0.4)] flex items-center justify-center text-white border-3 border-white transition-transform duration-200">
                  <Icon size={24} className="stroke-[2.3]" />
                </div>
                <span className="text-[11px] font-extrabold text-[#024363] mt-1 tracking-tight">
                  {item.label}
                </span>
              </motion.button>
            );
          }

          // Standard Nav Links
          return (
            <Link
              key={item.id}
              to={item.to}
              className="relative flex-1 flex flex-col items-center justify-center py-1.5 px-1 rounded-2xl no-underline transition-colors outline-none cursor-pointer group"
            >
              <div className="relative z-10 flex flex-col items-center gap-1">
                <Icon
                  size={21}
                  className={`transition-all duration-200 ${
                    item.isActive
                      ? "text-[#024363] stroke-[2.5]"
                      : "text-slate-500 group-hover:text-slate-800 stroke-[1.9]"
                  }`}
                />
                <span
                  className={`text-[11px] font-bold tracking-tight transition-colors duration-200 ${
                    item.isActive ? "text-[#024363]" : "text-slate-500"
                  }`}
                >
                  {item.label}
                </span>
              </div>
            </Link>
          );
        })}
      </motion.nav>
    </div>
  );
});

MobileNavigationDock.displayName = "MobileNavigationDock";

export default MobileNavigationDock;
