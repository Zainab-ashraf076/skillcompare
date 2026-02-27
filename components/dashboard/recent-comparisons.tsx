// components/dashboard/recent-comparisons.tsx
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { GitCompare } from "lucide-react";
import type { ComparisonHistory, ComparisonHistoryCourse, Course, Platform } from "@prisma/client";

type ComparisonWithCourses = ComparisonHistory & {
  courses: (ComparisonHistoryCourse & {
    course: Course & { platform: Platform };
  })[];
};

export function RecentComparisons({ comparisons }: { comparisons: ComparisonWithCourses[] }) {
  if (comparisons.length === 0) {
    return null;
  }

  return (
    <div className="bg-card rounded-2xl border border-border p-6">
      <h2 className="font-semibold text-foreground mb-4 flex items-center gap-2">
        <GitCompare className="w-5 h-5 text-primary" />
        Recent Comparisons
      </h2>
      <div className="space-y-3">
        {comparisons.map((comparison) => (
          <div key={comparison.id} className="flex items-center gap-3 py-3 border-b border-border last:border-0">
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap gap-1">
                {comparison.courses.map((c) => (
                  <Link
                    key={c.courseId}
                    href={`/courses/${c.course.slug}`}
                    className="text-sm text-foreground hover:text-primary truncate max-w-[160px]"
                  >
                    {c.course.title}
                  </Link>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                {formatDistanceToNow(comparison.createdAt, { addSuffix: true })}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
