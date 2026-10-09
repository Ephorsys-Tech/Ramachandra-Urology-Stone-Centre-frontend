import { useState, useEffect } from "react";
import { LayoutDashboard, Users, UserCog, LogOut, X, Building, Image, FileText, Sparkles, Activity, Stethoscope } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { logoutAdmin } from "../../redux/features/auth/authThunk";
import { fetchSettings } from "../../redux/features/setting/settingThunk";
import toast from "react-hot-toast";

const NAV_ITEMS = [
  { path: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { path: "/admin/patients", label: "Patients", icon: Users },
  { path: "/admin/doctors", label: "Doctors", icon: UserCog },
  { path: "/admin/departments", label: "Departments", icon: Building },
  { path: "/admin/services", label: "Services", icon: Stethoscope },
  { path: "/admin/features", label: "Features", icon: Sparkles },
  { path: "/admin/diseases", label: "Diseases", icon: Activity },
  { path: "/admin/gallery", label: "Gallery", icon: Image },
  { path: "/admin/blogs", label: "Blogs", icon: FileText },
];

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const { admin } = useSelector((state) => state.auth);
  const { settings } = useSelector((state) => state.setting);

  // Fetch settings on component mount
  useEffect(() => {
    dispatch(fetchSettings());
  }, [dispatch]);

  const isSuperAdmin = admin?.role === "super_admin";
  const visibleNavItems = NAV_ITEMS.filter((item) => {
    if (isSuperAdmin) return true;
    return ["Dashboard", "Patients"].includes(item.label);
  });

  async function confirmSignOut() {
    setShowLogoutModal(false);
    try {
      await dispatch(logoutAdmin()).unwrap();
      toast.success("Logged out successfully");
      navigate("/admin");
    } catch (err) {
      toast.error(err || "Logout failed");
    }
  }

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white flex flex-col transition-transform duration-300
          lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 lg:shrink-0
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="flex items-center justify-between px-6 py-4 border-b border-white/10"
        >
          <div className="flex items-center gap-2">
            <img 
              src={settings?.logo || "/logo.png"} 
              alt="Hospital Logo" 
              className="w-14 h-14 rounded-lg object-cover bg-white/70 p-1"
            />
            <div>
              <p className="text-md font-extrabold tracking-tight leading-tight">RAMACHANDRA</p>
              <p className="text-[10px] text-slate-400">Admin Portal</p>
            </div>
          </div>

          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1.5 hover:bg-white/10 rounded-lg transition"
          >
            <X size={18} />
          </button>
        </motion.div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1">
          {visibleNavItems.map(({ path, label, icon: Icon }, i) => (
            <motion.div
              key={path}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + i * 0.07, duration: 0.3, ease: "easeOut" }}
            >
              <NavLink
                to={path}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-medium transition-all
                  ${isActive
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
                    : "text-slate-400 hover:text-white hover:bg-white/10"
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <Icon size={18} />
                  <span>{label}</span>
                </div>
              </NavLink>
            </motion.div>
          ))}
        </nav>

        {/* Logout */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.3 }}
          className="px-4 pb-6"
        >
          <motion.button
            onClick={() => setShowLogoutModal(true)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full flex cursor-pointer items-center justify-center gap-3 px-4 py-2.5 bg-red-600/20 hover:bg-red-600 border border-red-500/30 hover:border-red-500 rounded-xl text-sm font-medium text-red-400 hover:text-white transition-all duration-200"
          >
            <LogOut size={18} />
            Logout
          </motion.button>
        </motion.div>
      </aside>

      {/* Logout Confirmation Modal */}
      <AnimatePresence>
        {showLogoutModal && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowLogoutModal(false)}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white w-full max-w-sm rounded-2xl shadow-xl overflow-hidden relative z-10 border border-slate-200 p-6 space-y-4 text-center"
            >
              <div className="mx-auto w-12 h-12 rounded-full bg-red-50 flex items-center justify-center text-red-500 mb-2 animate-bounce">
                <LogOut size={22} className="ml-0.5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-slate-900">Sign Out</h3>
                <p className="text-slate-500 text-xs leading-relaxed">
                  Are you sure you want to sign out of your admin dashboard session?
                </p>
              </div>
              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => setShowLogoutModal(false)}
                  className="w-full py-2.5 bg-slate-100 hover:bg-slate-200/80 text-slate-700 rounded-xl text-xs font-semibold transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmSignOut}
                  className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-semibold shadow-md shadow-red-600/10 transition cursor-pointer"
                >
                  Yes, Sign Out
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;
