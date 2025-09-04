import EventDetails from "@/components/EventDetails";
import  {EventData} from "@/components/EventDetails"; 
import Sidebar from"@/components/Sidebar";
// import Header from "@/components/Header";
import Image from "next/image";
import React from "react";
import ShareButton from "@/components/ShareButton";

// Define the props for the page component
interface EventPageProps {
  params: {
    id: string; // The dynamic part of the URL, e.g., /event/123 -> id = '123'
  };
}

// Generate static paths for each event
export async function generateStaticParams() {
  const response = await fetch('https://api.blocstage.com/events');
  const events: EventData[] = await response.json();
  return events.map((event) => ({
    id: event.id,
  }));
}

const EventPage = ({ params }: EventPageProps) => {
  const { id } = params;

  return (
    <div className="flex min-h-screen">
          
           {/* <Header /> */}
         
          <div className="hidden md:block">
          <Sidebar />
          </div>
          <main className="flex-1 mt-12">
      <EventDetails eventId={id} />
 </main>
    </div>  );
};

export default EventPage;