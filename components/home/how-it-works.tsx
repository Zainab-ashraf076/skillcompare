// components/home/how-it-works.tsx
import { Search, GitCompare, CheckCircle } from "lucide-react";

const STEPS = [
  {
    icon: Search,
    title: "Search Courses",
    description: "Browse thousands of courses across Udemy, Coursera, Pluralsight, edX, and more.",
    step: "01",
  },
  {
    icon: GitCompare,
    title: "Add to Comparison",
    description: "Select up to 3 courses and compare them side by side in a detailed table.",
    step: "02",
  },
  {
    icon: CheckCircle,
    title: "Make Your Decision",
    description: "See highlighted best values, ratings, and features at a glance and enroll with confidence.",
    step: "03",
  },
];

export function HowItWorks() {
  return (
    <section className="py-20">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-3">How SkillCompare Works</h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Three simple steps to find and compare the perfect course for your learning goals
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {STEPS.map((step, i) => (
            <div key={step.step} className="text-center relative">
              {i < STEPS.length - 1 && (
                <div className="hidden md:block absolute top-8 left-full w-full h-px bg-gradient-to-r from-border to-transparent -translate-x-1/2 z-0" />
              )}
              <div className="relative z-10">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-5">
                  <step.icon className="w-8 h-8 text-primary" />
                </div>
                <div className="text-xs font-bold text-primary/50 mb-2 uppercase tracking-wider">
                  Step {step.step}
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
