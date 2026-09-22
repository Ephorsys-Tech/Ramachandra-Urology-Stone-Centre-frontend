import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  ArrowLeft,
  ArrowRight,
  Stethoscope,
  Award,
  Users,
  Sparkles,
  CheckCircle2,
  Calendar,
  Phone,
  ShieldCheck,
  ChevronDown,
  HelpCircle,
  Activity,
  Layers,
  Cpu,
} from "lucide-react";
import PageHero from "../components/common/PageHero";
import { openAppointmentModal } from "../redux/features/patient/patientSlice";
import { fetchFeatureBySlug } from "../redux/features/feature/featureThunk";
import {
  fetchServiceBySlug,
  fetchServicesByFeature,
  fetchPublishedServices,
} from "../redux/features/service/serviceThunk";

const ServiceDetails = () => {
  const dispatch = useDispatch();
  const { slug } = useParams();

  const { currentFeature, loading: featureLoading } = useSelector(
    (state) => state.feature || { currentFeature: null, loading: false }
  );
  const {
    currentService,
    featureServices,
    services,
    loading: serviceLoading,
  } = useSelector(
    (state) => state.service || {
      currentService: null,
      featureServices: [],
      services: [],
      loading: false,
    }
  );

  const { settings } = useSelector((state) => state.setting || { settings: null });
  const emergencyPhone = settings?.emergencyPhone || "+91 99375 66625";

  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  useEffect(() => {
    if (slug) {
      // 1. Dispatch fetchFeatureBySlug
      dispatch(fetchFeatureBySlug(slug)).then((featureResult) => {
        if (
          fetchFeatureBySlug.fulfilled.match(featureResult) &&
          featureResult.payload?.data?._id
        ) {
          // If a feature was matched, fetch services for this feature
          dispatch(fetchServicesByFeature(featureResult.payload.data._id));
        } else {
          // 2. If no feature matched, try fetching service by slug
          dispatch(fetchServiceBySlug(slug)).then((serviceResult) => {
            if (fetchServiceBySlug.rejected.match(serviceResult)) {
              // 3. Fallback: fetch general published services
              dispatch(fetchPublishedServices());
            }
          });
        }
      });
    }
  }, [dispatch, slug]);

  const feature = currentFeature;
  const service = currentService;
  const servicesList = currentFeature
    ? featureServices || []
    : currentService
    ? [currentService]
    : services || [];

  const loading = featureLoading || serviceLoading;

  if (loading && !feature && !service && servicesList.length === 0) {
    return (
      <main className="bg-slate-50/50 min-h-screen pb-24 text-[#012442] flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0FA8D6] mb-4"></div>
        <h1 className="text-xl font-bold">Loading Clinical Service Details...</h1>
      </main>
    );
  }

  const title = feature?.name || service?.name || "Medical Service";
  const description =
    feature?.description ||
    service?.shortDescription ||
    service?.description ||
    "Advanced clinical procedures and specialized treatment care.";
  const departmentName = feature?.department?.name || "Urology & Stone Centre";

  return (
    <main className="bg-slate-50/50 min-h-screen pb-24">
      {/* Page Hero */}
      <PageHero
        breadcrumb={`Urology Services / ${title}`}
        badge="Specialized Clinical Capability"
        title={title}
        subtitle={description}
        image="https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1200&q=80"
        imageAlt={title}
        imageTag={departmentName}
        theme="blue"
      />

      {/* Trust & Capability Badges Bar */}
      <div className="bg-white border-b border-slate-200/80 py-4 shadow-2xs">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="flex items-center justify-center gap-2 text-xs font-semibold text-[#012442]">
              <Award className="text-[#0FA8D6] shrink-0" size={18} />
              <span>NABH Entry Level SHCO</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-xs font-semibold text-[#012442]">
              <ShieldCheck className="text-emerald-600 shrink-0" size={18} />
              <span>Ayushman Bharat / GJAY</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-xs font-semibold text-[#012442]">
              <Sparkles className="text-cyan-600 shrink-0" size={18} />
              <span>Thulium Laser Tech</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-xs font-semibold text-[#012442]">
              <Phone className="text-rose-600 shrink-0" size={18} />
              <span>24/7 OPD Helpline</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Container */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Left Content (2 Columns) */}
          <div className="lg:col-span-2 space-y-10">
            {/* Feature Overview Card */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#0FA8D6]/10 text-[#024363] flex items-center justify-center">
                  <Stethoscope size={24} />
                </div>
                <div>
                  <span className="text-xs font-extrabold text-[#0FA8D6] uppercase tracking-wider block">
                    Clinical Specialty Overview
                  </span>
                  <h2 className="text-2xl font-extrabold text-[#012442]">
                    {title}
                  </h2>
                </div>
              </div>

              <p className="text-sm text-slate-650 leading-relaxed font-normal">
                {description}
              </p>
            </div>

            {/* SERVICES LIST OFFERED UNDER THIS FEATURE */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-[#012442] flex items-center gap-2">
                    <Layers className="text-[#0FA8D6]" size={22} />
                    Medical Services & Procedures Offered
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Specialized treatments available for {title}
                  </p>
                </div>
                <span className="text-xs font-bold px-3 py-1 bg-[#0FA8D6]/10 text-[#024363] rounded-full border border-[#0FA8D6]/20">
                  {servicesList.length} Services Available
                </span>
              </div>

              {servicesList.length > 0 ? (
                <div className="grid grid-cols-1 gap-6">
                  {servicesList.map((srv) => (
                    <div
                      key={srv._id}
                      className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all space-y-4"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                        <div>
                          <h4 className="text-lg font-bold text-[#012442]">
                            {srv.name}
                          </h4>
                          <p className="text-xs text-slate-500 font-medium">
                            {srv.shortDescription}
                          </p>
                        </div>
                        <button
                          onClick={() => dispatch(openAppointmentModal())}
                          className="self-start sm:self-center px-4 py-2 bg-[#0FA8D6] hover:bg-[#00b4ea] text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer"
                        >
                          <Calendar size={14} /> Book Procedure
                        </button>
                      </div>

                      {/* <p className="text-xs text-slate-600 leading-relaxed">
                        {srv.description}
                      </p> */}

                      {/* Clinical Parameters Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                        {srv.procedures?.length > 0 && (
                          <div className="space-y-1.5">
                            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
                              Key Procedures
                            </span>
                            <div className="flex flex-wrap gap-1.5">
                              {srv.procedures.map((p, i) => (
                                <span
                                  key={i}
                                  className="text-xs px-2.5 py-1 bg-blue-50 text-blue-700 rounded-lg border border-blue-100 font-medium"
                                >
                                  {p}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {srv.conditions?.length > 0 && (
                          <div className="space-y-1.5">
                            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
                              Treated Conditions
                            </span>
                            <div className="flex flex-wrap gap-1.5">
                              {srv.conditions.map((c, i) => (
                                <span
                                  key={i}
                                  className="text-xs px-2.5 py-1 bg-purple-50 text-purple-700 rounded-lg border border-purple-100 font-medium"
                                >
                                  {c}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {srv.technologies?.length > 0 && (
                          <div className="space-y-1.5">
                            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
                              Technologies
                            </span>
                            <div className="flex flex-wrap gap-1.5">
                              {srv.technologies.map((t, i) => (
                                <span
                                  key={i}
                                  className="text-xs px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-lg border border-emerald-100 font-medium"
                                >
                                  {t}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {srv.benefits?.length > 0 && (
                          <div className="space-y-1.5">
                            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
                              Patient Benefits
                            </span>
                            <div className="flex flex-wrap gap-1.5">
                              {srv.benefits.map((b, i) => (
                                <span
                                  key={i}
                                  className="text-xs px-2.5 py-1 bg-amber-50 text-amber-700 rounded-lg border border-amber-100 font-medium"
                                >
                                  {b}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* FAQs Accordion under Service */}
                      {srv.faqs?.length > 0 && (
                        <div className="pt-3 border-t border-slate-100 space-y-2">
                          <span className="text-xs font-bold text-slate-700 block">
                            Frequently Asked Questions
                          </span>
                          <div className="space-y-2">
                            {srv.faqs.map((faq, idx) => {
                              const isOpen =
                                openFaqIndex === `${srv._id}-${idx}`;
                              return (
                                <div
                                  key={idx}
                                  className="bg-slate-50 border border-slate-200/80 rounded-xl overflow-hidden"
                                >
                                  <button
                                    onClick={() =>
                                      setOpenFaqIndex(
                                        isOpen ? null : `${srv._id}-${idx}`
                                      )
                                    }
                                    className="w-full flex items-center justify-between p-3 text-left text-xs font-bold text-[#012442] hover:bg-slate-100 transition cursor-pointer"
                                  >
                                    <span>Q: {faq.question}</span>
                                    <ChevronDown
                                      size={14}
                                      className={`text-slate-400 transition-transform ${
                                        isOpen
                                          ? "rotate-180 text-[#0FA8D6]"
                                          : ""
                                      }`}
                                    />
                                  </button>
                                  {isOpen && (
                                    <div className="p-3 pt-0 text-xs text-slate-600 leading-relaxed border-t border-slate-200/50 bg-white">
                                      A: {faq.answer}
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white p-8 rounded-3xl border border-slate-200/90 text-center space-y-3">
                  <Activity size={32} className="text-slate-300 mx-auto" />
                  <h4 className="text-base font-bold text-[#012442]">
                    Comprehensive Clinical Services Available
                  </h4>
                  <p className="text-xs text-slate-500 max-w-md mx-auto">
                    Contact our Sambalpur urology center for specialized clinical
                    consultation regarding {title}.
                  </p>
                  <button
                    onClick={() => dispatch(openAppointmentModal())}
                    className="px-5 py-2.5 bg-[#0FA8D6] hover:bg-[#00b4ea] text-white text-xs font-bold rounded-xl shadow-md transition cursor-pointer inline-flex items-center gap-2"
                  >
                    <Calendar size={14} /> Schedule Doctor Consultation
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right Sticky Sidebar */}
          <div className="space-y-6">
            {/* Appointment Booking Box */}
            <div className="bg-gradient-to-br from-[#012442] via-[#024363] to-[#012442] text-white p-6 sm:p-7 rounded-3xl shadow-xl border border-[#0FA8D6]/20 space-y-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#0FA8D6] text-[#012442] flex items-center justify-center font-bold shrink-0">
                  <Calendar size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold leading-tight">
                    Need Urgent Consultation?
                  </h3>
                  <p className="text-xs text-slate-300">
                    Book OPD or Laser Surgery Slot
                  </p>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                Consult with Dr. Biswa Ranjan Rout or Dr. Ramachandra Pradhan for
                advanced urological care & laser stone surgery.
              </p>

              <button
                onClick={() => dispatch(openAppointmentModal())}
                className="w-full py-3 bg-[#0FA8D6] hover:bg-[#00b4ea] text-[#012442] text-xs font-extrabold uppercase tracking-wider rounded-2xl shadow-md transition cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Book Appointment Now</span>
                <ArrowRight size={14} />
              </button>

              <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                <span className="text-slate-400">Emergency Line:</span>
                <a
                  href={`tel:${emergencyPhone}`}
                  className="font-bold text-[#0FA8D6] hover:underline"
                >
                  {emergencyPhone}
                </a>
              </div>
            </div>

            {/* Quick Navigation Card */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm space-y-3">
              <h4 className="text-sm font-bold text-[#012442] uppercase tracking-wider">
                Clinical Navigation
              </h4>
              <div className="space-y-2 text-xs font-medium text-slate-700">
                <Link
                  to="/urology-services"
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 transition no-underline text-slate-700"
                >
                  <span>Explore All Services</span>
                  <ArrowRight size={14} className="text-[#0FA8D6]" />
                </Link>
                <Link
                  to="/doctors"
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 transition no-underline text-slate-700"
                >
                  <span>View Specialist Doctors</span>
                  <ArrowRight size={14} className="text-[#0FA8D6]" />
                </Link>
                <Link
                  to="/contact"
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 transition no-underline text-slate-700"
                >
                  <span>Hospital Contact & Location</span>
                  <ArrowRight size={14} className="text-[#0FA8D6]" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ServiceDetails;
