"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

type PageTransitionProps = {
  children: React.ReactNode;
};

export function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);

  return (
    <div key={pathname} className="page-transition-enter">
      {children}
    </div>
  );
}
