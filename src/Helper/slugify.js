export const getDoctorSlug = (name) => {
  if (!name) return "";
  return name
    .toLowerCase()
    .replace(/^(dr|ms)\.?\s+/i, "") // Remove common titles like Dr. Dr, Ms. Ms
    .replace(/[^a-z0-9]+/g, "-")   // Replace spaces and special characters with hyphens
    .replace(/(^-|-$)+/g, "");     // Clean up leading/trailing hyphens
};
