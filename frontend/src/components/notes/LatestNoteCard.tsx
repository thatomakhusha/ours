import Link from "next/link";
import { StickyNote as NoteIcon } from "lucide-react";
import StickyNote from "@/components/notes/StickyNote";

type LatestNoteCardProps = {
  from: string;
  text: string;
  createdAt: string;
  isEdited: boolean;
  updatedAt: string;
};

export default function LatestNoteCard({
  from,
  text,
  createdAt,
  isEdited,
  updatedAt,
}: LatestNoteCardProps) {
  return (
    <section className="rounded-3xl bg-card p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[10px] font-extrabold uppercase tracking-widest text-muted">
            A note from {from}
          </p>
          <h2 className="mt-1 font-display text-2xl font-semibold">
            For your morning
          </h2>
        </div>

        <Link
          href="/notes"
          aria-label="Go to notes"
          className="flex size-9 items-center justify-center rounded-full bg-note-hers text-medium-ink"
        >
          <NoteIcon size={16} />
        </Link>
      </div>

      <div className="mt-5">
        <StickyNote text={text} author={from} createdAt={createdAt} isEdited={isEdited} updatedAt={updatedAt}/>
      </div>
    </section>
  );
}