"use client";

import { useState } from "react";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Loader from "@/components/Loader";
import toast from "react-hot-toast";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!name || !email || !password) {
      setError("All fields are required");
      toast.error("All fields are required");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      toast.error("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post("/api/auth/signup", {
        name,
        email,
        password,
      });
      setSuccess(res.data.message);
      setName("");
      setEmail("");
      setPassword("");
      toast.success(res.data.message);
      router.push("/signin");

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
        <h2 className="text-2xl font-bold text-center text-gray-800">Register</h2>
        {error && (
          <div className="bg-red-100 text-red-700 p-2 rounded">{error}</div>
        )}
        {success && (
          <div className="bg-green-100 text-green-700 p-2 rounded">
            {success}
          </div>
        )}
        <div>
          <label className="block text-gray-600 mb-1">name</label>
          <input
            type="text"
            required
            className="w-full px-3 py-2 border border-gray-200 rounded-3xl focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500 duration-300 ease-in-out"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your Name"
          />
        </div>
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
            placeholder="Password (min 6 chars)"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-purple-600 text-white font-bold py-2 rounded-2xl hover:bg-purple-700 transition"
        >
          {loading ? "Creating Account..." : "Sign Up"}
        </button>
        <p className="text-center text-gray-600">
          Already have an account?{" "}
          <Link href="/signin" className="text-purple-600 hover:underline">
            Sign In
          </Link>
        </p>
      </form>
    </div>
  );
}
