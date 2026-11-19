import type { ReactNode } from "react";

type PageHeadingProps = {
    eyebrow: string;
    title: string;
    subtitle: string;
    action?: ReactNode;
    variant?: "label" | "date";
};

const eyebrowStyles = {
  label: "text-[10px] font-extrabold uppercase tracking-widest text-muted",
  date: "text-xs font-bold text-secondary",
};

export default function PageHeading({
    eyebrow,
    title,
    subtitle,
    action,
    variant = "label",
}: PageHeadingProps) {

    return (
        <header className="mb-6 flex items-start justify-between gap-4">
            <div>
                <p className={eyebrowStyles[variant]}>
                    {eyebrow}
                </p>

                <h1 className="mt-2 font-display text-4xl font-semibold leading-tight">
                    {title}
                </h1>

                <p className="mt-2 text-sm text-muted">
                    {subtitle}
                </p>
            </div>

            <div className="shrink-0">
                {action}
            </div>
        </header>
    )
}