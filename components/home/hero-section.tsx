// components/home/hero-section.tsx
"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Star } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden py-20 md:py-28">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-50 via-white to-blue-50 dark:from-brand-950/20 dark:via-background dark:to-background -z-10" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-brand-100 dark:bg-brand-900/20 rounded-full blur-3xl opacity-50 -z-10" />

      <div className="container">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium"
          >
            <Star className="w-3.5 h-3.5 fill-current" />
            Compare 50,000+ courses from top platforms
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-bold text-foreground leading-tight tracking-tight"
          >
            Find the{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-brand-400">
              perfect course
            </span>{" "}
            for your goals
          </motion.h1>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto leading-relaxed"
          >
            Compare courses side-by-side from Udemy, Coursera, Pluralsight, and more.
            Make smarter learning decisions in minutes.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3"
          >
            <Link
              href="/courses"
              className="flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 px-7 py-3.5 rounded-xl font-semibold transition-all hover:scale-105 text-sm shadow-lg shadow-primary/25"
            >
              Browse Courses
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/compare"
              className="flex items-center gap-2 bg-background text-foreground hover:bg-muted border border-border px-7 py-3.5 rounded-xl font-semibold transition-colors text-sm"
            >
              Start Comparing
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
