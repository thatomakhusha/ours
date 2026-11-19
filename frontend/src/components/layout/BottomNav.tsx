"use client"

import Link from "next/link";
import { usePathname } from "next/navigation";
import { House, Check, Heart, StickyNote } from "lucide-react";
import type { LucideIcon } from "lucide-react";

type Tab = {
  label: string;
  href: string;
  icon: LucideIcon;
  matches: (pathname: string) => boolean;
};

const tabs: Tab[] = [
  { label: "Home", href: "/", icon: House, matches: (p) => p === "/" },
  { label: "My tasks", href: "/tasks", icon: Check, matches: (p) => p.startsWith("/tasks") },
  { label: "Ours", href: "/ours", icon: Heart, matches: (p) => p.startsWith("/ours") },
  { label: "Notes", href: "/notes", icon: StickyNote, matches: (p) => p.startsWith("/notes") },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Main"
      className="fixed inset-x-0 bottom-0 z-20 border-t border-border/40 bg-card/95 backdrop-blur"
    >
      <ul className="mx-auto flex max-w-md items-center justify-around px-4 pb-[env(safe-area-inset-bottom)] pt-2">
        {tabs.map((tab) => {
          const active = tab.matches(pathname);
          const Icon = tab.icon;

          return (
            <li key={tab.href}>
              <Link
                href={tab.href}
                aria-current={active ? "page" : undefined}
                className="flex flex-col items-center gap-1 py-1"
              >
                <span
                  className={`flex items-center justify-center rounded-full px-4 py-1.5 transition-colors ${
                    active ? "bg-low-soft text-primary" : "text-muted"
                  }`}
                >
                  <Icon size={18} strokeWidth={2} />
                </span>
                <span
                  className={`text-[11px] font-bold ${
                    active ? "text-primary" : "text-muted"
                  }`}
                >
                  {tab.label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}