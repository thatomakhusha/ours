
"use client";

import { useEffect, useState } from "react";
import PageHeading from "@/components/layout/PageHeading";
import { getCurrentUser } from "@/lib/auth/auth";
import type { CurrentUser } from "@/types/users";

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
      eyebrow={new Date().toLocaleDateString("en-ZA", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      }).toUpperCase()}
      title={`${greeting}, ${currentUser?.displayName || "..."}`}
      subtitle="Here's what's happening in your little world."
    />
  );
}
