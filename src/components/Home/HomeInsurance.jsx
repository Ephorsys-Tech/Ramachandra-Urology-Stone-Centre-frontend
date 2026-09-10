import { memo } from "react";
import { ShieldCheck, Phone, CheckCircle2, Sparkles, Building2 } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { openAppointmentModal } from "../../redux/features/patient/patientSlice";

const insurancePartners = [
  { name: "Ayushman Bharat (PM-JAY)", type: "Govt Scheme", badge: "100% Cashless" },
  { name: "BSKY / Gopabandhu Swasthya Bima", type: "Odisha Govt", badge: "Direct Empaneled" },
  { name: "Star Health & Allied Insurance", type: "Private TPA", badge: "Instant Approval" },
  { name: "HDFC ERGO Health Insurance", type: "Private TPA", badge: "Cashless Desk" },
  { name: "ICICI Lombard General Insurance", type: "Private TPA", badge: "Zero Hassle" },
  { name: "Medi Assist & Paramount TPA", type: "Corporate TPA", badge: "Fast Settlement" },
];

const HomeInsurance = memo(() => {
  const dispatch = useDispatch();
  const { settings } = useSelector((state) => state.setting || { settings: null });
  const emergencyPhone = settings?.emergencyPhone || "9090963722";

  return (
    <section className="py-16 sm:py-20 bg-slate-50/70 relative overflow-hidden font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Banner container */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-8 sm:p-10 shadow-xs">
          
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-8 pb-8 border-b border-slate-100">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 text-xs font-black uppercase tracking-wider mb-2">
                <ShieldCheck size={13} className="text-emerald-600" />
                Hassle-Free Cashless Hospitalization
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#012442] tracking-tight">
                Empaneled with Major <span className="text-[#0FA8D6]">Govt Schemes & TPAs</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
                Avail cashless treatment for kidney stone surgery, prostate procedures, and emergency admissions with dedicated on-desk claim assistance.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <a
                href={`tel:${emergencyPhone}`}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#012442] hover:bg-[#024363] text-white text-xs font-black transition-all shadow-xs no-underline"
              >
                <Phone size={14} className="text-[#0FA8D6]" />
                <span>TPA Desk: +91 {emergencyPhone}</span>
              </a>
              <button
                onClick={() => dispatch(openAppointmentModal())}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-[#0FA8D6] to-[#024363] hover:from-[#00b4ea] hover:to-[#013550] text-white text-xs font-black transition-all shadow-xs cursor-pointer border-none"
              >
                <span>Verify Insurance</span>
              </button>
            </div>
          </div>

          {/* Partners Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {insurancePartners.map((partner) => (
              <div
                key={partner.name}
                className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 flex items-center justify-between gap-3 hover:bg-white hover:border-[#0FA8D6]/30 hover:shadow-xs transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
                    <CheckCircle2 size={16} />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-[#012442]">{partner.name}</h4>
                    <span className="text-[10px] text-slate-500 font-medium">{partner.type}</span>
                  </div>
                </div>

                <span className="text-[10px] font-extrabold text-[#024363] bg-[#0FA8D6]/10 px-2 py-0.5 rounded-md shrink-0">
                  {partner.badge}
                </span>
              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
});

HomeInsurance.displayName = "HomeInsurance";
export default HomeInsurance;
