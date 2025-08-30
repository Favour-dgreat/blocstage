"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Ticket, CalendarDays, Bell } from "lucide-react";
import  Link  from  "next/link";

type Event = {
  image_url?: string;
  title: string;
  type: string;
  start_time: string;
  location: string;
  tickets_sold?: number;
};

const EventDashboard = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("https://api.blocstage.com/events");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setEvents(data);
      } catch (e) {
        setError("Failed to fetch events.");
        console.error("Failed to fetch events:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading events...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-8 py-8 min-h-screen p-8 ml-0 md:ml-64">
      {/* Header section from the image */}
      <div className="flex flex-row justify-between items-center mb-8">
        <h1 className="text-1xl font-bold text-[#282828]">Event </h1>
        <div className="bg-[#E4F0FC] p-2 rounded-md cursor-pointer">
        <Bell className="w-6 h-5 text-[#092C4C]" />
        </div>
      </div>

      {/* Greeting and "Create Event" button */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold text-[#092C4C] mb-2">
            Good Morning John !
          </h1>
          <p className="text-gray-600">
            It&apos;s time to create and manage event
          </p>
        </div>
        <Link href="/createevent">
        <Button className="hidden md:block bg-[#0C2D48] text-white">
          Create Event
        </Button>
        </Link>
      </div>

      {/* Event Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event, index) => (
          <Card key={index} className="rounded-lg shadow-md overflow-hidden">
            <CardHeader className="p-0 relative">
              <Image
                src={event.image_url || "/images/placeholder.png"}
                alt={event.title}
                width={400}
                height={200}
                className="w-full h-48 object-cover"
              />
              
            </CardHeader>
            <Badge
                className="ml-4 mt-2 text-sm rounded-md p-2"
                style={{ backgroundColor:  "#FBEAE4", color: "#F4511E" }}
              >
                {event.type || "Virtual"}
              </Badge>
            <CardContent className="p-4">
              <CardTitle className="text-lg font-semibold text-gray-900 mb-2">
                {event.title}
              </CardTitle>
              <div className="flex items-center text-gray-500 text-sm mb-2">
                <CalendarDays className="w-4 h-4 mr-2" />
                <span>{new Date(event.start_time).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center text-gray-500 text-sm mb-4">
                <MapPin className="w-4 h-4 mr-2" />
                <span>{event.location}</span>
              </div>
              <div className="flex flex-row items-left text-[#F4511E]">
                <Ticket className="w-6 h-6 mr-2 text-[#F4511E]" />
                <span className="text-md">{event.tickets_sold || 0} </span>
              </div>
              <span className="text-gray-500 text-md">Tickets Sold</span>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default EventDashboard;