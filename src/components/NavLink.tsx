import type { ReactNode } from "react";
import { Link } from "react-router-dom";

interface NavLinkProps {
  to: string;
  children: ReactNode;
}

export const NavLink = ({ to, children }: NavLinkProps) => {
  return (
    <Link
      to={to}
      className="text-[26px] cursor-pointer no-underline hover:underline hover:decoration-[#497954]"
    >
      {children}
    </Link>
  );
};
