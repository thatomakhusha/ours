"use client";

import { useEffect, useState } from "react";
import PageHeading from "@/components/layout/PageHeading";
import StickyNote from "@/components/notes/StickyNote";
import { getCurrentUser } from "@/lib/auth/auth";
import { sendNote, updateNote, deleteNote, getSentNotes, getReceivedNotes } from "@/lib/notes/notes";
import type { CurrentUser } from "@/types/users";
import type { Note } from "@/types/notes";
import { ApiError } from "@/lib/api/client";

export default function Notes() {
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [message, setMessage] = useState("");
  const [feedback, setFeedback] = useState("");
  const [editingNoteId, setEditingNoteId] = useState<number | null>(null);
  const [editMessage, setEditMessage] = useState("");
  const [noteToDelete, setNoteToDelete] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    async function loadNotes() {
      try {
        const [user, sentNotes, receivedNotes] = await Promise.all([
          getCurrentUser(),
          getSentNotes(),
          getReceivedNotes(),
        ]);

        setCurrentUser(user);
        setNotes([...sentNotes, ...receivedNotes]);
      } catch (error) {
        console.error("Failed to load Notes page:", error);
        setLoadError("Couldn't load your notes. Please refresh and try again.");
      } finally {
        setIsLoading(false);
      }
    }

    loadNotes();
  }, []);

  const sortedNotes = [...notes].sort(
    (a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  function handleEdit(note: Note) {
    setEditingNoteId(note.noteId);
    setEditMessage(note.content);
  }

  function canEditNote(note: Note): boolean {
    const createdAt = new Date(note.createdAt).getTime();
    const twentyFourHours = 24 * 60 * 60 * 1000;

    return Date.now() < createdAt + twentyFourHours;
  }

  async function handleSave(noteId: number) {
    if (!editMessage.trim()) {
      return;
    }

    setIsSaving(true);

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

      if (error instanceof ApiError) {
        setFeedback(error.message);
      } else {
        setFeedback("Couldn't update your note. Please try again.");
      }
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete(noteId: number) {
    setIsDeleting(true);

    try {
      await deleteNote(noteId);

      const [sentNotes, receivedNotes] = await Promise.all([
        getSentNotes(),
        getReceivedNotes(),
      ]);

      setNotes([...sentNotes, ...receivedNotes]);
      setFeedback("Note deleted successfully!");
      setNoteToDelete(null);
    } catch (error) {
      console.error("Failed to delete note:", error);

      if (error instanceof ApiError) {
        setFeedback(error.message);
      } else {
        setFeedback("Couldn't delete your note. Please try again.");
      }

      setNoteToDelete(null);
    } finally {
      setIsDeleting(false);
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

              setIsSending(true);

              try {
                await sendNote(message.trim());

                const [sentNotes, receivedNotes] = await Promise.all([
                  getSentNotes(),
                  getReceivedNotes(),
                ]);

                setNotes([...sentNotes, ...receivedNotes]);

                setMessage("");
                setFeedback("Note sent successfully!");
              } catch (error) {
                console.error("Failed to send note:", error);

                if (error instanceof ApiError) {
                  setFeedback(error.message);
                } else {
                  setFeedback("Couldn't send your note. Please try again.");
                }
              } finally {
                setIsSending(false);
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
                disabled={!message.trim() || isSending}
                className="rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white disabled:opacity-50"
              >
                {isSending ? "Sending..." : "Leave note"}
              </button>
            </div>
          </form>
        </section>

        <section className="space-y-8 px-2">
          {isLoading ? (
            <p className="py-8 text-center text-sm text-muted">
              Loading your notes...
            </p>
          ) : loadError ? (
            <p className="py-8 text-center text-sm text-red-600">
              {loadError}
            </p>
          ) : currentUser && sortedNotes.length > 0 ? (
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
                        disabled={isSaving}
                        className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white"
                      >
                        {isSaving ? "Saving..." : "Save"}
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setEditingNoteId(null);
                          setEditMessage("");
                        }}
                        disabled={isSaving}
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
                    <div className="mt-2 flex gap-2">
                      {canEditNote(note) && (
                        <button
                          type="button"
                          onClick={() => handleEdit(note)}
                          className="rounded-lg px-3 py-2 text-sm font-semibold text-primary hover:bg-primary/10"
                        >
                          Edit
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => setNoteToDelete(note.noteId)}
                        className="rounded-lg px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50"
                      >
                        Delete
                      </button>
                    </div>
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

      {noteToDelete !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-sm rounded-3xl bg-card p-6 shadow-xl">
            <h2 className="font-display text-xl font-semibold text-ink">
              Delete this note?
            </h2>

            <p className="mt-3 text-sm leading-relaxed text-muted">
              Are you sure you want to delete this note? It will be permanently
              removed for both of you.
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setNoteToDelete(null)}
                disabled={isDeleting}
                className="rounded-xl border border-border px-4 py-2.5 text-sm font-semibold text-ink"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={() => handleDelete(noteToDelete)}
                disabled={isDeleting}
                className="rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700"
              >
                {isDeleting ? "Deleting..." : "Delete note"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}