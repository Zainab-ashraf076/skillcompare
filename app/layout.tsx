// app/layout.tsx
import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Toaster } from "sonner";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "SkillCompare — Compare Online Courses Side by Side",
    template: "%s | SkillCompare",
  },
  description:
    "Find and compare the best online courses from Udemy, Coursera, Pluralsight, and more. Make smarter learning decisions.",
  keywords: ["online courses", "course comparison", "e-learning", "Udemy", "Coursera"],
  authors: [{ name: "SkillCompare" }],
  creator: "SkillCompare",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://skillcompare.app",
    title: "SkillCompare — Compare Online Courses Side by Side",
    description: "Find and compare the best online courses. Make smarter learning decisions.",
    siteName: "SkillCompare",
  },
  twitter: {
    card: "summary_large_image",
    title: "SkillCompare",
    description: "Compare online courses side by side",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${GeistSans.variable} ${GeistMono.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster position="bottom-right" richColors closeButton />
        </ThemeProvider>
      </body>
    </html>
  );
}
