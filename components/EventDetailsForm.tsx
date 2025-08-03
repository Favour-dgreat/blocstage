"use client";

import { useState } from 'react';
import { Upload, Calendar, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import Image from 'next/image';
interface EventDetailsFormProps {
  data: any;
  onUpdate: (data: any) => void;
  onNext: () => void;
}

export default function EventDetailsForm({ data, onUpdate, onNext }: EventDetailsFormProps) {
  const [dragActive, setDragActive] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setImagePreview(e.target?.result as string);
        };
        reader.readAsDataURL(file);
        onUpdate({ image: file });
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setImagePreview(e.target?.result as string);
        };
        reader.readAsDataURL(file);
        onUpdate({ image: file });
      }
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    onUpdate({ image: null });
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Basic Event Details</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Image */}
        <div>
          {imagePreview ? (
            <div className="relative">
                
              <Image 
                src={imagePreview} 
                alt="Event preview" 
                className="w-full h-80 object-cover rounded-lg"
              />
            </div>
          ) : (
            <div className="w-full h-80  rounded-lg flex items-center justify-center">
<Image
                src="/images/imagepreview.png"
                alt="Event preview"
                className="w-full h-80 object-cover rounded-lg"
                width={500}
                height={500}
              />           
               </div>
          )}
        </div>

        {/* Right Column - Upload */}
        <div className='text-center border-[#BDBDBD] border-2 rounded-lg p-4'>
          <h3 className="text-sm font-bold text-[#092C4C] mb-4 text-left">Upload File</h3>
          
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive ? 'border-blue-400 bg-blue-50' : 'border-gray-300'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            {imagePreview ? (
              <div className="space-y-4">
                <img 
                  src={imagePreview} 
                  alt="Preview" 
                  className="w-24 h-24 object-cover rounded-lg mx-auto"
                />
                <div className="flex gap-2 justify-center">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={removeImage}
                  >
                    Remove Image
                  </Button>
                  <Button variant="secondary" size="sm">
                    Upload Now
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <FileText className="w-12 h-12 text-gray-400 mx-auto" />
                <div>
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
               
              </div>
              
            )}
            
          </div>
           <Button className="w-4/5 py-6 bg-[#BDBDBD] mt-5" disabled>
                  Upload Now
                </Button>
        </div>
      </div>

      {/* Form Fields */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Event Name
          </label>
          <Input
            value={data.name}
            onChange={(e) => onUpdate({ name: e.target.value })}
            placeholder="BTS Watch Party: Purple Night Edition"
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Location
          </label>
          <Input
            value={data.location}
            onChange={(e) => onUpdate({ location: e.target.value })}
            placeholder="The Vibe Lounge, Warri, Delta State, Nigeria"
            className="w-full"
          />
          <div className="flex items-center space-x-2 mt-2">
            <Checkbox
              id="online"
              checked={data.isOnline}
              onCheckedChange={(checked) => onUpdate({ isOnline: checked })}
            />
            <label htmlFor="online" className="text-sm text-gray-600">
              Online Event
            </label>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Event Description
        </label>
        <Textarea
          value={data.description}
          onChange={(e) => onUpdate({ description: e.target.value })}
          placeholder="Join fellow ARMYs for a night of music, fun, and unforgettable BTS moments! Whether you're tuning in from home or vibing live with us, it's going to be a Purple Night to remember."
          rows={4}
          className="w-full"
        />
        <div className="flex items-center gap-2 mt-2 text-xs text-gray-400">
          <button className="hover:text-gray-600">U</button>
          <button className="hover:text-gray-600">I</button>
          <button className="hover:text-gray-600">B</button>
          <div className="w-px h-4 bg-gray-300"></div>
          <button className="hover:text-gray-600">≡</button>
          <button className="hover:text-gray-600">≣</button>
          <button className="hover:text-gray-600">≡</button>
          <div className="w-px h-4 bg-gray-300"></div>
          <button className="hover:text-gray-600">• </button>
          <button className="hover:text-gray-600">1.</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Start Date & Time
          </label>
          <div className="relative">
            <Input
              type="datetime-local"
              value={data.startDate}
              onChange={(e) => onUpdate({ startDate: e.target.value })}
              className="w-full"
            />
            <Calendar className="absolute right-3 top-3 h-4 w-4 text-gray-400 pointer-events-none" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            End Date & Time
          </label>
          <div className="relative">
            <Input
              type="datetime-local"
              value={data.endDate}
              onChange={(e) => onUpdate({ endDate: e.target.value })}
              className="w-full"
            />
            <Calendar className="absolute right-3 top-3 h-4 w-4 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

      <div className="flex justify-end mt-8">
        <Button
          onClick={onNext}
          className="px-6 py-6 bg-[#092C4C] text-white rounded-lg font-medium hover:[#092C4C]"
        >
          Continue
        </Button>
      </div>
    </div>
  );
}