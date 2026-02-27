// components/comparison/comparison-table-wrapper.tsx
"use client";

import { useEffect, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
} from "@tanstack/react-table";
import { useComparisonStore } from "@/store/comparison-store";
import { Star, Check, X, Crown, Loader2 } from "lucide-react";
import Link from "next/link";
import { EmptyState } from "@/components/ui/empty-state";
import type { Course, Platform, Category } from "@prisma/client";

type FullCourse = Course & { platform: Platform; category: Category };

// Feature rows to compare
interface ComparisonRow {
  feature: string;
  key: keyof FullCourse | string;
  render?: (value: unknown, course: FullCourse, isBest: boolean) => React.ReactNode;
}

const ROWS: ComparisonRow[] = [
  {
    feature: "Price",
    key: "price",
    render: (v) => (
      <span className="font-bold text-lg">
        {Number(v) === 0 ? "Free" : `$${Number(v).toFixed(2)}`}
      </span>
    ),
  },
  {
    feature: "Rating",
    key: "rating",
    render: (v, _c, isBest) => (
      <div className="flex items-center gap-1">
        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
        <span className={isBest ? "font-bold text-green-600" : ""}>{String(v)}</span>
      </div>
    ),
  },
  { feature: "Platform", key: "platform", render: (_, c) => c.platform.name },
  { feature: "Category", key: "category", render: (_, c) => c.category.name },
  { feature: "Level", key: "level", render: (v) => String(v).replace("_", " ") },
  { feature: "Language", key: "language" },
  {
    feature: "Duration",
    key: "duration",
    render: (v) => (v ? `${v} hours` : "—"),
  },
  {
    feature: "Lessons",
    key: "lessonsCount",
    render: (v) => (v ? `${v} lessons` : "—"),
  },
  {
    feature: "Certificate",
    key: "hasCertificate",
    render: (v) =>
      v ? (
        <Check className="w-5 h-5 text-green-500" />
      ) : (
        <X className="w-4 h-4 text-muted-foreground" />
      ),
  },
  {
    feature: "Job Support",
    key: "hasJobSupport",
    render: (v) =>
      v ? (
        <Check className="w-5 h-5 text-green-500" />
      ) : (
        <X className="w-4 h-4 text-muted-foreground" />
      ),
  },
  {
    feature: "Enrollments",
    key: "enrollmentCount",
    render: (v) => Number(v).toLocaleString(),
  },
];

function getBestCourseIndex(courses: FullCourse[], key: keyof FullCourse): number {
  if (courses.length === 0) return -1;
  if (key === "price") {
    const minPrice = Math.min(...courses.map((c) => c.price));
    return courses.findIndex((c) => c.price === minPrice);
  }
  if (key === "rating") {
    const maxRating = Math.max(...courses.map((c) => c.rating));
    return courses.findIndex((c) => c.rating === maxRating);
  }
  return -1;
}

const columnHelper = createColumnHelper<ComparisonRow>();

export function ComparisonTableWrapper() {
  const { courses: storedCourses } = useComparisonStore();
  const [courses, setCourses] = useState<FullCourse[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (storedCourses.length === 0) {
      setCourses([]);
      return;
    }

    setLoading(true);
    fetch("/api/courses/by-ids", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: storedCourses.map((c) => c.id) }),
    })
      .then((r) => r.json())
      .then((data: { courses: FullCourse[] }) => setCourses(data.courses))
      .finally(() => setLoading(false));
  }, [storedCourses]);

  const bestPriceIdx = getBestCourseIndex(courses, "price");
  const bestRatingIdx = getBestCourseIndex(courses, "rating");

  const columns = [
    columnHelper.accessor("feature", {
      header: "Feature",
      cell: (info) => (
        <span className="font-medium text-sm text-muted-foreground">
          {info.getValue()}
        </span>
      ),
    }),
    ...courses.map((course, idx) =>
      columnHelper.display({
        id: `course-${course.id}`,
        header: () => (
          <div className="text-center space-y-2 p-2">
            {course.imageUrl && (
              <img
                src={course.imageUrl}
                alt={course.title}
                className="w-16 h-10 object-cover rounded-lg mx-auto"
              />
            )}
            <div>
              <Link
                href={`/courses/${course.slug}`}
                className="font-semibold text-sm text-foreground hover:text-primary transition-colors line-clamp-2"
              >
                {course.title}
              </Link>
              <p className="text-xs text-muted-foreground">{course.platform.name}</p>
            </div>
            {idx === bestPriceIdx && (
              <div className="inline-flex items-center gap-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs px-2 py-0.5 rounded-full">
                <Crown className="w-3 h-3" />
                Best Value
              </div>
            )}
          </div>
        ),
        cell: ({ row }) => {
          const rowData = row.original;
          const value = (course as Record<string, unknown>)[rowData.key];
          const isBestPrice = rowData.key === "price" && idx === bestPriceIdx;
          const isBestRating = rowData.key === "rating" && idx === bestRatingIdx;

          return (
            <div className={`text-center p-2 ${isBestPrice || isBestRating ? "bg-green-50 dark:bg-green-900/10 rounded-lg" : ""}`}>
              {rowData.render
                ? rowData.render(value, course, isBestPrice || isBestRating)
                : String(value ?? "—")}
            </div>
          );
        },
      })
    ),
  ];

  const table = useReactTable({
    data: ROWS,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (storedCourses.length === 0) {
    return (
      <EmptyState
        title="No courses to compare"
        description="Browse courses and add up to 3 to compare them side by side."
        actionLabel="Browse Courses"
        actionHref="/courses"
        icon="compare"
      />
    );
  }

  return (
    <div className="bg-card border rounded-2xl overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="border-b border-border">
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="p-4 text-left first:w-40 bg-muted/30"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row, rowIdx) => (
              <tr
                key={row.id}
                className={`border-b border-border last:border-0 ${
                  rowIdx % 2 === 0 ? "bg-background" : "bg-muted/20"
                }`}
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="p-4">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
