"use client";

import { useState } from "react";
import { Share2, Copy, Facebook, Twitter, Linkedin, MessageCircle } from "lucide-react";

interface ShareButtonProps {
  eventTitle?: string;
  eventDescription?: string;
  eventUrl?: string;
}

export default function ShareButton({ 
  eventTitle = "Check out this amazing event!", 
  eventDescription = "Join us for an incredible experience!",
  eventUrl 
}: ShareButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const url = eventUrl || (typeof window !== "undefined" ? window.location.href : "");
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(eventTitle);
  const encodedDescription = encodeURIComponent(eventDescription);

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    whatsapp: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
      alert("Failed to copy link");
    }
  };

  const handleSocialShare = (platform: keyof typeof shareLinks) => {
    window.open(shareLinks[platform], '_blank', 'width=600,height=400');
    setIsOpen(false);
  };

  const handleNativeShare = async () => {
    if (typeof navigator !== 'undefined' && 'share' in navigator) {
      try {
        await navigator.share({
          title: eventTitle,
          text: eventDescription,
          url: url,
        });
        setIsOpen(false);
      } catch (err) {
        console.error('Error sharing: ', err);
      }
    } else {
      // Fallback to copy link
      handleCopyLink();
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-gray-200 text-gray-700 p-2 rounded-full hover:bg-gray-300 transition-colors flex items-center gap-2"
        aria-label="Share Event"
      >
        <Share2 className="w-5 h-5" />
        <span className="text-sm font-medium">Share</span>
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown Menu */}
          <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
            <div className="p-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Share Event</h3>
              
              {/* Native Share (Mobile) */}
              {typeof navigator !== 'undefined' && 'share' in navigator && (
                <button
                  onClick={handleNativeShare}
                  className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <Share2 className="w-5 h-5 text-gray-600" />
                  <span className="text-sm text-gray-700">Share via...</span>
                </button>
              )}

              {/* Copy Link */}
              <button
                onClick={handleCopyLink}
                className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors"
              >
                <Copy className="w-5 h-5 text-gray-600" />
                <span className="text-sm text-gray-700">
                  {copied ? "Copied!" : "Copy Link"}
                </span>
              </button>

              {/* Social Media Options */}
              <div className="border-t border-gray-200 my-2 overflow-y-scroll" />
              
              
            </div>
          </div>
        </>
      )}
    </div>
  );
}