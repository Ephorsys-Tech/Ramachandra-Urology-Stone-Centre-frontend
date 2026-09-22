import React from "react";

const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white/90 backdrop-blur-md transition-all duration-300">
      
      {/* ── Central Loader Box ── */}
      <div className="relative flex flex-col items-center p-8">
        
        {/* Modern Dual Ring Spinner with Center Logo */}
        <div className="relative w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center mb-5">
          {/* Subtle Outer Glow */}
          <div className="absolute inset-0 rounded-full bg-[#00B4EA]/10 blur-xl animate-pulse" />

          {/* Outer Rotating Track */}
          <div className="absolute inset-0 rounded-full border-2 border-slate-100" />

          {/* Outer Gradient Spinner */}
          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-[#00B4EA] border-r-[#024363] animate-spin" style={{ animationDuration: "1s" }} />

          {/* Inner Reverse Spinner */}
          <div className="absolute inset-2 rounded-full border-2 border-transparent border-b-[#00B4EA]/60 border-l-[#024363]/40 animate-spin" style={{ animationDirection: "reverse", animationDuration: "1.6s" }} />

          {/* Centered Brand Icon/Logo */}
          <div className="w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-white shadow-sm flex items-center justify-center p-2 relative z-10 border border-slate-100">
            <img
              src="/logo.png"
              alt="Loading..."
              className="w-full h-full object-contain"
            />
          </div>
        </div>

        {/* Clean Typography */}
        <div className="text-center space-y-1">
          <p className="text-xs font-bold text-[#012442] tracking-wider uppercase">
            Ramachandra Urology
          </p>
          <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400 font-medium">
            <span>Loading</span>
            <span className="inline-flex gap-0.5">
              <span className="w-1 h-1 rounded-full bg-[#00B4EA] animate-bounce" style={{ animationDelay: "0ms" }} />
              <span className="w-1 h-1 rounded-full bg-[#00B4EA] animate-bounce" style={{ animationDelay: "150ms" }} />
              <span className="w-1 h-1 rounded-full bg-[#00B4EA] animate-bounce" style={{ animationDelay: "300ms" }} />
            </span>
          </div>
        </div>

      </div>

    </div>
  );
};

export default LoadingScreen;

