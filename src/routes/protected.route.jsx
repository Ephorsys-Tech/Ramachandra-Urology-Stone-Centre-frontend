import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const { isAuthenticated, isCheckingAuth } = useSelector((state) => state.auth);

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            Verifying Session...
          </p>
        </div>
      </div>
    );
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/admin" replace />;
};

export default ProtectedRoute;