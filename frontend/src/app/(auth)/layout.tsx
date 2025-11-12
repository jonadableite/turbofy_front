import { RouteGuard } from "@/components/routing/route-guard";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RouteGuard requireGuest>
      {children}
    </RouteGuard>
  );
}

