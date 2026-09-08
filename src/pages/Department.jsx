import DepartmentHero from "../components/Department/DepartmentHero";
import DepartmentGrid from "../components/Department/DepartmentGrid";

const Department = () => {
  return (
    <main className="bg-background min-h-screen pb-24">
      <DepartmentHero />
      <DepartmentGrid />
    </main>
  );
};

export default Department;
