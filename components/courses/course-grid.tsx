// components/courses/course-grid.tsx
import { CourseCard } from "./course-card";
import { PaginationControls } from "@/components/ui/pagination-controls";
import { EmptyState } from "@/components/ui/empty-state";
import type { Course, Platform, Category } from "@prisma/client";

type CourseWithRelations = Course & { platform: Platform; category: Category };

interface CourseGridProps {
  courses: CourseWithRelations[];
  total: number;
  page: number;
  pageSize: number;
  searchParams: Record<string, string | undefined>;
}

export function CourseGrid({ courses, total, page, pageSize, searchParams }: CourseGridProps) {
  if (courses.length === 0) {
    return (
      <EmptyState
        title="No courses found"
        description="Try adjusting your filters or search terms."
        actionLabel="Clear Filters"
        actionHref="/courses"
        icon="search"
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
        {courses.map((course, i) => (
          <CourseCard key={course.id} course={course} index={i} />
        ))}
      </div>

      <PaginationControls
        total={total}
        page={page}
        pageSize={pageSize}
        searchParams={searchParams}
      />
    </div>
  );
}
