"use client";

import { Share2 } from "lucide-react";

export default function ShareButton() {
  const handleShare = () => {
    if (typeof window !== "undefined") {
      const url = window.location.href;
      navigator.clipboard.writeText(url);
      alert("Event link copied to clipboard!");
    }
  };

  return (
    <button
      onClick={handleShare}
      className="bg-gray-200 text-gray-700 p-2 rounded-full hover:bg-gray-300 transition-colors"
      aria-label="Share Event"
    >
      <Share2 className="w-5 h-5" />
    </button>
  );
}