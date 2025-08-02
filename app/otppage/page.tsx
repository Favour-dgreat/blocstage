"use client";
import React, { useRef, useState } from "react";
import Image from "next/image";

const OTPPage = () => {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const inputRefs = useRef<HTMLInputElement[]>([]);

  const handleChange = (index: number, value: string) => {
    if (!/^[0-9]*$/.test(value)) return;
    const updatedOtp = [...otp];
    updatedOtp[index] = value;
    setOtp(updatedOtp);

    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const otpCode = otp.join("");
    // Validate and submit OTP here
  };

  return (
    <div className="flex min-h-screen">
      {/* Left Side */}
      <div className="flex-1 flex flex-col justify-center items-center px-2 md:px-18 bg-white">
        {/* Logo */}
        <div className="items-center justify-center mb-8">
            <div className="absolute top-8 transform -translate-x-1/2 mb-8">
                <Image className="justify-center items-center"
                src="/images/logoorange.png"
                alt="blocStage"
                width={120}
                height={32}
                />
            </div>

          {/* Illustration */}
            <div className="mb-3 flex justify-center items-center">
            <Image
              src="/images/rocketlaunch.png"
              alt="Rocket Icon"
              width={150}
              height={150}
            />
            </div>

          {/* Heading */}
          <div className="mb-4  items-center">
            <h1 className="text-3xl text-center font-bold mb-1">Verify your account</h1>
            <p className="text-gray-600 text-center">
              Enter the 4-digit code sent to your email
            </p>
          </div>

          {/* OTP Form */}
          <form
            onSubmit={handleSubmit}
            className="space-y-6 w-full max-w-md"
          >
            {/* OTP Inputs */}
            <div className="flex flex-col items-center gap-6 mt-4">
              <div className="flex gap-4">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    ref={(el) => {
                      if (el) inputRefs.current[index] = el;
                    }}
                    className="w-14 h-14 text-2xl text-center border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                ))}
              </div>

              {/* Resend Link */}
              <p className="text-sm text-center text-gray-400 font-semibold">
                Resend Code
              </p>

              {/* Button */}
              <button
                type="submit"
                className="w-full py-3 bg-[#0C2D48] text-white rounded-md font-semibold hover:bg-[#0a263c] transition"
              >
                Create Account
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Right Image */}
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

export default OTPPage;
