"use client"

import { useState } from "react";
import Link from "next/link";
import { Heart, ChevronRight } from "lucide-react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
  }

  return (
    <div className="mx-auto w-full max-w-sm">
      <div className="text-center">
        <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-md">
          <Heart size={26} />
        </div>
        <h1 className="mt-4 font-display text-4xl font-semibold">Ours</h1>
        <p className="mt-1 text-sm text-muted">A little space for our life.</p>
      </div>

      <div className="mt-8 rounded-3xl bg-card p-6 shadow-sm">
        <h2 className="font-display text-3xl font-semibold">Welcome back</h2>
        <p className="mt-2 text-sm text-muted">
          Come in, your little corner is waiting.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <Input
            label="Email"
            id="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Input
            label="Password"
            id="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button type="submit" fullWidth>
            Come on in
            <ChevronRight size={18} />
          </Button>
        </form>

        <div className="mt-5 text-center">
          <Link
            href="/forgot-password"
            className="text-sm font-semibold text-primary"
          >
            Forgot your password?
          </Link>
        </div>
      </div>

      <p className="mt-8 text-center text-xs text-muted">
        Private, quiet, and just for two.
      </p>
    </div>
  );
}