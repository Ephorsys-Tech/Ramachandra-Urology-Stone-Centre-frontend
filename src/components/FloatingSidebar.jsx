import { memo } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Calendar, Asterisk, MessageSquare } from "lucide-react";
import { openAppointmentModal } from "../redux/features/patient/patientSlice";

const FloatingSidebar = memo(() => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return (
    <div className="flex fixed right-0 top-1/2 -translate-y-1/2 z-[90] flex-col shadow-lg rounded-l-xl md:rounded-l-2xl overflow-hidden">
      {/* 1. Book Appointment Tab */}
      <div className="group relative flex items-center">
        {/* Tooltip */}
        <div className="absolute right-full mr-3 px-2.5 py-1.5 md:px-3 md:py-2 bg-slate-900 text-white text-[11px] md:text-xs font-bold rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 group-hover:mr-2.5 transition-all duration-200 whitespace-nowrap shadow-md">
          Book Appointment
        </div>
        <button
          onClick={() => dispatch(openAppointmentModal())}
          className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-[#004649] hover:bg-[#005e63] text-white flex items-center justify-center transition-colors cursor-pointer border-none rounded-tl-xl md:rounded-tl-2xl outline-none"
          aria-label="Book Appointment"
        >
          <Calendar className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 stroke-[2.5]" />
        </button>
      </div>

      {/* 2. Emergency Tab */}
      <div className="group relative flex items-center">
        {/* Tooltip */}
        <div className="absolute right-full mr-3 px-2.5 py-1.5 md:px-3 md:py-2 bg-slate-900 text-white text-[11px] md:text-xs font-bold rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 group-hover:mr-2.5 transition-all duration-200 whitespace-nowrap shadow-md">
          Emergency Helpline (+91 88950 62072)
        </div>
        <a
          href="tel:8895062072"
          className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-[#ba1a1a] hover:bg-[#d32f2f] text-white flex items-center justify-center transition-colors cursor-pointer border-none outline-none no-underline"
          aria-label="Emergency Call"
        >
          <Asterisk className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 stroke-[3]" />
        </a>
      </div>

      {/* 3. Ask a Query Tab */}
      <div className="group relative flex items-center">
        {/* Tooltip */}
        <div className="absolute right-full mr-3 px-2.5 py-1.5 md:px-3 md:py-2 bg-slate-900 text-white text-[11px] md:text-xs font-bold rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 group-hover:mr-2.5 transition-all duration-200 whitespace-nowrap shadow-md">
          Ask Your Query / Contact
        </div>
        <button
          onClick={() => navigate("/contact")}
          className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-[#10b981] hover:bg-[#059669] text-white flex items-center justify-center transition-colors cursor-pointer border-none rounded-bl-xl md:rounded-bl-2xl outline-none"
          aria-label="Contact Us"
        >
          <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 stroke-[2.5]" />
        </button>
      </div>
    </div>
  );
});

FloatingSidebar.displayName = "FloatingSidebar";

export default FloatingSidebar;
