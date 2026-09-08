import { useSelector } from "react-redux"
import { Navigate, Outlet } from "react-router-dom"

const SuperAdminRoute = () => {
  const { admin } = useSelector((state) => state.auth)
  return admin?.role === "super_admin" ? (<Outlet />) : (<Navigate to="/admin/dashboard" replace />)
}

export default SuperAdminRoute
