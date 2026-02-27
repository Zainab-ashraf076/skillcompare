// app/(admin)/admin/page.tsx
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { AdminOverviewStats } from "@/components/admin/admin-overview-stats";

export const metadata: Metadata = { title: "Admin Dashboard" };

export default async function AdminPage() {
  const [userCount, courseCount, reviewCount, platformCount] = await Promise.all([
    prisma.user.count(),
    prisma.course.count(),
    prisma.review.count(),
    prisma.platform.count(),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-1">Platform overview and management</p>
      </div>
      <AdminOverviewStats
        userCount={userCount}
        courseCount={courseCount}
        reviewCount={reviewCount}
        platformCount={platformCount}
      />
    </div>
  );
}
