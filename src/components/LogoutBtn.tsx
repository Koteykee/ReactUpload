import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../stores/useAuthStore";

export const LogoutBtn = () => {
  const { logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <button
      onClick={handleLogout}
      className="text-[26px] cursor-pointer no-underline hover:underline hover:decoration-[#497954]"
    >
      Logout
    </button>
  );
};
