// components/courses/course-detail-hero.tsx
import { Star, Clock, BookOpen, Users, Globe, Award, Briefcase } from "lucide-react";
import type { Course, Platform, Category } from "@prisma/client";

type CourseWithRelations = Course & { platform: Platform; category: Category };

export function CourseDetailHero({ course }: { course: CourseWithRelations }) {
  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2 text-sm">
        <a href={`/courses?category=${course.category.slug}`} className="text-primary hover:underline">
          {course.category.name}
        </a>
        <span className="text-muted-foreground">/</span>
        <span className="text-muted-foreground">{course.title}</span>
      </div>

      <h1 className="text-3xl font-bold text-foreground leading-tight">
        {course.title}
      </h1>

      {course.shortDesc && (
        <p className="text-lg text-muted-foreground leading-relaxed">
          {course.shortDesc}
        </p>
      )}

      {/* Stats row */}
      <div className="flex flex-wrap items-center gap-4 text-sm">
        {course.rating > 0 && (
          <div className="flex items-center gap-1.5">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-4 h-4 ${
                    star <= Math.round(course.rating)
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-muted"
                  }`}
                />
              ))}
            </div>
            <span className="font-semibold text-foreground">{course.rating}</span>
            <span className="text-muted-foreground">({course.reviewCount.toLocaleString()} reviews)</span>
          </div>
        )}
        {course.enrollmentCount > 0 && (
          <div className="flex items-center gap-1 text-muted-foreground">
            <Users className="w-4 h-4" />
            <span>{course.enrollmentCount.toLocaleString()} students</span>
          </div>
        )}
        {course.instructor && (
          <span className="text-muted-foreground">by <span className="text-foreground">{course.instructor}</span></span>
        )}
      </div>

      {/* Meta tags */}
      <div className="flex flex-wrap gap-3">
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground bg-muted px-3 py-1.5 rounded-lg">
          <Globe className="w-4 h-4" />
          {course.language}
        </div>
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground bg-muted px-3 py-1.5 rounded-lg">
          <BookOpen className="w-4 h-4" />
          {course.level.replace("_", " ")}
        </div>
        {course.duration && (
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground bg-muted px-3 py-1.5 rounded-lg">
            <Clock className="w-4 h-4" />
            {course.duration} hours
          </div>
        )}
        {course.hasCertificate && (
          <div className="flex items-center gap-1.5 text-sm text-green-600 bg-green-50 dark:bg-green-900/20 px-3 py-1.5 rounded-lg">
            <Award className="w-4 h-4" />
            Certificate
          </div>
        )}
        {course.hasJobSupport && (
          <div className="flex items-center gap-1.5 text-sm text-blue-600 bg-blue-50 dark:bg-blue-900/20 px-3 py-1.5 rounded-lg">
            <Briefcase className="w-4 h-4" />
            Job Support
          </div>
        )}
      </div>
    </div>
  );
}
