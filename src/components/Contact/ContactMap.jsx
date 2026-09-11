import { motion } from "framer-motion";
import { MapPin, Navigation, Phone, ExternalLink } from "lucide-react";
import { useSelector } from "react-redux";

const ContactMap = () => {
  const { settings } = useSelector((state) => state.setting || { settings: null });
  const hospitalAddress = settings?.address || "Sourav Vihar, Burla, Sambalpur - 768017, Odisha";
  const emergencyPhone = settings?.emergencyPhone || "8895062072";

  // Google Maps directions search query for Ramachandra Urology, Sambalpur
  const googleMapsDirectionsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent("Ramachandra Urology and Stone Centre Sourav Vihar Burla Sambalpur Odisha")}`;

  return (
    <section className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8 mt-4 mb-8">
      <motion.div
        className="relative rounded-3xl overflow-hidden border border-slate-200/90 shadow-md bg-white"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        {/* Map Header Strip */}
        <div className="bg-[#012442] px-6 py-4 flex flex-wrap items-center justify-between gap-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#0FA8D6]/20 border border-[#0FA8D6]/40 flex items-center justify-center text-[#0FA8D6]">
              <MapPin size={18} />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white tracking-tight">
                Hospital Campus Location & Directions
              </h3>
              <p className="text-[11px] text-cyan-200/80">
                Sourav Vihar, Burla, Sambalpur - 768017, Odisha
              </p>
            </div>
          </div>

          <a
            href={googleMapsDirectionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-[#0FA8D6] to-[#024363] hover:from-[#00b4ea] hover:to-[#013550] text-white text-xs font-bold shadow-xs hover:shadow-md transition-all no-underline"
          >
            <Navigation size={13} />
            <span>Open in Google Maps</span>
            <ExternalLink size={12} className="opacity-70" />
          </a>
        </div>

        {/* Map Iframe Container */}
        <div className="relative h-[380px] sm:h-[440px] w-full bg-slate-100">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d118844.7554904278!2d83.90382348564034!3d21.46736294713702!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a21167f04bb0f77%3A0xa1984628d022b79a!2sSambalpur%2C%20Odisha!5e0!3m2!1sen!2sin!4v1710000000000!5m2!1sen!2sin"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Ramachandra Urology & Stone Centre Location Sambalpur"
            className="w-full h-full filter contrast-105"
          />

          {/* Floating Address Quick-Card Overlay (Desktop & Tablet) */}
          <div className="hidden sm:block absolute bottom-6 left-6 max-w-sm bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-2xl p-4 shadow-xl text-slate-800">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10.5px] font-black uppercase tracking-wider text-[#024363]">
                Open Today & 24/7 Casualty
              </span>
            </div>
            <p className="text-xs font-bold text-[#012442] mb-1">
              Ramachandra Urology & Stone Centre
            </p>
            <p className="text-[11.5px] text-slate-600 leading-snug mb-3">
              {hospitalAddress}
            </p>
            <div className="flex items-center justify-between text-xs pt-2.5 border-t border-slate-100">
              <span className="text-[11px] text-slate-500">Helpline:</span>
              <a
                href={`tel:${emergencyPhone}`}
                className="font-black text-[#0FA8D6] hover:text-[#024363] transition-colors no-underline flex items-center gap-1"
              >
                <Phone size={11} />
                +91 {emergencyPhone}
              </a>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default ContactMap;
