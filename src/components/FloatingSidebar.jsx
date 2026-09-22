import { memo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Calendar, Phone } from "lucide-react";
import { openAppointmentModal } from "../redux/features/patient/patientSlice";

const WhatsAppIcon = ({ className = "w-5 h-5" }) => (
  <svg
    viewBox="0 0 24 24"
    width="24"
    height="24"
    fill="currentColor"
    className={className}
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
  </svg>
);

const FloatingSidebar = memo(() => {
  const dispatch = useDispatch();
  const { settings } = useSelector((state) => state.setting || { settings: null });
  const emergencyPhone = settings?.emergencyPhone || "9937566625";
  const whatsappNumber = (settings?.whatsapp || settings?.phone || "8895062072").replace(/\D/g, "");

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
          className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-[#024363] hover:bg-[#012442] text-white flex items-center justify-center transition-colors cursor-pointer border-none rounded-tl-xl md:rounded-tl-2xl outline-none shadow-md"
          aria-label="Book Appointment"
        >
          <Calendar className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 stroke-[2.5]" />
        </button>
      </div>

      {/* 2. Direct Emergency Call Tab */}
      <div className="group relative flex items-center">
        {/* Tooltip */}
        <div className="absolute right-full mr-3 px-2.5 py-1.5 md:px-3 md:py-2 bg-slate-900 text-white text-[11px] md:text-xs font-bold rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 group-hover:mr-2.5 transition-all duration-200 whitespace-nowrap shadow-md">
          Call Helpline (+91 {emergencyPhone})
        </div>
        <a
          href={`tel:${emergencyPhone}`}
          className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-[#dc2626] hover:bg-[#b91c1c] text-white flex items-center justify-center transition-colors cursor-pointer border-none outline-none no-underline shadow-md"
          aria-label="Call Emergency Helpline"
        >
          <Phone className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 stroke-[2.5]" />
        </a>
      </div>

      {/* 3. WhatsApp Direct Chat Tab */}
      <div className="group relative flex items-center">
        {/* Tooltip */}
        <div className="absolute right-full mr-3 px-2.5 py-1.5 md:px-3 md:py-2 bg-slate-900 text-white text-[11px] md:text-xs font-bold rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 group-hover:mr-2.5 transition-all duration-200 whitespace-nowrap shadow-md">
          Chat on WhatsApp
        </div>
        <a
          href={`https://wa.me/91${whatsappNumber}?text=Hello%20Ramachandra%20Urology%20Hospital%2C%20I%20would%20like%20to%20inquire%20about%20treatments%20and%20appointments.`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-[#25D366] hover:bg-[#20bd5a] text-white flex items-center justify-center transition-colors cursor-pointer border-none rounded-bl-xl md:rounded-bl-2xl outline-none no-underline shadow-md"
          aria-label="Chat on WhatsApp"
        >
          <WhatsAppIcon className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
        </a>
      </div>
    </div>
  );
});

FloatingSidebar.displayName = "FloatingSidebar";

export default FloatingSidebar;

