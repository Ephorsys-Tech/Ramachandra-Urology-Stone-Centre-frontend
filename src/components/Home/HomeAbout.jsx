import { memo } from "react";
import { Link } from "react-router-dom";
import { CheckCircle2, ArrowRight } from "lucide-react";

const HomeAbout = memo(() => {
  return (
    <section className="py-20 lg:py-32 bg-background relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16">

          {/* Left Image Section */}
          <div className="w-full lg:w-[45%] relative h-[300px] sm:h-[350px] md:h-[400px] lg:h-[450px]">
            <img
              src="https://res.cloudinary.com/drqb4p2a2/image/upload/v1783148317/PXL_20260701_144557189.jpg_i7iqlz.jpg"
              alt="Hospital Building and Medical Team"
              className="w-full h-full object-cover rounded-3xl lg:rounded-[40px] shadow-[0_20px_40px_rgba(0,0,0,0.06)] border border-slate-200"
            />
            <div className="absolute inset-0 bg-primary/5 mix-blend-multiply rounded-3xl lg:rounded-[40px]"></div>

            {/* Floating Experience Badge */}
            <div className="absolute -bottom-6 -right-4 sm:-bottom-8 sm:-right-6 lg:-right-8 lg:-bottom-8 bg-tertiary text-white p-6 sm:p-7 md:p-8 rounded-3xl shadow-[0_15px_35px_rgba(5,150,105,0.25)] z-10 min-w-[140px] md:min-w-[180px] text-center">
              <p className="text-3xl sm:text-4xl md:text-5xl font-black mb-1">25<span className="text-2xl sm:text-3xl">+</span></p>
              <p className="text-xs sm:text-sm md:text-base font-bold tracking-wide leading-tight">Years of<br />Excellence</p>
            </div>
          </div>

          {/* Text Section (Right Side) */}
          <div className="w-full lg:w-[50%] mt-8 lg:mt-0">
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-8 h-[2px] bg-secondary"></span>
                <p className="text-secondary font-bold text-sm tracking-widest uppercase">About Our Hospital</p>
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-[46px] font-bold text-primary leading-[1.15] mb-6 font-sans">
                Your Trusted Partner in <br /> <span className="text-secondary">Health & Medical Care</span>
              </h2>
            </div>

            <p className="text-on-surface-variant leading-relaxed mb-6 text-[17px]">
              At our hospital, we are dedicated to providing world-class medical services with a compassionate touch. Our team of expert doctors and state-of-the-art facilities ensure that you receive the highest standard of care, tailored specifically to your needs.
            </p>
            <p className="text-on-surface-variant leading-relaxed mb-10 text-[17px]">
              From routine check-ups to complex surgeries, we prioritize your well-being above all else. We believe in empowering our patients through education, continuous support, and cutting-edge treatments.
            </p>

            {/* Feature Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-tertiary/10 flex items-center justify-center text-tertiary shrink-0 border border-tertiary/5 shadow-sm">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-primary mb-1">Expert Doctors</h4>
                  <p className="text-sm text-slate-500">Highly qualified team</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-tertiary/10 flex items-center justify-center text-tertiary shrink-0 border border-tertiary/5 shadow-sm">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-primary mb-1">Modern Facilities</h4>
                  <p className="text-sm text-slate-500">Advanced equipment</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-tertiary/10 flex items-center justify-center text-tertiary shrink-0 border border-tertiary/5 shadow-sm">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-primary mb-1">24/7 Emergency</h4>
                  <p className="text-sm text-slate-500">Always here for you</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-tertiary/10 flex items-center justify-center text-tertiary shrink-0 border border-tertiary/5 shadow-sm">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-primary mb-1">Patient Centric</h4>
                  <p className="text-sm text-slate-500">Care with compassion</p>
                </div>
              </div>
            </div>

            <Link to="/about" className="inline-flex items-center gap-3 bg-secondary text-white px-9 py-4 rounded-full font-bold hover:bg-secondary/90 transition-all duration-300 shadow-[0_8px_20px_rgba(37,99,235,0.25)] hover:shadow-[0_12px_25px_rgba(37,99,235,0.35)] hover:-translate-y-1 cursor-pointer no-underline">
              Discover More About Us
              <ArrowRight className="w-5 h-5" strokeWidth={2.5} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
});

export default HomeAbout;
