import EventDashboard from "@/components/EventDashboard";
import Sidebar from "@/components/Sidebar";

const viewEvent = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1">
       <EventDashboard />
      </main>
    </div>
  );
    };
  
  export default viewEvent;
