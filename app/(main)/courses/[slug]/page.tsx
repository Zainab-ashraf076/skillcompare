// app/(main)/courses/[slug]/page.tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { CourseDetailHero } from "@/components/courses/course-detail-hero";
import { CourseDetailTabs } from "@/components/courses/course-detail-tabs";
import { RelatedCourses } from "@/components/courses/related-courses";
import { CourseJsonLd } from "@/components/seo/course-json-ld";
import { AddToCompareButton } from "@/components/comparison/add-to-compare-button";
import { WishlistButton } from "@/components/wishlist/wishlist-button";

interface CoursePageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: CoursePageProps): Promise<Metadata> {
  const course = await prisma.course.findUnique({
    where: { slug: params.slug },
    include: { platform: true, category: true },
  });

  if (!course) return {};

  return {
    title: course.title,
    description: course.shortDesc ?? course.description.slice(0, 160),
    openGraph: {
      title: course.title,
      description: course.shortDesc ?? course.description.slice(0, 160),
      images: course.imageUrl ? [course.imageUrl] : [],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: course.title,
      description: course.shortDesc ?? course.description.slice(0, 160),
      images: course.imageUrl ? [course.imageUrl] : [],
    },
  };
}

export default async function CourseDetailPage({ params }: CoursePageProps) {
  const session = await auth();

  const course = await prisma.course.findUnique({
    where: { slug: params.slug, status: "PUBLISHED" },
    include: {
      platform: true,
      category: true,
      reviews: {
        take: 10,
        orderBy: { createdAt: "desc" },
        include: { user: { select: { name: true, image: true } } },
      },
    },
  });

  if (!course) notFound();

  const [relatedCourses, isWishlisted] = await Promise.all([
    prisma.course.findMany({
      where: {
        categoryId: course.categoryId,
        id: { not: course.id },
        status: "PUBLISHED",
      },
      take: 4,
      orderBy: { rating: "desc" },
      include: { platform: true, category: true },
    }),
    session?.user.id
      ? prisma.wishlist.findUnique({
          where: { userId_courseId: { userId: session.user.id, courseId: course.id } },
        })
      : null,
  ]);

  return (
    <>
      <CourseJsonLd course={course} />

      <div className="container py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <CourseDetailHero course={course} />
            <CourseDetailTabs course={course} />
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-3">
              {course.imageUrl && (
                <img
                  src={course.imageUrl}
                  alt={course.title}
                  className="w-full rounded-2xl shadow-lg object-cover aspect-video"
                />
              )}
              <div className="bg-card border rounded-2xl p-6 shadow-sm space-y-4">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-foreground">
                    {course.price === 0 ? "Free" : `$${course.price.toFixed(2)}`}
                  </span>
                  {course.originalPrice && course.originalPrice > course.price && (
                    <span className="text-muted-foreground line-through text-lg">
                      ${course.originalPrice.toFixed(2)}
                    </span>
                  )}
                </div>

                {course.url && (
                  <a
                    href={course.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full text-center bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-3 rounded-xl font-semibold transition-colors"
                  >
                    Enroll Now
                  </a>
                )}

                <div className="flex gap-2">
                  <div className="flex-1">
                    <AddToCompareButton course={course} />
                  </div>
                  <WishlistButton
                    courseId={course.id}
                    isWishlisted={!!isWishlisted}
                    userId={session?.user.id}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {relatedCourses.length > 0 && (
          <div className="mt-16">
            <RelatedCourses courses={relatedCourses} />
          </div>
        )}
      </div>
    </>
  );
}
