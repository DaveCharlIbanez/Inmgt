import Link from "next/link";
import React from "react";

export default function Login() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-100 text-gray-800">
      <form className="w-full max-w-sm bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-500">Login</h2>
      {/*email*/}
      <div className="mb-4">
        <label htmlFor="email" className="block text-gray-700 font-bold mb-2">Email</label>
        <input type="email" id="email" className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-500" />
      </div>
      {/*password*/}
      <div className="mb-4 text-gray-800">
        <label htmlFor="password" className="block text-gray-700 font-bold mb-2">Password</label>
        <input type="password" id="password" className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-500 " />
      </div>
      {/*submit button*/}
      <button type="submit" className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg">Login</button>

      {/*signup link*/}
      <p className="text-sm text-center mt-4 text-gray-600">
        Don't have an account? <Link href="/signup" className="text-blue-500 hover:underline">Sign up</Link>
      </p>
      </form>
    </div>
  );
}