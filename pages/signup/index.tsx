import Link from "next/link";
import React, { useState } from "react";
import { useRouter } from "next/router";

export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
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

    // Validation
    if (!formData.email || !formData.password || !formData.confirmPassword) {
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
          contactNumber: formData.contactNumber,
          role: "client", // Default role
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create account");
      }

      // Success - redirect to login page
      alert("Account created successfully! Please sign in.");
      router.push("/login");
    } catch (err: any) {
      setError(err.message || "An error occurred during signup");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-100 text-gray-800">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm bg-white p-6 shadow-md rounded-lg"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-500">
          Sign Up
        </h2>

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
            Email *
          </label>
          <input
            type="email"
            id="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-500"
          />
        </div>

        {/*password*/}
        <div className="mb-4 text-gray-800">
          <label
            htmlFor="password"
            className="block text-gray-700 font-bold mb-2"
          >
            Password *
          </label>
          <input
            type="password"
            id="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-500"
          />
        </div>

        {/*confirm password*/}
        <div className="mb-4 text-gray-800">
          <label
            htmlFor="confirmPassword"
            className="block text-gray-700 font-bold mb-2"
          >
            Confirm Password *
          </label>
          <input
            type="password"
            id="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-500"
          />
        </div>

        {/*contact number*/}
        <div className="mb-4 text-gray-800">
          <label
            htmlFor="contactNumber"
            className="block text-gray-700 font-bold mb-2"
          >
            Contact Number
          </label>
          <input
            type="tel"
            id="contactNumber"
            value={formData.contactNumber}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-500"
          />
        </div>

        {/*submit button*/}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Creating Account..." : "Sign Up"}
        </button>

        {/*login link*/}
        <div className="text-sm text-center mt-4 text-gray-600">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-500 hover:underline">
            Log in
          </Link>
        </div>
      </form>
    </div>
  );
}
