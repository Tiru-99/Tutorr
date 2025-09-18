"use client";
import { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";

export const GoogleSignIn = ({ role }: { role: string }) => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSuccess = async (credentialResponse: any) => {
    try {
      setLoading(true);
      const { credential } = credentialResponse;

      const response = await axios.post("/api/auth/google", {
        idToken: credential,
        role,
      });

      const { userId, type, name, email, studentId, teacherId } = response.data;

      localStorage.setItem("userId", userId);
      localStorage.setItem("type", type);
      localStorage.setItem("name", name);
      localStorage.setItem("email", email);
      localStorage.setItem("studentId", studentId);
      localStorage.setItem("teacherId", teacherId);

      toast.success("Sign in successfull!")

      router.push(`/${type.toLowerCase()}/profile`);
    } catch (err : any) {
      setError(err.response.data.error ?? err.response.data.message );
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleError = () => {
    setError("Google sign in error");
    setLoading(false);
  };

  return (
    <div className="w-80 flex flex-col items-center space-y-2">
      {loading ? (
        <button
          disabled
          className="w-full flex justify-center items-center gap-3 bg-white border border-gray-300 rounded-lg py-3 shadow-sm"
        >
          {/* Google Logo Placeholder */}
          <img
            src="https://www.svgrepo.com/show/355037/google.svg"
            alt="Google"
            className="h-5 w-5"
          />
          <span className="text-gray-600 font-medium">Signing in...</span>
          {/* Animated Dots Loader */}
          <span className="flex space-x-1">
            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></span>
            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-150"></span>
            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-300"></span>
          </span>
        </button>
      ) : (
        <GoogleLogin
          onSuccess={handleSuccess}
          onError={handleError}
          useOneTap={false}
          size="large"
          text="continue_with"
          logo_alignment="left"
        />
      )}

      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
};
