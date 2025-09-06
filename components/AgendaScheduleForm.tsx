"use client";

import { useState, useRef } from "react";
import { Clock, Upload, X, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import Image from "next/image";

interface Session {
  id: string;
  title: string;
  description: string;
  start_time: string;
  end_time: string;
  speaker_name: string;
  session_order: number;
  image_url?: string;
}

interface AgendaScheduleFormProps {
  data: any;
  onUpdate: (data: any) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function AgendaScheduleForm({
  data,
  onUpdate,
  onNext,
  onBack,
}: AgendaScheduleFormProps) {
  const [sessions, setSessions] = useState<Session[]>(
    data.sessions?.length > 0
      ? data.sessions
      : [
          {
            id: "1",
            title: "",
            start_time: "",
            end_time: "",
            speaker_name: "",
            session_order: 0,
            image_url: "",
          },
        ]
  );

  const [showSkip, setShowSkip] = useState(true);
  const [nextEnabled, setNextEnabled] = useState(false);
  const [uploadingImages, setUploadingImages] = useState<{ [key: string]: boolean }>({});
  const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

  const addNewSession = () => {
    const newSession: Session = {
      id: Date.now().toString(),
      title: "",
      description: "",
      start_time: "",
      end_time: "",
      speaker_name: "",
      session_order: sessions.length,
      image_url: "",
    };
    setSessions((prev) => [...prev, newSession]);
    setShowSkip(false);
    setNextEnabled(true);
  };

  const uploadImageToCloudinary = async (imageFile: File) => {
    const cloudName = "dsohqp4d9"; // Your Cloudinary cloud name
    const unsignedUploadPreset = "blocstage"; // Your upload preset

    const formData = new FormData();
    formData.append("file", imageFile);
    formData.append("upload_preset", unsignedUploadPreset);

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Cloudinary upload failed:", errorData);
        throw new Error(errorData.error?.message || "Cloudinary upload failed");
      }

      const data = await response.json();
      return data.secure_url;
    } catch (error) {
      console.error("Error during Cloudinary upload:", error);
      throw error;
    }
  };

  const handleImageUpload = async (sessionId: string, file: File) => {
    setUploadingImages(prev => ({ ...prev, [sessionId]: true }));
    
    try {
      // Upload to Cloudinary
      const imageUrl = await uploadImageToCloudinary(file);
      updateSession(sessionId, 'image_url', imageUrl);
      setUploadingImages(prev => ({ ...prev, [sessionId]: false }));
      
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image. Please try again.');
      setUploadingImages(prev => ({ ...prev, [sessionId]: false }));
    }
  };

  const handleFileSelect = (sessionId: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB');
        return;
      }
      
      handleImageUpload(sessionId, file);
    }
  };

  const removeImage = (sessionId: string) => {
    updateSession(sessionId, 'image_url', '');
  };

  const triggerFileInput = (sessionId: string) => {
    fileInputRefs.current[sessionId]?.click();
  };

  const updateSession = (id: string, field: keyof Session, value: any) => {
    const updatedSessions = sessions.map((session) =>
      session.id === id ? { ...session, [field]: value } : session
    );
    setSessions(updatedSessions);
    onUpdate({ sessions: updatedSessions });
  };

  const removeSession = (id: string) => {
    if (sessions.length > 1) {
      const updatedSessions = sessions
        .filter((session) => session.id !== id)
        .map((session, index) => ({ ...session, session_order: index }));
      setSessions(updatedSessions);
      onUpdate({ sessions: updatedSessions });
    }
  };

  return (
  <div>
    <h2 className="text-xl font-semibold text-[#092C4C] mb-2">
      Agenda 
    </h2>
    <p className="text-sm text-[#4F4F4F] mb-8">Set up your agenda of the day</p>

    <div className="space-y-6 flex flex-col gap-4">
      {sessions.map((session, index) => (
        <div key={session.id} className="rounded-lg">
          <h2 className="text-sm font-light text-[#121111] mb-6">
            Agenda & Schedule
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-[#BDBDBD] mb-4">
                Session title
              </label>
              <Input
                value={session.title}
                onChange={(e) =>
                  updateSession(session.id, "title", e.target.value)
                }
                placeholder={
                  index === 0 ? "Welcome & Introductions" : "Session Name"
                }
                className="w-full"
              />
            </div>

            {/* Start Date & Time */}
            <div>
              <label className="block text-sm font-medium text-[#BDBDBD] mb-4">
                Session Start
              </label>
              <div className="relative">
                <Input
                  type="datetime-local"
                  step="1"
                  placeholder="Pick date and time"
                  value={session.start_time}
                  onChange={(e) =>
                    updateSession(session.id, "start_time", e.target.value)
                  }
                  className="w-full"
                />
              </div>
            </div>

            {/* End Date & Time */}
            <div>
              <label className="block text-sm font-medium text-[#BDBDBD] mb-4">
                Session End
              </label>
              <div className="relative">
                <Input
                  type="datetime-local"
                  step="1"
                  placeholder="Pick date and time"
                  value={session.end_time}
                  onChange={(e) =>
                    updateSession(session.id, "end_time", e.target.value)
                  }
                  className="w-full"
                />
              </div>
            </div>

            {/* Speaker (full width on mobile, last column on desktop) */}
            <div className="md:col-span-2 lg:col-span-1">
              <label className="block text-sm font-medium text-[#BDBDBD] mb-4">
                Speaker
              </label>
              <div className="relative">
                <Input
                  type="text"
                  value={session.speaker_name}
                  onChange={(e) =>
                    updateSession(session.id, "speaker_name", e.target.value)
                  }
                  placeholder="Chioma Chiboo Ibekwe"
                  className="w-full"
                />
              </div>
            </div>
          </div>

          {/* Speaker Image Upload */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-[#BDBDBD] mb-4">
              Speaker Image
            </label>
            <div className="flex items-center gap-4">
              {/* Hidden file input */}
              <input
                ref={(el) => (fileInputRefs.current[session.id] = el)}
                type="file"
                accept="image/*"
                onChange={(e) => handleFileSelect(session.id, e)}
                className="hidden"
              />
              
              {/* Image preview or upload button */}
              {session.image_url ? (
                <div className="relative">
                  <div className="w-20 h-20 rounded-lg overflow-hidden border-2 border-gray-200">
                    <Image
                      src={session.image_url}
                      alt="Speaker"
                      width={80}
                      height={80}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeImage(session.id)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => triggerFileInput(session.id)}
                  disabled={uploadingImages[session.id]}
                  className="flex flex-col items-center justify-center w-20 h-20 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-colors disabled:opacity-50"
                >
                  {uploadingImages[session.id] ? (
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-600"></div>
                  ) : (
                    <>
                      <Upload className="w-6 h-6 text-gray-400 mb-1" />
                      <span className="text-xs text-gray-500">Upload</span>
                    </>
                  )}
                </button>
              )}
              
              <div className="flex-1">
                <p className="text-sm text-gray-600 mb-1">
                  {session.image_url ? "Image uploaded successfully" : "Upload speaker photo"}
                </p>
                <p className="text-xs text-gray-400">
                  JPG, PNG up to 5MB
                </p>
              </div>
            </div>
          </div>

          {/* Switch & Remove Button */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
            
            {sessions.length > 1 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeSession(session.id)}
                className="bg-[#EB5757] text-white hover:text-red-700 hover:bg-red-50"
              >
                Remove Session
              </Button>
            )}
          </div>
        </div>
      ))}
    </div>

    {/* Footer */}
    <div className="mt-8 flex flex-col md:flex-row items-center justify-between gap-4">
      <Button
        variant="outline"
        onClick={addNewSession}
        className="flex items-center gap-2 text-[#092C4C] text-xs font-light border-[#DBEBFB] bg-[#DBEBFB] hover:bg[#092C4C] w-full md:w-auto"
      >
        Add new agenda
      </Button>

      <div className="bb flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
        {showSkip && (
          <Button variant="ghost" onClick={onNext} className="text-gray-500 w-full md:w-auto">
            Skip this step
          </Button>
        )}
        <Button
          onClick={onNext}
          className={`px-8 py-2 text-white w-full md:w-auto ${
            "bg-[#092C4C] hover:bg-[#092C4C]" 
          }`}
        >
          Next
        </Button>
      </div>
    </div>
  </div>
);
}