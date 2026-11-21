"use client";

import { useEffect, useState } from "react";
import PageHeading from "@/components/layout/PageHeading";
import StickyNote from "@/components/notes/StickyNote";
import { getCurrentUser } from "@/lib/auth/auth";
import { getLatestReceivedNote, sendNote } from "@/lib/notes/notes";
import type { CurrentUser } from "@/types/users";
import type { Note } from "@/types/notes";

export default function Notes() {
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [latestNote, setLatestNote] = useState<Note | null>(null);
  const [message, setMessage] = useState("");
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    getCurrentUser()
      .then(setCurrentUser)
      .catch((error) => console.error("Failed to load user:", error));

    getLatestReceivedNote()
      .then(setLatestNote)
      .catch((error) => console.error("Failed to load note:", error));
  }, []);

  return (
    <>
      <PageHeading
        eyebrow="Left with love"
        title="Notes"
        subtitle="Little things worth saying."
      />

      <div className="space-y-8">
        <section className="rounded-3xl bg-card p-5 shadow-sm">
          <form
            onSubmit={async (event) => {
              event.preventDefault();
              try {
                await sendNote(message.trim());
                setMessage("");
                setFeedback("Note sent successfully!");
              } catch(error) {
                console.error("Failed to send note:", error);
                setFeedback("Couldn't send your note. Please try again.");
              }
            }}
          >
            <h2 className="font-semibold text-ink">
              Leave your partner a note
            </h2>

            <textarea
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              placeholder="Write something lovely..."
              rows={3}
              maxLength={500}
              className="mt-4 w-full resize-none rounded-2xl border border-border bg-background p-4 text-sm text-ink outline-none placeholder:text-muted focus:border-primary"
            />
            {feedback && <p>{feedback}</p>}
            <div className="mt-4 flex items-center justify-between">
              <p className="text-xs text-muted">
                It'll be signed from you.
              </p>

              <button
                type="submit"
                disabled={!message.trim()}
                className="rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white disabled:opacity-50"
              >
                Leave note
              </button>
            </div>
          </form>
        </section>

        <section className="space-y-8 px-2">
          {latestNote && currentUser && (
            <StickyNote
              text={latestNote.content}
              author={latestNote.senderDisplayName}
              tone={
                latestNote.senderId === currentUser.userId
                  ? "his"
                  : "hers"
              }
            />
          )}

          {!latestNote && (
            <p className="py-8 text-center text-sm text-muted">
              No notes to show just yet.
            </p>
          )}
        </section>
      </div>
    </>
  );
}
