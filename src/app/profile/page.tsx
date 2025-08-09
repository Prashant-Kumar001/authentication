"use client";

import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { User } from "@/types";
import Link from "next/link";
import Loader from "@/components/Loader";

const Profile = () => {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [error, setError] = useState("");

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/user/me");
      const userData = res.data.user ?? res.data;
      setUser(userData);
      setError("");
      toast.success("Profile loaded");
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(
          err.response?.data?.error || err.message || "Failed to load profile"
        );
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to load profile");
      }
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await axios.get("/api/auth/logout");
      toast.success("Logout successful");
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
      setUser(null);
    }
  };

  const sendVerificationEmail = async () => {
    try {
      setLoading2(true);
      await axios.post("/api/send-email");
      toast.success(" link has been sent to your email");
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
      setLoading2(false);
    }
  };

  return (
    <main>
      {loading2 && <Loader />}
      <div className="min-h-screen font-normal bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white shadow-lg rounded-2xl max-w-lg w-full p-6 text-center">
          <h1 className="text-2xl font-semibold text-gray-800">User Profile</h1>
          <p className="text-gray-500 text-sm mb-6">
            Manage your account information here
          </p>

          {!user && (
            <button
              onClick={fetchProfile}
              disabled={loading}
              className="bg-purple-500 text-white px-6 py-2 rounded-lg hover:bg-purple-600 disabled:bg-blue-300 transition"
            >
              {loading ? "Loading..." : "Load Profile"}
            </button>
          )}

          {error && <p className="text-red-500 mt-4">{error}</p>}

          {user && (
            <>
              <div className="flex flex-col items-center mt-6">
                <div className="w-24 h-24 bg-gradient-to-tr from-blue-500 to-purple-500 text-white rounded-full flex items-center justify-center text-3xl font-bold">
                  {user.name?.charAt(0).toUpperCase()}
                </div>
                <h2 className="mt-4 text-xl font-semibold">{user.name}</h2>
                <p className="text-gray-500">{user.email}</p>
                <span className="mt-2 px-3 py-1 text-sm rounded-full bg-blue-100 text-blue-600">
                  {user.role}
                </span>
              </div>

              <div className="mt-6 w-full border-t border-gray-200 pt-4 space-y-2">
                <p className="text-sm text-gray-600">
                  <strong>Verified At:</strong>{" "}
                  {user.isVerified
                    ? new Date(user.verifiedAt).toLocaleString()
                    : "Not Verified"}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Joined:</strong>{" "}
                  {new Date(user.createdAt).toLocaleDateString()}
                </p>
              </div>

              {!user.isVerified && (
                <button
                  onClick={sendVerificationEmail}
                  className="mt-4 bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition"
                >
                  Verify Email
                </button>
              )}

              <div className="mt-6 flex gap-3 justify-center">
                <button
                  onClick={() => router.push("/")}
                  className="bg-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
                >
                  Home
                </button>
                <button
                  onClick={logout}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                >
                  Logout
                </button>

                <Link href={`profile/${user._id}`}>
                  <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition">
                    {user._id}
                  </button>
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  );
};

export default Profile;
