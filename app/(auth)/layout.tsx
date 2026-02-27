// app/(auth)/layout.tsx
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left decorative panel */}
      <div className="hidden lg:flex flex-col justify-between p-12 bg-gradient-to-br from-brand-700 to-brand-950 text-white">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">SC</span>
          </div>
          <span className="font-bold text-xl">SkillCompare</span>
        </div>

        <div>
          <blockquote className="text-xl font-light leading-relaxed text-white/90 mb-4">
            "SkillCompare helped me choose the right course and save $200. Best decision for my career."
          </blockquote>
          <p className="text-white/60 text-sm">— Sarah M., Software Engineer</p>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {[
            { value: "50K+", label: "Courses" },
            { value: "200K+", label: "Users" },
            { value: "$2M+", label: "Saved" },
          ].map((stat) => (
            <div key={stat.label}>
              <div className="text-2xl font-bold text-white">{stat.value}</div>
              <div className="text-white/60 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Right auth panel */}
      <div className="flex items-center justify-center p-8">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  );
}
