import type { Priority } from "@/types/tasks";

type PriorityBadgeProps = {
  priority: Priority;
};

const priorityStyles: Record<Priority, string> = {
  HIGH: "bg-high-soft text-high-ink",
  MEDIUM: "bg-medium-soft text-medium-ink",
  LOW: "bg-low-soft text-low-ink",
};

export default function PriorityBadge({ priority }: PriorityBadgeProps) {
  return ( 
    <span className={`rounded-full px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wide ${priorityStyles[priority]}`}>
        {priority}
    </span>
   );
}
