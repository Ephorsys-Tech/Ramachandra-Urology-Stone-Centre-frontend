import { useEffect, useState } from "react";
import { Activity } from "lucide-react";

const LoadingScreen = () => {
  const [showSlowMessage, setShowSlowMessage] = useState(false);

  useEffect(() => {
    // Show a helpful tip if it takes longer than 2 seconds (e.g. slow connection)
    const timer = setTimeout(() => {
      setShowSlowMessage(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-gradient-to-br from-[#000d1a] via-[#001a36] to-[#00264d] text-white">
      {/* Background Animated Glows */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: "2s" }} />
      </div>

      <div className="relative z-10 flex flex-col items-center max-w-md px-6 text-center">
        {/* Animated Heartbeat Icon */}
        <div className="relative flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 shadow-[0_0_50px_rgba(6,182,212,0.25)] animate-bounce mb-8">
          <Activity className="w-12 h-12 text-cyan-400 animate-pulse" />
          <span className="absolute inset-0 rounded-full border border-cyan-500/30 animate-ping opacity-75" />
        </div>

        {/* Brand Name */}
        <h2 className="text-3xl font-black tracking-tight mb-2 font-sans bg-gradient-to-r from-white via-cyan-100 to-cyan-300 bg-clip-text text-transparent">
          USTHI HOSPITAL
        </h2>
        
        {/* Subtitle / Status */}
        <p className="text-cyan-300/80 font-medium text-sm tracking-widest uppercase mb-6">
          Premium Healthcare Center
        </p>

        {/* EKG / Progress Line */}
        <div className="relative w-48 h-[3px] bg-slate-800 rounded-full overflow-hidden mb-4">
          <div className="absolute top-0 left-0 h-full w-1/2 bg-gradient-to-r from-transparent via-cyan-400 to-blue-500 rounded-full animate-[loadingProgress_1.5s_infinite_ease-in-out]" />
        </div>

        <p className="text-xs text-slate-400/80 mt-2 font-medium">
          Loading secure hospital system...
        </p>

        {showSlowMessage && (
          <div className="mt-8 px-4 py-2 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md animate-[fadeIn_0.5s_ease-out]">
            <p className="text-xs text-cyan-200/70">
              Connecting to secure servers. Please wait...
            </p>
          </div>
        )}
      </div>

      <style>{`
        @keyframes loadingProgress {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default LoadingScreen;
