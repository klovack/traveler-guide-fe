import { PREDEFINED_ROLES } from "@/constants/auth";
import { requireUser } from "@/lib/auth.server";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const user = await requireUser({ allowedRoles: PREDEFINED_ROLES.ALL });

  if (user?.role === "guide") {
    redirect("/guide/dashboard");
  }

  return (
    <div>
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p className="mt-4">Welcome to your dashboard!</p>
    </div>
  );
}
