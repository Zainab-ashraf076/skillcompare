// components/admin/admin-courses-table.tsx
"use client";

import Link from "next/link";
import { Pencil, Trash2 } from "lucide-react";
import { deleteCourse } from "@/lib/actions/courses";
import { toast } from "sonner";
import { PaginationControls } from "@/components/ui/pagination-controls";
import type { Course, Platform, Category } from "@prisma/client";

type CourseWithRelations = Course & { platform: Platform; category: Category };

interface AdminCoursesTableProps {
  courses: CourseWithRelations[];
  total: number;
  page: number;
  pageSize: number;
}

const STATUS_STYLES = {
  PUBLISHED: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  DRAFT: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  ARCHIVED: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
};

export function AdminCoursesTable({ courses, total, page, pageSize }: AdminCoursesTableProps) {
  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    try {
      await deleteCourse(id);
      toast.success("Course deleted");
    } catch {
      toast.error("Failed to delete course");
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-card rounded-2xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left px-5 py-4 font-medium text-muted-foreground">Course</th>
                <th className="text-left px-5 py-4 font-medium text-muted-foreground">Platform</th>
                <th className="text-left px-5 py-4 font-medium text-muted-foreground">Category</th>
                <th className="text-left px-5 py-4 font-medium text-muted-foreground">Price</th>
                <th className="text-left px-5 py-4 font-medium text-muted-foreground">Status</th>
                <th className="text-right px-5 py-4 font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course) => (
                <tr key={course.id} className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors">
                  <td className="px-5 py-4">
                    <div className="max-w-[240px]">
                      <p className="font-medium text-foreground truncate">{course.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        ⭐ {course.rating} · {course.reviewCount} reviews
                      </p>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-muted-foreground">{course.platform.name}</td>
                  <td className="px-5 py-4 text-muted-foreground">{course.category.name}</td>
                  <td className="px-5 py-4 font-medium text-foreground">
                    {course.price === 0 ? "Free" : `$${course.price.toFixed(2)}`}
                  </td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${STATUS_STYLES[course.status]}`}>
                      {course.status}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/courses/${course.id}/edit`}
                        className="w-8 h-8 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                      >
                        <Pencil className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(course.id, course.title)}
                        className="w-8 h-8 flex items-center justify-center rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <PaginationControls total={total} page={page} pageSize={pageSize} searchParams={{}} />
    </div>
  );
}
