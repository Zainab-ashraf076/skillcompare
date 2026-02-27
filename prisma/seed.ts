// prisma/seed.ts
import { PrismaClient, Level, CourseStatus, Role } from "@prisma/client";
import bcrypt from "bcryptjs";
import slugify from "slugify";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Admin user
  const adminPassword = await bcrypt.hash("admin123456", 12);
  const admin = await prisma.user.upsert({
    where: { email: "admin@skillcompare.app" },
    update: {},
    create: {
      name: "Admin User",
      email: "admin@skillcompare.app",
      password: adminPassword,
      role: Role.ADMIN,
    },
  });
  console.log("✅ Admin user created:", admin.email);

  // Demo user
  const userPassword = await bcrypt.hash("user123456", 12);
  const user = await prisma.user.upsert({
    where: { email: "demo@skillcompare.app" },
    update: {},
    create: {
      name: "Demo User",
      email: "demo@skillcompare.app",
      password: userPassword,
      role: Role.USER,
    },
  });
  console.log("✅ Demo user created:", user.email);

  // Platforms
  const platforms = await Promise.all([
    prisma.platform.upsert({
      where: { slug: "udemy" },
      update: {},
      create: { name: "Udemy", slug: "udemy", websiteUrl: "https://udemy.com", description: "World's largest e-learning marketplace" },
    }),
    prisma.platform.upsert({
      where: { slug: "coursera" },
      update: {},
      create: { name: "Coursera", slug: "coursera", websiteUrl: "https://coursera.org", description: "Online learning from top universities" },
    }),
    prisma.platform.upsert({
      where: { slug: "pluralsight" },
      update: {},
      create: { name: "Pluralsight", slug: "pluralsight", websiteUrl: "https://pluralsight.com", description: "Tech skills platform" },
    }),
    prisma.platform.upsert({
      where: { slug: "edx" },
      update: {},
      create: { name: "edX", slug: "edx", websiteUrl: "https://edx.org", description: "Non-profit online learning" },
    }),
  ]);
  console.log("✅ Platforms created");

  // Categories
  const categories = await Promise.all([
    prisma.category.upsert({ where: { slug: "web-development" }, update: {}, create: { name: "Web Development", slug: "web-development", icon: "🌐" } }),
    prisma.category.upsert({ where: { slug: "data-science" }, update: {}, create: { name: "Data Science", slug: "data-science", icon: "📊" } }),
    prisma.category.upsert({ where: { slug: "machine-learning" }, update: {}, create: { name: "Machine Learning", slug: "machine-learning", icon: "🤖" } }),
    prisma.category.upsert({ where: { slug: "mobile-development" }, update: {}, create: { name: "Mobile Development", slug: "mobile-development", icon: "📱" } }),
    prisma.category.upsert({ where: { slug: "devops" }, update: {}, create: { name: "DevOps & Cloud", slug: "devops", icon: "☁️" } }),
    prisma.category.upsert({ where: { slug: "cybersecurity" }, update: {}, create: { name: "Cybersecurity", slug: "cybersecurity", icon: "🔒" } }),
    prisma.category.upsert({ where: { slug: "ui-ux-design" }, update: {}, create: { name: "UI/UX Design", slug: "ui-ux-design", icon: "🎨" } }),
    prisma.category.upsert({ where: { slug: "business" }, update: {}, create: { name: "Business", slug: "business", icon: "💼" } }),
  ]);
  console.log("✅ Categories created");

  const [udemy, coursera, pluralsight, edx] = platforms;
  const [webDev, dataScience, ml, mobile, devops, cybersec, design, business] = categories;

  // Courses
  const coursesData = [
    {
      title: "The Complete Web Development Bootcamp 2024",
      description: "Become a full-stack web developer with just one course. HTML, CSS, Javascript, Node, React, MongoDB, and more! This comprehensive course covers everything you need to know to become a professional web developer.",
      shortDesc: "Learn HTML, CSS, JS, Node.js, React and more in one comprehensive course.",
      instructor: "Dr. Angela Yu",
      language: "English",
      level: Level.BEGINNER,
      status: CourseStatus.PUBLISHED,
      price: 19.99,
      originalPrice: 129.99,
      duration: 65,
      lessonsCount: 490,
      hasCertificate: true,
      hasJobSupport: false,
      rating: 4.7,
      reviewCount: 312450,
      enrollmentCount: 780000,
      skills: ["HTML5", "CSS3", "JavaScript", "Node.js", "React", "MongoDB"],
      platformId: udemy.id,
      categoryId: webDev.id,
    },
    {
      title: "Machine Learning Specialization",
      description: "A foundational online program created in collaboration with DeepLearning.AI. This updated Specialization is taught by AI visionary Andrew Ng and will help you build a strong machine learning foundation.",
      shortDesc: "Master machine learning fundamentals with Andrew Ng and Stanford.",
      instructor: "Andrew Ng",
      language: "English",
      level: Level.INTERMEDIATE,
      status: CourseStatus.PUBLISHED,
      price: 49.00,
      originalPrice: 79.00,
      duration: 90,
      lessonsCount: 200,
      hasCertificate: true,
      hasJobSupport: false,
      rating: 4.9,
      reviewCount: 98500,
      enrollmentCount: 510000,
      skills: ["Python", "Machine Learning", "TensorFlow", "Neural Networks"],
      platformId: coursera.id,
      categoryId: ml.id,
    },
    {
      title: "React — The Complete Guide (includes Hooks, Router, Redux)",
      description: "Dive in and learn React.js from scratch! Learn Reactjs, Hooks, Redux, React Router, Next.js, Best Practices and way more! Updated to include React 18.",
      shortDesc: "Comprehensive React course covering all modern features and patterns.",
      instructor: "Maximilian Schwarzmüller",
      language: "English",
      level: Level.ALL_LEVELS,
      status: CourseStatus.PUBLISHED,
      price: 24.99,
      originalPrice: 149.99,
      duration: 68,
      lessonsCount: 610,
      hasCertificate: true,
      hasJobSupport: false,
      rating: 4.6,
      reviewCount: 192300,
      enrollmentCount: 850000,
      skills: ["React", "Redux", "Hooks", "React Router", "Next.js"],
      platformId: udemy.id,
      categoryId: webDev.id,
    },
    {
      title: "AWS Cloud Practitioner Essentials",
      description: "This course is for individuals who seek an overall understanding of the Amazon Web Services (AWS) Cloud, independent of specific technical roles. Learn AWS core services, security, architecture, and pricing.",
      shortDesc: "Get AWS Cloud Foundation knowledge for the Cloud Practitioner exam.",
      instructor: "AWS Training",
      language: "English",
      level: Level.BEGINNER,
      status: CourseStatus.PUBLISHED,
      price: 0,
      duration: 6,
      lessonsCount: 44,
      hasCertificate: true,
      hasJobSupport: false,
      rating: 4.5,
      reviewCount: 45000,
      enrollmentCount: 2100000,
      skills: ["AWS", "Cloud Computing", "S3", "EC2", "Lambda"],
      platformId: edx.id,
      categoryId: devops.id,
    },
    {
      title: "Python for Data Science, AI & Development",
      description: "This introduction to Python will kickstart your learning of Python for data science, as well as programming in general. This beginner-friendly Python course will take you from zero to programming in Python in a matter of hours.",
      shortDesc: "Learn Python for data science and AI development from IBM.",
      instructor: "IBM Skills Network",
      language: "English",
      level: Level.BEGINNER,
      status: CourseStatus.PUBLISHED,
      price: 49.00,
      duration: 25,
      lessonsCount: 168,
      hasCertificate: true,
      hasJobSupport: true,
      rating: 4.4,
      reviewCount: 73200,
      enrollmentCount: 1100000,
      skills: ["Python", "NumPy", "Pandas", "Jupyter Notebooks"],
      platformId: coursera.id,
      categoryId: dataScience.id,
    },
    {
      title: "Angular: Getting Started",
      description: "Angular is a great TypeScript-based open-source front-end platform for building mobile and desktop web applications. This course will help you get started building Angular applications right away.",
      shortDesc: "Learn Angular from scratch with TypeScript components and services.",
      instructor: "Deborah Kurata",
      language: "English",
      level: Level.BEGINNER,
      status: CourseStatus.PUBLISHED,
      price: 29.00,
      duration: 7,
      lessonsCount: 63,
      hasCertificate: true,
      hasJobSupport: false,
      rating: 4.5,
      reviewCount: 21000,
      enrollmentCount: 89000,
      skills: ["Angular", "TypeScript", "RxJS", "Components"],
      platformId: pluralsight.id,
      categoryId: webDev.id,
    },
    {
      title: "iOS & Swift — The Complete iOS App Development Bootcamp",
      description: "From Beginner to iOS App Developer with Just One Course! Fully Updated with a Comprehensive Module Dedicated to SwiftUI. Build apps for iPhone 15 and iOS 17.",
      shortDesc: "Build iOS apps with Swift and SwiftUI from beginner to developer.",
      instructor: "Dr. Angela Yu",
      language: "English",
      level: Level.BEGINNER,
      status: CourseStatus.PUBLISHED,
      price: 19.99,
      originalPrice: 119.99,
      duration: 55,
      lessonsCount: 395,
      hasCertificate: true,
      hasJobSupport: false,
      rating: 4.8,
      reviewCount: 87600,
      enrollmentCount: 390000,
      skills: ["Swift", "SwiftUI", "Xcode", "iOS", "UIKit"],
      platformId: udemy.id,
      categoryId: mobile.id,
    },
    {
      title: "Google UX Design Professional Certificate",
      description: "Launch your career in UX design. Build job-ready skills for an in-demand career and earn a credential from Google. No degree or previous experience required.",
      shortDesc: "Earn a Google certificate and launch your UX design career.",
      instructor: "Google Career Certificates",
      language: "English",
      level: Level.BEGINNER,
      status: CourseStatus.PUBLISHED,
      price: 49.00,
      duration: 180,
      lessonsCount: 250,
      hasCertificate: true,
      hasJobSupport: true,
      rating: 4.8,
      reviewCount: 115000,
      enrollmentCount: 980000,
      skills: ["UX Design", "Figma", "Wireframing", "Prototyping", "User Research"],
      platformId: coursera.id,
      categoryId: design.id,
    },
  ];

  for (const courseData of coursesData) {
    const slug = slugify(courseData.title, { lower: true, strict: true });
    await prisma.course.upsert({
      where: { slug },
      update: {},
      create: { ...courseData, slug },
    });
  }
  console.log("✅ Courses created");

  // Sample reviews
  const webDevCourse = await prisma.course.findFirst({ where: { slug: { contains: "web-development-bootcamp" } } });
  if (webDevCourse) {
    await prisma.review.upsert({
      where: { userId_courseId: { userId: user.id, courseId: webDevCourse.id } },
      update: {},
      create: {
        userId: user.id,
        courseId: webDevCourse.id,
        rating: 5,
        title: "Best web dev course ever!",
        body: "This course completely transformed my career. Angela's teaching style is incredible. I went from zero coding knowledge to building full-stack applications in just 3 months.",
      },
    });
    console.log("✅ Sample review created");
  }

  console.log("\n🎉 Database seeded successfully!");
  console.log("\nCredentials:");
  console.log("Admin: admin@skillcompare.app / admin123456");
  console.log("User:  demo@skillcompare.app  / user123456");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
