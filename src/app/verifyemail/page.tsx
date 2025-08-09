"use client";

import { useSearchParams, useRouter } from "next/navigation";
import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

const VerifyToken = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const router = useRouter();

  const [status, setStatus] = useState<"loading" | "error">("loading");

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        toast.error("No verification token found");
        setStatus("error");
        return;
      }

      try {
        await axios.post("/api/verify-email", { token });
        toast.success("Email verified successfully");
        router.push("/profile");
      } catch (error) {
        console.log(error);
        setStatus("error");
      }
    };

    verifyEmail();
  }, [token, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white shadow-md rounded-xl p-8 max-w-md w-full text-center">
        {status === "loading" ? (
          <>
            <h1 className="text-xl font-semibold text-gray-800">
              Verifying your email...
            </h1>
            <p className="mt-2 text-gray-500 text-sm">
              Please wait, this should only take a moment.
            </p>
          </>
        ) : (
          <>
            <h1 className="text-xl font-semibold text-red-600">
              Verification failed
            </h1>
            <p className="mt-2 text-gray-500 text-sm">
              Your link is invalid or expired.
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default VerifyToken;
