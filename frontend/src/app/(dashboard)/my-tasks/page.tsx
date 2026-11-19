import PageHeading from "@/components/layout/PageHeading";
import { Plus } from "lucide-react";

export default function MyTasksPage() {
  return (
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
  );
}