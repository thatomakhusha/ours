import PageHeading from "@/components/layout/PageHeading";
import AddButton from "@/components/ui/AddButton";
export default function SharedTasks() {
  return (
    <PageHeading
      eyebrow="Better together"
      title="Our tasks"
      subtitle="The list we share, the life we make."
      action={<AddButton />}
    />
  );
}