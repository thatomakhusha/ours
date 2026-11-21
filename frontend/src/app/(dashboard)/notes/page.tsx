"use client";

import { useEffect, useState } from "react";
import PageHeading from "@/components/layout/PageHeading";
import StickyNote from "@/components/notes/StickyNote";
import { getCurrentUser } from "@/lib/auth/auth";
import { sendNote, updateNote, getSentNotes, getReceivedNotes } from "@/lib/notes/notes";
import type { CurrentUser } from "@/types/users";
import type { Note } from "@/types/notes";

export default function Notes() {
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [message, setMessage] = useState("");
  const [feedback, setFeedback] = useState("");
  const [editingNoteId, setEditingNoteId] = useState<number | null>(null);
  const [editMessage, setEditMessage] = useState("");

  useEffect(() => {
      getCurrentUser()
        .then(setCurrentUser)
        .catch((error) => console.error("Failed to load user:", error));

      Promise.all([getSentNotes(), getReceivedNotes()])
        .then(([sentNotes, receivedNotes]) => {
          setNotes([...sentNotes, ...receivedNotes]);
        })
        .catch((error) => console.error("Failed to load notes:", error));
    }, []);

  const sortedNotes = [...notes].sort(
    (a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  function handleEdit(note: Note) {
    setEditingNoteId(note.noteId);
    setEditMessage(note.content);
  }

  async function handleSave(noteId: number) {
    if (!editMessage.trim()) {
      return;
    }

    try {
      await updateNote(noteId, editMessage.trim());

      const [sentNotes, receivedNotes] = await Promise.all([
        getSentNotes(),
        getReceivedNotes(),
      ]);

      setNotes([...sentNotes, ...receivedNotes]);
      setEditingNoteId(null);
      setEditMessage("");
      setFeedback("Note updated successfully!");
    } catch (error) {
      console.error("Failed to update note:", error);
      setFeedback("Couldn't update your note. Please try again.");
    }
  }

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

                const [sentNotes, receivedNotes] = await Promise.all([
                  getSentNotes(),
                  getReceivedNotes(),
                ]);

                setNotes([...sentNotes, ...receivedNotes]);

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
          {currentUser && sortedNotes.length > 0 ? (
            sortedNotes.map((note) => (
              <div key={note.noteId}>
                {editingNoteId === note.noteId ? (
                  <>
                    <textarea
                      value={editMessage}
                      onChange={(event) => setEditMessage(event.target.value)}
                      placeholder="Edit your note..."
                      rows={3}
                      maxLength={500}
                      className="w-full resize-none rounded-2xl border border-border bg-background p-4 text-sm text-ink outline-none placeholder:text-muted focus:border-primary"
                    />

                    

                    <div className="mt-3 flex gap-2">
                      <button
                        type="button"
                        onClick={() => handleSave(note.noteId)}
                        className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white"
                      >
                        Save
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setEditingNoteId(null);
                          setEditMessage("");
                        }}
                        className="rounded-xl border border-border px-4 py-2 text-sm font-semibold text-ink"
                      >
                        Cancel
                      </button>
                    </div>
                  </>
                ) : (
                  <StickyNote
                    text={note.content}
                    author={note.senderDisplayName}
                    createdAt={note.createdAt}
                    isEdited={note.isEdited}
                    updatedAt={note.updatedAt}
                    tone={note.senderId === currentUser.userId ? "his" : "hers"}
                  />
                )}
                {note.senderId === currentUser.userId &&
                  editingNoteId !== note.noteId && (
                    <button
                      type="button"
                      onClick={() => handleEdit(note)}
                      className="mt-2 rounded-lg px-3 py-2 text-sm font-semibold text-primary hover:bg-primary/10"
                    >
                      Edit
                    </button>
                )}
              </div>
            ))
          ) : (
            <p className="py-8 text-center text-sm text-muted">
              No notes to show just yet.
            </p>
          )}
        </section>
      </div>
    </>
  );
}
