"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { getCurrentUser } from "@/lib/auth/auth";
import { ApiError } from "@/lib/api/client";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function checkAuthentication() {
      try {
        await getCurrentUser();

        if (isMounted) {
          setIsChecking(false);
        }
      } catch (error) {
        if (!isMounted) return;

        if (error instanceof ApiError && error.status === 401) {
          router.replace("/login");
          return;
        }

        setHasError(true);
        setIsChecking(false);
      }
    }

    checkAuthentication();

    return () => {
      isMounted = false;
    };
  }, [router]);

  if (isChecking) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-sm text-muted">Opening your space...</p>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="flex min-h-screen items-center justify-center px-5">
        <p className="text-center text-sm text-muted">
          We couldn't connect to Ours. Please try again.
        </p>
      </div>
    );
  }

  return <>{children}</>;
}