import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthStore } from "../../stores/useAuthStore";

export function AuthGuard() {
  const accessToken = useAuthStore((state) => state.accessToken);
  const location = useLocation();

  if (!accessToken) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ reason: "auth_required", from: location.pathname }}
      />
    );
  }

  return <Outlet />;
}
