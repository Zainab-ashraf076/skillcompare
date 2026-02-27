// components/wishlist/wishlist-grid.tsx
import Link from "next/link";
import { CourseCard } from "@/components/courses/course-card";
import { EmptyState } from "@/components/ui/empty-state";
import type { Wishlist, Course, Platform, Category } from "@prisma/client";

type WishlistWithCourse = Wishlist & {
  course: Course & { platform: Platform; category: Category };
};

export function WishlistGrid({ items }: { items: WishlistWithCourse[] }) {
  if (items.length === 0) {
    return (
      <EmptyState
        title="Your wishlist is empty"
        description="Browse courses and save the ones you're interested in."
        actionLabel="Browse Courses"
        actionHref="/courses"
        icon="heart"
      />
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {items.map((item, i) => (
        <CourseCard key={item.id} course={item.course} index={i} />
      ))}
    </div>
  );
}
