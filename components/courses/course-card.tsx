// components/courses/course-card.tsx
"use client";

import Link from "next/link";
import { Star, Clock, Award, Briefcase, Users } from "lucide-react";
import { motion } from "framer-motion";
import { AddToCompareButton } from "@/components/comparison/add-to-compare-button";
import { cn } from "@/lib/utils";
import type { Course, Platform, Category } from "@prisma/client";

type CourseWithRelations = Course & { platform: Platform; category: Category };

interface CourseCardProps {
  course: CourseWithRelations;
  index?: number;
}

const LEVEL_COLORS = {
  BEGINNER: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  INTERMEDIATE: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  ADVANCED: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  ALL_LEVELS: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
};

export function CourseCard({ course, index = 0 }: CourseCardProps) {
  const discount =
    course.originalPrice && course.originalPrice > course.price
      ? Math.round(((course.originalPrice - course.price) / course.originalPrice) * 100)
      : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="group bg-card rounded-2xl border border-border shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col"
    >
      {/* Image */}
      <Link href={`/courses/${course.slug}`} className="block relative">
        <div className="aspect-video bg-muted overflow-hidden">
          {course.imageUrl ? (
            <img
              src={course.imageUrl}
              alt={course.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-brand-100 to-brand-200 dark:from-brand-900 dark:to-brand-800">
              <span className="text-4xl font-bold text-brand-500/50">
                {course.title[0]}
              </span>
            </div>
          )}
        </div>

        {discount && (
          <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-lg">
            -{discount}%
          </span>
        )}
      </Link>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1 gap-3">
        {/* Tags */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium bg-primary/10 text-primary px-2.5 py-1 rounded-full">
            {course.platform.name}
          </span>
          <span
            className={cn(
              "text-xs font-medium px-2.5 py-1 rounded-full",
              LEVEL_COLORS[course.level]
            )}
          >
            {course.level.replace("_", " ")}
          </span>
        </div>

        {/* Title */}
        <Link href={`/courses/${course.slug}`}>
          <h3 className="font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors leading-snug">
            {course.title}
          </h3>
        </Link>

        {/* Instructor */}
        {course.instructor && (
          <p className="text-xs text-muted-foreground">by {course.instructor}</p>
        )}

        {/* Stats */}
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          {course.rating > 0 && (
            <div className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
              <span className="font-semibold text-foreground">{course.rating}</span>
              <span>({course.reviewCount.toLocaleString()})</span>
            </div>
          )}
          {course.duration && (
            <div className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              <span>{course.duration}h</span>
            </div>
          )}
          {course.hasCertificate && (
            <div className="flex items-center gap-1 text-green-600">
              <Award className="w-3.5 h-3.5" />
              <span>Certificate</span>
            </div>
          )}
        </div>

        {/* Price + Actions */}
        <div className="mt-auto pt-3 border-t border-border flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-foreground">
              {course.price === 0 ? "Free" : `$${course.price.toFixed(2)}`}
            </span>
            {course.originalPrice && course.originalPrice > course.price && (
              <span className="text-sm text-muted-foreground line-through">
                ${course.originalPrice.toFixed(2)}
              </span>
            )}
          </div>
        </div>

        <AddToCompareButton course={course} />
      </div>
    </motion.div>
  );
}
