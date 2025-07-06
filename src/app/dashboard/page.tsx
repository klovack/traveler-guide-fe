"use client";

import { withAuthOnly } from "@/lib/withAuthOnly";

function DashboardPage() {
  return (
    <div className="flex items-center justify-center h-screen">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p className="mt-4">Welcome to your dashboard!</p>
    </div>
  );
}

export default withAuthOnly(DashboardPage);
