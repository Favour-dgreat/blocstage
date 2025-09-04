"use client"; 

import React, { useState, useEffect } from 'react';
import {
  MapPin,
  CalendarDays,
  Ticket,
  DollarSign,
  ArrowLeft,
  Calendar,
  Bell,
} from 'lucide-react'; // Ensure you have lucide-react installed

interface EventDetailsProps {
  eventId: string; // The ID of the event to display
}

// Define the expected structure of your event data from the API
interface EventData {
  id: string;
  title: string;
  start_time: string;
  end_time: string;
  location: string;
  tickets_sold: number;
  revenue_generated: number;
  // Add any other properties your API returns
}

// Define the expected structure for the overview cards
interface EventOverview {
  totalEventsCreated: number;
  totalTicketsSold: number;
  totalRevenueGenerated: number;
}


const EventDetails = ({ eventId }: EventDetailsProps) => {
  const [eventData, setEventData] = useState<EventData | null>(null);
  const [eventOverview, setEventOverview] = useState<EventOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('Upcoming'); // Matches the initial state in the image

  useEffect(() => {
    const fetchEventData = async () => {
      setLoading(true);
      setError(null); // Reset error on new fetch
      try {
        const response = await fetch(`https://api.blocstage.com/events/${eventId}`);
        
        if (!response.ok) {
          // Attempt to read error message from body if available
          const errorText = await response.text();
          throw new Error(`HTTP error! Status: ${response.status} - ${errorText}`);
        }
        
        const data: EventData = await response.json();
        setEventData(data);
        
        // Populate event overview with dynamic data where possible,
        // otherwise use sensible defaults or fetch from another endpoint if available.
        setEventOverview({
          totalEventsCreated: 1, // This typically comes from a different aggregate API
          totalTicketsSold: data.tickets_sold,
          totalRevenueGenerated: data.revenue_generated,
        });

      } catch (e: any) {
        console.error("Failed to fetch event data:", e);
        setError(`Failed to load event details: ${e.message}`);
      } finally {
        setLoading(false);
      }
    };
    
    if (eventId) {
      fetchEventData();
    } else {
      setLoading(false);
      setError("No event ID provided.");
    }

  }, [eventId]); // Depend on eventId so data refetches if ID changes

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <p className="text-gray-600 text-lg">Loading event details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <p className="text-red-500 text-lg">Error: {error}</p>
      </div>
    );
  }

  if (!eventData) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <p className="text-gray-700 text-lg">Event not found.</p>
      </div>
    );
  }

  // Helper functions for date and time formatting
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const formatTime = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit', hour12: true, timeZoneName: 'short' };
    return new Date(dateString).toLocaleTimeString(undefined, options);
  };

  const formattedDate = formatDate(eventData.start_time);
  const formattedStartTime = formatTime(eventData.start_time);
  const formattedEndTime = formatTime(eventData.end_time);

  return (
    <div className="bg-[#F8F8F8] min-h-screen p-6 sm:p-8 md:p-12">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Top Header Section (Back link and Bell icon) */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center">
          <div className="flex items-center space-x-2 text-sm text-gray-500 mb-4 md:mb-0">
            <a href="/events" className="hover:underline">
              Event
            </a>
            <span>/</span>
            <span className="font-semibold text-gray-700">Preview Event</span>
          </div>
          <div className="bg-[#E4F0FC] p-2 rounded-md cursor-pointer flex-shrink-0 hover:bg-[#d0e0f5] transition-colors">
            <Bell className="w-6 h-5 text-[#092C4C]" />
          </div>
        </div>

        {/* Main Event Details Header */}
        <div className="bg-white p-6 sm:p-8 rounded-lg shadow-md">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
            <h1 className="text-3xl font-bold text-[#282828] mb-4 lg:mb-0">
              {eventData.title}
            </h1>
            <button className="bg-[#0C2D48] text-white px-6 py-3 rounded-md font-medium text-sm hover:bg-[#092C4C] transition-colors self-start lg:self-auto">
              Edit Event Details
            </button>
          </div>

          {/* Event Info - Date, Time, Location */}
          <div className="space-y-4 text-gray-700 text-base">
            <div className="flex items-center space-x-3">
              <CalendarDays className="w-5 h-5 text-gray-500" />
              <span className="font-medium">{formattedDate}</span>
            </div>
            <div className="flex items-center space-x-3">
              <Calendar className="w-5 h-5 text-gray-500" />
              <span className="font-medium">{formattedStartTime} - {formattedEndTime}</span>
            </div>
            <div className="flex items-start space-x-3">
              <MapPin className="w-5 h-5 text-gray-500 flex-shrink-0 mt-1" />
              <span className="font-medium">{eventData.location}</span>
            </div>
          </div>

          {/* Event Tabs */}
          <div className="flex flex-wrap space-x-4 sm:space-x-6 mt-8 border-b border-gray-200 text-gray-600">
            {['Upcoming', 'Tickets', 'Attendee List', 'Sales'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-3 px-2 text-sm sm:text-base font-semibold transition-colors whitespace-nowrap ${
                  activeTab === tab
                    ? 'text-[#F4511E] border-b-2 border-[#F4511E]'
                    : 'hover:text-gray-800'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Event Overview Section */}
        <div className="bg-white p-6 sm:p-8 rounded-lg shadow-md">
          <h2 className="text-xl font-bold text-[#282828] mb-6">
            Event Overview
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card: Total Events Created */}
            <div className="flex items-center p-6 bg-[#F8F8F8] rounded-lg">
              <div className="w-12 h-12 flex items-center justify-center bg-[#FBEAE4] rounded-full mr-4 flex-shrink-0">
                <CalendarDays className="w-6 h-6 text-[#F4511E]" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {eventOverview?.totalEventsCreated ?? 0}
                </p>
                <p className="text-sm text-gray-500">Total Events Created</p>
              </div>
            </div>
            {/* Card: Total Ticket Sold */}
            <div className="flex items-center p-6 bg-[#F8F8F8] rounded-lg">
              <div className="w-12 h-12 flex items-center justify-center bg-[#E4F0FC] rounded-full mr-4 flex-shrink-0">
                <Ticket className="w-6 h-6 text-[#092C4C]" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {eventOverview?.totalTicketsSold ?? 0}
                </p>
                <p className="text-sm text-gray-500">Total Ticket Sold</p>
              </div>
            </div>
            {/* Card: Total Revenue Generated */}
            <div className="flex items-center p-6 bg-[#F8F8F8] rounded-lg">
              <div className="w-12 h-12 flex items-center justify-center bg-[#E4F0FC] rounded-full mr-4 flex-shrink-0">
                <DollarSign className="w-6 h-6 text-[#092C4C]" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  ₦{(eventOverview?.totalRevenueGenerated ?? 0).toLocaleString()}
                </p>
                <p className="text-sm text-gray-500">Total Revenue Generated</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;  