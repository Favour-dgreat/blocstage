"use client";
import EventCreationWizard from "@/components/EventCreationWizard";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
const eventPage = () => {
  return (
    <div className="flex min-h-screen">
      
       <Header />
     
      <div className="hidden md:block">
      <Sidebar />
      </div>
      <main className="flex-1 mt-12">
        <EventCreationWizard />
      </main>
    </div>
  );
  };
  
  export default eventPage;
