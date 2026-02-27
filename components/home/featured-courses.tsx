// components/home/featured-courses.tsx
import Link from "next/link";
import { CourseCard } from "@/components/courses/course-card";
import { ArrowRight } from "lucide-react";
import type { Course, Platform, Category } from "@prisma/client";

type CourseWithRelations = Course & { platform: Platform; category: Category };

export function FeaturedCourses({ courses }: { courses: CourseWithRelations[] }) {
  return (
    <section className="py-16 bg-muted/20">
      <div className="container">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-1">Top-Rated Courses</h2>
            <p className="text-muted-foreground">Highly rated across all platforms</p>
          </div>
          <Link
            href="/courses"
            className="flex items-center gap-1.5 text-primary hover:underline text-sm font-medium"
          >
            View all
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {courses.map((course, i) => (
            <CourseCard key={course.id} course={course} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
