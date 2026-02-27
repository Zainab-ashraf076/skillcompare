// app/(main)/courses/page.tsx
import type { Metadata } from "next";
import { Suspense } from "react";
import { CourseGrid } from "@/components/courses/course-grid";
import { CourseFilters } from "@/components/courses/course-filters";
import { CourseSearch } from "@/components/courses/course-search";
import { CourseGridSkeleton } from "@/components/courses/course-grid-skeleton";
import { prisma } from "@/lib/prisma";
import type { Level } from "@prisma/client";

export const metadata: Metadata = {
  title: "Browse Courses",
  description: "Browse and compare thousands of online courses across all platforms.",
};

interface CoursesPageProps {
  searchParams: {
    q?: string;
    category?: string;
    platform?: string;
    level?: string;
    minPrice?: string;
    maxPrice?: string;
    language?: string;
    certificate?: string;
    jobSupport?: string;
    sort?: string;
    page?: string;
  };
}

const PAGE_SIZE = 12;

export default async function CoursesPage({ searchParams }: CoursesPageProps) {
  const page = Number(searchParams.page ?? 1);
  const skip = (page - 1) * PAGE_SIZE;

  const where = {
    status: "PUBLISHED" as const,
    ...(searchParams.q && {
      OR: [
        { title: { contains: searchParams.q, mode: "insensitive" as const } },
        { description: { contains: searchParams.q, mode: "insensitive" as const } },
        { instructor: { contains: searchParams.q, mode: "insensitive" as const } },
      ],
    }),
    ...(searchParams.category && { category: { slug: searchParams.category } }),
    ...(searchParams.platform && { platform: { slug: searchParams.platform } }),
    ...(searchParams.level && { level: searchParams.level as Level }),
    ...(searchParams.language && { language: searchParams.language }),
    ...(searchParams.certificate === "true" && { hasCertificate: true }),
    ...(searchParams.jobSupport === "true" && { hasJobSupport: true }),
    ...((searchParams.minPrice || searchParams.maxPrice) && {
      price: {
        ...(searchParams.minPrice && { gte: Number(searchParams.minPrice) }),
        ...(searchParams.maxPrice && { lte: Number(searchParams.maxPrice) }),
      },
    }),
  };

  const orderBy = (() => {
    switch (searchParams.sort) {
      case "price_asc": return { price: "asc" as const };
      case "price_desc": return { price: "desc" as const };
      case "rating": return { rating: "desc" as const };
      case "newest": return { createdAt: "desc" as const };
      default: return { rating: "desc" as const };
    }
  })();

  const [courses, total, categories, platforms] = await Promise.all([
    prisma.course.findMany({
      where,
      take: PAGE_SIZE,
      skip,
      orderBy,
      include: { platform: true, category: true },
    }),
    prisma.course.count({ where }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    prisma.platform.findMany({ orderBy: { name: "asc" } }),
  ]);

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Browse Courses</h1>
        <p className="text-muted-foreground">
          Discover and compare {total.toLocaleString()} courses across top platforms
        </p>
      </div>

      <div className="flex gap-8">
        {/* Sidebar Filters */}
        <aside className="hidden lg:block w-72 shrink-0">
          <CourseFilters
            categories={categories}
            platforms={platforms}
            searchParams={searchParams}
          />
        </aside>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          <div className="mb-6 flex flex-col sm:flex-row gap-4">
            <CourseSearch defaultValue={searchParams.q} />
            <div className="flex gap-2 items-center text-sm text-muted-foreground shrink-0">
              {total} results
            </div>
          </div>

          <Suspense fallback={<CourseGridSkeleton />}>
            <CourseGrid
              courses={courses}
              total={total}
              page={page}
              pageSize={PAGE_SIZE}
              searchParams={searchParams}
            />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
