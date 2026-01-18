import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { getDashboardPath } from "../utils/getDashboardPath";

const PublicRoute = ({ children }) => {
  const { isAuthenticated, user, hasHydrated } = useAuthStore();

  // ⛔ Wait until Zustand rehydrates from localStorage
  if (!hasHydrated) return null;

  // 🔒 Logged-in users cannot access public pages
  if (isAuthenticated && user?.role) {
    return <Navigate to={getDashboardPath(user.role)} replace />;
  }

  return children;
};

export default PublicRoute;