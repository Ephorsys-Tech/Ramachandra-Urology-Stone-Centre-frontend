import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Building,
  Image as ImageIcon,
  Phone,
  Mail,
  MapPin,
  Bell,
  Save,
  Loader2,
  Shield,
  User,
  Key,
  LogOut
} from "lucide-react";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";
import { fetchSettings, updateSettings } from "../../redux/features/setting/settingThunk";
import { logoutAdmin, getAdminProfile } from "../../redux/features/auth/authThunk";
import api from "../../redux/services/api";
import toast from "react-hot-toast";

const Settings = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { settings, loading } = useSelector((state) => state.setting);
  const { admin } = useSelector((state) => state.auth);

  const [activeTab, setActiveTab] = useState("general");

  // 1. Initialize state directly using Redux settings to avoid an extra useEffect render
  const [formData, setFormData] = useState({
    hospitalName: settings?.hospitalName || "",
    tagline: settings?.tagline || "",
    logo: settings?.logo || "",
    emergencyPhone: settings?.emergencyPhone || "",
    contactEmail: settings?.contactEmail || "",
    address: settings?.address || "",
    facebook: settings?.socialLinks?.facebook || "",
    twitter: settings?.socialLinks?.twitter || "",
    instagram: settings?.socialLinks?.instagram || "",
    linkedin: settings?.socialLinks?.linkedin || "",
    announcementText: settings?.announcementBanner?.text || "",
    announcementActive: settings?.announcementBanner?.isActive || false,
    popupImage: settings?.popupBanner?.image || "",
    popupDescription: settings?.popupBanner?.description || "",
    popupPublished: settings?.popupBanner?.isPublished || false
  });

  // 2. Safely sync state if settings are loaded late from the backend after the initial render
  const [prevSettings, setPrevSettings] = useState(settings);
  if (settings !== prevSettings) {
    setPrevSettings(settings);
    setFormData({
      hospitalName: settings?.hospitalName || "",
      tagline: settings?.tagline || "",
      logo: settings?.logo || "",
      emergencyPhone: settings?.emergencyPhone || "",
      contactEmail: settings?.contactEmail || "",
      address: settings?.address || "",
      facebook: settings?.socialLinks?.facebook || "",
      twitter: settings?.socialLinks?.twitter || "",
      instagram: settings?.socialLinks?.instagram || "",
      linkedin: settings?.socialLinks?.linkedin || "",
      announcementText: settings?.announcementBanner?.text || "",
      announcementActive: settings?.announcementBanner?.isActive || false,
      popupImage: settings?.popupBanner?.image || "",
      popupDescription: settings?.popupBanner?.description || "",
      popupPublished: settings?.popupBanner?.isPublished || false
    });
  }

  useEffect(() => {
    dispatch(fetchSettings());
    if (!admin) {
      dispatch(getAdminProfile());
    }
  }, [dispatch, admin]);

  // Forget Password states
  const [resetStep, setResetStep] = useState(1);
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resetLoading, setResetLoading] = useState(false);

  const handleRequestOtp = async () => {
    if (!admin?.email) return;
    setResetLoading(true);
    try {
      const response = await api.post("/admin/forget-password", { email: admin.email });
      if (response.data.success) {
        toast.success("Reset OTP sent to your email!");
        setResetStep(2);
      } else {
        toast.error(response.data.message || "Failed to send reset OTP");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setResetLoading(false);
    }
  };

  const handleVerifyOtpAndReset = async (e) => {
    e.preventDefault();
    if (!otp || !newPassword || !confirmPassword) {
      toast.error("Please fill in all reset fields");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    setResetLoading(true);
    try {
      const verifyRes = await api.post("/admin/verify-reset-otp", { email: admin.email, otp });
      if (verifyRes.data.success) {
        const token = verifyRes.data.data.resetToken;
        const resetRes = await api.post("/admin/reset-password", {
          email: admin.email,
          resetToken: token,
          password: newPassword,
          confirmPassword
        });
        if (resetRes.data.success) {
          toast.success("Password reset successfully!");
          setResetStep(1);
          setOtp("");
          setNewPassword("");
          setConfirmPassword("");
        } else {
          toast.error(resetRes.data.message || "Password reset failed");
        }
      } else {
        toast.error(verifyRes.data.message || "Invalid OTP code");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Verification failed");
    } finally {
      setResetLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await dispatch(logoutAdmin()).unwrap();
      toast.success("Logged out successfully");
      navigate("/admin");
    } catch (err) {
      toast.error(err || "Logout failed");
    }
  };

  function handleInputChange(e) {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  }

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Logo file size must be less than 2MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          logo: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePopupImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Popup banner image size must be less than 2MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          popupImage: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      hospitalName: formData.hospitalName,
      tagline: formData.tagline,
      logo: formData.logo,
      emergencyPhone: formData.emergencyPhone,
      contactEmail: formData.contactEmail,
      address: formData.address,
      socialLinks: {
        facebook: formData.facebook,
        twitter: formData.twitter,
        instagram: formData.instagram,
        linkedin: formData.linkedin
      },
      announcementBanner: {
        text: formData.announcementText,
        isActive: formData.announcementActive
      },
      popupBanner: {
        image: formData.popupImage,
        description: formData.popupDescription,
        isPublished: formData.popupPublished
      }
    };

    try {
      const result = await dispatch(updateSettings(payload));
      if (updateSettings.fulfilled.match(result)) {
        toast.success("Settings saved successfully!");
      } else {
        toast.error(result.payload || "Failed to update settings");
      }
    } catch (err) {
      toast.error(err || "An unexpected error occurred");
    }
  };

  const tabs = [
    { id: "general", label: "General Settings", icon: Building },
    { id: "branding", label: "Branding & Logo", icon: ImageIcon },
    { id: "contact", label: "Contact Details", icon: Phone },
    { id: "social", label: "Social Media", icon: FaFacebook },
    { id: "announcement", label: "Announcement Banner", icon: Bell },
    ...(admin?.role === "super_admin" ? [{ id: "popup", label: "Popup Banner Config", icon: ImageIcon }] : []),
    { id: "profile", label: "Admin Profile", icon: User },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Hospital Settings</h2>
          <p className="text-sm text-slate-500">Configure global parameters, contact information, and logo branding.</p>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col md:flex-row">
        {/* Navigation Sidebar Tabs */}
        <div className="w-full md:w-64 bg-slate-50 border-r border-slate-100 p-4 space-y-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all text-left cursor-pointer
                  ${isActive
                    ? "bg-blue-600 text-white shadow-md shadow-blue-600/10"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-800"
                  }`}
              >
                <Icon size={18} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Form Container */}
        <form onSubmit={handleSubmit} className="flex-1 p-6 md:p-8 space-y-6">
          {/* General Tab */}
          {activeTab === "general" && (
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-5"
            >
              <h3 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-2">General Settings</h3>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Hospital Name</label>
                <div className="relative">
                  <input
                    type="text"
                    name="hospitalName"
                    value={formData.hospitalName}
                    onChange={handleInputChange}
                    placeholder="Ramachandra Urology & Stone Centre"
                    className="w-full pl-3 pr-4 py-2.5 border border-slate-200 focus:border-blue-500 rounded-xl text-sm outline-none transition"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Tagline</label>
                <input
                  type="text"
                  name="tagline"
                  value={formData.tagline}
                  onChange={handleInputChange}
                  placeholder="Caring for life"
                  className="w-full px-3 py-2.5 border border-slate-200 focus:border-blue-500 rounded-xl text-sm outline-none transition"
                />
              </div>
            </motion.div>
          )}

          {/* Branding Tab */}
          {activeTab === "branding" && (
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-5"
            >
              <h3 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-2">Branding & Logo</h3>

              <div className="space-y-4">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Hospital Logo</label>

                <div className="flex items-center gap-6">
                  {/* Logo Preview */}
                  <div className="w-24 h-24 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center overflow-hidden shrink-0 shadow-inner">
                    {formData.logo ? (
                      <img src={formData.logo} alt="Logo Preview" className="w-full h-full object-contain p-2" />
                    ) : (
                      <ImageIcon size={32} className="text-slate-300" />
                    )}
                  </div>

                  <div className="space-y-2">
                    <input
                      type="file"
                      id="logo-upload"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="hidden"
                    />
                    <label
                      htmlFor="logo-upload"
                      className="inline-block px-4 py-2 border border-slate-300 hover:border-slate-400 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs rounded-lg cursor-pointer transition shadow-sm"
                    >
                      Choose Logo File
                    </label>
                    <p className="text-[11px] text-slate-400">Supported formats: PNG, JPG, SVG. Max size: 2MB.</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Contact Details Tab */}
          {activeTab === "contact" && (
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-5"
            >
              <h3 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-2">Contact Details</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                    <Phone size={14} className="text-slate-400" /> Emergency Phone
                  </label>
                  <input
                    type="text"
                    name="emergencyPhone"
                    value={formData.emergencyPhone}
                    onChange={handleInputChange}
                    placeholder="9090963722"
                    className="w-full px-3 py-2.5 border border-slate-200 focus:border-blue-500 rounded-xl text-sm outline-none transition"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                    <Mail size={14} className="text-slate-400" /> Contact Email
                  </label>
                  <input
                    type="email"
                    name="contactEmail"
                    value={formData.contactEmail}
                    onChange={handleInputChange}
                    placeholder="ruasc.burla@gmail.com"
                    className="w-full px-3 py-2.5 border border-slate-200 focus:border-blue-500 rounded-xl text-sm outline-none transition"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                  <MapPin size={14} className="text-slate-400" /> Clinic Address
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  rows={3}
                  placeholder="123 Healthcare Ave, Clinic City"
                  className="w-full px-3 py-2.5 border border-slate-200 focus:border-blue-500 rounded-xl text-sm outline-none transition resize-none"
                />
              </div>
            </motion.div>
          )}

          {/* Social Media Tab */}
          {activeTab === "social" && (
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-5"
            >
              <h3 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-2">Social Media Links</h3>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center border border-blue-100 text-blue-600 shrink-0">
                    <FaFacebook size={18} />
                  </div>
                  <input
                    type="url"
                    name="facebook"
                    value={formData.facebook}
                    onChange={handleInputChange}
                    placeholder="https://facebook.com/ramachandraurology"
                    className="flex-1 px-3 py-2.5 border border-slate-200 focus:border-blue-500 rounded-xl text-sm outline-none transition"
                  />
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-sky-50 flex items-center justify-center border border-sky-100 text-sky-500 shrink-0">
                    <FaTwitter size={18} />
                  </div>
                  <input
                    type="url"
                    name="twitter"
                    value={formData.twitter}
                    onChange={handleInputChange}
                    placeholder="https://twitter.com/ramachandraurology"
                    className="flex-1 px-3 py-2.5 border border-slate-200 focus:border-blue-500 rounded-xl text-sm outline-none transition"
                  />
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-pink-50 flex items-center justify-center border border-pink-100 text-pink-500 shrink-0">
                    <FaInstagram size={18} />
                  </div>
                  <input
                    type="url"
                    name="instagram"
                    value={formData.instagram}
                    onChange={handleInputChange}
                    placeholder="https://instagram.com/ramachandraurology"
                    className="flex-1 px-3 py-2.5 border border-slate-200 focus:border-blue-500 rounded-xl text-sm outline-none transition"
                  />
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center border border-indigo-100 text-indigo-600 shrink-0">
                    <FaLinkedin size={18} />
                  </div>
                  <input
                    type="url"
                    name="linkedin"
                    value={formData.linkedin}
                    onChange={handleInputChange}
                    placeholder="https://linkedin.com/company/ramachandraurology"
                    className="flex-1 px-3 py-2.5 border border-slate-200 focus:border-blue-500 rounded-xl text-sm outline-none transition"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* Announcement Tab */}
          {activeTab === "announcement" && (
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-5"
            >
              <h3 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-2">Announcement Banner</h3>

              <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-2xl">
                <div>
                  <h4 className="font-semibold text-slate-800 text-sm">Enable Announcement Banner</h4>
                  <p className="text-xs text-slate-400">Show a top notice strip on the patient homepage.</p>
                </div>

                <label className="relative inline-flex items-center cursor-pointer select-none">
                  <input
                    type="checkbox"
                    name="announcementActive"
                    checked={formData.announcementActive}
                    onChange={handleInputChange}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600" />
                </label>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Banner Announcement Text</label>
                <textarea
                  name="announcementText"
                  value={formData.announcementText}
                  onChange={handleInputChange}
                  rows={3}
                  placeholder="Enter notice text here (e.g. Free checkup drive this weekend!)"
                  className="w-full px-3 py-2.5 border border-slate-200 focus:border-blue-500 rounded-xl text-sm outline-none transition resize-none"
                />
              </div>
            </motion.div>
          )}

          {/* Popup Banner Tab (Super Admin Only) */}
          {activeTab === "popup" && admin?.role === "super_admin" && (
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-5"
            >
              <h3 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-2">Popup Banner Configuration</h3>

              <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-2xl">
                <div>
                  <h4 className="font-semibold text-slate-800 text-sm">Publish Popup Banner</h4>
                  <p className="text-xs text-slate-400">Show this modal to visitors upon loading the homepage.</p>
                </div>

                <label className="relative inline-flex items-center cursor-pointer select-none">
                  <input
                    type="checkbox"
                    name="popupPublished"
                    checked={formData.popupPublished}
                    onChange={handleInputChange}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600" />
                </label>
              </div>

              <div className="space-y-4">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Banner Image</label>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                  {/* Banner Preview */}
                  <div className="w-48 h-32 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center overflow-hidden shrink-0 shadow-inner relative">
                    {formData.popupImage ? (
                      <img src={formData.popupImage} alt="Popup Preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-center text-slate-300">
                        <ImageIcon size={32} className="mx-auto mb-1" />
                        <span className="text-[10px] uppercase font-bold tracking-wider">No Image</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <input
                      type="file"
                      id="popup-image-upload"
                      accept="image/*"
                      onChange={handlePopupImageUpload}
                      className="hidden"
                    />
                    <label
                      htmlFor="popup-image-upload"
                      className="inline-block px-4 py-2 border border-slate-300 hover:border-slate-400 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs rounded-lg cursor-pointer transition shadow-sm"
                    >
                      Choose Banner Image
                    </label>
                    <p className="text-[11px] text-slate-400">Supported formats: PNG, JPG. Max size: 2MB.</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Description Text</label>
                <textarea
                  name="popupDescription"
                  value={formData.popupDescription}
                  onChange={handleInputChange}
                  rows={4}
                  placeholder="Enter the details for the popup banner..."
                  className="w-full px-3 py-2.5 border border-slate-200 focus:border-blue-500 rounded-xl text-sm outline-none transition resize-none"
                />
              </div>
            </motion.div>
          )}

          {/* Admin Profile Tab */}
          {activeTab === "profile" && (
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <h3 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-2">Admin Profile Details</h3>

              {/* Profile Card */}
              <div className="flex flex-col sm:flex-row items-center gap-6 p-6 bg-slate-50 border border-slate-200 rounded-2xl">
                <div className="w-20 h-20 rounded-full bg-blue-100 text-blue-600 border border-blue-200 flex items-center justify-center font-bold text-2xl uppercase">
                  {admin?.name?.charAt(0) || "A"}
                </div>
                <div className="space-y-1.5 text-center sm:text-left ">
                  <h4 className="text-base font-bold text-slate-800">{admin?.name || "Administrator"}</h4>
                  <p className="text-xs text-slate-500 flex items-center justify-center sm:justify-start gap-1">
                    <Mail size={12} /> {admin?.email || "admin@ramachandrahospital.com"}
                  </p>
                  <span className="inline-block px-2.5 py-0.5 bg-blue-100 text-blue-700 font-bold text-[10px] rounded-full uppercase tracking-wider">
                    {admin?.role || "Admin"}
                  </span>
                </div>
              </div>

              {/* Password Reset Section */}
              <div className="border border-slate-200 rounded-2xl p-5 space-y-4">
                <div className="flex items-center gap-2 text-slate-700">
                  <Key size={16} className="text-blue-500" />
                  <h4 className="font-bold text-sm">Security & Password Management</h4>
                </div>

                {resetStep === 1 ? (
                  <div className="space-y-3">
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Need to change or reset your administrator password? You can request a secure reset OTP to be sent to your registered email address.
                    </p>
                    <button
                      type="button"
                      disabled={resetLoading}
                      onClick={handleRequestOtp}
                      className="px-4 py-2 bg-blue-50 border border-blue-200 text-blue-600 font-bold text-xs rounded-xl hover:bg-blue-100 transition cursor-pointer flex items-center gap-1.5"
                    >
                      {resetLoading && <Loader2 size={12} className="animate-spin" />}
                      Request Password Reset OTP
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Verification OTP Code</label>
                      <input
                        type="text"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        placeholder="Enter 6-digit OTP code"
                        className="w-full px-3 py-2 border border-slate-200 focus:border-blue-500 rounded-xl text-sm outline-none transition  tracking-widest text-center"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">New Password</label>
                        <input
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="Min. 8 characters"
                          className="w-full px-3 py-2 border border-slate-200 focus:border-blue-500 rounded-xl text-sm outline-none transition"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Confirm Password</label>
                        <input
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Confirm new password"
                          className="w-full px-3 py-2 border border-slate-200 focus:border-blue-500 rounded-xl text-sm outline-none transition"
                        />
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={handleVerifyOtpAndReset}
                        disabled={resetLoading}
                        className="px-4 py-2 bg-blue-600 text-white font-bold text-xs rounded-xl hover:bg-blue-555 transition cursor-pointer flex items-center gap-1.5"
                      >
                        {resetLoading && <Loader2 size={12} className="animate-spin" />}
                        Verify & Reset Password
                      </button>
                      <button
                        type="button"
                        onClick={() => setResetStep(1)}
                        className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Logout Section */}
              <div className="border border-red-200/60 bg-red-50/20 rounded-2xl p-5 space-y-4">
                <div className="flex items-center gap-2 text-red-700">
                  <LogOut size={16} />
                  <h4 className="font-bold text-sm">Account Operations</h4>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Sign out of this administrator dashboard session. Active requests or changes must be saved beforehand.
                </p>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="px-4 py-2 bg-red-50 border border-red-200 text-red-600 font-bold text-xs rounded-xl hover:bg-red-600 hover:text-white transition cursor-pointer flex items-center gap-1.5"
                >
                  <LogOut size={14} /> Log Out Dashboard
                </button>
              </div>
            </motion.div>
          )}

          {/* Save Button */}
          {activeTab !== "profile" && (
            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="flex cursor-pointer items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-550 text-white rounded-xl text-sm font-semibold transition active:scale-[0.985] disabled:opacity-70 disabled:pointer-events-none"
              >
                {loading ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Save size={16} />
                )}
                <span>{loading ? "Saving..." : "Save Changes"}</span>
              </button>
            </div>
          )}
        </form>
      </div>

      <div className="mx-auto bg-slate-900 border border-slate-805 rounded-2xl p-6 md:p-8 text-slate-300 space-y-6 shadow-xl mt-6">
        <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
          <div className="p-2.5 bg-blue-500/10 text-blue-400 rounded-xl">
            <Shield size={20} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Admin Guidelines & Access Control Policy</h3>
            <p className="text-xs text-slate-400">Rules, responsibilities, and system access rights for administrative roles.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Column 1: System Capabilities */}
          <div className="space-y-4">
            <h4 className="font-semibold text-white text-sm flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
              Administrative Capabilities
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400 list-none p-0 m-0">
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">✓</span>
                <span><strong>Hospital Branding:</strong> Update name, tagline, official logo, and contact info at any time.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">✓</span>
                <span><strong>Medical Departments:</strong> Add new departments, upload custom icons, and define services offered.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">✓</span>
                <span><strong>Staff Roster:</strong> Register, update, and manage doctor profiles under active departments.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">✓</span>
                <span><strong>Public Notice:</strong> Broadcast announcements to the front page using the announcement banner.</span>
              </li>
            </ul>
          </div>

          {/* Column 2: Code of Conduct */}
          <div className="space-y-4">
            <h4 className="font-semibold text-white text-sm flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
              Code of Conduct & Data Safety
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400 list-none p-0 m-0">
              <li className="flex items-start gap-2">
                <span className="text-amber-500 font-bold">!</span>
                <span><strong>Credentials:</strong> Never share admin credentials. Use strong passwords and rotate them periodically.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-500 font-bold">!</span>
                <span><strong>Patient Privacy:</strong> Protect patient logs and appointment data. Do not export data to public platforms.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-500 font-bold">!</span>
                <span><strong>Media Guidelines:</strong> Upload images and branding files only in supported formats (under 2MB) to prevent server lag.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-500 font-bold">!</span>
                <span><strong>Review Broadcasts:</strong> Verify notice board texts before publishing, as they go live immediately.</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-800 text-[10px] text-slate-500 flex items-center justify-between">
          <span>Ramachandra Hospital Security Operations</span>
          <span>Last Updated: June 2026</span>
        </div>
      </div>
    </motion.div>
  );
};

export default Settings;