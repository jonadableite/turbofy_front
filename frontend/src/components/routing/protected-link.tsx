"use client";

import Link, { LinkProps } from "next/link";
import { useRoutePreload } from "@/lib/route-loader";

interface ProtectedLinkProps extends LinkProps {
  children: React.ReactNode;
  className?: string;
  requireAuth?: boolean;
}

export const ProtectedLink = ({
  children,
  href,
  className,
  requireAuth = true,
  ...props
}: ProtectedLinkProps) => {
  const { handleMouseEnter } = useRoutePreload();
  const routeName = typeof href === "string" ? href : href.pathname || "";

  return (
    <Link
      href={href}
      className={className}
      onMouseEnter={() => handleMouseEnter(routeName)}
      {...props}
    >
      {children}
    </Link>
  );
};

