
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


const MainLayout = () => {
  return (
    <>
      <Header />     
      <main>
        <Outlet />     
      </main>
    </>
  );
};


const RoleBasedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, user,isLoading } = useAuthStore();
  if (isLoading) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-600">Loading dashboard...</p>
    </div>
  );
}



  if (!isAuthenticated) return <Navigate to="/login" replace />;
    if (!user?.role) return null; 


  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};


const PublicRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (isAuthenticated) {
    const dashboardPath = getDashboardPath(user?.role);
    return <Navigate to={dashboardPath} replace />;
  }

  return children;
};


const getDashboardPath = (role) => {
  switch (role) {
    case "driver":
      return "/dashboard/driver";
    case "hospital":
      return "/dashboard/hospital";
    case "user":
    default:
      return "/dashboard/user";
  }
};


const RootRedirect = () => {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) return <Navigate to="/" replace />;

  const dashboardPath = getDashboardPath(user?.role);
  return <Navigate to={dashboardPath} replace />;
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,  // Layout wraps all child routes
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/login", element: <PublicRoute><Login /></PublicRoute> },
      { path: "/signup", element: <PublicRoute><Signup /></PublicRoute> },
      { path: "/unauthorized", element: <Unauthorized /> },

      // User Dashboard
      {
        path: "/dashboard/user",
        element: <RoleBasedRoute allowedRoles={["user"]}><UserDashboard /></RoleBasedRoute>,
      },

      // Driver Dashboard
      {
        path: "/dashboard/driver",
        element: <RoleBasedRoute allowedRoles={["driver"]}><DriverDashboard /></RoleBasedRoute>,
      },

      // Hospital Dashboard
      {
        path: "/dashboard/hospital",
        element: <RoleBasedRoute allowedRoles={["hospital"]}><HospitalDashboard /></RoleBasedRoute>,
      },

      // Catch-all
      { path: "*", element: <RootRedirect /> },
    ],
  },
]);

// ---------------------
// App Component
// ---------------------
function App() {
  return <RouterProvider router={router} />;
}

export default App;
