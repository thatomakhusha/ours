type StickyNoteProps = {
  text: string;
  author: string;
  tone?: "hers" | "his";
};

const tones = {
  hers: "bg-note-hers",
  his: "bg-note-his",
};

export default function StickyNote({
  text,
  author,
  tone = "hers",
}: StickyNoteProps) {
  return (
    <div
      className={`relative -rotate-1 rounded-sm px-6 pb-4 pt-8 shadow-md ${tones[tone]}`}
    >
      <span
        aria-hidden="true"
        className="absolute -top-3 left-1/2 h-6 w-20 -translate-x-1/2 bg-tape/50"
      />
      <p className="font-hand text-2xl leading-snug">{text}</p>
      <p className="mt-3 text-right font-hand text-lg text-muted">
        — {author}
      </p>
    </div>
  );
}