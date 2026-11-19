import { useId } from "react";
import type { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export default function Input({
  label,
  error,
  helperText,
  id,
  className = "",
  ...props
}: InputProps) {
    const generatedId = useId();
    const inputId = id ?? props.name ?? generatedId;

  return (
    <div className="w-full space-y-2">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-foreground"
        >
          {label}
        </label>
      )}

      <input
        id={inputId}
        aria-invalid={!!error}
        aria-describedby={
          error
            ? `${inputId}-error`
            : helperText
              ? `${inputId}-helper`
              : undefined
        }
        className={`w-full rounded-full border bg-background px-5 py-3 text-sm text-foreground outline-none transition placeholder:text-foreground/50 focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50 ${
          error ? "border-red-600 focus:border-red-600 focus:ring-red-600/20" : "border-border"
        } ${className}`}
        {...props}
      />

      {error && (
        <p
          id={`${inputId}-error`}
          className="text-sm text-red-600"
          role="alert"
        >
          {error}
        </p>
      )}

      {!error && helperText && (
        <p
          id={`${inputId}-helper`}
          className="text-sm text-foreground/60"
        >
          {helperText}
        </p>
      )}
    </div>
  );
}
