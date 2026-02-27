// components/dashboard/dashboard-stats.tsx
import { Heart, GitCompare, Star } from "lucide-react";

interface DashboardStatsProps {
  wishlistCount: number;
  comparisonCount: number;
  reviewCount: number;
}

export function DashboardStats({ wishlistCount, comparisonCount, reviewCount }: DashboardStatsProps) {
  const stats = [
    { icon: Heart, label: "Wishlisted Courses", value: wishlistCount, color: "text-red-500", bg: "bg-red-50 dark:bg-red-900/20" },
    { icon: GitCompare, label: "Comparisons Made", value: comparisonCount, color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-900/20" },
    { icon: Star, label: "Reviews Written", value: reviewCount, color: "text-yellow-500", bg: "bg-yellow-50 dark:bg-yellow-900/20" },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
      {stats.map((stat) => (
        <div key={stat.label} className="bg-card rounded-2xl border border-border p-6">
          <div className={`w-12 h-12 ${stat.bg} rounded-xl flex items-center justify-center mb-4`}>
            <stat.icon className={`w-6 h-6 ${stat.color}`} />
          </div>
          <div className="text-3xl font-bold text-foreground">{stat.value}</div>
          <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
        </div>
      ))}
    </div>
  );
}
