import { RouteGuard } from "@/components/routing/route-guard";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RouteGuard requireAuth>
      {children}
    </RouteGuard>
  );
}

