import React from "react";
import {
  FaHeartPulse,
  FaBrain,
  FaBone,
  FaBaby,
  FaStethoscope,
  FaTruckMedical,
  FaXRay,
  FaMicroscope,
  FaEarListen,
  FaLungs,
  FaSyringe,
  FaHandDots,
  FaPersonPregnant,
  FaScissors,
  FaEye,
  FaTooth,
  FaKitMedical,
} from "react-icons/fa6";
import {
  GiKidneys,
  GiStomach,
  GiLaserSparks,
  GiScalpel,
} from "react-icons/gi";
import { Stethoscope } from "lucide-react";

/**
 * Returns an accurate medical icon component from external icon libraries (react-icons/fa6, react-icons/gi)
 * for any given department name or slug.
 * @param {string} name - Department name or slug
 * @param {object} props - Props for the icon (size, className, etc.)
 */
export const getDepartmentIcon = (name, props = {}) => {
  // Strip "department" word first to avoid false substring matches like "ent" in "department"
  const raw = (name || "").toLowerCase().trim();
  const lower = raw.replace(/\bdepartment\b/g, "").replace(/\bdept\b/g, "").trim();

  // 1. Nephrology & Kidney / Renal / Dialysis
  if (lower.includes("nephro") || lower.includes("kidney") || lower.includes("renal") || lower.includes("dialysis")) {
    return <GiKidneys {...props} />;
  }

  // 2. Pulmonology / Lungs / Respiratory / Chest
  if (lower.includes("pulmon") || lower.includes("lung") || lower.includes("respirat") || lower.includes("chest") || lower.includes("asthma")) {
    return <FaLungs {...props} />;
  }

  // 3. Cardiology / Heart / Cardiac
  if (lower.includes("cardio") || lower.includes("heart")) {
    return <FaHeartPulse {...props} />;
  }

  // 4. Neurology / Brain / Neuro / Spine
  if (lower.includes("neuro") || lower.includes("brain") || lower.includes("spine") || lower.includes("psych")) {
    return <FaBrain {...props} />;
  }

  // 5. Orthopedics / Bone / Joint
  if (lower.includes("ortho") || lower.includes("bone") || lower.includes("joint")) {
    return <FaBone {...props} />;
  }

  // 6. Emergency & Trauma / Casualty / Critical
  if (lower.includes("emerg") || lower.includes("trauma") || lower.includes("casualty") || lower.includes("critical")) {
    return <FaTruckMedical {...props} />;
  }

  // 7. Radiology / Imaging / X-Ray / Scan / CT / MRI
  if (lower.includes("radio") || lower.includes("x-ray") || lower.includes("xray") || lower.includes("scan") || lower.includes("imaging") || lower.includes("mri") || lower.includes("ct")) {
    return <FaXRay {...props} />;
  }

  // 8. Pathology / Diagnostics / Lab / Blood
  if (lower.includes("patho") || lower.includes("lab") || lower.includes("diagnos") || lower.includes("blood") || lower.includes("hemat")) {
    return <FaMicroscope {...props} />;
  }

  // 9. Gynecology / Obstetrics / Women's health / Maternity
  if (lower.includes("gyn") || lower.includes("obste") || lower.includes("women") || lower.includes("matern")) {
    return <FaPersonPregnant {...props} />;
  }

  // 10. Pediatrics / Child / Infant / Neonatal
  if (lower.includes("pediat") || lower.includes("paediat") || lower.includes("child") || lower.includes("infant") || lower.includes("neonat") || lower.includes("baby")) {
    return <FaBaby {...props} />;
  }

  // 11. Dermatology / Skin / Hair / Cosmetology
  if (lower.includes("dermat") || lower.includes("skin") || lower.includes("hair") || lower.includes("cosmet")) {
    return <FaHandDots {...props} />;
  }

  // 12. ENT / Ear / Nose / Throat / Otorhinolaryngology
  if (/\bent\b/.test(lower) || lower.includes("ear") || lower.includes("nose") || lower.includes("throat") || lower.includes("otolaryn")) {
    return <FaEarListen {...props} />;
  }

  // 13. Advanced Laser Surgery / Laser
  if (lower.includes("laser")) {
    return <GiLaserSparks {...props} />;
  }

  // 14. Plastic Surgery / Reconstructive / Cosmetic Surgery
  if (lower.includes("plastic") || lower.includes("reconstruct")) {
    return <FaScissors {...props} />;
  }

  // 15. General Surgery / Surgery / Operation
  if (lower.includes("surg") || lower.includes("operation")) {
    return <GiScalpel {...props} />;
  }

  // 16. Urology / Bladder / Prostate
  if (lower.includes("uro") || lower.includes("bladder") || lower.includes("prostate")) {
    return <GiKidneys {...props} />;
  }

  // 17. Gastroenterology / Digestive / Stomach / Liver
  if (lower.includes("gastro") || lower.includes("stomach") || lower.includes("digest") || lower.includes("liver") || lower.includes("hepat")) {
    return <GiStomach {...props} />;
  }

  // 18. General Medicine / Physician / Internal Medicine
  if (lower.includes("general") || lower.includes("medicine") || lower.includes("internal") || lower.includes("physician")) {
    return <FaStethoscope {...props} />;
  }

  // 19. Ophthalmology / Eye / Vision
  if (lower.includes("eye") || lower.includes("ophthal") || lower.includes("vision")) {
    return <FaEye {...props} />;
  }

  // 20. Dentistry / Dental / Teeth
  if (lower.includes("dent") || lower.includes("oral") || lower.includes("teeth") || lower.includes("tooth")) {
    return <FaTooth {...props} />;
  }

  // Fallback
  return <FaKitMedical {...props} />;
};

export default getDepartmentIcon;
