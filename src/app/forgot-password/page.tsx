"use client";

import React, { useState } from "react";
import axios from "axios";
import Loader from "@/components/Loader";
import toast from "react-hot-toast";

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const validateEmail = (e: string) => /\S+@\S+\.\S+/.test(e);

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    setError("");
    setMessage("");

    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post("/api/auth/forgot-password", { email });
      toast(res.data.message || "password reset link sent to your email");
      setMessage(
        res.data?.message ||
        "password reset link sent to your email"
      );
      setEmail("");
    } catch (err) {
      console.log(err)
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      {loading && <Loader />}
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow">
        <h1 className="text-2xl font-semibold mb-2">Forgot your password</h1>
        <p className="text-sm text-gray-600 mb-6">
          Enter the email associated with your account and we&apos;ll send a
          link to reset your password.
        </p>

        <form onSubmit={handleSubmit} aria-label="forgot-password-form">
          {message && (
            <p
              role="status"
              className="mb-4 bg-green-100 rounded-lg py-5 px-6 text-sm text-green-700"
            >
              {message}
            </p>
          )}
          {error && (
            <p
              role="alert"
              className="mb-4 bg-red-100 rounded-lg py-5 px-6 text-sm text-red-700"
            >
              {error}
            </p>
          )}
          <label className="block text-sm font-medium mb-1" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            className="w-full px-3 py-2 border border-gray-200 rounded-3xl focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500 duration-300 ease-in-out mb-5"
            aria-required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 rounded-2xl   bg-purple-600 text-white font-medium disabled:opacity-60"
            aria-busy={loading}
          >
            {loading ? "Sending…" : "Send reset link"}
          </button>
        </form>

        <p className="mt-6 text-xs text-gray-500">
          If you don&apos;t receive an email, check your spam folder or try
          again later.
        </p>
      </div>
    </main>
  );
};

export default ForgotPasswordPage;
