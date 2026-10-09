import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, ArrowLeft, KeyRound, CheckCircle } from "lucide-react";
import api from "../../redux/services/api";
import toast from "react-hot-toast";

// Internal Step Fade-Slide Variants
const stepVariants = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.3 } },
  exit: { opacity: 0, x: -20, transition: { duration: 0.2 } },
};




const ForgotPasswordForm = ({ onBack, onSuccess }) => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Step 1: Request OTP
  const handleRequestReset = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email");
      return;
    }
    setLoading(true);
    try {
      const response = await api.post("/admin/forget-password", { email });
      toast.success(response.data?.message || "OTP sent to your email.");
      setStep(2);
    } catch (error) {
      const errMsg = error.response?.data?.message || "Failed to send reset link.";
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp) {
      toast.error("Please enter the OTP");
      return;
    }
    setLoading(true);
    try {
      const response = await api.post("/admin/verify-reset-otp", { email, otp });
      if (response.data?.data?.resetToken) {
        setResetToken(response.data.data.resetToken);
      }
      toast.success(response.data?.message || "OTP verified.");
      setStep(3);
    } catch (error) {
      const errMsg = error.response?.data?.message || "Invalid or expired OTP.";
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Reset Password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!newPassword || !confirmPassword) {
      toast.error("Please fill all fields");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      const response = await api.post("/admin/reset-password", { 
        email, 
        resetToken, 
        password: newPassword, 
        confirmPassword 
      });
      toast.success(response.data?.message || "Password reset successfully!");
      onSuccess(email); // Returns to login page and prefills email
    } catch (error) {
      const errMsg = error.response?.data?.message || "Failed to reset password.";
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-full p-8 sm:p-12 md:p-16 flex flex-col justify-center bg-white">
      {/* Logo Header (Consistent with Login Page) */}
      <div className="flex items-center gap-2 mb-6">
        <span className="text-[#024363] font-medium text-2xl sm:text-3xl tracking-wide uppercase">RAMACHANDRA</span>
        <span className="text-[#0FA8D6] font-bold text-2xl sm:text-3xl tracking-wide">Hospital</span>
      </div>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="email-step"
            variants={stepVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="space-y-6"
          >
            <div>
              <h2 className="text-xl font-bold text-slate-800 mb-1.5 flex items-center gap-2">
                <KeyRound className="text-[#3fc0b0] w-5 h-5" /> Forgot Password
              </h2>
              <p className="text-slate-500 text-xs font-medium leading-relaxed">
                Enter your registered email address below, and we'll send you an OTP to reset your password.
              </p>
            </div>

            <form onSubmit={handleRequestReset} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block">
                  E-mail Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@ramachandrahospital.com"
                    className="w-full bg-[#f8fafc] border border-slate-200/80 focus:border-[#3fc0b0] focus:bg-white rounded-xl py-3.5 pl-11 pr-4 text-slate-800 text-sm outline-none transition-all placeholder:text-slate-400 font-medium"
                    required
                  />
                </div>
              </div>

              <div className="pt-2 space-y-4">
                <motion.button
                  whileHover={{ scale: 1.015 }}
                  whileTap={{ scale: 0.985 }}
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 bg-gradient-to-r from-[#60a5fa] to-[#3b82f6] hover:from-[#4f46e5] hover:to-[#2563eb] disabled:opacity-75 text-white font-bold text-sm rounded-full transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 cursor-pointer"
                >
                  {loading ? "Sending..." : "Send OTP"}
                </motion.button>

                <button
                  type="button"
                  onClick={onBack}
                  className="w-full py-3 bg-slate-555/0 hover:bg-slate-50 border border-slate-200/80 text-slate-650 hover:text-slate-850 font-bold text-xs rounded-full transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ArrowLeft size={14} /> Back to Login
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="otp-step"
            variants={stepVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="space-y-6"
          >
            <div>
              <h2 className="text-xl font-bold text-slate-800 mb-1.5 flex items-center gap-2">
                <CheckCircle className="text-[#3fc0b0] w-5 h-5" /> Enter OTP
              </h2>
              <p className="text-slate-500 text-xs font-medium leading-relaxed">
                We've sent a one-time passcode to <span className="font-bold">{email}</span>. Please enter it below.
              </p>
            </div>

            <form onSubmit={handleVerifyOtp} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block">
                  OTP Code
                </label>
                <div className="relative">
                  <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="Enter 6-digit OTP"
                    className="w-full bg-[#f8fafc] border border-slate-200/80 focus:border-[#3fc0b0] focus:bg-white rounded-xl py-3.5 pl-11 pr-4 text-slate-800 text-sm outline-none transition-all placeholder:text-slate-400 font-medium"
                    required
                  />
                </div>
              </div>

              <div className="pt-2 space-y-4">
                <motion.button
                  whileHover={{ scale: 1.015 }}
                  whileTap={{ scale: 0.985 }}
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 bg-gradient-to-r from-[#60a5fa] to-[#3b82f6] hover:from-[#4f46e5] hover:to-[#2563eb] disabled:opacity-75 text-white font-bold text-sm rounded-full transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 cursor-pointer"
                >
                  {loading ? "Verifying..." : "Verify OTP"}
                </motion.button>

                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-full py-3 bg-slate-555/0 hover:bg-slate-50 border border-slate-200/80 text-slate-650 hover:text-slate-850 font-bold text-xs rounded-full transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ArrowLeft size={14} /> Back
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            key="password-step"
            variants={stepVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="space-y-6"
          >
            <div>
              <h2 className="text-xl font-bold text-slate-800 mb-1.5 flex items-center gap-2">
                <Lock className="text-[#3fc0b0] w-5 h-5" /> Reset Password
              </h2>
              <p className="text-slate-500 text-xs font-medium leading-relaxed">
                Please set a new secure password for your account.
              </p>
            </div>

            <form onSubmit={handleResetPassword} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block">
                  New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    className="w-full bg-[#f8fafc] border border-slate-200/80 focus:border-[#3fc0b0] focus:bg-white rounded-xl py-3.5 pl-11 pr-4 text-slate-800 text-sm outline-none transition-all placeholder:text-slate-400 font-medium"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    className="w-full bg-[#f8fafc] border border-slate-200/80 focus:border-[#3fc0b0] focus:bg-white rounded-xl py-3.5 pl-11 pr-4 text-slate-800 text-sm outline-none transition-all placeholder:text-slate-400 font-medium"
                    required
                  />
                </div>
              </div>

              <div className="pt-2 space-y-4">
                <motion.button
                  whileHover={{ scale: 1.015 }}
                  whileTap={{ scale: 0.985 }}
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 bg-gradient-to-r from-[#60a5fa] to-[#3b82f6] hover:from-[#4f46e5] hover:to-[#2563eb] disabled:opacity-75 text-white font-bold text-sm rounded-full transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 cursor-pointer"
                >
                  {loading ? "Resetting..." : "Update Password"}
                </motion.button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ForgotPasswordForm;
