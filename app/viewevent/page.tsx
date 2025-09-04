"use client";
import EventDashboard from "@/components/EventDashboard";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";

const viewEvent = () => {
  return (
    <div className="flex min-h-screen">
        
        <div className="hidden md:block">
          <Sidebar />
        </div>
      <main className="flex-1">
       <EventDashboard />
      </main>
    </div>
  );
    };
  
  export default viewEvent;
