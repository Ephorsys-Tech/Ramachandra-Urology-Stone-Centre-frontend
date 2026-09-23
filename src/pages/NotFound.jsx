import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Home, Stethoscope, Activity, Phone, ArrowRight, Calendar, AlertCircle } from "lucide-react";
import { openAppointmentModal } from "../redux/features/patient/patientSlice";
import SEO from "../components/common/SEO";

const NotFound = () => {
  const dispatch = useDispatch();

  return (
    <>
      <SEO
        title="404 - Page Not Found"
        description="The page you are looking for does not exist or has been moved. Explore Ramachandra Urology & Stone Centre services, specialist doctors, or book an appointment."
        noindex={true}
      />
      <main className="min-h-[70vh] bg-gradient-to-b from-slate-50 via-white to-slate-100 flex items-center justify-center px-4 py-16 sm:py-24">
        <div className="max-w-2xl w-full text-center space-y-6">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-cyan-50 border border-[#0FA8D6]/30 text-[#024363] shadow-inner mb-2">
            <AlertCircle size={40} className="text-[#0FA8D6]" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-[#0FA8D6]">
              Error 404 • Resource Not Located
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-[#012442] tracking-tight">
              Page Not Found
            </h1>
            <p className="text-slate-600 text-sm sm:text-base max-w-lg mx-auto leading-relaxed">
              We couldn’t find the page you requested. It might have been moved, renamed, or is temporarily unavailable.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-[#0FA8D6] to-[#0284c7] hover:from-[#00bbf0] hover:to-[#0396e3] text-white text-sm font-semibold shadow-md transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Home size={16} />
              <span>Return Home</span>
            </Link>

            <button
              onClick={() => dispatch(openAppointmentModal())}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white hover:bg-slate-50 text-[#012442] border border-slate-200 text-sm font-semibold shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              <Calendar size={16} className="text-[#0FA8D6]" />
              <span>Book Appointment</span>
            </button>
          </div>

          <div className="pt-8 border-t border-slate-200/80 mt-8">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-4">
              Explore Important Hospital Sections
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 max-w-xl mx-auto">
              <Link
                to="/urology-services"
                className="flex flex-col items-center p-3 rounded-xl bg-white border border-slate-200/70 hover:border-[#0FA8D6]/50 hover:shadow-md transition-all group text-slate-700"
              >
                <Activity size={18} className="text-[#0FA8D6] mb-1 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-semibold">Services</span>
              </Link>
              <Link
                to="/doctors"
                className="flex flex-col items-center p-3 rounded-xl bg-white border border-slate-200/70 hover:border-[#0FA8D6]/50 hover:shadow-md transition-all group text-slate-700"
              >
                <Stethoscope size={18} className="text-[#0FA8D6] mb-1 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-semibold">Our Doctors</span>
              </Link>
              <Link
                to="/about"
                className="flex flex-col items-center p-3 rounded-xl bg-white border border-slate-200/70 hover:border-[#0FA8D6]/50 hover:shadow-md transition-all group text-slate-700"
              >
                <AlertCircle size={18} className="text-[#0FA8D6] mb-1 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-semibold">About Us</span>
              </Link>
              <Link
                to="/contact"
                className="flex flex-col items-center p-3 rounded-xl bg-white border border-slate-200/70 hover:border-[#0FA8D6]/50 hover:shadow-md transition-all group text-slate-700"
              >
                <Phone size={18} className="text-[#0FA8D6] mb-1 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-semibold">Contact Us</span>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default NotFound;
