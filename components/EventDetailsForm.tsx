"use client";

import { Calendar, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect } from "react";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";

// Event data type
export interface EventData {
  id?: string;
  title: string;
  description: string;
  location: string;
  category: string[]; // Updated to an array of strings
  isOnline: boolean;
  start_time: string;
  tags?: string[];
  end_time: string;
  image?: File | null;
}

interface EventDetailsFormProps {
  data: EventData;
  onUpdate: (update: Partial<EventData>) => void;
  onNext: (updatedData: EventData) => void;
  onBack?: () => void;
}

// Reusable TagInput Component
interface TagInputProps {
  label: string;
  value: string[];
  allOptions: string[];
  onUpdate: (tags: string[]) => void;
  placeholder: string;
}

const TagInput = ({ label, value, allOptions, onUpdate, placeholder }: TagInputProps) => {
  const [inputValue, setInputValue] = useState("");
  const [suggestedOptions, setSuggestedOptions] = useState<string[]>([]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setInputValue(term);
    if (term.length > 0) {
      const filtered = allOptions.filter(
        (option) => option.toLowerCase().includes(term.toLowerCase()) && !value.includes(option)
      );
      setSuggestedOptions(filtered);
    } else {
      setSuggestedOptions([]);
    }
  };

  const handleAddTag = (tag: string) => {
    const newTags = [...value, tag];
    onUpdate(newTags);
    setInputValue("");
    setSuggestedOptions([]);
  };

  const handleRemoveTag = (tagToRemove: string) => {
    const newTags = value.filter((tag) => tag !== tagToRemove);
    onUpdate(newTags);
  };

  return (
    <div className="mt-6">
      <label className="block text-sm font-medium text-[#BDBDBD] mb-4">
        {label}
      </label>
      <div className="relative">
        <Input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder={placeholder}
          className="w-full"
        />
        {suggestedOptions.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-48 overflow-y-auto">
            {suggestedOptions.map((option) => (
              <div
                key={option}
                onClick={() => handleAddTag(option)}
                className="px-4 py-2 cursor-pointer hover:bg-gray-100"
              >
                {option}
              </div>
            ))}
          </div>
        )}
      </div>
      {value.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {value.map((tag: string) => (
            <Badge
              key={tag}
              variant="default"
              className="bg-[#092C4C] text-white flex items-center"
            >
              <span>{tag}</span>
              <X
                className="ml-1 w-4 h-4 cursor-pointer hover:text-gray-300"
                onClick={() => handleRemoveTag(tag)}
              />
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
};

export default function EventDetailsForm({
  data,
  onUpdate,
  onNext,
}: EventDetailsFormProps) {
  const [localData, setLocalData] = useState<EventData>({
    ...data,
    category: Array.isArray(data.category) ? data.category : (data.category ? [data.category] : [])
  });
  const [userData, setUserData] = useState({ name: "User" });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const authToken = localStorage.getItem("authToken");
        if (!authToken) return;

        const response = await fetch("https://api.blocstage.com/users/me", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        });

        if (response.ok) {
          const user = await response.json();
          setUserData({
            name: user.name || user.full_name || user.username || "User",
          });
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  const allCategories = [
    "Tech Event",
    "Conference",
    "Meetup",
    "Workshop",
    "Concert",
    "Art Exhibition",
    "Sports Event",
    "Web3 Event"
  ];
  const allTags = [
    "Music", "Networking", "Workshop", "Hackathon", "Codelab", "Web3", "Health",
    "Fitness", "Art", "Technology", "Education", "Business", "Startup", 
    "Food & Drink", "Travel", "Photography"
  ];

  const handleChange = (update: Partial<EventData>) => {
    const newData = { ...localData, ...update };
    setLocalData(newData);
    onUpdate(update); 
  };
  
  const handleContinue = () => {
    localStorage.setItem("eventData", JSON.stringify(localData));
    onNext(localData);
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#092C4C] mb-2">Hi {userData.name}!</h1>
        <p className="text-gray-600">
          Let&apos;s get your event up and running!
        </p>
      </div>
      <h2 className="text-lg font-light text-gray-900 mb-6">
        Basic Event Details
      </h2>

      {/* Event Name */}
      <div className="grid grid-cols-1 mt-8">
        <label className="block text-sm font-medium text-[#BDBDBD] mb-4">
          Event Name
        </label>
        <Input
          value={localData.title}
          onChange={(e) => handleChange({ title: e.target.value })}
          placeholder="BTS Watch Party: Purple Night Edition"
          className="w-full"
        />
      </div>

      {/* Event Description */}
      <div className="mt-6">
        <label className="block text-sm font-medium text-[#BDBDBD] mb-4">
          Event Description
        </label>
        <Textarea
          value={localData.description}
          onChange={(e) => handleChange({ description: e.target.value })}
          placeholder="Join fellow ARMYs for a night of music, fun, and unforgettable BTS moments!"
          rows={8}
          className="w-full"
        />
      </div>

      {/* Location */}
      <div className="mt-6">
        <label className="block text-sm font-medium text-[#BDBDBD] mb-4">
          Location
        </label>
        <Input
          value={localData.location}
          onChange={(e) => handleChange({ location: e.target.value })}
          placeholder="The Vibe Lounge, Warri, Delta State, Nigeria"
          className="w-full"
        />
        <div className="flex items-center space-x-2 mt-2">
          <Switch
            checked={localData.isOnline}
            onCheckedChange={(checked) =>
              handleChange({ isOnline: checked as boolean })
            }
            className={
              localData.isOnline
                ? "bg-[#F56630] text-white hover:bg-[#F56630]"
                : "bg-[#E4E7EC] text-gray-600 border-gray-300 hover:bg-gray-100"
            }
          />
          <label htmlFor="online" className="text-sm text-gray-600">
            Online Event
          </label>
        </div>
      </div>
      
      {/* Event Category (using the TagInput component) */}
      <TagInput
        label="Event Category"
        value={localData.category}
        allOptions={allCategories}
        onUpdate={(categories) => handleChange({ category: categories })}
        placeholder="Start typing to add event categories..."
      />

      {/* Dates */}
      <div className="grid grid-cols-1 mt-6 gap-4">
        <div>
          <label className="block text-sm font-medium text-[#BDBDBD] mb-4">
            Start Date & Time
          </label>
          <div className="relative">
            <Input
              type="datetime-local"
              step="1"
              value={localData.start_time}
              onChange={(e) => handleChange({ start_time: e.target.value })}
              className="w-full"
            />
            <Calendar className="absolute right-3 top-3 h-4 w-4 text-gray-400 pointer-events-none" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-[#BDBDBD] mb-4">
            End Date & Time
          </label>
          <div className="relative">
            <Input
              type="datetime-local"
              step="1"
              value={localData.end_time}
              onChange={(e) => handleChange({ end_time: e.target.value })}
              className="w-full"
            />
            <Calendar className="absolute right-3 top-3 h-4 w-4 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Tags Section (using the new TagInput component) */}
      <TagInput
        label="Tags"
        value={localData.tags || []}
        allOptions={allTags}
        onUpdate={(tags) => handleChange({ tags })}
        placeholder="Start typing to add tags..."
      />

      {/* Continue Button */}
      <div className="flex justify-end mt-8">
        <Button
          onClick={handleContinue}
          className="px-6 py-6 bg-[#092C4C] text-white rounded-lg font-medium hover:bg-[#092C4C]"
        >
          Continue
        </Button>
      </div>
    </div>
  );
}