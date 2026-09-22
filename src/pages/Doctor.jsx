import { useSelector } from "react-redux";
import DoctorHero from "../components/Doctor/DoctorHero";
import DoctorGrid from "../components/Doctor/DoctorGrid";

const Doctor = () => {
  const { doctors = [] } = useSelector((state) => state.doctor || {});

  return (
    <main className="bg-[#f8fafc] min-h-screen pb-16">
      <DoctorHero totalDoctors={doctors.length} />
      <DoctorGrid />
    </main>
  );
};

export default Doctor;
