import PageHeading from "@/components/layout/PageHeading";
import { Plus } from "lucide-react";
import PriorityBadge from "@/components/ui/PriorityBadge";

export default function MyTasksPage() {
  return (
    <>
      <PageHeading
        eyebrow="Just for me"
        title="My tasks"
        subtitle="Tiny steps still count."
        action={
          <button type="button" aria-label="Add task" className="flex size-11 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-md">
            <Plus size={20} />
          </button>
        }
      />

      <div className="flex gap-2">
        <PriorityBadge priority="HIGH" />
        <PriorityBadge priority="MEDIUM" />
        <PriorityBadge priority="LOW" />
      </div>
    </>
  );
}