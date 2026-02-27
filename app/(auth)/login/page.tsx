// app/(auth)/login/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { LoginForm } from "@/components/auth/login-form";
import { OAuthButtons } from "@/components/auth/oauth-buttons";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to your SkillCompare account",
};

export default function LoginPage({
  searchParams,
}: {
  searchParams: { callbackUrl?: string; error?: string };
}) {
  return (
    <div className="space-y-8">
      <div>
        <Link
          href="/"
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <span className="text-xl">←</span>
          <span className="text-sm">Back to home</span>
        </Link>
        <h1 className="text-2xl font-bold text-foreground">Welcome back</h1>
        <p className="text-muted-foreground mt-1">
          Sign in to your account to continue
        </p>
      </div>

      {searchParams.error && (
        <div className="bg-destructive/10 text-destructive text-sm px-4 py-3 rounded-xl">
          {searchParams.error === "CredentialsSignin"
            ? "Invalid email or password"
            : "An error occurred. Please try again."}
        </div>
      )}

      <OAuthButtons callbackUrl={searchParams.callbackUrl} />

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs text-muted-foreground">
          <span className="bg-background px-2">Or continue with email</span>
        </div>
      </div>

      <LoginForm callbackUrl={searchParams.callbackUrl} />

      <p className="text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="text-primary hover:underline font-medium">
          Create one
        </Link>
      </p>
    </div>
  );
}
