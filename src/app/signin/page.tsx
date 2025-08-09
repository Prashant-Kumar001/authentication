"use client";

import React, { useState } from "react";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Loader from "@/components/Loader";
import toast from "react-hot-toast";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {

    if(!email || !password){
      setError("All fields are required");
      toast.error("All fields are required");
      return;
    }
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      const res = await axios.post("/api/auth/signin", { email, password });
      setSuccess(res.data.message);
      setEmail("");
      setPassword("");
      toast.success(res.data.message);
      router.push("/profile");
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(
          err.response?.data?.error || err.message || "Failed to logout"
        );
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to load profile");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen font-sans flex items-center justify-center ">
      {loading && <Loader />}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-xl w-full max-w-sm space-y-6"
      >
        {error && (
          <div className="bg-red-100 text-red-700 p-2 rounded">{error}</div>
        )}
        {success && (
          <div className="bg-green-100 text-green-700 p-2 rounded">
            {success}
          </div>
        )}
        <div>
          <label className="block text-gray-600 mb-1">email</label>
          <input
            type="email"
            required
            className="w-full px-3 py-2 border border-gray-200 rounded-3xl focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500 duration-300 ease-in-out"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
          />
        </div>
        <div>
          <label className="block text-gray-600 mb-1">password</label>
          <input
            type="password"
            required
            className="w-full px-3 py-2 border border-gray-200 rounded-3xl focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500 duration-300 ease-in-out"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Your password"
          />
          <p>
            <Link
              href="/forgot-password"
              className="text-purple-600 text-[13px] font-bold hover:underline"
            >
              Forgot password?
            </Link>
          </p>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-purple-600 text-white font-bold py-2 rounded-2xl hover:bg-purple-700 transition"
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>
        <p className="text-center text-gray-600">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-purple-600 hover:underline">
            Sign Up
          </Link>
        </p>
      </form>
    </div>
  );
}
