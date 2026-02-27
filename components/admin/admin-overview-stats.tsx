// components/admin/admin-overview-stats.tsx
import { Users, BookOpen, Star, Globe } from "lucide-react";

interface AdminOverviewStatsProps {
  userCount: number;
  courseCount: number;
  reviewCount: number;
  platformCount: number;
}

export function AdminOverviewStats({ userCount, courseCount, reviewCount, platformCount }: AdminOverviewStatsProps) {
  const stats = [
    { icon: Users, label: "Total Users", value: userCount, color: "text-blue-500", bg: "bg-blue-500/10" },
    { icon: BookOpen, label: "Total Courses", value: courseCount, color: "text-green-500", bg: "bg-green-500/10" },
    { icon: Star, label: "Total Reviews", value: reviewCount, color: "text-yellow-500", bg: "bg-yellow-500/10" },
    { icon: Globe, label: "Platforms", value: platformCount, color: "text-purple-500", bg: "bg-purple-500/10" },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {stats.map((stat) => (
        <div key={stat.label} className="bg-card rounded-2xl border border-border p-6">
          <div className={`w-12 h-12 ${stat.bg} rounded-xl flex items-center justify-center mb-4`}>
            <stat.icon className={`w-6 h-6 ${stat.color}`} />
          </div>
          <div className="text-3xl font-bold text-foreground">{stat.value.toLocaleString()}</div>
          <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
        </div>
      ))}
    </div>
  );
}
