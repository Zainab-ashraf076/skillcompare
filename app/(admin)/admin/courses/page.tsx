// app/(admin)/admin/courses/page.tsx
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { AdminCoursesTable } from "@/components/admin/admin-courses-table";
import Link from "next/link";

export const metadata: Metadata = { title: "Manage Courses — Admin" };

export default async function AdminCoursesPage({
  searchParams,
}: {
  searchParams: { page?: string; q?: string };
}) {
  const page = Number(searchParams.page ?? 1);
  const PAGE_SIZE = 20;
  const skip = (page - 1) * PAGE_SIZE;

  const where = searchParams.q
    ? { title: { contains: searchParams.q, mode: "insensitive" as const } }
    : {};

  const [courses, total] = await Promise.all([
    prisma.course.findMany({
      where,
      take: PAGE_SIZE,
      skip,
      orderBy: { createdAt: "desc" },
      include: { platform: true, category: true },
    }),
    prisma.course.count({ where }),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Courses</h1>
          <p className="text-muted-foreground mt-1">{total} total courses</p>
        </div>
        <Link
          href="/admin/courses/new"
          className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-xl text-sm font-medium transition-colors"
        >
          + Add Course
        </Link>
      </div>

      <AdminCoursesTable courses={courses} total={total} page={page} pageSize={PAGE_SIZE} />
    </div>
  );
}
