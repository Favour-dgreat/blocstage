import EventCreationWizard from "@/components/EventCreationWizard";
import Sidebar from "@/components/Sidebar";

const eventPage = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1">
        <EventCreationWizard />
      </main>
    </div>
  );
    };
  
  export default eventPage;
