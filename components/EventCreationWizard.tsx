"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { useRouter } from "next/navigation";
import EventDetailsForm from "./EventDetailsForm";
import EventDetailsPreview from "./EventDetailsPreview";
import AgendaScheduleForm from "./AgendaScheduleForm";
import TicketsForm from "./TicketsForm";
import EventPreview from "./EventPreview";

const steps = [
  { id: "details", title: "Event Details", completed: false },
  { id: "agenda", title: "Agenda & Schedule", completed: false },
  { id: "tickets", title: "Tickets", completed: false },
  { id: "preview", title: "Preview", completed: false },
  { id: "finalpreview", title: "FinalPreview", completed: false },
];

export default function EventCreationWizard() {
  const [currentStep, setCurrentStep] = useState(0);
  const [eventData, setEventData] = useState({
    title: "",
    description: "",
    location: "",
    start_time: "",
    end_time: "",
    isOnline: false,
    image: null,
    category: "",
    tags: [],
    sessions: [
      {
        title: "",
        description: "",
        speaker_name: "",
        start_time: "",
        end_time: "",
      },
    ],
  });
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const router = useRouter();

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const updateEventData = (data: any) => {
    setEventData((prev) => ({ ...prev, ...data }));
  };

  const handleStepClick = (index: number) => {
    setCurrentStep(index);
  };
const uploadImageToCloudinary = async (imageFile:any) => {
  const cloudName = "dsohqp4d9";
  const unsignedUploadPreset = "blocstage"; 

  const formData = new FormData();
  formData.append("file", imageFile);
  formData.append("upload_preset", unsignedUploadPreset);

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (response.ok) {
      const data = await response.json();
      return data.secure_url; 
    } else {
      const errorData = await response.json();
      console.error("Cloudinary upload failed:", errorData);
      throw new Error("Cloudinary upload failed");
    }
  } catch (error) {
    console.error("An error occurred during Cloudinary upload:", error);
    throw error;
  }
};
  const handlePublish = async () => {
    try {
      const authToken = localStorage.getItem("authToken");

      if (!authToken) {
        alert("Authentication token not found. Please log in.");
        return;
      }

      // 1. Handle image upload to Cloudinary
      let imageUrl = eventData.image; // Assume it's a URL by default

      // Check if eventData.image is a file object (not a string)
      if (eventData.image && typeof eventData.image !== 'string') {
        try {
          imageUrl = await uploadImageToCloudinary(eventData.image);
        } catch (error) {
          alert("Failed to upload image. Please try again.");
          return;
        }
      }

      const eventDate = eventData.start_time.split("T")[0]; 

      const payload = {
        title: eventData.title,
        description: eventData.description,
        location: eventData.location,
        start_time: eventData.start_time,
        end_time: eventData.end_time,
        category: eventData.category,
        // event_type: eventData.isOnline, // Re-enable this if needed
        tags: eventData.tags,
        banner_image_url: imageUrl, // Use the new image URL here
        sessions: eventData.sessions.map((session, index) => {
          const sessionStartTime = `${eventDate}T${session.start_time}:00Z`;
          const sessionEndTime = `${eventDate}T${session.end_time}:00Z`;

          return {
            title: session.title,
            start_time: sessionStartTime,
            end_time: sessionEndTime,
            speaker_name: session.speaker_name,
            session_order: index,
          };
        }),
      };

      const response = await fetch("https://api.blocstage.com/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
       setShowSuccessModal(true);
        setCurrentStep(0);
        setEventData({
          title: "",
          description: "",
          location: "",
          start_time: "",
          end_time: "",
          image: null,
          isOnline: false,
          category: "",
          tags: [],
          sessions: [
            {
              title: "",
              description: "",
              speaker_name: "",
              start_time: "",
              end_time: "",
            },
          ],
        });
         setTimeout(() => {
          setShowSuccessModal(false);
          router.push("/viewevent");
        }, 60000);
      } else {
        const errorData = await response.json();
        console.log(payload);
        console.error("Failed to publish event:", errorData);
        alert(
          `Failed to publish event: ${errorData.message || response.statusText}`
        );
      }
    } catch (error) {
      console.error("An error occurred:", error);
      alert("An error occurred while publishing the event. Please try again.");
    }
  };

  return (
    <div className="md:ml-64 max-w-6xl mx-auto px-8 py-8">
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg p-8 flex flex-col items-center">
            <div className="bg-green-100 rounded-full p-4 mb-4">
              <Check className="w-12 h-12 text-green-600" />
            </div>
            <p className="text-lg font-semibold text-gray-800 mb-2 text-center">
              Event published successfully!
            </p>
            <p className="text-sm text-gray-500 text-center">
              Redirecting to your events page...
            </p>
          </div>
        </div>
      )}
      {/* Breadcrumb */}
      <div className="mb-8">
        <h1 className="text-[#092C4C] font-bold mb-4">Event</h1>

        <div className="flex items-center text-md text-gray-500">
          <a href="/viewevent" className="hover:underline">
          <span className="text-orange-500">Event</span>
          </a>
          <span className="mx-2">/</span>
          <span>Create Event</span>
        </div>
      </div>

      {/* Progress Steps */}
   <div className="mb-6">
  <div className="flex items-center justify-between ">
    {steps.map((step, index) => (
      <div key={step.id} className="flex items-center flex-1">
        <div
          className="flex flex-col items-center cursor-pointer"
          onClick={() => handleStepClick(index)}
        >
          {/* Step Circle */}
          <div
            className={`w-5 h-5 rounded-full flex items-center justify-center border-2 ${
              index < currentStep
                ? "bg-[#092C4C] border-[#092C4C] text-white"
                : index === currentStep
                ? "bg-white border-[#092C4C] text-[#092C4C]"
                : "border-gray-300 text-gray-400"
            }`}
          >
            {index < currentStep && <Check className="w-4 h-4" />}
          </div>
          {/* Step Name */}
          {/* <span className="mt-2 text-xs text-center text-gray-700 max-w-[80px]">
            {step.title}
          </span> */}
        </div>
        {/* Progress Bar */}
        {index < steps.length - 1 && (
          <div
            className={`flex-1 flex-row w-2.5 h-1.5 ${
              index < currentStep ? "bg-[#092C4C]" : "bg-gray-200"
            }`}
          />
        )}
      </div>
    ))}
  </div>
</div>
      {/* Content */}
      <div className=" rounded-lg">
        <div className="p-2">
          {currentStep === 0 && (
            
            <EventDetailsForm
              data={eventData}
              onUpdate={updateEventData}
              onNext={handleNext}
            />
          )}

          {currentStep === 1 && (
            <EventDetailsPreview
              onBack={handleBack}
              onUpdate={updateEventData}
              onNext={handleNext}
            />
          )}

          {currentStep === 2 && (
            <AgendaScheduleForm
              data={eventData}
              onUpdate={updateEventData}
              onBack={handleBack}
              onNext={handleNext}
            />
          )}
          {currentStep === 3 && (
            <TicketsForm
              data={eventData}
              onUpdate={updateEventData}
              onNext={handleNext}
              onBack={handleBack}
            />
          )}

          {currentStep === 4 && (
            <EventPreview
              data={eventData}
              onBack={handleBack}
              onPublish={handlePublish}
            />
          )}
        </div>
      </div>
    </div>
  );
}
