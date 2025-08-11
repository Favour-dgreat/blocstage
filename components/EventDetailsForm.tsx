"use client";

import { Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { useState } from 'react';

// Event data type
export interface EventData {
  name: string;
  description: string;
  location: string;
  isOnline: boolean;
  startDate: string;
  endDate: string;
  image?: File | null;
}

interface EventDetailsFormProps {
  data: EventData;
  onUpdate: (update: Partial<EventData>) => void;
  onNext: (updatedData: EventData) => void;
  onBack?: () => void;
}

export default function EventDetailsForm({ data, onUpdate, onNext }: EventDetailsFormProps) {
  const [localData, setLocalData] = useState<EventData>(data);

  const handleChange = (update: Partial<EventData>) => {
    const newData = { ...localData, ...update };
    setLocalData(newData);
    onUpdate(update); // optional: keep parent in sync too
  };
const handleContinue = () => {
  localStorage.setItem("eventData", JSON.stringify(localData));
  onNext(localData);
};


  return (
    <div>
      <div className="mb-8">
                  <h1 className="text-2xl font-bold text-[#092C4C] mb-2">Hi John</h1>
                  <p className="text-gray-600">Let&apos;s get your event up and running!</p>
                </div>
      <h2 className="text-lg font-light text-gray-900 mb-6">Basic Event Details</h2>

      {/* Event Name */}
      <div className="grid grid-cols-1 mt-8">
        <label className="block text-sm font-medium text-[#BDBDBD] mb-4">Event Name</label>
        <Input
          value={localData.name}
          onChange={(e) => handleChange({ name: e.target.value })}
          placeholder="BTS Watch Party: Purple Night Edition"
          className="w-full"
        />
      </div>

      {/* Event Description */}
      <div className="mt-6">
        <label className="block text-sm font-medium text-[#BDBDBD] mb-4">Event Description</label>
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
        <label className="block text-sm font-medium text-[#BDBDBD] mb-4">Location</label>
        <Input
          value={localData.location}
          onChange={(e) => handleChange({ location: e.target.value })}
          placeholder="The Vibe Lounge, Warri, Delta State, Nigeria"
          className="w-full"
        />
        <div className="flex items-center space-x-2 mt-2">
          <Checkbox
            id="online"
            checked={localData.isOnline}
            onCheckedChange={(checked) => handleChange({ isOnline: checked as boolean })}
          />
          <label htmlFor="online" className="text-sm text-gray-600">Online Event</label>
        </div>
      </div>

      {/* Dates */}
      <div className="grid grid-cols-1 mt-6 gap-4">
        <div>
          <label className="block text-sm font-medium text-[#BDBDBD] mb-4">Start Date & Time</label>
          <div className="relative">
            <Input
              type="datetime-local"
              value={localData.startDate}
              onChange={(e) => handleChange({ startDate: e.target.value })}
              className="w-full"
            />
            <Calendar className="absolute right-3 top-3 h-4 w-4 text-gray-400 pointer-events-none" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-[#BDBDBD] mb-4">End Date & Time</label>
          <div className="relative">
            <Input
              type="datetime-local"
              value={localData.endDate}
              onChange={(e) => handleChange({ endDate: e.target.value })}
              className="w-full"
            />
            <Calendar className="absolute right-3 top-3 h-4 w-4 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

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
