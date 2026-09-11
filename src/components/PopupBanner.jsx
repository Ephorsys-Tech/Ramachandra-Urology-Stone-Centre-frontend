import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchSettings } from '../redux/features/setting/settingThunk';

export default function PopupBanner() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { settings } = useSelector((state) => state.setting);

  useEffect(() => {
    if (!settings) {
      dispatch(fetchSettings());
    }
  }, [dispatch, settings]);

  useEffect(() => {
    // Only proceed if settings are loaded and popup is published
    if (!settings || !settings.popupBanner?.isPublished) return;

    const hasSeenBanner = sessionStorage.getItem('hasSeenPopupBanner');
    
    if (!hasSeenBanner) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 1500); // 1.5 seconds delay
      return () => clearTimeout(timer);
    }
  }, [settings]);

  const handleClose = () => {
    setIsOpen(false);
    sessionStorage.setItem('hasSeenPopupBanner', 'true');
  };

  if (!settings || !settings.popupBanner?.isPublished) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm"
            onClick={handleClose}
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="relative w-full max-w-sm bg-white rounded-2xl overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.3)] z-10"
          >
            <button
              onClick={handleClose}
              className="absolute top-3 right-3 z-20 p-1.5 bg-black/20 hover:bg-black/40 text-white rounded-full transition-colors cursor-pointer border-none"
            >
              <X size={18} strokeWidth={2.5} />
            </button>
            
            {settings.popupBanner.image && (
              <div className="h-44 w-full relative">
                <img 
                  src={settings.popupBanner.image} 
                  alt="Announcement"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />
              </div>
            )}
            
            <div className="p-6 text-left">
              <h3 className="text-xl font-bold text-slate-800 mb-2 leading-tight">
                Hospital Announcement
              </h3>
              <p className="text-slate-500 text-[13px] mb-6 leading-relaxed whitespace-pre-line">
                {settings.popupBanner.description || "Welcome to Ramachandra Urology & Stone Centre."}
              </p>
              <button 
                onClick={() => {
                  handleClose();
                  navigate('/departments');
                }}
                className="w-full py-3 bg-secondary hover:bg-secondary/90 text-white rounded-xl font-bold text-sm transition-colors shadow-md cursor-pointer border-none"
              >
                Learn More
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
