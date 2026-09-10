import { useEffect, useState } from "react";

const LoadingScreen = () => {
  const [progress, setProgress] = useState(0);
  const [showSlowMessage, setShowSlowMessage] = useState(false);

  useEffect(() => {
    // Simulate loading progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + Math.random() * 12;
      });
    }, 200);

    const slowTimer = setTimeout(() => setShowSlowMessage(true), 3000);

    return () => {
      clearInterval(interval);
      clearTimeout(slowTimer);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#020c1b] overflow-hidden">

      {/* ── Ambient Background Glows ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute w-[500px] h-[500px] rounded-full blur-[120px] opacity-20"
          style={{
            background: "radial-gradient(circle, #0ea5e9, transparent 70%)",
            top: "10%",
            left: "20%",
            animation: "loaderFloat 8s ease-in-out infinite",
          }}
        />
        <div
          className="absolute w-[400px] h-[400px] rounded-full blur-[100px] opacity-15"
          style={{
            background: "radial-gradient(circle, #06b6d4, transparent 70%)",
            bottom: "15%",
            right: "15%",
            animation: "loaderFloat 10s ease-in-out infinite reverse",
          }}
        />
        <div
          className="absolute w-[300px] h-[300px] rounded-full blur-[80px] opacity-10"
          style={{
            background: "radial-gradient(circle, #0369a1, transparent 70%)",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            animation: "loaderFloat 6s ease-in-out infinite 2s",
          }}
        />
      </div>

      {/* ── Content Container ── */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-md">

        {/* ── Animated ECG Ring + Logo ── */}
        <div className="relative mb-8">
          {/* Outer pulsing ring */}
          <div
            className="absolute inset-[-16px] rounded-full border border-cyan-500/20"
            style={{ animation: "loaderPulseRing 2.5s ease-out infinite" }}
          />
          <div
            className="absolute inset-[-8px] rounded-full border border-cyan-400/15"
            style={{ animation: "loaderPulseRing 2.5s ease-out infinite 0.5s" }}
          />

          {/* Logo container with glow */}
          <div
            className="relative w-28 h-28 rounded-full flex items-center justify-center overflow-hidden"
            style={{
              background: "linear-gradient(135deg, rgba(14,165,233,0.12), rgba(6,182,212,0.08))",
              border: "1px solid rgba(14,165,233,0.2)",
              boxShadow: "0 0 60px rgba(14,165,233,0.15), inset 0 0 30px rgba(14,165,233,0.05)",
            }}
          >
            <img
              src="/logo.png"
              alt="Ramachandra Urology & Stone Centre"
              className="w-20 h-auto object-contain"
              style={{
                filter: "brightness(1.1)",
                animation: "loaderLogoPulse 3s ease-in-out infinite",
              }}
            />
          </div>

          {/* Orbiting ECG dot */}
          <div
            className="absolute w-2 h-2 bg-cyan-400 rounded-full"
            style={{
              top: "50%",
              left: "50%",
              boxShadow: "0 0 8px rgba(6,182,212,0.8), 0 0 20px rgba(6,182,212,0.4)",
              animation: "loaderOrbit 3s linear infinite",
            }}
          />
        </div>

        {/* ── Live ECG Heartbeat Line ── */}
        <div className="w-64 h-12 mb-6 relative overflow-hidden">
          <svg
            viewBox="0 0 300 50"
            className="w-full h-full"
            preserveAspectRatio="none"
          >
            {/* Static grid lines for ECG paper effect */}
            <line x1="0" y1="25" x2="300" y2="25" stroke="rgba(14,165,233,0.08)" strokeWidth="0.5" />
            <line x1="0" y1="12" x2="300" y2="12" stroke="rgba(14,165,233,0.04)" strokeWidth="0.5" />
            <line x1="0" y1="38" x2="300" y2="38" stroke="rgba(14,165,233,0.04)" strokeWidth="0.5" />

            {/* ECG heartbeat waveform */}
            <path
              d="M0,25 L30,25 L35,25 L40,20 L45,30 L50,25 L55,25 L60,25 L65,10 L70,40 L75,5 L80,45 L85,15 L90,25 L95,25 L100,25 L130,25 L135,25 L140,20 L145,30 L150,25 L155,25 L160,25 L165,10 L170,40 L175,5 L180,45 L185,15 L190,25 L195,25 L200,25 L230,25 L235,25 L240,20 L245,30 L250,25 L255,25 L260,25 L265,10 L270,40 L275,5 L280,45 L285,15 L290,25 L295,25 L300,25"
              fill="none"
              stroke="url(#ecgGradient)"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{
                strokeDasharray: 900,
                animation: "loaderEcgTrace 3s linear infinite",
              }}
            />

            {/* Gradient for ECG line */}
            <defs>
              <linearGradient id="ecgGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="rgba(6,182,212,0.1)" />
                <stop offset="40%" stopColor="rgba(14,165,233,0.8)" />
                <stop offset="60%" stopColor="rgba(6,182,212,1)" />
                <stop offset="100%" stopColor="rgba(6,182,212,0.1)" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* ── Status Text ── */}
        <p
          className="text-cyan-300/50 text-[11px] tracking-[0.25em] uppercase font-medium mb-6"
          style={{ animation: "loaderFadeInUp 0.6s ease-out 0.3s both" }}
        >
          Preparing your experience
        </p>

        {/* ── Progress Bar ── */}
        <div className="w-48 relative">
          <div
            className="h-[2px] rounded-full overflow-hidden"
            style={{ background: "rgba(14,165,233,0.1)" }}
          >
            <div
              className="h-full rounded-full transition-all duration-500 ease-out"
              style={{
                width: `${Math.min(progress, 100)}%`,
                background: "linear-gradient(90deg, #0ea5e9, #06b6d4, #0ea5e9)",
                boxShadow: "0 0 10px rgba(14,165,233,0.5)",
              }}
            />
          </div>
          <div className="flex items-center justify-between mt-2">
            <span className="text-[10px] text-slate-500 font-medium">Loading</span>
            <span className="text-[10px] text-cyan-400/60 font-mono">
              {Math.round(Math.min(progress, 100))}%
            </span>
          </div>
        </div>

        {/* ── Slow Connection Message ── */}
        {showSlowMessage && (
          <div
            className="mt-8 px-4 py-2.5 rounded-xl backdrop-blur-md"
            style={{
              background: "rgba(14,165,233,0.06)",
              border: "1px solid rgba(14,165,233,0.12)",
              animation: "loaderFadeInUp 0.5s ease-out both",
            }}
          >
            <p className="text-[11px] text-cyan-300/50 font-medium">
              Establishing secure connection…
            </p>
          </div>
        )}
      </div>

      {/* ── Bottom subtle branding ── */}
      <div className="absolute bottom-6 z-10 text-center">
        <p className="text-[10px] text-slate-600/40 tracking-wider font-medium">
          Centre for Advanced Kidney Care & Laparoscopic Surgeries
        </p>
      </div>

      {/* ── Inline Keyframes ── */}
      <style>{`
        @keyframes loaderFloat {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-20px) scale(1.05); }
        }

        @keyframes loaderPulseRing {
          0% { transform: scale(1); opacity: 0.5; }
          100% { transform: scale(1.4); opacity: 0; }
        }

        @keyframes loaderLogoPulse {
          0%, 100% { opacity: 0.85; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.04); }
        }

        @keyframes loaderOrbit {
          0% { transform: translate(-50%, -50%) rotate(0deg) translateX(68px) rotate(0deg); }
          100% { transform: translate(-50%, -50%) rotate(360deg) translateX(68px) rotate(-360deg); }
        }

        @keyframes loaderEcgTrace {
          0% { stroke-dashoffset: 1800; }
          100% { stroke-dashoffset: 0; }
        }

        @keyframes loaderFadeInUp {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default LoadingScreen;
