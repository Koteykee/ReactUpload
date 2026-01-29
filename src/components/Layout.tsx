import type { ReactNode } from "react";

import { Header } from "./Header";

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <>
      <Header />
      <main className="container mx-auto p-8">{children}</main>
    </>
  );
};
