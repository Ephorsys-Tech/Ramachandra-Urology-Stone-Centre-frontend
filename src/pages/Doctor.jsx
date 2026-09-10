import { useState } from "react";
import { useSelector } from "react-redux";
import DoctorHero from "../components/Doctor/DoctorHero";
import DoctorGrid from "../components/Doctor/DoctorGrid";

const Doctor = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { doctors = [] } = useSelector((state) => state.doctor || {});

  return (
    <main className="bg-[#f8fafc] min-h-screen pb-16">
      <DoctorHero
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        totalDoctors={doctors.length}
      />
      <DoctorGrid
        externalSearch={searchQuery}
        setExternalSearch={setSearchQuery}
      />
    </main>
  );
};

export default Doctor;
