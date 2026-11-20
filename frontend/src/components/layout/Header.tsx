"use client"

import { useRouter } from "next/navigation";
import { logout, getCurrentUser  } from "@/lib/auth/auth";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Heart, Lock, LogOut } from "lucide-react";

export default function Header() {
    const [open, setOpen] = useState(false);
    const [displayName, setDisplayName] = useState("");
    const wrapperRef = useRef<HTMLDivElement>(null);
    const initial = displayName
        ? displayName.charAt(0).toUpperCase()
        : "?";

    const router = useRouter();

    async function handleLogout() {
        setOpen(false);

        try {
            await logout();
            router.replace("/login");
            router.refresh();
        } catch {
            console.error("Unable to log out. Please try again.");
        }
    }

    useEffect(() => {
        let isMounted = true;

        async function loadUser() {
            try {
                const currentUser = await getCurrentUser();

                if (isMounted) {
                    setDisplayName(currentUser.displayName);
                }
            } catch (error) {
                console.error("Unable to load user details:", error);
            }
        }

        loadUser();

        return () => {
            isMounted = false;
        };
    }, []);

    useEffect(() => {
        function handlePointerDown(e: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        }

        function handleKeyDown(e: KeyboardEvent) {
            if (e.key === "Escape") setOpen(false);
        }

        document.addEventListener("mousedown", handlePointerDown);
        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("mousedown", handlePointerDown);
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, []);

    return (
        <header className="flex items-center justify-between px-5 pt-5">
            <Link href="/" className="flex items-center gap-2">
                <span className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                    <Heart size={18} />
                </span>
                <span className="font-display text-xl font-semibold">Ours</span>
            </Link>

            <div className="relative" ref={wrapperRef}>
                <button
                    type="button"
                    onClick={() => setOpen(!open)}
                    aria-haspopup="menu"
                    aria-expanded={open}
                    className="flex size-10 items-center justify-center rounded-full bg-accent font-bold text-accent-foreground"
                >
                    {initial}
                </button>

                {open && (
                    <div
                        role="menu"
                        className="absolute right-0 top-12 z-30 w-64 rounded-2xl bg-card p-2 shadow-lg"
                    >
                        <div className="flex items-center gap-3 px-3 py-2">
                            <span className="flex size-10 items-center justify-center rounded-full bg-accent font-bold text-accent-foreground">
                                {initial}
                            </span>
                            <div>
                                <p className="text-sm font-bold">{displayName || "Loading..."}</p>
                                <p className="text-xs text-muted">Sharing with your partner</p>
                            </div>
                        </div>

                        <hr className="my-2 border-border/40" />

                        <Link
                            href="/change-password"
                            onClick={() => setOpen(false)}
                            className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold"
                        >
                            <Lock size={16} />
                            Change password
                        </Link>

                        <button
                            type="button"
                            onClick={handleLogout}
                            className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-high-ink"
                        >
                            <LogOut size={16} />
                            Log out
                        </button>
                    </div>
                )}
            </div>
        </header>
    )
}