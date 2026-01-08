import Link from "next/link";
import React, { useState } from "react";
import { useRouter } from "next/router";
import { LogIn } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
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

    // Validation
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

      // Success - store user data in localStorage and redirect to dashboard
      localStorage.setItem("user", JSON.stringify(data.data));
      
      // Redirect based on user role
      if (data.data.role === "client") {
        router.push("/client");
      } else if (data.data.role === "owner") {
        router.push("/owner"); // You can create this later
      } else if (data.data.role === "admin") {
        router.push("/admin"); // You can create this later
      } else {
        router.push("/client"); // Default to client dashboard
      }
    } catch (err: any) {
      setError(err.message || "An error occurred during login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-100 text-gray-800">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm bg-white p-8 shadow-lg rounded-lg"
      >
        <div className="flex items-center justify-center mb-6">
          <LogIn className="h-8 w-8 text-blue-500 mr-2" />
          <h2 className="text-2xl font-bold text-blue-500">
            Sign In
          </h2>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        {/*email*/}
        <div className="mb-4 text-gray-800">
          <label
            htmlFor="email"
            className="block text-gray-700 font-bold mb-2"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-500"
            placeholder="Enter your email"
          />
        </div>

        {/*password*/}
        <div className="mb-6 text-gray-800">
          <label
            htmlFor="password"
            className="block text-gray-700 font-bold mb-2"
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-500"
            placeholder="Enter your password"
          />
        </div>

        {/*submit button*/}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? "Signing In..." : "Sign In"}
        </button>

        {/*signup link*/}
        <div className="text-sm text-center mt-4 text-gray-600">
          Don't have an account?{" "}
          <Link href="/signup" className="text-blue-500 hover:underline font-semibold">
            Sign Up
          </Link>
        </div>
      </form>
    </div>
  );
}
