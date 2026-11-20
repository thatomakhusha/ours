import { useId, type InputHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
};

export default function Input({
  label,
  error,
  id,
  className = "",
  ...props
}: InputProps) {
  const generatedId = useId();
  const inputId = id ?? props.name ?? generatedId;    
  const errorId = `${inputId}-error`;

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={inputId} className="text-sm font-bold text-foreground">
        {label}
      </label>
      <input
        id={inputId}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        className={`w-full rounded-2xl border bg-background/60 px-4 py-3 text-base text-foreground transition placeholder:text-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring ${error ? "border-high-ink" : "border-input"} ${className}`}
        {...props}
      />
      {error && (
        <p id={errorId} role="alert" className="text-sm text-high-ink">
          {error}
        </p>
      )}
    </div>
  );
}