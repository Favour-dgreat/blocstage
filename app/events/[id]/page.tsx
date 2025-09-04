// app/events/[id]/page.tsx

import Image from "next/image";
import {
  MapPin,
  CalendarDays,
  Clock,
} from "lucide-react";

import SpeakerCard from "@/components/SpeakerCard";
import ShareButton from "@/components/ShareButton";
type Session = {
  title: string;
  start_time: string;
  end_time: string;
  speaker_name: string;
};

type EventData = {
  id: string;
  title: string;
  description: string;
  location: string;
  start_time: string;
  end_time: string;
  banner_image_url: string;
  sessions: Session[];
};

export async function generateStaticParams() {
  const response = await fetch('https://api.blocstage.com/events');
  const events = await response.json();
  return events.map((event: EventData) => ({
    id: event.id,
  }));
}

export default async function EventPage({ params }: { params: { id: string } }) {
  const { id } = params;
  
  const response = await fetch(`https://api.blocstage.com/events/${id}`);
  
  if (!response.ok) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-red-500">Event not found.</p>
      </div>
    );
  }
  
  const event: EventData = await response.json();

  const startDate = new Date(event.start_time);
  const endDate = new Date(event.end_time);

  const formattedDate = startDate.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const formattedTimeRange = `${startDate.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })} - ${endDate.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })}`;


  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Event Title and Use Template Button */}
      <header className="px-8 py-4 flex justify-between items-center max-w-7xl mx-auto">
        <div className="text-xl font-bold text-gray-800">
          <span className="text-gray-500">Event</span> / <span className="text-gray-900">Register</span>
        </div>
       
      </header>

      <main className="container mx-auto p-8 max-w-7xl">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Banner Image */}
          <div className="relative h-80 w-full"> 
            <Image
              src={event.banner_image_url || "/images/placeholder.png"}
              alt={event.title}
              fill
              style={{ objectFit: "cover" }}
              className="rounded-t-xl"
              sizes="(max-width: 1200px) 100vw, 80vw"
            />
          </div>

          {/* Event Info Section */}
          <div className="p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">{event.title}</h2>
            
            <div className="flex flex-col md:flex-row md:items-center text-gray-700 text-lg mb-6 gap-y-2 md:gap-x-8">
              <div className="flex items-center">
                <CalendarDays className="w-6 h-6 mr-2 text-gray-600" />
                <span>{formattedDate}</span>
              </div>
              <div className="flex items-center">
                <Clock className="w-6 h-6 mr-2 text-gray-600" />
                <span>{formattedTimeRange}</span>
              </div>
              <div className="flex items-center">
                <MapPin className="w-6 h-6 mr-2 text-gray-600" />
                <span>{event.location}</span>
              </div>
            </div>

            <div className="flex gap-4 mb-10"> {/* Added mb-10 for spacing */}
                <a href='/BuyTicketPage'>
                      <button className="bg-[#0C2D48] text-white px-6 py-2 rounded-md hover:bg-blue-800 transition-colors font-semibold">
                Get Tickets
              </button>
                </a>
            
              <ShareButton />
            </div>

            {/* About Event and Agenda Sections */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {/* About Event */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">About Event</h2>
                <div className="text-gray-700 leading-relaxed space-y-4">
                  <p>{event.description}</p>
                  {/* You can add more description paragraphs here if needed */}
                </div>
              </div>

              {/* Agenda & Speakers Section */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Event Agenda & Speakers</h2>
                <div className="space-y-6">
                  {event.sessions && event.sessions.length > 0 ? (
                    event.sessions.map((session, index) => (
                      <SpeakerCard
                        key={index}
                        sessionTitle={session.title}
                        speakerName={session.speaker_name}
                        startTime={new Date(session.start_time).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}
                        endTime={new Date(session.end_time).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}
                      />
                    ))
                  ) : (
                    <p className="text-gray-600">No agenda items available.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}