import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
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
  ShieldCheck
} from "lucide-react";
import PageHero from "../components/common/PageHero";
import { openAppointmentModal } from "../redux/features/patient/patientSlice";
import { fetchAllDepartments, fetchDoctorsByDepartmentId } from "../redux/features/department/departmentThunk";
import { getDoctorSlug } from "../Helper/slugify";
import { getDepartmentIcon } from "../Helper/departmentIcon";

const DepartmentDetails = () => {
  const dispatch = useDispatch();
  const { slug } = useParams();

  const { departments, departmentDoctors, loading } = useSelector((state) => state.department || { departments: [], departmentDoctors: [], loading: false });
  const { settings } = useSelector((state) => state.setting || { settings: null });
  const emergencyPhone = settings?.emergencyPhone || "9937566625";

  useEffect(() => {
    if (!departments || departments.length === 0) {
      dispatch(fetchAllDepartments());
    }
  }, [dispatch, departments?.length]);

  const department = (departments || []).find(
    (dept) => (dept.slug && dept.slug.toLowerCase() === (slug || "").toLowerCase()) || dept._id === slug
  );

  useEffect(() => {
    if (department?._id) {
      dispatch(fetchDoctorsByDepartmentId(department._id));
    }
  }, [dispatch, department?._id]);

  if (loading || (departments.length === 0 && !loading)) {
    return (
      <main className="bg-slate-50/50 min-h-screen pb-24 text-[#012442] flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0FA8D6] mb-4"></div>
        <h1 className="text-xl font-bold">Loading Clinical Wing Details...</h1>
      </main>
    );
  }

  if (!department) {
    return (
      <main className="bg-slate-50/50 min-h-screen pb-24 text-[#012442] flex flex-col items-center justify-center p-4">
        <h1 className="text-3xl font-extrabold mb-3 ">Department Not Found</h1>
        <p className="text-slate-500 text-sm mb-6">The clinical specialty wing you requested is currently unavailable.</p>
        <Link
          to="/departments"
          className="bg-[#0FA8D6] hover:bg-[#00b4ea] text-[#012442] px-6 py-2.5 rounded-full font-bold flex items-center gap-2 text-xs uppercase tracking-wider no-underline transition-colors"
        >
          <ArrowLeft size={14} /> Back to All Departments
        </Link>
      </main>
    );
  }

  return (
    <main className="bg-slate-50/50 min-h-screen pb-24 ">
      <PageHero
        breadcrumb={`Specialties / ${department.name}`}
        badge="Clinical Specialty Wing"
        title={department.name}
        subtitle={department.description}
        image={department.image || "https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&w=1000&q=80"}
        imageAlt={department.name}
        imageTag="Sambalpur Clinical Wing"
        theme="blue"
      />

      <section className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8 mt-10 sm:mt-14">

        {/* Main Specialty Info Card */}
        <div className="bg-white rounded-3xl shadow-xs p-6 sm:p-8 lg:p-10 mb-10 border border-slate-200/90">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">

            {/* Left Wing Overview Column */}
            <div className="lg:w-1/3">
              <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-[#0FA8D6]/15 to-[#024363]/10 border border-[#0FA8D6]/30 text-[#024363] flex items-center justify-center mb-5 shadow-xs">
                {getDepartmentIcon(department.name, { size: 36 })}
              </div>

              <span className="inline-flex items-center gap-1.5 text-[11px] font-extrabold px-3 py-1 rounded-full bg-[#0FA8D6]/10 text-[#024363] border border-[#0FA8D6]/20 shadow-2xs mb-2">
                <ShieldCheck size={12} className="text-[#0FA8D6]" />
                Certified Care Wing
              </span>

              <h2 className="text-2xl sm:text-3xl font-medium text-[#012442] mb-3 tracking-tight">
                {department.name}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mb-6 leading-relaxed">
                {department.description}
              </p>

              {department.features && department.features.length > 0 && (
                <div className="space-y-2.5 mb-6 pt-4 border-t border-slate-100">
                  <p className="text-[#012442] font-extrabold uppercase tracking-wider text-xs flex items-center gap-1.5">
                    <CheckCircle2 size={13} className="text-[#0FA8D6]" />
                    Key Clinical Services
                  </p>
                  <div className="flex flex-col gap-2">
                    {department.features.map((feature, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2.5 text-slate-700 bg-slate-50 border border-slate-200/80 px-3.5 py-2 rounded-xl text-xs font-semibold"
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-[#0FA8D6] shrink-0" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <button
                onClick={() => dispatch(openAppointmentModal())}
                className="w-full text-center bg-[#00B4EA] hover:from-[#00b4ea] hover:to-[#013550] text-white font-medium py-3.5 px-6 text-xs rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border-none cursor-pointer uppercase tracking-wider flex items-center justify-center gap-2"
              >
                <Calendar size={14} />
                <span>Book OPD Consultation</span>
              </button>
            </div>

            {/* Right Wing Content Column */}
            <div className="lg:w-2/3 flex flex-col gap-6 sm:gap-8">
              <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-6 sm:p-8">
                <h3 className="text-lg sm:text-xl font-extrabold text-[#012442] mb-4 flex items-center gap-2 tracking-tight">
                  <span className="w-6 h-1 bg-[#0FA8D6] rounded-full inline-block"></span>
                  About This Department
                </h3>
                <div className="text-slate-700 leading-relaxed text-xs sm:text-sm mb-4 flex flex-col gap-3">
                  {(department.content || department.description || "").split("\n").map((para, idx) => {
                    const trimmed = para.trim();
                    if (!trimmed) return null;
                    return (
                      <p key={idx} className="leading-relaxed">
                        {trimmed}
                      </p>
                    );
                  })}
                </div>
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                  At Ramachandra Urology & Stone Centre, the {department.name} division operates with modern modular infrastructure and evidence-based protocols to ensure precision surgical care and compassionate patient recovery.
                </p>
              </div>

              {/* Conditions We Treat */}
              {department.diseases && department.diseases.length > 0 && (
                <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-xs">
                  <h3 className="text-lg sm:text-xl font-extrabold text-[#012442] mb-4 flex items-center gap-2 tracking-tight">
                    <span className="w-6 h-1 bg-[#0FA8D6] rounded-full inline-block"></span>
                    Clinical Conditions Treated
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {department.diseases.map((disease, idx) => {
                      const dName = typeof disease === "string" ? disease : disease.name;
                      const dDesc = typeof disease === "string" ? `Diagnostic & clinical care for ${disease}` : (disease.description || `Treatment for ${disease.name}`);
                      return (
                        <div
                          key={idx}
                          className="bg-slate-50/80 border border-slate-200/80 p-4 rounded-xl hover:border-[#0FA8D6]/40 transition-colors shadow-2xs"
                        >
                          <h4 className="text-xs sm:text-sm font-bold text-[#012442] mb-1 flex items-center gap-1.5">
                            <Sparkles size={12} className="text-[#0FA8D6]" />
                            {dName}
                          </h4>
                          <p className="text-[11px] text-slate-500 leading-relaxed">{dDesc}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>

        {/* ── DEPARTMENT SPECIALISTS SECTION ── */}
        {((departmentDoctors && departmentDoctors.length > 0) || (department.doctors && department.doctors.length > 0)) && (
          <div className="mb-14">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#0FA8D6]/15 border border-[#0FA8D6]/30 text-[#024363] text-[11px] font-medium uppercase tracking-wider mb-2 shadow-2xs">
                <Users size={12} className="text-[#0FA8D6]" />
                Specialist Medical Faculty
              </div>
              <h2 className="text-2xl sm:text-3xl font-medium text-[#012442] tracking-tight mb-1">
                Consult With {department.name} Specialists
              </h2>
            <p className="text-xs sm:text-sm text-slate-500 max-w-lg mx-auto">
              Senior consultant doctors and surgeons dedicated to exceptional clinical outcomes.
            </p>
          </div>

            {/* Doctors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(departmentDoctors && departmentDoctors.length > 0 ? departmentDoctors : department.doctors).map((doctor, idx) => {
            const docImage = doctor.photo || doctor.image;
            const docSpecialty = doctor.specialization || doctor.specialty || department.name;
            const docName = doctor.name;

            if (!docName) return null;

            return (
              <div
                key={doctor._id || idx}
                className="relative bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs hover:shadow-xl hover:border-[#0FA8D6]/40 transition-all duration-300 flex flex-col items-center text-center overflow-hidden group"
              >
                {/* Top Accent Icon Badge */}
                <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#0FA8D6]/10 text-[#024363] border border-[#0FA8D6]/20 flex items-center justify-center z-10 shadow-2xs">
                  <Stethoscope size={15} className="text-[#0FA8D6]" />
                </div>

                {/* Circular Avatar Image */}
                <div className="relative z-10 mb-3">
                  <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden border-3 border-white shadow-md bg-slate-50 mx-auto">
                    {docImage && !docImage.includes("👨‍⚕️") && !docImage.includes("👩‍⚕️") ? (
                      <img
                        src={docImage}
                        alt={docName}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-[#0FA8D6]/10 text-[#024363]">
                        <Stethoscope size={32} />
                      </div>
                    )}
                  </div>
                </div>

                {/* Doctor Name & Specialty */}
                <h3 className="text-base sm:text-lg font-medium text-[#012442] tracking-tight mb-1">
                  {docName.startsWith("Dr.") ? docName : `Dr. ${docName}`}
                </h3>
                <p className="text-xs font-bold text-[#0FA8D6] uppercase tracking-wider mb-4">
                  {docSpecialty}
                </p>

                {/* Experience Box */}
                <div className="w-full bg-slate-50 border border-slate-200/80 rounded-xl p-3 flex items-center gap-3 text-left mb-5">
                  <div className="w-8 h-8 rounded-full bg-white text-[#024363] border border-slate-200 flex items-center justify-center shrink-0 shadow-2xs">
                    <Award size={15} className="text-[#0FA8D6]" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-extrabold text-[#012442] leading-tight">
                      {doctor.experience || 10}+ Years Experience
                    </div>
                    <p className="text-[11px] text-slate-500 line-clamp-1 leading-snug mt-0.5">
                      {doctor.qualifications || "Senior Consultant Surgeon"}
                    </p>
                  </div>
                </div>

                {/* View Profile Action Button */}
                <div className="mt-auto w-full">
                  <Link
                    to={`/doctors/${getDoctorSlug(docName)}`}
                    className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-5 bg-[#00B4EA] hover:from-[#00b4ea] hover:to-[#013550] text-white text-xs font-bold rounded-full shadow-xs hover:shadow-md transition-all no-underline uppercase tracking-wide group/btn"
                  >
                    <span>View Specialist Profile</span>
                    <ArrowRight size={13} className="transition-transform group-hover/btn:translate-x-1" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
        )}

      {/* Back Link */}
      <div className="mt-8 flex justify-center">
        <Link
          to="/departments"
          className="text-slate-600 hover:text-[#0FA8D6] flex items-center gap-2 font-bold text-xs uppercase tracking-wider transition-colors no-underline bg-white px-5 py-2.5 rounded-full border border-slate-200 shadow-2xs"
        >
          <ArrowLeft size={14} /> Back to All Clinical Wings
        </Link>
      </div>
    </section>
    </main >
  );
};

export default DepartmentDetails;

