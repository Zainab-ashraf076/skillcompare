// app/(main)/page.tsx
import { HeroSection } from "@/components/home/hero-section";
import { FeaturedCategories } from "@/components/home/featured-categories";
import { FeaturedCourses } from "@/components/home/featured-courses";
import { HowItWorks } from "@/components/home/how-it-works";
import { TrustBar } from "@/components/home/trust-bar";
import { prisma } from "@/lib/prisma";

export default async function HomePage() {
  const [categories, featuredCourses] = await Promise.all([
    prisma.category.findMany({
      take: 8,
      orderBy: { courses: { _count: "desc" } },
      include: { _count: { select: { courses: true } } },
    }),
    prisma.course.findMany({
      where: { status: "PUBLISHED" },
      take: 8,
      orderBy: { rating: "desc" },
      include: { platform: true, category: true },
    }),
  ]);

  return (
    <>
      <HeroSection />
      <TrustBar />
      <FeaturedCategories categories={categories} />
      <FeaturedCourses courses={featuredCourses} />
      <HowItWorks />
    </>
  );
}
