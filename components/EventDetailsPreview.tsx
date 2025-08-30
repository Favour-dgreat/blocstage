"use client";
import React, { useRef, useState, useEffect } from "react";
import { CalendarDays, Clock, MapPin, Trash2, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { EventData } from "./EventDetailsForm";

interface EventPreviewProps {
  onUpdate: (data: Partial<EventData>) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function EventPreview({ onBack, onUpdate, onNext }: EventPreviewProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [dragActive, setDragActive] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [eventData, setEventData] = useState<EventData | null>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);

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
      startFileSelection(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      startFileSelection(e.target.files[0]);
    }
  };

  const startFileSelection = (file: File) => {
    if (file.type.startsWith("image/")) {
      setSelectedFile(file);
      setUploading(true);
      setUploadProgress(0);

      let progress = 0;
      const interval = setInterval(() => {
        progress += 20;
        if (progress >= 100) {
          clearInterval(interval);
          setUploadProgress(100);

          const reader = new FileReader();
          reader.onloadend = (ev) => {
            setImagePreview(ev.target?.result as string);
            onUpdate({ image: file });
            setUploading(false);
            setSelectedFile(null);
          };
          reader.readAsDataURL(file);
        } else {
          setUploadProgress(progress);
        }
      }, 300);
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
        <p className="text-sm text-gray-500">Upload a JPEG or PNG file</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Preview */}
        <div className="space-y-4 bg-[#F4F3F3] p-4 md:p-6 rounded-lg">
          <h3 className="text-lg md:text-xl font-semibold text-[#08080E]">{eventData.title}</h3>
          <div className="flex items-center text-gray-600 text-sm md:text-base">
            <CalendarDays className="w-5 h-5 md:w-6 md:h-6 mr-2 text-[#E04E1E]" />
            <span>
              {new Date(eventData.start_time).toLocaleDateString(undefined, {
                weekday: "long",
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>
          <div className="flex items-center text-gray-600 text-sm md:text-base">
            <Clock className="w-5 h-5 md:w-6 md:h-6 mr-2 text-[#E04E1E]" />
            <span>
              {new Date(eventData.start_time).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}{" "}
              -{" "}
              {new Date(eventData.end_time).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
          <div className="flex items-center text-gray-600 text-sm md:text-base">
            <MapPin className="w-5 h-5 md:w-6 md:h-6 mr-2 text-[#E04E1E]" />
            <span>{eventData.location}</span>
          </div>
          <div>
            <h4 className="font-bold mt-6">About Event</h4>
            <p className="text-gray-600">{eventData.description}</p>
          </div>
        </div>

        {/* Right Upload Area */}
        <div>
          <div className="bg-[#FCF7ED] border border-[#E2A83B] text-[#E2A83B] p-3 md:p-4 rounded-md text-xs md:text-sm mb-4">
            Images with a 1:1 ratio (a square) work best on all event themes
          </div>

          {/* Upload States */}
          {uploading ? (
            <div className="border border-[#BDBDBD] rounded-lg p-4 md:p-6 text-center">
              <p className="text-[#092C4C] font-semibold mb-4">Upload File</p>
              <div className="border border-dashed border-gray-300 rounded-lg p-4 md:p-6">
                <p className="text-sm text-gray-700 mb-2">{selectedFile?.name}</p>
                <div className="w-full bg-gray-200 h-3 rounded-lg overflow-hidden">
                  <div
                    className="bg-[#092C4C] h-3"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
                <p className="mt-2 text-sm text-gray-600">{uploadProgress}%</p>
              </div>
            </div>
          ) : imagePreview ? (
            <div>
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full h-48 md:h-64 object-cover rounded-lg mb-4"
              />
              <div className="flex flex-col md:flex-row gap-3">
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex-1 text-sm py-4 md:py-6 bg-[#BDBDBD] font-semibold text-white"
                >
                  Change Image
                </Button>
                <div
                  className="flex items-center justify-center p-3 bg-[#FCE8E8] rounded-lg cursor-pointer"
                  onClick={() => {
                    setImagePreview(null);
                    onUpdate({ image: null });
                  }}
                >
                  <Trash2 className="text-2xl text-[#EB5757]" />
                </div>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          ) : (
            <div
              className={`border-2 border-dashed rounded-lg p-4 md:p-6 text-center ${
                dragActive ? "border-blue-400 bg-blue-50" : "border-gray-300"
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <FileText className="w-10 h-10 md:w-12 md:h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-xs md:text-sm text-gray-600">Drag & Drop here</p>
              <p className="text-xs text-gray-400">Or</p>
              <label className="text-xs md:text-sm text-[#092C4C] cursor-pointer hover:underline">
                Browse
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex flex-col md:flex-row justify-between gap-4 mt-8">
        <Button variant="outline" onClick={onBack} className="px-6 py-2 w-full md:w-auto">
          Back
        </Button>
        <Button
          onClick={onNext}
          className="px-6 py-4 md:py-6 bg-[#092C4C] text-white rounded-lg font-medium hover:bg-[#0b3a63] w-full md:w-auto"
        >
          Next
        </Button>
      </div>
    </div>
  );
}
