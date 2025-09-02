import type { ReactNode } from "react";

const HomeLayout = ({ children }: { children: ReactNode }) => {
  return children;
};

export default function Layout({ children }: { children: ReactNode }) {
  return <HomeLayout>{children}</HomeLayout>;
}
