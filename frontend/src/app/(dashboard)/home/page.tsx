
"use client";

import { useEffect, useState } from "react";
import PageHeading from "@/components/layout/PageHeading";
import LatestNoteCard from "@/components/notes/LatestNoteCard";
import { getCurrentUser } from "@/lib/auth/auth";
import { getLatestReceivedNote } from "@/lib/notes/notes";
import type { CurrentUser } from "@/types/users";
import type { Note } from "@/types/notes";

export default function HomePage() {
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [latestNote, setLatestNote] = useState<Note | null>(null);

  useEffect(() => {
    getCurrentUser()
      .then(setCurrentUser)
      .catch((error) => console.error("Failed to load current user:", error));

    getLatestReceivedNote()
      .then(setLatestNote)
      .catch((error) => console.error("Failed to load latest note:", error));
  }, []);

  const hour = new Date().getHours();

  const greeting =
    hour < 12 ? "Morning" : hour < 18 ? "Afternoon" : "Evening";

  return (
    <>
      <PageHeading
        eyebrow={new Date()
          .toLocaleDateString("en-ZA", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
          })
          .toUpperCase()}
        title={`${greeting}, ${currentUser?.displayName || "..."}`}
        subtitle="Here's what's happening in your little world."
      />

      <div className="space-y-4">
        {latestNote && (
          <LatestNoteCard
            from={latestNote.senderDisplayName}
            text={latestNote.content}
            createdAt={latestNote.createdAt}
            isEdited={latestNote.isEdited}
            updatedAt={latestNote.updatedAt}
          />
        )}
      </div>
    </>
  );
}
