"use client";

import { CheckCircle2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const VerifySuccessPage = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="absolute top-6 left-6">
       <Image className="justify-center items-center"
                       src="/images/logoorange.png"
                       alt="blocStage"
                       width={150}
                       height={40}
                       />
      </div>

      <div className="bg-white p-8 md:p-12 rounded-lg shadow-lg max-w-md w-full text-center">
        <div className="flex justify-center mb-6">
          <CheckCircle2 className="w-20 h-20 text-green-500" />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
          Email Verified Successfully!
        </h1>
        <p className="text-gray-600 mb-8">
          Your email has been successfully verified. You can now proceed to log in to your account.
        </p>
        <Link href="/login">
          <button className="w-full py-3 px-6 bg-[#092C4C] text-white font-semibold rounded-md shadow-md hover:bg-[#072036] transition-colors duration-300">
            Go to Login
          </button>
        </Link>
      </div>

      <footer className="mt-8 text-sm text-gray-500">
        © 2025 Blocstage. All rights reserved.
      </footer>
    </div>
  );
};

export default VerifySuccessPage;