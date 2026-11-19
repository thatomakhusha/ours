import { Plus } from "lucide-react";

type AddButtonProps = {
  label?: string;
  onClick?: () => void;
};

export default function AddButton({ label = "Add task", onClick }: AddButtonProps) {
  return ( 
    <button type="button" aria-label={label} onClick={onClick} className="flex size-11 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-md transition-transform active:scale-95">
        <Plus size={20}/>
    </button>
   );
}