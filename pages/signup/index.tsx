import Link from "next/link";
import React from "react";



export default function SignupPage() {
  return (
    <div  className="min-h-screen flex items-center justify-center bg-green-100 text-gray-800">
        <form className="w-full max-w-sm bg-white p-6 shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-500">Sign Up</h2>
        {/*email*/}
        <div className="mb-4 text-gray-800">
            <label htmlFor="email" className="block text-gray-700 font-bold mb-2">Email</label>
            <input type="email" id="email" className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-500" />
        {/*password*/}
        </div>
        <div className="mb-4 text-gray-800">
            <label htmlFor="password" className="block text-gray-700 font-bold mb-2">Password</label>
            <input type="password" id="password" className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-500 " />
        </div>
        {/*confirm password*/}
        <div className="mb-4 text-gray-800">
            <label htmlFor="confirmPassword" className="block text-gray-700 font-bold mb-2">Confirm Password</label>
            <input type="password" id="confirmPassword" className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-500 " />
        {/*contact number*/}
        </div>
        <div className="mb-4 text-gray-800">
            <label htmlFor="contactNumber" className="block text-gray-700 font-bold mb-2">Contact Number</label>
            <input type="tel" id="contactNumber" className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-500 " />
        </div>
        {/*submit button*/}
        <button type="submit" className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg">Sign Up</button>
        
        {/*login link*/}
        <div className="text-sm text-center mt-4 text-gray-600">
            Already have an account? <Link href="/login" className="text-blue-500 hover:underline">Log in</Link>   
        </div>
        </form>
    </div>
  );
}
