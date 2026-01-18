import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";

const RoleBasedRoute = ({ allowedRoles, children }) => {
  const { isAuthenticated, user, isLoading, hasHydrated } = useAuthStore();

  if (!hasHydrated || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  // ❌ Not logged in
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // ❌ Logged in but role not allowed
  if (!allowedRoles.includes(user?.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // ✅ Authorized
  return children;
};

export default RoleBasedRoute;