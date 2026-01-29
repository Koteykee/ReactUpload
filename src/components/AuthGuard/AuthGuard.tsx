import { Navigate, Outlet } from "react-router-dom";
import toast from "react-hot-toast";

export function AuthGuard() {
  const accessToken = localStorage.getItem("accessToken");

  if (!accessToken) {
    toast.error("Необходимо авторизоваться");
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
