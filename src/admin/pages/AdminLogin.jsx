import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";
import { loginAdmin } from "../../redux/features/auth/authThunk";
import toast from "react-hot-toast";
import ForgotPasswordForm from "../components/ForgotPasswordForm";

// 3D Flip Card Animation Variants
const flipVariants = {
  initial: {
    rotateY: -90,
    opacity: 0,
  },
  animate: {
    rotateY: 0,
    opacity: 1,
    transition: {
      duration: 0.4,
      ease: "easeOut",
    },
  },
  exit: {
    rotateY: 90,
    opacity: 0,
    transition: {
      duration: 0.4,
      ease: "easeIn",
    },
  },
};

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showForgot, setShowForgot] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/admin/dashboard");
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoading(true);
    setErrorMessage("");

    try {
      const resultAction = await dispatch(loginAdmin({ email, password }));
      
      if (loginAdmin.fulfilled.match(resultAction)) {
        toast.success("Successfully logged in!");
        navigate("/admin/dashboard");
      } else {
        setErrorMessage(resultAction.payload || "Login failed. Please try again.");
      }
    } catch (err) {
      setErrorMessage(err || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-[#dfebff] to-[#bdcfff] p-4 sm:p-6 md:p-8 ">
      {/* Main Container Card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-5xl bg-[#f8fafc] rounded-[32px] shadow-2xl overflow-hidden flex flex-col md:flex-row relative min-h-[550px] border border-white/60"
      >

        {/* Left side: Doctor Illustration */}
        <div className="w-full md:w-1/2 bg-gradient-to-tr from-[#d5f3f2] via-[#e2f9f8] to-[#ffffff] p-8 sm:p-12 flex flex-col justify-between relative overflow-hidden min-h-[350px] md:min-h-[550px]">
          {/* Decorative background shapes */}
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-white/40 blur-xl pointer-events-none" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-[#b2dfdb]/20 blur-2xl pointer-events-none" />

          {/* Decorative circular outlines from image */}
          <div className="absolute top-6 left-8 w-20 h-20 rounded-full border-[8px] border-[#80cbc4]/15 pointer-events-none" />
          <div className="absolute top-20 left-24 w-10 h-10 rounded-full border-[5px] border-[#80cbc4]/10 pointer-events-none" />

          {/* Text Content */}
          <div className="z-10 mt-4 md:mt-10">
            <h1 className="text-5xl md:text-6xl font-extrabold text-[#1e293b] tracking-tight mb-4">
              HELLO <span className="text-[#3fc0b0] font-medium">!</span>
            </h1>
            <p className="text-slate-500 font-semibold text-base leading-relaxed max-w-[220px]">
              Please entre your details to continue
            </p>
          </div>

          {/* 3D Doctor pointing (Overlaps the boundary and points across the center) */}
          <div className="absolute bottom-0 right-0 md:-right-6 w-[70%] md:w-[80%] h-[80%] md:h-[90%] flex items-end justify-end pointer-events-none z-10">
            <img
              src="3d-dc.png"
              alt="3D Doctor illustration pointing right"
              className="h-[100%] object-contain object-bottom max-w-full select-none"
              onError={(e) => {
                // Fallback icon/shape in case the image is not copied yet
                e.target.style.display = "none";
              }}
            />
          </div>
        </div>

        {/* Right side: Login Form or Forgot Password Form with 3D Flip */}
        <div
          className="w-full md:w-1/2 bg-white z-20 border-t md:border-t-0 md:border-l border-slate-100 relative min-h-[550px] flex flex-col justify-center"
          style={{ perspective: 1200 }}
        >
          <AnimatePresence mode="wait">
            {!showForgot ? (
              <motion.div
                key="login-form-container"
                variants={flipVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="w-full p-8 sm:p-12 md:p-16 flex flex-col justify-center h-full"
                style={{ backfaceVisibility: "hidden" }}
              >
                {/* Hospital Logo Header */}
                <div className="flex items-center gap-2 mb-8 md:mb-12">
                  <span className="text-[#024363] font-medium text-2xl sm:text-3xl tracking-wide uppercase">RAMACHANDRA</span>
                  <span className="text-[#0FA8D6] font-bold text-2xl sm:text-3xl tracking-wide">Hospital</span>
                </div>

                {/* Login Form */}
                <form onSubmit={handleSubmit} className="space-y-6">

                  {/* Username field */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-650 uppercase tracking-wider block">Username or E-mail</label>
                    <input
                      type="text"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (errorMessage) setErrorMessage("");
                      }}
                      placeholder="Aya_99@gmail.com"
                      className="w-full bg-[#f8fafc] border border-slate-200/80 focus:border-[#3fc0b0] focus:bg-white rounded-xl py-3.5 px-4 text-slate-800 text-sm outline-none transition-all placeholder:text-slate-400 font-medium"
                      required
                    />
                  </div>

                  {/* Password field */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-650 uppercase tracking-wider block">Password</label>
                    <div className="relative group">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value);
                          if (errorMessage) setErrorMessage("");
                        }}
                        placeholder="••••••••"
                        className={`w-full bg-[#f8fafc] border rounded-xl py-3.5 pl-4 pr-12 text-slate-800 text-sm outline-none transition-all placeholder:text-slate-400 font-medium ${errorMessage
                          ? "border-red-400 focus:border-red-500"
                          : "border-slate-200/80 focus:border-[#3fc0b0] focus:bg-white"
                          }`}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition cursor-pointer"
                        tabIndex="-1"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>

                    {/* Red validation message from screenshot */}
                    {errorMessage && (
                      <motion.p
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-xs font-bold text-red-500 mt-1.5 pl-0.5"
                      >
                        {errorMessage}
                      </motion.p>
                    )}
                  </div>

                  {/* Login button */}
                  <div className="pt-2">
                    <motion.button
                      whileHover={{ scale: 1.015 }}
                      whileTap={{ scale: 0.985 }}
                      type="submit"
                      disabled={loading}
                      className="w-full py-3.5 bg-gradient-to-r from-[#60a5fa] to-[#3b82f6] hover:from-[#4f46e5] hover:to-[#2563eb] disabled:opacity-75 text-white font-bold text-sm rounded-full transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {loading ? (
                        <>
                          <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          Logging in...
                        </>
                      ) : "Log in"}
                    </motion.button>
                  </div>

                  {/* Under-form Links matching screenshot */}
                  <div className="flex flex-col items-center justify-center gap-3.5 pt-4 text-center">
                    <button
                      type="button"
                      onClick={() => setShowForgot(true)}
                      className="text-xs font-semibold text-[#3fc0b0] hover:text-[#2da899] transition-colors cursor-pointer"
                    >
                      Forget Password?
                    </button>

                    <p className="text-xs text-slate-500 font-medium">
                      Do Not Have Account?{" "}
                      <a
                        href="#"
                        onClick={(e) => { e.preventDefault(); toast.success("Self-registration is disabled. Please contact the administrator."); }}
                        className="text-[#3fc0b0] hover:text-[#2da899] font-bold transition-colors"
                      >
                        Sign Up
                      </a>
                    </p>
                  </div>

                </form>
              </motion.div>
            ) : (
              <motion.div
                key="forgot-form-container"
                variants={flipVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="w-full h-full"
                style={{ backfaceVisibility: "hidden" }}
              >
                <ForgotPasswordForm
                  onBack={() => setShowForgot(false)}
                  onSuccess={(resetEmail) => {
                    setShowForgot(false);
                    setEmail(resetEmail);
                  }}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </motion.div>
    </div>
  );
};

export default AdminLogin;