import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { ArrowLeft, ArrowRight, Stethoscope, Award, Users, Sparkles } from "lucide-react";
import * as LucideIcons from "lucide-react";
import BgHero from "../Helper/BgHero";
import { openAppointmentModal } from "../redux/features/patient/patientSlice";
import { fetchAllDepartments, fetchDoctorsByDepartmentId } from "../redux/features/department/departmentThunk";
import { getDoctorSlug } from "../Helper/slugify";
import { getDepartmentIcon } from "../Helper/departmentIcon";

const DepartmentDetails = () => {
  const dispatch = useDispatch();
  const { slug } = useParams();
  
  const { departments, departmentDoctors, loading } = useSelector((state) => state.department);

  useEffect(() => {
    if (!departments || departments.length === 0) {
      dispatch(fetchAllDepartments());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, departments.length]);

  const department = departments.find(
    (dept) => (dept.slug && dept.slug.toLowerCase() === (slug || "").toLowerCase()) || dept._id === slug
  );

  useEffect(() => {
    if (department?._id) {
      dispatch(fetchDoctorsByDepartmentId(department._id));
    }
  }, [dispatch, department?._id]);

  if (loading || (departments.length === 0 && !loading)) {
    return (
      <main className="bg-background min-h-screen pb-24 text-primary flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary mb-4"></div>
        <h1 className="text-xl font-bold">Loading Department...</h1>
      </main>
    );
  }

  if (!department) {
    return (
      <main className="bg-background min-h-screen pb-24 text-primary flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold mb-4 font-sans">Department Not Found</h1>
        <Link to="/departments" className="text-secondary hover:underline flex items-center gap-2 font-bold no-underline">
          <ArrowLeft className="w-5 h-5" /> Back to Departments
        </Link>
      </main>
    );
  }

  // Safe color parsing
  const themeColor = department.color || "#2563eb";
  
  // Create solid RGBA / HEX representations for theme colors
  const hasHexColor = themeColor.startsWith("#");
  const bgLightStyle = hasHexColor ? { backgroundColor: `${themeColor}15`, color: themeColor, borderColor: `${themeColor}30` } : {};


  return (
    <main className="bg-background min-h-screen pb-24">
      <BgHero 
        imgSrc={department.image || "https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&w=1920&q=80"}
        heading={department.name} 
        subtitle={department.description}
        service={department.name}
        showButtons={false}
      />
      
      <section className="max-w-7xl mx-auto px-3 sm:px-4 mt-8 sm:mt-16">
        <div className="bg-white rounded-xl sm:rounded-[2rem] shadow-[0_8px_30px_rgba(0,0,0,0.03)] p-5 sm:p-8 lg:p-12 mb-8 sm:mb-12 border border-slate-200/60">
          <div className="flex flex-col lg:flex-row gap-6 sm:gap-12">
            <div className="lg:w-1/3">
              <div 
                className="w-20 sm:w-24 h-20 sm:h-24 rounded-2xl sm:rounded-3xl border flex items-center justify-center mb-4 sm:mb-6 shadow-sm"
                style={bgLightStyle}
              >
                {getDepartmentIcon(department.name, { className: "w-12 h-12" })}
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-primary mb-3 sm:mb-4 font-sans tracking-tight">{department.name}</h2>
              <p className="text-sm sm:text-base text-slate-600 mb-6 sm:mb-8 leading-relaxed">
                {department.description}
              </p>
              
              {department.features && department.features.length > 0 && (
                <div className="space-y-2 sm:space-y-4">
                  <p className="text-primary font-bold uppercase tracking-wider mb-2 sm:mb-3 text-xs sm:text-sm">Key Services</p>
                  <div className="flex flex-col gap-2 sm:gap-3">
                    {department.features.map((feature, idx) => (
                      <div 
                        key={idx} 
                        className="flex items-center gap-3 text-slate-700 bg-slate-50 border px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl shadow-sm border-slate-200/60 text-sm sm:text-base"
                      >
                        <div 
                          className="w-2.5 h-2.5 rounded-full bg-secondary"
                        ></div>
                        <span className="font-medium">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <button 
                onClick={() => dispatch(openAppointmentModal())}
                className="mt-6 sm:mt-8 w-full text-center bg-secondary text-white font-bold py-3 sm:py-4 text-sm sm:text-base rounded-lg sm:rounded-xl hover:bg-secondary/90 shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border-none cursor-pointer"
              >
                Book Appointment
              </button>
            </div>
            
            <div className="lg:w-2/3 flex flex-col gap-6 sm:gap-8">
              <div className="bg-slate-50 border border-slate-200/50 rounded-xl sm:rounded-2xl p-5 sm:p-8">
                <h3 className="text-xl sm:text-2xl font-bold text-primary mb-4 sm:mb-6 flex items-center gap-2 font-sans tracking-tight">
                  <span className="w-8 h-1 bg-secondary rounded-full inline-block"></span>
                  About the Department
                </h3>
                <div className="text-slate-650 leading-relaxed text-sm sm:text-lg mb-4 sm:mb-6 flex flex-col gap-3 sm:gap-4">
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
                <p className="text-slate-605 leading-relaxed text-sm sm:text-lg">
                  At our facility, the {department.name} department operates with a multidisciplinary approach, ensuring that every patient receives comprehensive and personalized care. We leverage the latest medical advancements and technology to deliver the best possible outcomes.
                </p>
              </div>

              {department.diseases && department.diseases.length > 0 && (
              <div className="bg-white border border-slate-200 shadow-sm rounded-xl sm:rounded-2xl p-5 sm:p-8">
                <h3 className="text-xl sm:text-2xl font-bold text-primary mb-4 sm:mb-6 flex items-center gap-2 font-sans tracking-tight">
                    <span className="w-8 h-1 bg-secondary rounded-full inline-block"></span>
                    Conditions We Treat
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    {department.diseases.map((disease, idx) => {
                      const dName = typeof disease === "string" ? disease : disease.name;
                      const dDesc = typeof disease === "string" ? `Treatment for ${disease}` : (disease.description || `Treatment for ${disease.name}`);
                      return (
                        <div 
                          key={idx} 
                          className="bg-slate-50 border border-slate-200/80 p-4 sm:p-5 rounded-lg sm:rounded-xl hover:border-slate-350 transition-colors shadow-sm"
                        >
                          <h4 className="text-base sm:text-lg font-bold text-secondary mb-1 sm:mb-2">{dName}</h4>
                          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{dDesc}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {((departmentDoctors && departmentDoctors.length > 0) || (department.doctors && department.doctors.length > 0)) && (
          <div className="mb-12 sm:mb-16">
            {/* Section Header */}
            <div className="text-center mb-8 sm:mb-12">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-extrabold uppercase tracking-wider mb-3 shadow-2xs">
                <Users className="w-3.5 h-3.5 text-secondary" /> OUR EXPERT CARE
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-sans tracking-tight mb-2">
                Meet Our <span className="text-secondary">{department.name} Department</span> Specialists
              </h2>
              <div className="flex items-center justify-center gap-3 my-2.5">
                <div className="w-12 h-px bg-emerald-300"></div>
                <Sparkles className="w-4 h-4 text-secondary" />
                <div className="w-12 h-px bg-emerald-300"></div>
              </div>
              <p className="text-sm sm:text-base text-slate-500 max-w-xl mx-auto font-medium">
                Experienced. Compassionate. Dedicated to Exceptional Medical Care.
              </p>
            </div>

            {/* Doctors Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {(departmentDoctors && departmentDoctors.length > 0 ? departmentDoctors : department.doctors).map((doctor, idx) => {
                const docImage = doctor.photo || doctor.image;
                const docSpecialty = doctor.specialization || doctor.specialty || department.name;
                const docName = doctor.name;
                
                if (!docName) return null;

                return (
                  <div
                    key={doctor._id || idx}
                    className="relative bg-white rounded-[28px] sm:rounded-[32px] p-6 sm:p-7 border border-slate-200/90 shadow-[0_10px_30px_rgba(0,0,0,0.04)] hover:shadow-xl hover:-translate-y-2 transition-all duration-300 flex flex-col items-center text-center overflow-hidden group"
                  >
                    {/* Ambient Corner Wave Curve */}
                    <div className="absolute top-0 left-0 w-28 h-28 bg-gradient-to-br from-emerald-100/60 to-teal-50/20 rounded-br-[70px] -z-0 pointer-events-none transition-transform duration-500 group-hover:scale-110" />

                    {/* Top-Right Specialty Icon Badge */}
                    <div className="absolute top-5 right-5 w-9 h-9 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100/90 flex items-center justify-center z-10 shadow-2xs">
                      <Stethoscope className="w-4.5 h-4.5 stroke-[2.2]" />
                    </div>

                    {/* Circular Avatar Image */}
                    <div className="relative z-10 mb-2">
                      <div className="w-32 h-32 sm:w-36 sm:h-36 rounded-full overflow-hidden border-4 border-white shadow-[0_8px_25px_rgba(0,0,0,0.08)] bg-slate-50 mx-auto">
                        {docImage && !docImage.includes('👨‍⚕️') && !docImage.includes('👩‍⚕️') ? (
                          <img
                            src={docImage}
                            alt={docName}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-emerald-50 text-emerald-600">
                            <Stethoscope className="w-12 h-12" />
                          </div>
                        )}
                      </div>

                      {/* Decorative Accent Dots */}
                      <div className="flex items-center justify-center gap-1.5 mt-3">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                        <span className="w-5 h-1 bg-emerald-600 rounded-full"></span>
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                      </div>
                    </div>

                    {/* Doctor Name & Specialty */}
                    <h3 className="text-lg sm:text-xl font-black text-slate-900 uppercase font-sans tracking-tight mb-1">
                      {docName}
                    </h3>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">
                      {docSpecialty}
                    </p>

                    {/* Experience & Expertise Highlight Box */}
                    <div className="w-full bg-emerald-50/70 border border-emerald-100/90 rounded-2xl p-3.5 flex items-center gap-3 text-left mb-6">
                      <div className="w-9 h-9 rounded-full bg-white text-emerald-700 border border-emerald-200/80 flex items-center justify-center shrink-0 shadow-2xs">
                        <Award className="w-4.5 h-4.5 stroke-[2.3]" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-extrabold text-slate-900 leading-tight">
                          {doctor.experience || 10}+ Years Experience
                        </div>
                        <p className="text-[11px] text-slate-600 line-clamp-2 leading-snug mt-0.5">
                          {doctor.qualifications || doctor.description || `Specialist in ${department.name} clinical treatments`}
                        </p>
                      </div>
                    </div>

                    {/* View Profile Action Button */}
                    <div className="mt-auto w-full">
                      <Link
                        to={`/doctors/${getDoctorSlug(docName)}`}
                        className="inline-flex items-center justify-center gap-2 w-full py-3 px-6 bg-[#006769] hover:bg-[#004f51] text-white text-xs sm:text-sm font-bold rounded-full shadow-sm hover:shadow-md transition-all duration-200 no-underline group/btn"
                      >
                        <span>View Profile</span>
                        <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        
        <div className="mt-6 sm:mt-8 flex justify-center">
          <Link to="/departments" className="text-slate-500 hover:text-secondary flex items-center gap-2 font-semibold text-sm sm:text-base transition-colors no-underline">
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" /> Back to All Departments
          </Link>
        </div>
      </section>
    </main>
  );
};

export default DepartmentDetails;
