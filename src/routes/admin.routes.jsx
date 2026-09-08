import { lazy } from "react";
import { Route } from "react-router-dom";
import ProtectedRoute from "./protected.route";
import SuperAdminRoute from "./superadmin.route";
import AdminLayout from "../layouts/AdminLayout";

const AdminLogin = lazy(() => import("../admin/pages/AdminLogin"));
const AdminDashboard = lazy(() => import("../admin/pages/AdminDashboard"));
const Patients = lazy(() => import("../admin/pages/Patients"));
const Doctors = lazy(() => import("../admin/pages/Doctors"));
const Departments = lazy(() => import("../admin/pages/Departments"));
const Gallery = lazy(() => import("../admin/pages/Gallery"));
const Messages = lazy(() => import("../admin/pages/Messages"));
const Blogs = lazy(() => import("../admin/pages/Blogs"));
const Settings = lazy(() => import("../admin/pages/Settings"));


const AdminRoutes = (
  <Route path="/admin">
    {/* Public Route */}
    <Route index element={<AdminLogin />} />

    {/* Protected Routes */}
    <Route element={<ProtectedRoute />}>
      <Route element={<AdminLayout />}>
        {/* Dashboard */}
        <Route path="dashboard" element={<AdminDashboard />} />
        {/* Patients */}
        <Route path="patients" element={<Patients />} />
        {/* Messages */}
        <Route path="messages" element={<Messages />} />

        {/* Super Admin Only Routes */}
        <Route element={<SuperAdminRoute />}>
          {/* Doctors */}
          <Route path="doctors" element={<Doctors />} />
          {/* Departments */}
          <Route path="departments" element={<Departments />} />
          {/* Gallery */}
          <Route path="gallery" element={<Gallery />} />
          {/* Blogs */}
          <Route path="blogs" element={<Blogs />} />
          {/* Settings Page */}
          <Route path="settings" element={<Settings />} />
        </Route>
      </Route>
    </Route>
  </Route>
);

export default AdminRoutes;
