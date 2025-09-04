// components/EventDashboard.tsx

"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  Ticket,
  CalendarDays,
  Bell,
  DollarSign,
} from "lucide-react";
import Link from "next/link";

// Event type for user's events
type Event = {
  id: string;
  image_url?: string;
  title: string;
  type: string;
  start_time: string;
  location: string;
  tickets_sold?: number;
  revenue?: number;
  status?: string;
  category?: string;
};

type EventOverview = {
  totalEventsCreated: number;
  totalTicketsSold: number;
  totalRevenueGenerated: number;
};

interface UserData {
  name: string;
  email: string;
}

const EventDashboard = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [eventOverview, setEventOverview] = useState<EventOverview | null>(
    null
  );
  const [activeTab, setActiveTab] = useState("Upcoming");
  const [userData, setUserData] = useState<UserData>({ name: "User", email: "" });

  // Fetch user data
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
            email: user.email || "",
          });
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    const fetchEventData = async () => {
      try {
        console.log("🔍 Starting to fetch event data...");
        
        // Check if user is logged in
        const authToken = localStorage.getItem("authToken");
        console.log("🔑 Auth token exists:", !!authToken);
        
        if (!authToken) {
          console.log("❌ No auth token found");
          setError("Please log in to view your events.");
          setLoading(false);
          window.location.href = "/login";
          return;
        }

        console.log("📡 Making API request to: https://api.blocstage.com/events");
        
        // Fetch user's events
        const eventResponse = await fetch("https://api.blocstage.com/events", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        });

        console.log("📊 Response status:", eventResponse.status);
        console.log("📊 Response headers:", Object.fromEntries(eventResponse.headers.entries()));

        if (!eventResponse.ok) {
          const errorText = await eventResponse.text();
          console.error("❌ API Error Response:", errorText);
          
          if (eventResponse.status === 401) {
            setError("Authentication failed. Please log in again.");
            window.location.href = "/login";
          } else {
            setError(`Server error: ${eventResponse.status} - ${errorText}`);
          }
          return;
        }

        const eventData = await eventResponse.json();
        console.log("✅ Event data received:", eventData);
        console.log("📈 Number of events:", eventData.length);
        
        setEvents(eventData);

        // Calculate event overview data
        const overview = {
          totalEventsCreated: eventData.length,
          totalTicketsSold: eventData.reduce((sum: number, event: Event) => sum + (event.tickets_sold ?? 0), 0),
          totalRevenueGenerated: eventData.reduce((sum: number, event: Event) => sum + (event.revenue ?? 0), 0),
        };
        
        console.log("📊 Event overview:", overview);
        setEventOverview(overview);
        
      } catch (e) {
        console.error("❌ Exception caught:", e);
        setError(`Failed to fetch event data: ${e instanceof Error ? e.message : 'Unknown error'}`);
      } finally {
        setLoading(false);
        console.log("🏁 Fetch completed, loading set to false");
      }
    };

    fetchEventData();
  }, []);

  // Function to fetch individual event details if needed
  const fetchEventById = async (eventId: string) => {
    try {
      const authToken = localStorage.getItem("authToken");
      if (!authToken) {
        throw new Error("No authentication token found");
      }

      const response = await fetch(`https://api.blocstage.com/events/${eventId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching event:", error);
      throw error;
    }
  };

  // Function to refresh events data
  const refreshEvents = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const authToken = localStorage.getItem("authToken");
      if (!authToken) {
        setError("Please log in to view your events.");
        window.location.href = "/login";
        return;
      }

      const eventResponse = await fetch("https://api.blocstage.com/events", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (!eventResponse.ok) {
        if (eventResponse.status === 401) {
          setError("Authentication failed. Please log in again.");
          window.location.href = "/login";
        } else {
          throw new Error(`HTTP error! status: ${eventResponse.status}`);
        }
        return;
      }

      const eventData = await eventResponse.json();
      setEvents(eventData);

      setEventOverview({
        totalEventsCreated: eventData.length,
        totalTicketsSold: eventData.reduce((sum: number, event: Event) => sum + (event.tickets_sold ?? 0), 0),
        totalRevenueGenerated: eventData.reduce((sum: number, event: Event) => sum + (event.revenue ?? 0), 0),
      });
    } catch (e) {
      setError("Failed to refresh event data.");
      console.error("Failed to refresh event data:", e);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredEvents = () => {
    const now = new Date();
    switch (activeTab) {
      case "Upcoming":
        return events.filter((event) => new Date(event.start_time) > now);
      case "Ended":
        return events.filter((event) => new Date(event.start_time) < now);
      case "All Events":
      default:
        return events;
    }
  };

  const filteredEvents = getFilteredEvents();
  
  console.log("🎯 Render state:", {
    loading,
    error,
    eventsCount: events.length,
    filteredEventsCount: filteredEvents.length,
    activeTab,
    eventOverview
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-t-4 border-[#F4511E] border-gray-200 rounded-full animate-spin mb-4 mx-auto"></div>
        <p>Loading events...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-[#092C4C] text-white rounded hover:bg-[#0a3a5c]"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-8 bg-[#F8F8F8] py-8 min-h-screen p-8 ml-0 md:ml-64">
      {/* Header section from the image */}
      <div className="flex flex-row justify-between items-center mb-8">
        <h1 className="text-xl font-bold text-[#282828]">Events</h1>
        <div className="bg-[#E4F0FC] p-2 rounded-md cursor-pointer">
          <Bell className="w-6 h-5 text-[#092C4C]" />
        </div>
      </div>
      {/* Greeting and "Create Event" button */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold text-[#092C4C] mb-2">
           Hi {userData.name}!
          </h1>
          <p className="text-gray-600">It&apos;s time to create and manage event</p>
        </div>
        <Link href="/createevent">
          <Button className="hidden md:block bg-[#0C2D48] text-white">
            Create Event
          </Button>
        </Link>
      </div>
      {/* Event Overview Section */}
      <div className="mb-8 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold text-[#282828] mb-4">Event Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="flex items-center p-6 bg-[#F8F8F8] rounded-lg ">
            <div className="w-12 h-12 flex items-center justify-center bg-[#FBEAE4] rounded-full mr-4">
              <CalendarDays className="w-6 h-6 text-[#F4511E]" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {eventOverview?.totalEventsCreated ?? 0}
              </p>
              <p className="text-sm text-gray-500">Total Events Created</p>
            </div>
          </Card>
          <Card className="flex items-center p-4 bg-[#F8F8F8] rounded-lg">
            <div className="w-12 h-12 flex items-center justify-center bg-[#E4F0FC] rounded-full mr-4">
              <Ticket className="w-6 h-6 text-[#092C4C]" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {eventOverview?.totalTicketsSold ?? 0}
              </p>
              <p className="text-sm text-gray-500">Total Ticket Sold</p>
            </div>
          </Card>
          <Card className="flex items-center p-4 bg-[#F8F8F8] rounded-lg">
            <div className="w-12 h-12 flex items-center justify-center bg-[#E4F0FC] rounded-full mr-4">
              <DollarSign className="w-6 h-6 text-[#092C4C]" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {eventOverview?.totalRevenueGenerated ?? 0}
              </p>
              <p className="text-sm text-gray-500">Total Revenue Generated</p>
            </div>
          </Card>
        </div>
      </div>
      {/* Event List Section */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-[#282828] mb-4">Events</h2>
        {/* Tabs for filtering events */}
        <div className="flex space-x-4 mb-6 text-gray-600">
          <button
            onClick={() => setActiveTab("Upcoming")}
            className={`font-semibold ${
              activeTab === "Upcoming" ? "text-[#F4511E] border-b-2 border-[#F4511E]" : "hover:text-gray-800"
            }`}
          >
            Upcoming
          </button>
          <button
            onClick={() => setActiveTab("All Events")}
            className={`font-semibold ${
              activeTab === "All Events" ? "text-[#F4511E] border-b-2 border-[#F4511E]" : "hover:text-gray-800"
            }`}
          >
            All Events
          </button>
          <button
            onClick={() => setActiveTab("Published")}
            className={`font-semibold ${
              activeTab === "Published" ? "text-[#F4511E] border-b-2 border-[#F4511E]" : "hover:text-gray-800"
            }`}
          >
            Published
          </button>
          <button
            onClick={() => setActiveTab("Ended")}
            className={`font-semibold ${
              activeTab === "Ended" ? "text-[#F4511E] border-b-2 border-[#F4511E]" : "hover:text-gray-800"
            }`}
          >
            Ended
          </button>
          
        </div>

        {filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <Card
                key={event.id} // Use the unique ID as the key
                className="rounded-lg shadow-md overflow-hidden"
              >
                <CardHeader className="p-0 relative">
                  <Image
                    src={event.image_url || "/images/placeholder.png"}
                    alt={event.title}
                    width={400}
                    height={200}
                    className="w-full h-48 object-cover"
                  />
                  <Badge
                    className="absolute top-2 left-2 text-sm rounded-md p-2"
                    style={{
                      backgroundColor: "#FBEAE4",
                      color: "#F4511E",
                      opacity: 0.8,
                    }}
                  >
                    {event.type}
                  </Badge>
                </CardHeader>
                <CardContent className="p-4">
                  <CardTitle className="text-lg font-semibold text-gray-900 mb-2">
                    {event.title}
                  </CardTitle>
                  <div className="flex items-center text-gray-500 text-sm mb-2">
                    <CalendarDays className="w-4 h-4 mr-2" />
                    <span>
                      {new Date(event.start_time).toLocaleDateString("en-US", {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  <div className="flex items-center text-gray-500 text-sm mb-4">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span>{event.location}</span>
                  </div>
                  <div className="flex flex-row items-center">
                    <div className="flex items-center text-[#F4511E] mr-1">
                      <Ticket className="w-5 h-5 mr-1" />
                      <span className="text-sm font-semibold">
                        {event.tickets_sold ?? 0}
                      </span>
                    </div>
                    <span className="text-gray-500 text-sm">Tickets sold</span>
                  </div>
                  <Link href={`/event/${event.id}`} passHref legacyBehavior>
                    <Button className="w-full mt-4 bg-[#0C2D48] text-white hover:bg-[#0C2D48]">
                      View Event
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-12 bg-white rounded-lg shadow-md text-center">
            <div className="text-center mb-4 p-4 bg-yellow-50 rounded-lg">
              <p className="text-sm text-yellow-800 mb-2">Debug Info:</p>
              <p className="text-xs text-yellow-700">Total events: {events.length}</p>
              <p className="text-xs text-yellow-700">Filtered events: {filteredEvents.length}</p>
              <p className="text-xs text-yellow-700">Active tab: {activeTab}</p>
              <p className="text-xs text-yellow-700">Loading: {loading.toString()}</p>
              <p className="text-xs text-yellow-700">Error: {error || 'None'}</p>
            </div>
            <Image
              src="/images/no-events.png"
              alt="No Events"
              width={150}
              height={150}
              className="mb-4"
            />
            <p className="text-lg font-semibold text-gray-900">No Events</p>
            <p className="text-gray-500 mb-6">You are yet to create an event</p>
            <Link href="/createevent" passHref legacyBehavior>
              <Button className="bg-[#0C2D48] text-white hover:bg-blue-800">
                Create Event
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventDashboard;