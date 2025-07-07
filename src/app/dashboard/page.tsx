import { PREDEFINED_ROLES } from "@/constants/auth";
import { requireUser } from "@/lib/auth.server";

export default async function DashboardPage() {
  await requireUser({ allowedRoles: PREDEFINED_ROLES.ALL });

  return (
    <div>
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p className="mt-4">Welcome to your dashboard!</p>
    </div>
  );
}
