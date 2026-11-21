type StickyNoteProps = {
  text: string;
  author: string;
  createdAt: string;
  tone?: "hers" | "his";
};

const tones = {
  hers: "bg-note-hers",
  his: "bg-note-his",
};

function formatNoteDate(createdAt: string): string {
  const noteDate = new Date(createdAt);
  const today = new Date();
  const isToday = noteDate.toDateString() === today.toDateString();

  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  const isYesterday = noteDate.toDateString() === yesterday.toDateString();

  const time = noteDate.toLocaleTimeString("en-ZA", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  if (isToday) {
    return `Today, ${time}`;
  }

  if (isYesterday) {
    return `Yesterday, ${time}`;
  }

  const date = noteDate.toLocaleDateString("en-ZA", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return `${date}, ${time}`;
}

export default function StickyNote({
  text,
  author,
  createdAt,
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
      <div className="mt-3 flex items-center justify-between">
        <p className="text-xs text-muted">
          {formatNoteDate(createdAt)}
        </p>
        <p className="text-right font-hand text-lg text-muted">
          — {author}
        </p>
      </div>
    </div>
  );
}