import Link from "next/link";
import React, { useState } from "react";
import { useRouter } from "next/router";
import { Mail, Lock, LogIn } from "lucide-react";
import { Playfair_Display } from "next/font/google";

const brandFont = Playfair_Display({ subsets: ["latin"], weight: ["600", "700"], display: "swap" });

export default function LoginPage() {
  const router = useRouter();
  const [glowPos, setGlowPos] = useState({ x: 50, y: 50 });
  const [formData, setFormData] = useState({
    email: "",
    password: "",
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

    if (!formData.email || !formData.password) {
      setError("Please fill in all fields");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to login");
      }

      localStorage.setItem("user", JSON.stringify(data.data));
      
      if (data.data.role === "client") {
        router.push("/client");
      } else {
        router.push("/");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred during login");
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
      {/* Left Side - Branding */}
      <div
        className="hidden lg:flex lg:w-1/2 relative overflow-hidden text-white"
        onMouseMove={handleGlowMove}
        onMouseLeave={handleGlowLeave}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-blue-700 via-indigo-700 to-purple-700" />
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
              Boarding houses built for students - from move-in ready rooms to seamless monthly billing.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm text-blue-50/90">
            <div className="p-4 rounded-2xl bg-white/10 border border-white/10 backdrop-blur-sm">
              <p className="font-semibold">Comfort first</p>
              <p className="text-blue-50/80">Thoughtfully managed rooms with essentials covered.</p>
            </div>
            <div className="p-4 rounded-2xl bg-white/10 border border-white/10 backdrop-blur-sm">
              <p className="font-semibold">Simple management</p>
              <p className="text-blue-50/80">One hub for payments, maintenance, and profiles.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Welcome Back</h2>
            <p className="text-gray-600">Sign in to your account to continue</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm flex items-center gap-2">
                <span>⚠️</span>
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <Mail size={18} /> Email Address
              </label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-gray-900"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <Lock size={18} /> Password
              </label>
              <input
                type="password"
                id="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-gray-900"
              />
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-gray-300"
                />
                <span className="text-gray-700">Remember me</span>
              </label>
              <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-3 px-4 rounded-lg transition-all flex items-center justify-center gap-2"
            >
              <LogIn size={20} />
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-300">
            <p className="text-center text-gray-600">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="text-blue-600 hover:text-blue-700 font-bold">
                Sign up here
              </Link>
            </p>
          </div>

          <p className="text-center text-xs text-gray-500 mt-4">
            Demo credentials: johnny@test.com / clientpass123
          </p>

          <p className="text-center text-xs text-gray-500 mt-4">
            Admin credentials: johnny@testadmin.com / adminpass123
          </p>
        </div>
      </div>
    </div>
  );
}
