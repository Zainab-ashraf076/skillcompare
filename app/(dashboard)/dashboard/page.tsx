// app/(dashboard)/dashboard/page.tsx
import type { Metadata } from "next";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { DashboardStats } from "@/components/dashboard/dashboard-stats";
import { RecentComparisons } from "@/components/dashboard/recent-comparisons";

export const metadata: Metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const session = await auth();
  if (!session) return null;

  const [wishlistCount, comparisonCount, reviewCount] = await Promise.all([
    prisma.wishlist.count({ where: { userId: session.user.id } }),
    prisma.comparisonHistory.count({ where: { userId: session.user.id } }),
    prisma.review.count({ where: { userId: session.user.id } }),
  ]);

  const recentComparisons = await prisma.comparisonHistory.findMany({
    where: { userId: session.user.id },
    take: 5,
    orderBy: { createdAt: "desc" },
    include: {
      courses: {
        include: {
          course: {
            include: { platform: true },
          },
        },
      },
    },
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          Welcome back, {session.user.name?.split(" ")[0]} 👋
        </h1>
        <p className="text-muted-foreground mt-1">
          Here&apos;s a summary of your learning activity
        </p>
      </div>

      <DashboardStats
        wishlistCount={wishlistCount}
        comparisonCount={comparisonCount}
        reviewCount={reviewCount}
      />

      <RecentComparisons comparisons={recentComparisons} />
    </div>
  );
}
