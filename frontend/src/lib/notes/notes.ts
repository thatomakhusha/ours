import { apiRequest } from "@/lib/api/client";
import type { Note } from "@/types/notes";

export function getLatestReceivedNote(): Promise<Note | null> {
  return apiRequest<Note | null>("/api/notes/latest");
}

export function sendNote(content: string): Promise<Note> {
  return apiRequest<Note>("/api/notes", {
    method: "POST",
    body: JSON.stringify({ content }),
  });
}