// components/courses/course-filters.tsx
"use client";

import { useRouter, usePathname } from "next/navigation";
import { useCallback } from "react";
import type { Category, Platform } from "@prisma/client";

interface CourseFiltersProps {
  categories: Category[];
  platforms: Platform[];
  searchParams: Record<string, string | undefined>;
}

export function CourseFilters({ categories, platforms, searchParams }: CourseFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();

  const updateFilter = useCallback(
    (key: string, value: string | null) => {
      const params = new URLSearchParams(
        Object.fromEntries(
          Object.entries(searchParams).filter(([, v]) => v != null) as [string, string][]
        )
      );
      if (value === null || value === "") {
        params.delete(key);
      } else {
        params.set(key, value);
      }
      params.delete("page");
      router.push(`${pathname}?${params.toString()}`);
    },
    [router, pathname, searchParams]
  );

  const isActive = (key: string, value: string) => searchParams[key] === value;

  return (
    <div className="space-y-6">
      {/* Category */}
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-3">Category</h3>
        <div className="space-y-1">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() =>
                updateFilter("category", isActive("category", cat.slug) ? null : cat.slug)
              }
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                isActive("category", cat.slug)
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Platform */}
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-3">Platform</h3>
        <div className="space-y-1">
          {platforms.map((platform) => (
            <button
              key={platform.id}
              onClick={() =>
                updateFilter(
                  "platform",
                  isActive("platform", platform.slug) ? null : platform.slug
                )
              }
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                isActive("platform", platform.slug)
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              {platform.name}
            </button>
          ))}
        </div>
      </div>

      {/* Level */}
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-3">Level</h3>
        <div className="space-y-1">
          {[
            { value: "BEGINNER", label: "Beginner" },
            { value: "INTERMEDIATE", label: "Intermediate" },
            { value: "ADVANCED", label: "Advanced" },
            { value: "ALL_LEVELS", label: "All Levels" },
          ].map((level) => (
            <button
              key={level.value}
              onClick={() =>
                updateFilter("level", isActive("level", level.value) ? null : level.value)
              }
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                isActive("level", level.value)
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              {level.label}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-3">Price</h3>
        <div className="space-y-1">
          {[
            { label: "Free", min: "0", max: "0" },
            { label: "Under $25", min: "0", max: "25" },
            { label: "$25 – $50", min: "25", max: "50" },
            { label: "$50 – $100", min: "50", max: "100" },
            { label: "$100+", min: "100", max: "" },
          ].map((range) => {
            const active =
              searchParams.minPrice === range.min && searchParams.maxPrice === range.max;
            return (
              <button
                key={range.label}
                onClick={() => {
                  if (active) {
                    updateFilter("minPrice", null);
                    updateFilter("maxPrice", null);
                  } else {
                    updateFilter("minPrice", range.min);
                    updateFilter("maxPrice", range.max);
                  }
                }}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                  active
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                {range.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Features */}
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-3">Features</h3>
        <div className="space-y-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={searchParams.certificate === "true"}
              onChange={(e) => updateFilter("certificate", e.target.checked ? "true" : null)}
              className="rounded border-border text-primary focus:ring-primary"
            />
            <span className="text-sm text-muted-foreground">Has Certificate</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={searchParams.jobSupport === "true"}
              onChange={(e) => updateFilter("jobSupport", e.target.checked ? "true" : null)}
              className="rounded border-border text-primary focus:ring-primary"
            />
            <span className="text-sm text-muted-foreground">Job Support</span>
          </label>
        </div>
      </div>

      {/* Clear All */}
      <button
        onClick={() => router.push("/courses")}
        className="w-full text-sm text-muted-foreground hover:text-foreground border border-border hover:border-foreground rounded-lg px-3 py-2 transition-colors"
      >
        Clear All Filters
      </button>
    </div>
  );
}
