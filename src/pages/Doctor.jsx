import DoctorHero from "../components/Doctor/DoctorHero";
import DoctorGrid from "../components/Doctor/DoctorGrid";

const Doctor = () => {
  return (
    <main className="bg-background min-h-screen pb-24">
      <DoctorHero />
      <DoctorGrid />
    </main>
  );
};

export default Doctor;
