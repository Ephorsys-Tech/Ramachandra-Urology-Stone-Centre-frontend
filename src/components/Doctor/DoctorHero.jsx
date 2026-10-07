import PageHero from "../common/PageHero";

const DoctorHero = ({ totalDoctors }) => {
  return (
    <PageHero
      badge="Ramachandra Urology & Stone Centre • Sambalpur"
      breadcrumb="Our Doctors"
      title="World-Class Care by"
      highlightTitle="Leading Specialists"
      subtitle="Our team of seasoned urologists, surgeons, and medical consultants are dedicated to providing precision laser surgery, minimally invasive stone treatments, and compassionate clinical care."
      image="https://res.cloudinary.com/uvh9ozrt/image/upload/v1791368685/img_6655_1024.png"
      imageAlt="Medical Specialists & Surgeons"
      imageTag={totalDoctors > 0 ? `${totalDoctors}+ Super Specialists` : "15+ Super Specialists"}
      theme="blue"
    />
  );
};

export default DoctorHero;
