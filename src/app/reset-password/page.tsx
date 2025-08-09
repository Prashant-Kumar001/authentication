"use client";

import React, { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import Loader from "@/components/Loader";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const ChangePasswordForm: React.FC = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") as string;

  const router = useRouter();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!token) {
      setError("Invalid or missing token.");
      return;
    }

    if (!newPassword || newPassword.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post("/api/auth/change-password", {
        token,
        newPassword,
      });
      setMessage(res.data?.message || "Password updated successfully.");
      setNewPassword("");
      setConfirmPassword("");
      toast.success(res.data?.message || "Password updated successfully.");
      router.push("/signin");
    } catch {
      setError("Failed to update password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      {loading && <Loader />}
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow">
        <h1 className="text-2xl font-semibold mb-2">Change Password</h1>
        <p className="text-sm text-gray-600 mb-6">
          Enter your new password below.
        </p>

        <form onSubmit={handleSubmit}>
          <label
            className="block text-sm font-medium mb-1"
            htmlFor="newPassword"
          >
            New Password
          </label>
          <input
            id="newPassword"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="••••••••"
            required
            className="w-full px-3 py-2 border border-gray-200 rounded-3xl focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500 duration-300 ease-in-out mb-4"
          />

          <label
            className="block text-sm font-medium mb-1"
            htmlFor="confirmPassword"
          >
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="••••••••"
            required
            className="w-full px-3 py-2 border border-gray-200 rounded-3xl focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500 duration-300 ease-in-out mb-4"
          />

          <button
            className="w-full bg-purple-500 hover:bg-purple-600 text-white py-2 rounded-3xl"
            type="submit"
            disabled={loading}
          >
            {loading ? "Updating…" : "Update Password"}
          </button>
        </form>

        {message && (
          <p className="mt-4 text-sm text-green-700" role="status">
            {message}
          </p>
        )}
        {error && (
          <p className="mt-4 text-sm text-red-700" role="alert">
            {error}
          </p>
        )}
      </div>
    </main>
  );
};

export default function ChangePasswordPage() {
  return (
    <Suspense fallback={<Loader />}>
      <ChangePasswordForm />
    </Suspense>
  );
}
