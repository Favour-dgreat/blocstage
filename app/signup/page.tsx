"use client";
import React, { useState } from "react";
import Image from "next/image";
import { Eye, EyeOff } from "lucide-react";

const SignupPage = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    // Add sign-up logic
  };

  return (
    <div className="flex min-h-screen">
      {/* Left: Form Section */}
      <div className="flex-1 flex flex-col justify-center px-10 md:px-24 bg-white">
        {/* Logo */}
        <div className="mb-8">
          <Image src="/images/logoorange.png" alt="blocStage" width={120} height={32} />
        </div>

        {/* Heading */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Create Account</h1>
          <p className="text-gray-600">
            It’s free to create an account and get started with Tix!
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSignup} className="space-y-6">
          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-gray-400 mb-1">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              placeholder="Johndoe@gmail.com"
              value={form.email}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            />
          </div>

          {/* Password */}
          <div className="relative">
            <label className="block text-sm font-semibold text-gray-400 mb-1">
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Enter password"
              value={form.password}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-[42px] cursor-pointer text-gray-500"
            >
                  {showPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
            </span>
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <label className="block text-sm font-semibold text-gray-400 mb-1">
              Confirm Password
            </label>
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="Repeat password"
              value={form.confirmPassword}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            />
            <span
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-[42px] cursor-pointer text-gray-500"
            >
               {showPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
            </span>
          </div>

          {/* Button */}
          <button
            type="submit"
            className="w-full py-3 bg-[#0C2D48] text-white rounded-md font-semibold hover:bg-[#0a263c] transition"
          >
            Continue
          </button>
        </form>

        {/* Sign In Link */}
        <p className="text-center mt-6 text-gray-600 text-sm">
          Already have an account?{" "}
          <a href="#" className="text-[#f4511e] font-semibold">
            Sign In
          </a>
        </p>
      </div>

      {/* Right: Image Section */}
      <div className="hidden lg:block flex-1 relative">
        <Image
          src="/images/signupimage.png"
          alt="Signup Background"
          fill
          style={{ objectFit: "cover" }}
        />
      </div>
    </div>
  );
};

export default SignupPage;
