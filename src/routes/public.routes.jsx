import { lazy } from "react";
import { Route, Navigate } from "react-router-dom";
import MainLayouts from "../layouts/MainLayouts";

const Home = lazy(() => import("../pages/Home"));
const About = lazy(() => import("../pages/About"));
const Doctor = lazy(() => import("../pages/Doctor"));
const DoctorDetails = lazy(() => import("../pages/DoctorDetails"));
const Contact = lazy(() => import("../pages/Contact"));
const Gallery = lazy(() => import("../pages/Gallery"));
const Blog = lazy(() => import("../pages/Blog"));
const BlogDetails = lazy(() => import("../pages/BlogDetails"));
const Department = lazy(() => import("../pages/Department"));
const DepartmentDetails = lazy(() => import("../pages/DepartmentDetails"));

const PublicRoutes = (
  <Route path="/" element={<MainLayouts />}>
    <Route index element={<Home />} />
    
    {/* About Routes & Legacy Aliases */}
    <Route path="about" element={<About />} />
    <Route path="about-us" element={<Navigate to="/about" replace />} />
    <Route path="about-us.php" element={<Navigate to="/about" replace />} />
    <Route path="about-us.html" element={<Navigate to="/about" replace />} />
    <Route path="about.php" element={<Navigate to="/about" replace />} />
    <Route path="about.html" element={<Navigate to="/about" replace />} />
    
    {/* Doctor Routes & Legacy Aliases */}
    <Route path="doctors" element={<Doctor />} />
    <Route path="doctors/:slug" element={<DoctorDetails />} />
    <Route path="doctor" element={<Navigate to="/doctors" replace />} />
    <Route path="our-doctors" element={<Navigate to="/doctors" replace />} />
    <Route path="doctors.php" element={<Navigate to="/doctors" replace />} />
    
    {/* Urology Services Routes & Legacy Aliases */}
    <Route path="urology-services" element={<Department />} />
    <Route path="urology-services/:slug" element={<DepartmentDetails />} />
    {/* Redirect old /departments URLs to new /urology-services */}
    <Route path="departments" element={<Navigate to="/urology-services" replace />} />
    <Route path="departments/:slug" element={<Navigate to="/urology-services" replace />} />
    <Route path="department" element={<Navigate to="/urology-services" replace />} />
    <Route path="our-departments" element={<Navigate to="/urology-services" replace />} />
    <Route path="services" element={<Navigate to="/urology-services" replace />} />
    <Route path="services.php" element={<Navigate to="/urology-services" replace />} />
    <Route path="departments.php" element={<Navigate to="/urology-services" replace />} />
    
    {/* Contact Routes & Legacy Aliases */}
    <Route path="contact" element={<Contact />} />
    <Route path="contact-us" element={<Navigate to="/contact" replace />} />
    <Route path="contact-us.php" element={<Navigate to="/contact" replace />} />
    <Route path="contact-us.html" element={<Navigate to="/contact" replace />} />
    <Route path="contact.php" element={<Navigate to="/contact" replace />} />
    <Route path="contact.html" element={<Navigate to="/contact" replace />} />
    
    {/* Career Routes (Mapped to Contact) */}
    <Route path="career" element={<Navigate to="/contact" replace />} />
    <Route path="careers" element={<Navigate to="/contact" replace />} />
    <Route path="career.php" element={<Navigate to="/contact" replace />} />
    <Route path="careers.php" element={<Navigate to="/contact" replace />} />
    <Route path="career.html" element={<Navigate to="/contact" replace />} />
    <Route path="careers.html" element={<Navigate to="/contact" replace />} />
    
    {/* Gallery Routes & Legacy Aliases */}
    <Route path="gallery" element={<Gallery />} />
    <Route path="gallery.php" element={<Navigate to="/gallery" replace />} />
    <Route path="gallery.html" element={<Navigate to="/gallery" replace />} />
    
    {/* Blog Routes & Legacy Aliases */}
    <Route path="blog" element={<Blog />} />
    <Route path="blog/:id" element={<BlogDetails />} />
    <Route path="blogs" element={<Navigate to="/blog" replace />} />
    <Route path="blogs/:id" element={<BlogDetails />} />

    {/* Fallback for any unknown / old indexed URL */}
    <Route path="*" element={<Navigate to="/" replace />} />
  </Route>
);

export default PublicRoutes;
