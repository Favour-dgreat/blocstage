"use client";

import { useState } from "react";
import { Check } from "lucide-react";
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
    name: "",
    location: "",
    description: "",
    startDate: "",
    endDate: "",
    image: null,
    isOnline: false,
    sessions: [],
    tickets: [],
  });

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

  const handleStepClick = (index: any) => {
    setCurrentStep(index);
  };

  return (
    <div className="ml-64 max-w-6xl mx-auto px-8 py-8">
      {/* Breadcrumb */}
      <div className="mb-8">
        <div className="flex items-center text-sm text-gray-500">
          <span className="text-orange-500">Event</span>
          <span className="mx-2">/</span>
          <span>Create Event</span>
        </div>
      </div>

      {/*Progress Steps*/}
      <div className="mb-12">
        <div className="flex items-center justify-between ">
          
          {steps.map((step, index) => (
            
            <div key={step.id} className="flex items-center flex-1">
              
              <div
                className="flex flex-col items-center cursor-pointer"
                onClick={() => handleStepClick(index)}
              >
                {/* Step Title */}
                
                {/* Step Circle */}
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center border-2 ${
                    index < currentStep
                      ? "bg-[#092C4C] border-[#092C4C] text-white" // Completed Step
                      : index === currentStep
                      ? "bg-white border-[#092C4C] text-[#092C4C]" // Current Step
                      : "border-gray-300 text-gray-400" // Incomplete Step
                  }`}
                >
                  {index < currentStep && <Check className="w-4 h-4" />}
                </div>
                
              </div>
              {/* Progress Bar */}
              {index < steps.length - 1 && (
                <div
                  className={`flex-1 flex-row h-1.5 ${
                    index < currentStep ? "bg-[#092C4C]" : "bg-gray-200"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>
      {/* Content */}
      <div className="bg-white rounded-lg">
        <div className="p-8">
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
              onPublish={() => {
                console.log("Publishing event:", eventData);
                // Handle event publishing logic here
                alert("Event published successfully!");

                setCurrentStep(0);
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
