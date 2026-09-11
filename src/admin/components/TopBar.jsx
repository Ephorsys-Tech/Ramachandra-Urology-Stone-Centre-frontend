import { Menu, User, LogOut, Maximize, Minimize, Bell, Mail, Calendar, CheckCheck } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logoutAdmin } from "../../redux/features/auth/authThunk";
import { markMessageAsRead } from "../../redux/features/message/messageSlice";
import toast from "react-hot-toast";

const TopBar = ({ setSidebarOpen }) => {
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const dropdownRef = useRef(null);
  const notificationDropdownRef = useRef(null);
  
  const { admin: user } = useSelector((state) => state.auth);
  const { messages = [], readIds = [] } = useSelector((state) => state.message || {});
  const { requests = [] } = useSelector((state) => state.appointmentRequest || {});
  
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Close dropdowns on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
      if (notificationDropdownRef.current && !notificationDropdownRef.current.contains(e.target)) {
        setNotificationsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const unreadMessages = messages.filter((m) => !(readIds || []).includes(m._id));
  const pendingRequests = requests.filter((r) => r.status === "Pending");

  const notifications = [
    ...unreadMessages.map((m) => ({
      _id: m._id,
      type: "message",
      name: m.name,
      detail: m.subject || "General Inquiry",
      text: m.message,
      createdAt: m.createdAt,
    })),
    ...pendingRequests.map((r) => ({
      _id: r._id,
      type: "request",
      name: r.name,
      detail: r.department ? `${r.department} Dept` : "General Appointment",
      text: r.message || `Preferred slot: ${r.preferredTimeSlot || "Any time"}`,
      createdAt: r.createdAt,
    })),
  ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const totalNotificationsCount = notifications.length;

  const handleMarkAllAsRead = () => {
    if (unreadMessages.length === 0) return;
    unreadMessages.forEach((m) => {
      dispatch(markMessageAsRead(m._id));
    });
    toast.success("All messages marked as read");
  };

  const handleNotificationClick = (notif) => {
    setNotificationsOpen(false);
    if (notif.type === "message") {
      dispatch(markMessageAsRead(notif._id));
      navigate("/admin/messages");
    } else if (notif.type === "request") {
      navigate("/admin/patients", { state: { activeTab: "requests" } });
    }
  };

  const formatTimeAgo = (dateStr) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    const now = new Date();
    const diffMs = now - d;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return "Yesterday";
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  // Sync fullscreen state with browser events (e.g. Esc key exits)
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
        .then(() => setIsFullscreen(true))
        .catch((err) => console.error("Error attempting to enable fullscreen:", err));
    } else {
      document.exitFullscreen()
        .then(() => setIsFullscreen(false))
        .catch((err) => console.error("Error attempting to exit fullscreen:", err));
    }
  };

  const confirmSignOut = async () => {
    setShowLogoutModal(false);
    try {
      await dispatch(logoutAdmin()).unwrap();
      toast.success("Logged out successfully");
      navigate("/admin");
    } catch (err) {
      toast.error(err || "Logout failed");
    }
  };

  return (
    <>
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="relative z-10 bg-white border-b border-slate-200 px-6 h-16 flex items-center justify-between shrink-0"
      >
        {/* Left */}
        <div className="flex items-center gap-3">
          <motion.button
            whileTap={{ scale: 0.92 }}
            className="lg:hidden w-9 h-9 flex items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 transition cursor-pointer"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open sidebar"
          >
            <Menu size={18} />
          </motion.button>

          <motion.span
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1, ease: "easeOut" }}
            className="text-[15px] font-semibold tracking-wider text-slate-800"
          >
            RAMACHANDRA ADMIN
          </motion.span>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          {/* Fullscreen Button */}
          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={toggleFullscreen}
            className="w-9 h-9 flex items-center justify-center rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-700 transition cursor-pointer"
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen Mode"}
          >
            {isFullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
          </motion.button>

          {/* Notifications Dropdown */}
          <div className="relative" ref={notificationDropdownRef}>
            <motion.button
              whileTap={{ scale: 0.92 }}
              onClick={() => setNotificationsOpen((o) => !o)}
              className="w-9 h-9 flex items-center justify-center rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-700 transition cursor-pointer relative"
              title="Notifications"
            >
              <Bell size={18} />
              {totalNotificationsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] font-bold h-4.5 min-w-4.5 px-1 rounded-full flex items-center justify-center animate-pulse shadow-md border border-white">
                  {totalNotificationsCount}
                </span>
              )}
            </motion.button>

            <AnimatePresence>
              {notificationsOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.96 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="absolute right-0 mt-2.5 w-80 sm:w-96 bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden z-50"
                  style={{ boxShadow: "0 20px 40px rgba(0,0,0,0.1), 0 0 0 1px rgba(0,0,0,0.05)" }}
                >
                  {/* Header */}
                  <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <div className="flex items-center gap-2">
                      <span className="text-[13px] font-bold text-slate-800">Notifications</span>
                      {totalNotificationsCount > 0 && (
                        <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                          {totalNotificationsCount} new
                        </span>
                      )}
                    </div>
                    {unreadMessages.length > 0 && (
                      <button
                        onClick={handleMarkAllAsRead}
                        className="text-[11px] text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1 transition cursor-pointer"
                      >
                        <CheckCheck size={13} />
                        Mark messages read
                      </button>
                    )}
                  </div>

                  {/* List */}
                  <div className="max-h-72 sm:max-h-[350px] overflow-y-auto divide-y divide-slate-105">
                    {notifications.length === 0 ? (
                      <div className="py-10 px-4 text-center flex flex-col items-center justify-center">
                        <div className="w-11 h-11 rounded-full bg-slate-50 flex items-center justify-center text-slate-405 mb-2">
                          <Bell size={18} />
                        </div>
                        <p className="text-[13px] font-bold text-slate-800">All caught up!</p>
                        <p className="text-slate-400 text-[11px] mt-0.5">No unread notifications to show.</p>
                      </div>
                    ) : (
                      notifications.map((notif) => (
                        <div
                          key={notif._id}
                          onClick={() => handleNotificationClick(notif)}
                          className="p-3.5 flex items-start gap-3 hover:bg-slate-50 transition cursor-pointer relative group"
                        >
                          {/* Type icon */}
                          <div className={`w-8.5 h-8.5 rounded-xl flex items-center justify-center shrink-0 ${
                            notif.type === "message"
                              ? "bg-blue-50 text-blue-600 border border-blue-100"
                              : "bg-purple-50 text-purple-600 border border-purple-100"
                          }`}>
                            {notif.type === "message" ? <Mail size={15} /> : <Calendar size={15} />}
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-1.5">
                              <p className="text-[12px] font-bold text-slate-800 truncate">{notif.name}</p>
                              <span className="text-[10px] text-slate-400 shrink-0 font-medium">{formatTimeAgo(notif.createdAt)}</span>
                            </div>
                            <p className={`text-[11px] font-semibold mt-0.5 truncate ${
                              notif.type === "message" ? "text-blue-705" : "text-purple-705"
                            }`}>
                              {notif.detail}
                            </p>
                            <p className="text-slate-400 text-[11px] mt-0.5 truncate">{notif.text}</p>
                          </div>

                          {/* Unread indicator */}
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 self-center shrink-0 group-hover:scale-110 transition" />
                        </div>
                      ))
                    )}
                  </div>

                  {/* Footer links */}
                  <div className="border-t border-slate-100 p-1.5 bg-slate-50/50 grid grid-cols-2 gap-1.5">
                    <button
                      onClick={() => {
                        setNotificationsOpen(false);
                        navigate("/admin/messages");
                      }}
                      className="w-full py-2 flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 transition cursor-pointer text-[11px] font-semibold"
                    >
                      <Mail size={12} className="text-slate-400" />
                      All Messages
                    </button>
                    <button
                      onClick={() => {
                        setNotificationsOpen(false);
                        navigate("/admin/patients", { state: { activeTab: "requests" } });
                      }}
                      className="w-full py-2 flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 transition cursor-pointer text-[11px] font-semibold"
                    >
                      <Calendar size={12} className="text-slate-400" />
                      Appointments
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Profile Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <motion.button
              onClick={() => setProfileOpen((o) => !o)}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-2 px-2 py-1 rounded-xl hover:bg-slate-50 transition cursor-pointer"
            >
              <div className="hidden sm:block text-right">
                <p className="text-[13px] font-medium text-slate-800 leading-tight">{user?.name || "Admin User"}</p>
                <p className="text-[11px] uppercase tracking-wider text-slate-400 leading-tight">{user?.role || "Staff"}</p>
              </div>

              <div className="w-9 h-9 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center text-[13px] font-medium text-blue-700">
                <User size={18} />
              </div>
            </motion.button>

            {/* Dropdown Menu */}
            <AnimatePresence>
              {profileOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.96 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="absolute right-0 mt-2.5 w-52 bg-white border border-slate-200 rounded-xl shadow-md overflow-hidden z-50"
                >
                  {/* Identity */}
                  <div className="flex items-center gap-2.5 px-3.5 py-3 border-b border-slate-100">
                    <div className="w-9 h-9 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center text-[13px] font-medium text-blue-700 shrink-0">
                      {user?.name ? user.name[0] : "A"}
                    </div>
                    <div>
                      <p className="text-[13px] font-medium text-slate-800">{user?.name || "Admin User"}</p>
                      <p className="text-[11px] text-slate-400 capitalize truncate w-32">{user?.email || "admin@ramachandrahospital.com"}</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="p-1.5">
                    <motion.button
                      whileHover={{ backgroundColor: "#f8fafc" }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[13px] text-slate-700 transition text-left cursor-pointer"
                    >
                      <User size={15} className="text-slate-400" />
                      My profile
                    </motion.button>
                  </div>

                  {/* Sign out */}
                  <div className="border-t border-slate-100 p-1.5">
                    <motion.button
                      onClick={() => {
                        setProfileOpen(false);
                        setShowLogoutModal(true);
                      }}
                      whileHover={{ backgroundColor: "#fef2f2" }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[13px] text-red-500 transition text-left cursor-pointer"
                    >
                      <LogOut size={15} />
                      Sign out
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.header>

      {/* Logout Confirmation Modal */}
      <AnimatePresence>
        {showLogoutModal && (
          <div className="fixed inset-0 z-9999 flex items-center justify-center p-4">
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

export default TopBar;
