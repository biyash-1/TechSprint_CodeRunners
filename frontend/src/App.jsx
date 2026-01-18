// App.jsx
import React from "react";
import { createBrowserRouter, RouterProvider, Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "./store/useAuthStore";

import Header from "./components/Header";
import HomePage from "./pages/HomePage";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import Unauthorized from "./pages/Unauthorized";

import UserDashboard from "./dashboard/UserDashboard";
import DriverDashboard from "./dashboard/DriverDashboard";
import HospitalDashboard from "./dashboard/HospitalDashboard";
import AdminDashboard from "./dashboard/AdminDashboard";

// ---------------------
// Layouts
// ---------------------
const MainLayout = () => (
  <>
    <Header />
    <main>
      <Outlet />
    </main>
  </>
);

const DashboardLayout = () => (
  <>
    
    <div className="p-6">
      <Outlet />
    </div>
  </>
);

// ---------------------
// Role Based Route
// ---------------------
const RoleBasedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, user, isLoading } = useAuthStore();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!user?.role || !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

// ---------------------
// Public Route
// ---------------------
const PublicRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (isAuthenticated && user?.role) {
    const dashboardPath = getDashboardPath(user.role);
    return <Navigate to={dashboardPath} replace />;
  }

  return children;
};

// ---------------------
// Helpers
// ---------------------
const getDashboardPath = (role) => {
  switch (role) {
    case "driver":
      return "/dashboard/driver";
    case "hospital":
      return "/dashboard/hospital";
    case "admin":
      return "/dashboard/admin";
    case "user":
    default:
      return "/dashboard/user";
  }
};

const RootRedirect = () => {
  const { isAuthenticated, user } = useAuthStore();
  if (!isAuthenticated) return <Navigate to="/" replace />;
  return <Navigate to={getDashboardPath(user?.role)} replace />;
};

// ---------------------
// Router
// ---------------------
const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />, // Header for public pages
    children: [
      { index: true, element: <HomePage /> },
      { path: "login", element: <PublicRoute><Login /></PublicRoute> },
      { path: "signup", element: <PublicRoute><Signup /></PublicRoute> },
      { path: "unauthorized", element: <Unauthorized /> },

      // Dashboard routes now use DashboardLayout (Header inside it, remove from MainLayout)
      {
        path: "dashboard",
        element: <DashboardLayout />, // Header here only
        children: [
          {
            path: "user",
            element: <RoleBasedRoute allowedRoles={["user"]}><UserDashboard /></RoleBasedRoute>,
          },
          {
            path: "driver",
            element: <RoleBasedRoute allowedRoles={["driver"]}><DriverDashboard /></RoleBasedRoute>,
          },
          {
            path: "hospital",
            element: <RoleBasedRoute allowedRoles={["hospital"]}><HospitalDashboard /></RoleBasedRoute>,
          },
          {
            path: "admin",
            element: <RoleBasedRoute allowedRoles={["admin"]}><AdminDashboard /></RoleBasedRoute>,
          },
        ],
      },

      // Catch-all
      { path: "*", element: <RootRedirect /> },
    ],
  },
]);


// ---------------------
// App Component
// ---------------------
export default function App() {
  return <RouterProvider router={router} />;
}
