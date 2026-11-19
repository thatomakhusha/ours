import PageHeading from "@/components/layout/PageHeading";
import PriorityBadge from "@/components/ui/PriorityBadge";
import AddButton from "@/components/ui/AddButton";

export default function MyTasksPage() {
  return (
    <>
      <PageHeading
        eyebrow="Just for me"
        title="My tasks"
        subtitle="Tiny steps still count."
        action={<AddButton />}
      />

    </>
  );
}