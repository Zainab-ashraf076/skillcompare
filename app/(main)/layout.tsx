// app/(main)/layout.tsx
import { Navbar } from "@/components/layout/navbar";
import { ComparisonBar } from "@/components/comparison/comparison-bar";
import { auth } from "@/auth";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar session={session} />
      <main className="flex-1">{children}</main>
      <ComparisonBar />
    </div>
  );
}
