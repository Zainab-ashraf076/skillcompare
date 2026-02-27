// components/home/trust-bar.tsx
export function TrustBar() {
  const stats = [
    { value: "50K+", label: "Courses indexed" },
    { value: "12", label: "Platforms covered" },
    { value: "200K+", label: "Users helped" },
    { value: "$2M+", label: "Saved by users" },
  ];

  return (
    <div className="border-y border-border bg-muted/30">
      <div className="container py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl font-bold text-foreground">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
