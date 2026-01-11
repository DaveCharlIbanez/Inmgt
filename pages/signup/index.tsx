import Link from "next/link";
import React, { useState } from "react";
import { useRouter } from "next/router";
import { Mail, Lock, User, Phone, UserPlus, CheckCircle2 } from "lucide-react";
import { Playfair_Display } from "next/font/google";

const brandFont = Playfair_Display({ subsets: ["latin"], weight: ["600", "700"], display: "swap" });

export default function SignupPage() {
  const router = useRouter();
  const [glowPos, setGlowPos] = useState({ x: 50, y: 50 });
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    contactNumber: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword ||
      !formData.firstName
    ) {
      setError("Please fill in all required fields");
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          firstName: formData.firstName,
          contactNumber: formData.contactNumber,
          role: "client",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create account");
      }

      setShowSuccess(true);
      setTimeout(() => {
        router.push("/login");
      }, 2500);
    } catch (err: any) {
      setError(err.message || "An error occurred during signup");
    } finally {
      setLoading(false);
    }
  };

  const handleGlowMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setGlowPos({ x, y });
  };

  const handleGlowLeave = () => {
    setGlowPos({ x: 50, y: 50 });
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md text-center">
            <div className="flex justify-center mb-4">
              <CheckCircle2 size={64} className="text-green-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Account Created!</h2>
            <p className="text-gray-600 mb-6">Welcome to Tuluyan. Redirecting to login...</p>
            <div className="w-full bg-green-200 rounded-full h-1 overflow-hidden">
              <div className="bg-green-600 h-full animate-pulse" style={{ animation: "fill 2.5s ease-in forwards" }} />
            </div>
          </div>
          <style jsx>{`
            @keyframes fill {
              0% { width: 0%; }
              100% { width: 100%; }
            }
          `}</style>
        </div>
      )}

      {/* Left Side - Branding (matched to Login) */}
      <div
        className="hidden lg:flex lg:w-1/2 relative overflow-hidden text-white"
        onMouseMove={handleGlowMove}
        onMouseLeave={handleGlowLeave}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-green-700 via-emerald-700 to-teal-700" />
        <div
          className="absolute inset-0 opacity-70"
          style={{
            backgroundImage:
              `radial-gradient(circle at ${glowPos.x}% ${glowPos.y}%, rgba(255,255,255,0.22), transparent 34%),` +
              "radial-gradient(circle at 20% 20%, rgba(255,255,255,0.18), transparent 32%)," +
              "radial-gradient(circle at 80% 0%, rgba(255,255,255,0.14), transparent 30%)," +
              "radial-gradient(circle at 50% 70%, rgba(255,255,255,0.16), transparent 38%)",
          }}
        />
        <div className="absolute -right-24 -bottom-24 w-96 h-96 bg-white/15 blur-3xl rounded-full" />
        <div className="absolute inset-8 border border-white/15 rounded-3xl backdrop-blur-sm" />

        <div className="relative z-10 flex flex-col w-full h-full p-12">
          <div className="flex-1 flex flex-col items-center justify-center text-center gap-6">
            <span className="px-4 py-2 rounded-full border border-white/25 text-sm uppercase tracking-[0.18em] bg-white/10 backdrop-blur-sm">Student Living</span>
            <h1 className={`${brandFont.className} text-6xl sm:text-7xl font-semibold tracking-tight drop-shadow-md`}>
              Tuluyan
            </h1>
            <p className="max-w-md text-blue-50 text-lg leading-relaxed">
              Create your account and join a seamless student living experience.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm text-blue-50/90">
            <div className="p-4 rounded-2xl bg-white/10 border border-white/10 backdrop-blur-sm">
              <p className="font-semibold">Fast onboarding</p>
              <p className="text-blue-50/80">Sign up in minutes and get started.</p>
            </div>
            <div className="p-4 rounded-2xl bg-white/10 border border-white/10 backdrop-blur-sm">
              <p className="font-semibold">All-in-one</p>
              <p className="text-blue-50/80">Manage payments, requests, and your profile.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Create Account</h2>
            <p className="text-gray-600">Join us and start your journey today</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm flex items-center gap-2">
                <span>⚠️</span>
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <User size={18} /> Full Name *
              </label>
              <input
                type="text"
                id="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="John Doe"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent text-gray-900"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <Mail size={18} /> Email Address *
              </label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent text-gray-900"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <Lock size={18} /> Password *
              </label>
              <input
                type="password"
                id="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent text-gray-900"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <Lock size={18} /> Confirm Password *
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent text-gray-900"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <Phone size={18} /> Contact Number
              </label>
              <input
                type="tel"
                id="contactNumber"
                value={formData.contactNumber}
                onChange={handleChange}
                placeholder="+1 (555) 000-0000"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent text-gray-900"
              />
            </div>

            <div className="flex items-start gap-2 text-sm">
              <input
                type="checkbox"
                id="terms"
                className="w-4 h-4 rounded border-gray-300 mt-1"
                required
              />
              <label htmlFor="terms" className="text-gray-700">
                I agree to the{" "}
                <a href="#" className="text-green-600 hover:text-green-700 font-medium">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" className="text-green-600 hover:text-green-700 font-medium">
                  Privacy Policy
                </a>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-bold py-3 px-4 rounded-lg transition-all flex items-center justify-center gap-2 mt-6"
            >
              <UserPlus size={20} />
              {loading ? "Creating Account..." : "Sign Up"}
            </button>
          </form>

          <div className="mt-6 space-y-4">
            <Link href="/login">
              <button
                type="button"
                className="w-full px-4 py-3 border border-green-600 text-green-600 hover:bg-green-50 font-bold rounded-lg transition-all"
              >
                Back to Login
              </button>
            </Link>
            <div className="pt-2 border-t border-gray-300">
              <p className="text-center text-gray-600 text-sm">
                Already have an account?{" "}
                <Link href="/login" className="text-green-600 hover:text-green-700 font-bold">
                  Sign in here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
