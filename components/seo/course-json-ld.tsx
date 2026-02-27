// components/seo/course-json-ld.tsx
import type { Course, Platform, Category } from "@prisma/client";

type CourseWithRelations = Course & { platform: Platform; category: Category };

export function CourseJsonLd({ course }: { course: CourseWithRelations }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: course.title,
    description: course.shortDesc ?? course.description.slice(0, 300),
    image: course.imageUrl,
    url: course.url,
    provider: {
      "@type": "Organization",
      name: course.platform.name,
    },
    ...(course.instructor && {
      instructor: {
        "@type": "Person",
        name: course.instructor,
      },
    }),
    ...(course.rating > 0 && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: course.rating,
        reviewCount: course.reviewCount,
        bestRating: 5,
        worstRating: 1,
      },
    }),
    offers: {
      "@type": "Offer",
      price: course.price,
      priceCurrency: course.currency,
      availability: "https://schema.org/InStock",
    },
    educationalLevel: course.level.replace("_", " "),
    inLanguage: course.language,
    ...(course.hasCertificate && {
      educationalCredentialAwarded: "Certificate of Completion",
    }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
