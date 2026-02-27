// components/courses/related-courses.tsx
import { CourseCard } from "./course-card";
import type { Course, Platform, Category } from "@prisma/client";

type CourseWithRelations = Course & { platform: Platform; category: Category };

export function RelatedCourses({ courses }: { courses: CourseWithRelations[] }) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-foreground mb-6">Related Courses</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {courses.map((course, i) => (
          <CourseCard key={course.id} course={course} index={i} />
        ))}
      </div>
    </div>
  );
}
