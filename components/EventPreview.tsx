"use client";

import { Calendar, Clock, MapPin,  } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
interface EventPreviewProps {
  data: any;
  onBack: () => void;
  onPublish: () => void;
  isLoading?: boolean;
}

export default function EventPreview({ data, onBack, onPublish, isLoading = false }: EventPreviewProps) {
  const formatDate = (dateString: string) => {
    if (!dateString) return 'Saturday, August 10, 2025';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    if (!dateString) return '7:00 PM';
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatSessionTime = (startTime: string, endTime: string) => {
    if (!startTime || !endTime) return '20 mins';
    
    const start = new Date(startTime);
    const end = new Date(endTime);
    const durationMs = end.getTime() - start.getTime();
    const durationMins = Math.round(durationMs / (1000 * 60));
    
    return `${formatTime(startTime)} - ${formatTime(endTime)} • ${durationMins} mins`;
  };

  return (
    <div className="max-w-6xl">
         

      {/* Event Preview */}
      <div className="bg-white rounded-lg overflow-hidden">
        {/* Hero Image */}
        <div className="relative h-80 bg-gray-200">
          {data.image ? (
            <img 
              src={typeof data.image === 'string' ? data.image : URL.createObjectURL(data.image)}
              alt="Event"
              className="w-full h-full object-cover"
            />
          ) : (
            <img 
              src="https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&dpr=2"
              alt="Event"
              className="w-full h-full object-cover"
            />
          )}
        </div>

        <div className="p-4 md:p-6">
          {/* Event Title */}
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            {data.title }
          </h1>

          {/* Event Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Date</p>
                <p className="font-medium text-gray-900">
                  {formatDate(data.start_time)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Time</p>
                <p className="font-medium text-gray-900">
                  {formatTime(data.start_time)} - {formatTime(data.end_time)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <MapPin className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Location</p>
                <p className="font-medium text-gray-900">
                  {data.location }
                </p>
              </div>
            </div>
          </div>

          

          {/* About Event */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">About Event</h2>
            <p className="text-gray-600 leading-relaxed">
              {data.description 
              }
            </p>
          </div>

          {/* Event Agenda & Speakers */}
          {data.sessions && data.sessions.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Event Agenda & Speakers</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {data.sessions.map((session: any, index: number) => (
                  <div key={session.id} className="flex gap-4">
                    <div className="w-16 h-16 bg-gray-200 rounded-lg flex-shrink-0">
                      {session.image_url ? (
                        <img 
                          src={session.image_url}
                          alt={session.speaker_name || 'Speaker'}
                          className="w-full h-full object-cover rounded-lg"
                          onError={(e) => {
                            // Fallback to initials if image fails to load
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            const parent = target.parentElement;
                            if (parent) {
                              parent.innerHTML = `
                                <div class="w-full h-full bg-gray-300 rounded-lg flex items-center justify-center">
                                  <span class="text-gray-500 text-xs font-medium">
                                    ${session.speaker_name ? session.speaker_name.charAt(0).toUpperCase() : 'S'}
                                  </span>
                                </div>
                              `;
                            }
                          }}
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-300 rounded-lg flex items-center justify-center">
                          <span className="text-gray-500 text-xs font-medium">
                            {session.speaker_name ? session.speaker_name.charAt(0).toUpperCase() : 'S'}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 mb-1">
                        {session.title || `Session ${index + 1}`}
                      </h3>
                      <p className="text-sm text-gray-500 mb-2">
                        {formatSessionTime(session.start_time, session.end_time)}
                      </p>
                      <p className="text-sm text-gray-600">
                        {session.speaker_name}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Explore Templates */}
          <div className="bg-[#FFFFFF] shadow-md rounded-lg p-6">
            <div className="flex flex-col items-start gap-4">
              <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center flex-shrink-0">
                <Image
                  src="/images/template1.png"
                  alt="Template Icon"
                  width={30}
                  height={30}
                />
              </div>
              <div>
                <h3 className="font-medium text-[#092C4C] mb-2">Explore other templates</h3>
                <p className="text-sm text-[#4F4F4F]">
                  Check out other website templates for your event
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between mt-8">
        <Button
  variant="ghost"
  onClick={onBack}
  className="px-6 py-2 bg-transparent text-[#092C4C] hover:bg-gray-100 shadow-none"
>
  Edit 
</Button>
        <Button
          onClick={onPublish}
          disabled={isLoading}
          className={`px-6 py-2 bg-[#092C4C] text-white hover:bg-[#092C4C] flex items-center ${
            isLoading ? 'opacity-70 cursor-not-allowed' : ''
          }`}
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Publishing...
            </>
          ) : (
            'Publish Event'
          )}
        </Button>
      </div>
    </div>
  );
}