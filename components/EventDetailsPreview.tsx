"use client";
import { useState, useEffect } from "react";
import { CalendarDays, Clock, MapPin, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { EventData } from "./EventDetailsForm";

interface EventPreviewProps {
  onUpdate: (data: Partial<EventData>) => void;
  onNext: () => void;
  onBack?: () => void;
}

export default function EventPreview({ onUpdate, onNext }: EventPreviewProps) {
  const [dragActive, setDragActive] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [eventData, setEventData] = useState<EventData | null>(null);

  useEffect(() => {
    const storedData = localStorage.getItem("eventData");
    if (storedData) {
      setEventData(JSON.parse(storedData));
    }
  }, []);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === "dragenter" || e.type === "dragover");
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (ev) => setImagePreview(ev.target?.result as string);
        reader.readAsDataURL(file);
        onUpdate({ image: file });
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (ev) => setImagePreview(ev.target?.result as string);
        reader.readAsDataURL(file);
        onUpdate({ image: file });
      }
    }
  };

  if (!eventData) {
    return <p>No event data found.</p>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-lg font-bold text-[#092C4C]">Event Cover</h2>
        <p className="text-sm text-gray-500">
          Upload a JPEG or PNG file
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-2 gap-8">
        {/* Left - Event Info */}
        <div className="space-y-4 bg-[#F4F3F3] p-6 rounded-lg">
          <h3 className="text-xl font-semibold text-[#08080E]">{eventData.name}</h3>

          <div className="flex items-center  text-gray-600">
            <CalendarDays className="w-6 h-6 mr-2 text-[#E04E1E]" />
            <span>
              {new Date(eventData.startDate).toLocaleDateString(undefined, {
                weekday: "long",
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>

          <div className="flex items-center text-gray-600">
            <Clock className="w-6 h-6 mr-2 text-[#E04E1E]" />
            <span>
              {new Date(eventData.startDate).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}{" "}
              -{" "}
              {new Date(eventData.endDate).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} PST
            </span>
          </div>

          <div className="flex items-center text-gray-600">
            <MapPin className="w-6 h-6 mr-2 text-[#E04E1E]" />
            <span>{eventData.location}</span>
          </div>

          <div>
            <h4 className="font-bold mt-6 text-relaxed">About Event</h4>
            <p className="text-gray-600">{eventData.description}</p>
          </div>
        </div>

        {/* Right - Upload */}
        <div>
          <div className="bg-[#FCF7ED] border border-[#E2A83B] text-[#E2A83B] p-4 rounded-md text-sm mb-4">
            Images with a 1:1 ratio (a square) work best on all event themes
          </div>

          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive ? "border-blue-400 bg-blue-50" : "border-gray-300"
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Preview"
                className="w-32 h-32 object-cover rounded-lg mx-auto"
              />
            ) : (
              <div className="space-y-2">
                <FileText className="w-12 h-12 text-gray-400 mx-auto" />
                <p className="text-sm text-gray-600">Drag n Drop here</p>
                <p className="text-xs text-gray-400">Or</p>
                <label className="text-sm text-[#092C4C] cursor-pointer hover:underline">
                  Browse
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              </div>
            )}
          </div>

          <Button
            className="w-full py-6 bg-[#BDBDBD] mt-5"
            disabled
          >
            Upload Now
          </Button>
        </div>
      </div>

      {/* Next Button */}
      <div className="flex justify-end">
        <Button
          onClick={onNext}
          className="px-6 py-6 bg-[#092C4C] text-white rounded-lg font-medium hover:bg-[#0b3a63]"
        >
          Next
        </Button>
      </div>
    </div>
  );
}
