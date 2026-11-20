"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Lock } from "lucide-react";

import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { changePassword } from "@/lib/auth/auth";
import { ApiError } from "@/lib/api/client";

export default function ChangePasswordForm() {
  const router = useRouter();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const mismatch =
    confirmPassword !== "" && newPassword !== confirmPassword;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (newPassword !== confirmPassword) {
      setError("Your new passwords don't match.");
      return;
    }

    setIsLoading(true);

    try {
      await changePassword({
        currentPassword,
        newPassword,
      });

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      setSuccess("Your password has been changed successfully.");
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("Unable to change your password. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-sm">
      <Link
        href="/home"
        className="mb-4 inline-flex items-center gap-1 text-sm font-semibold text-primary"
      >
        <ChevronLeft size={16} />
        Back to our space
      </Link>

      <div className="rounded-3xl bg-card p-6 shadow-sm">
        <div className="flex size-11 items-center justify-center rounded-xl bg-low-soft text-primary">
          <Lock size={20} />
        </div>

        <h1 className="mt-4 font-display text-3xl font-semibold">
          Change password
        </h1>

        <p className="mt-2 text-sm text-muted">
          A fresh key for your little space.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <Input
            label="Current password"
            id="current-password"
            type="password"
            autoComplete="current-password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />

          <Input
            label="New password"
            id="new-password"
            type="password"
            autoComplete="new-password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />

          <Input
            label="Confirm new password"
            id="confirm-password"
            type="password"
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            error={mismatch ? "Passwords don't match" : undefined}
          />

          {error && (
            <p className="text-sm text-red-600" role="alert">
              {error}
            </p>
          )}

          {success && (
            <p className="text-sm text-primary" role="status">
              {success}
            </p>
          )}

          <Button
            type="submit"
            fullWidth
            disabled={
              isLoading ||
              mismatch ||
              !currentPassword ||
              !newPassword ||
              !confirmPassword
            }
          >
            {isLoading ? "Saving..." : "Save new password"}
          </Button>
        </form>
      </div>
    </div>
  );
}