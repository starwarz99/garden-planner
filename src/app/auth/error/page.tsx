"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function ErrorContent() {
  const params = useSearchParams();
  const error = params.get("error");

  const errorMessages: Record<string, string> = {
    Configuration: "Server configuration error. Please contact support.",
    AccessDenied: "You don't have permission to sign in.",
    Verification: "The sign-in link is no longer valid.",
    Default: "An authentication error occurred.",
  };

  return (
    <div className="min-h-screen bg-mint/30 flex items-center justify-center px-4">
      <div className="card max-w-md w-full text-center">
        <div className="text-5xl mb-4">🌧️</div>
        <h1 className="text-2xl font-serif font-bold text-gray-900 mb-2">Sign-in Error</h1>
        <p className="text-gray-600 mb-6">
          {errorMessages[error ?? "Default"] ?? errorMessages.Default}
        </p>
        <Link
          href="/auth/signin"
          className="inline-block px-6 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 transition-colors"
        >
          Try Again
        </Link>
      </div>
    </div>
  );
}

export default function AuthErrorPage() {
  return (
    <Suspense>
      <ErrorContent />
    </Suspense>
  );
}
