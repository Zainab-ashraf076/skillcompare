// components/courses/course-grid-skeleton.tsx
export function CourseGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="bg-card rounded-2xl border border-border overflow-hidden">
          <div className="skeleton aspect-video" />
          <div className="p-5 space-y-3">
            <div className="flex gap-2">
              <div className="skeleton h-6 w-20 rounded-full" />
              <div className="skeleton h-6 w-16 rounded-full" />
            </div>
            <div className="skeleton h-4 w-full rounded-lg" />
            <div className="skeleton h-4 w-3/4 rounded-lg" />
            <div className="skeleton h-3 w-24 rounded-lg" />
            <div className="flex gap-3">
              <div className="skeleton h-3 w-12 rounded-lg" />
              <div className="skeleton h-3 w-12 rounded-lg" />
            </div>
            <div className="pt-3 border-t border-border">
              <div className="skeleton h-6 w-20 rounded-lg" />
            </div>
            <div className="skeleton h-10 w-full rounded-xl" />
          </div>
        </div>
      ))}
    </div>
  );
}
