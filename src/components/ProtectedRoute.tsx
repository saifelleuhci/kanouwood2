import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const isAuthenticated = localStorage.getItem("admin-authenticated") === "true";

  if (!isAuthenticated) {
    return <Navigate to="/admin-auth" replace />;
  }

  return <>{children}</>;
}; 