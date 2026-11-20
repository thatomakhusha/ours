export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-5">
      <svg
        aria-hidden="true"
        viewBox="0 0 100 100"
        className="pointer-events-none absolute -right-10 -top-6 w-40 rotate-12 opacity-60"
      >
        <path
          d="M10 90 C 10 40, 50 10, 90 10 C 90 60, 50 90, 10 90 Z"
          fill="none"
          stroke="var(--accent)"
          strokeWidth={1.5}
        />
      </svg>

      <svg
        aria-hidden="true"
        viewBox="0 0 100 100"
        className="pointer-events-none absolute -bottom-8 -left-10 w-44 -rotate-12 opacity-60"
      >
        <path
          d="M10 90 C 10 40, 50 10, 90 10 C 90 60, 50 90, 10 90 Z"
          fill="none"
          stroke="var(--accent)"
          strokeWidth={1.5}
        />
      </svg>

      <div className="relative z-10 w-full">{children}</div>
    </div>
  );
}