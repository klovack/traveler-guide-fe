import { PREDEFINED_ROLES } from "@/constants/auth";
import { requireUser } from "@/lib/auth.server";

export default async function DashboardPage() {
  await requireUser(PREDEFINED_ROLES.ALL);

  return (
    <div className="flex items-center justify-center h-screen">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p className="mt-4">Welcome to your dashboard!</p>
    </div>
  );
}
