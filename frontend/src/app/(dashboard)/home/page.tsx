
"use client";

import { useEffect, useState } from "react";
import PageHeading from "@/components/layout/PageHeading";
import { getCurrentUser } from "@/lib/auth/auth";
import type { CurrentUser } from "@/types/user";

export default function HomePage() {
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);

  useEffect(() => {
    getCurrentUser()
      .then(setCurrentUser)
      .catch((error) => console.error("Failed to load current user:", error));
  }, []);

  const hour = new Date().getHours();

  const greeting =
    hour < 12 ? "Morning" : hour < 18 ? "Afternoon" : "Evening";

  return (
    <PageHeading
      eyebrow="today's date"
      title={`${greeting}, ${currentUser?.displayName || "..."}`}
      subtitle="Here's what's happening in your little world."
    />
  );
}
