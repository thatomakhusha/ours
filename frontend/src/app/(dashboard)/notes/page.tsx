
"use client";

import { useState } from "react";
import PageHeading from "@/components/layout/PageHeading";
import StickyNote from "@/components/notes/StickyNote";

type NoteItem = {
  id: number;
  text: string;
  author: string;
  tone: "hers" | "his";
};

const sampleNotes: NoteItem[] = [
  {
    id: 1,
    text: "Good luck with your presentation today. You'll be brilliant (as always). Dinner's on me tonight x",
    author: "Leo",
    tone: "hers",
  },
  {
    id: 2,
    text: "I put the good coffee aside for your early start. Have a gentle day x",
    author: "Anna",
    tone: "his",
  },
];

export default function Notes() {
  const [notes, setNotes] = useState<NoteItem[]>(sampleNotes);
  const [message, setMessage] = useState("");

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedMessage = message.trim();

    if (!trimmedMessage) return;

    const newNote: NoteItem = {
      id: Date.now(),
      text: trimmedMessage,
      author: "You",
      tone: "his",
    };

    setNotes((previousNotes) => [newNote, ...previousNotes]);
    setMessage("");
  }

  return (
    <>
      <PageHeading
        eyebrow="Left with love"
        title="Notes"
        subtitle="Little things worth saying."
      />

      <div className="space-y-8">
        {/* Write a note */}
        <section className="rounded-3xl bg-card p-5 shadow-sm">
          <form onSubmit={handleSubmit}>
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

            <div className="mt-4 flex items-center justify-between gap-3">
              <p className="text-xs text-muted">
                It'll be signed from you.
              </p>

              <button
                type="submit"
                disabled={!message.trim()}
                className="rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white transition-opacity disabled:cursor-not-allowed disabled:opacity-50"
              >
                Leave note
              </button>
            </div>
          </form>
        </section>

        {/* Notes feed */}
        <section className="space-y-8 px-2">
          {notes.map((note) => (
            <StickyNote
              key={note.id}
              text={note.text}
              author={note.author}
              tone={note.tone}
            />
          ))}
        </section>
      </div>
    </>
  );
}
