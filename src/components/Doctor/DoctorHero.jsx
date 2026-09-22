import PageHero from "../common/PageHero";

const DoctorHero = ({ totalDoctors }) => {
  return (
    <PageHero
      badge="Ramachandra Urology & Stone Centre • Sambalpur"
      breadcrumb="Our Doctors"
      title="World-Class Care by"
      highlightTitle="Leading Specialists"
      subtitle="Our team of seasoned urologists, surgeons, and medical consultants are dedicated to providing precision laser surgery, minimally invasive stone treatments, and compassionate clinical care."
      image="https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=1000&q=80"
      imageAlt="Medical Specialists & Surgeons"
      imageTag={totalDoctors > 0 ? `${totalDoctors}+ Super Specialists` : "15+ Super Specialists"}
      theme="blue"
    />
  );
};

export default DoctorHero;
