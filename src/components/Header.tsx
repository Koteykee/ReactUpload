import { LogoutBtn } from "./LogoutBtn";
import { NavLink } from "./NavLink";

export const Header = () => {
  const { user } = useAuthStore();

  return (
    <nav className="bg-[#C1D8CA] flex justify-center">
      {!user ? (
        <div className="flex gap-[50px] m-2.5">
          <NavLink to="/login">Login</NavLink>
          <NavLink to="/registration">Registration</NavLink>
        </div>
      ) : (
        <div className="flex gap-[50px] m-2.5">
          <NavLink to="/public">Main Page</NavLink>
          <NavLink to="/user">My files</NavLink>
          <LogoutBtn />
        </div>
      )}
    </nav>
  );
};
//импорт
