"use client";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import { toast } from "sonner";

export function SignOutButton() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const signOutMutation = useMutation(api.auth.signOut);

  const isAuthenticated = !!localStorage.getItem("sessionToken");

  if (!isAuthenticated) {
    return null;
  }

  const handleSignOut = async () => {
    setLoading(true);
    try {
      const sessionToken = localStorage.getItem("sessionToken");
      if (sessionToken) {
        await signOutMutation({ sessionToken });
      }
      localStorage.removeItem("sessionToken");
      toast.success("تم تسجيل الخروج بنجاح");
      navigate("/login");
    } catch (error) {
      console.error("Sign out error:", error);
      // Still clear local storage even if there's an error
      localStorage.removeItem("sessionToken");
      navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      disabled={loading}
      className="px-4 py-2 rounded-lg font-medium transition-all duration-200"
      style={{
        background: 'rgba(239, 68, 68, 0.1)',
        color: '#DC2626',
        border: '1px solid rgba(239, 68, 68, 0.2)',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.04)',
        opacity: loading ? 0.6 : 1,
      }}
      onMouseEnter={(e) => {
        if (!loading) {
          e.currentTarget.style.background = 'rgba(239, 68, 68, 0.15)';
          e.currentTarget.style.border = '1px solid rgba(239, 68, 68, 0.3)';
          e.currentTarget.style.boxShadow = '0 4px 8px rgba(239, 68, 68, 0.15)';
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)';
        e.currentTarget.style.border = '1px solid rgba(239, 68, 68, 0.2)';
        e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.04)';
      }}
      onClick={handleSignOut}
    >
      {loading ? "جاري التسجيل..." : "Sign Out"}
    </button>
  );
}
