// components/comparison/add-to-compare-button.tsx
"use client";

import { GitCompare, Check } from "lucide-react";
import { useComparisonStore } from "@/store/comparison-store";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import type { Course, Platform, Category } from "@prisma/client";

type CourseWithRelations = Course & {
  platform: Platform;
  category: Category;
};

interface AddToCompareButtonProps {
  course: CourseWithRelations;
  className?: string;
}

export function AddToCompareButton({ course, className }: AddToCompareButtonProps) {
  const { addCourse, removeCourse, hasCourse, courses } = useComparisonStore();
  const isAdded = hasCourse(course.id);
  const isFull = courses.length >= 3 && !isAdded;

  const handleClick = () => {
    if (isAdded) {
      removeCourse(course.id);
      toast.info(`Removed "${course.title}" from comparison`);
    } else if (isFull) {
      toast.error("You can compare up to 3 courses at a time");
    } else {
      addCourse({
        id: course.id,
        title: course.title,
        slug: course.slug,
        imageUrl: course.imageUrl,
        price: course.price,
        rating: course.rating,
        platform: { name: course.platform.name, slug: course.platform.slug },
        category: { name: course.category.name },
      });
      toast.success(`Added "${course.title}" to comparison`);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={isFull}
      className={cn(
        "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all w-full justify-center",
        isAdded
          ? "bg-primary text-primary-foreground"
          : "bg-secondary text-secondary-foreground hover:bg-primary/10 hover:text-primary",
        isFull && "opacity-50 cursor-not-allowed",
        className
      )}
    >
      {isAdded ? (
        <>
          <Check className="w-4 h-4" />
          Added to Compare
        </>
      ) : (
        <>
          <GitCompare className="w-4 h-4" />
          Add to Compare
        </>
      )}
    </button>
  );
}
