import DepartmentHero from "../components/Department/DepartmentHero";
import DepartmentGrid from "../components/Department/DepartmentGrid";

const Department = () => {
  return (
    <main className="bg-slate-50/50 min-h-screen pb-20">
      <DepartmentHero />
      <DepartmentGrid />
    </main>
  );
};

export default Department;
