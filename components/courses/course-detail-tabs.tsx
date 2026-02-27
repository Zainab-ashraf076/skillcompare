// components/courses/course-detail-tabs.tsx
"use client";

import { useState } from "react";
import { ReviewSection } from "@/components/reviews/review-section";
import { cn } from "@/lib/utils";
import type { Course, Platform, Category, Review, User } from "@prisma/client";

type ReviewWithUser = Review & { user: Pick<User, "name" | "image"> };
type CourseWithRelations = Course & {
  platform: Platform;
  category: Category;
  reviews: ReviewWithUser[];
};

const TABS = [
  { id: "description", label: "Description" },
  { id: "syllabus", label: "Syllabus" },
  { id: "reviews", label: "Reviews" },
];

export function CourseDetailTabs({ course }: { course: CourseWithRelations }) {
  const [activeTab, setActiveTab] = useState("description");

  return (
    <div className="mt-8">
      {/* Tab bar */}
      <div className="flex border-b border-border">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "px-5 py-3 text-sm font-medium border-b-2 transition-colors -mb-px",
              activeTab === tab.id
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            {tab.label}
            {tab.id === "reviews" && course.reviewCount > 0 && (
              <span className="ml-2 bg-muted text-muted-foreground text-xs px-2 py-0.5 rounded-full">
                {course.reviewCount}
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="pt-6">
        {activeTab === "description" && (
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
              {course.description}
            </p>
            {course.skills.length > 0 && (
              <div className="mt-6">
                <h3 className="text-foreground font-semibold mb-3">Skills you&apos;ll gain</h3>
                <div className="flex flex-wrap gap-2">
                  {course.skills.map((skill) => (
                    <span
                      key={skill}
                      className="bg-primary/10 text-primary text-sm px-3 py-1 rounded-lg"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "syllabus" && (
          <div>
            {course.syllabus ? (
              <pre className="text-sm text-muted-foreground whitespace-pre-wrap">
                {JSON.stringify(course.syllabus, null, 2)}
              </pre>
            ) : (
              <p className="text-muted-foreground">No syllabus available for this course.</p>
            )}
          </div>
        )}

        {activeTab === "reviews" && (
          <ReviewSection course={course} reviews={course.reviews} />
        )}
      </div>
    </div>
  );
}
