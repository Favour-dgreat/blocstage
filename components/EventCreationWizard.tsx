"use client";

import { useState } from 'react';
import { Check } from 'lucide-react';
import EventDetailsForm from './EventDetailsForm';
import AgendaScheduleForm from './AgendaScheduleForm';

const steps = [
  { id: 'details', title: 'Event Details', completed: false },
  { id: 'agenda', title: 'Agenda & Schedule', completed: false },
  { id: 'tickets', title: 'Tickets', completed: false },
  { id: 'preview', title: 'Preview', completed: false },
];

export default function EventCreationWizard() {
  const [currentStep, setCurrentStep] = useState(0);
  const [eventData, setEventData] = useState({
    name: '',
    location: '',
    description: '',
    startDate: '',
    endDate: '',
    image: null,
    isOnline: false,
    sessions: []
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
    setEventData(prev => ({ ...prev, ...data }));
  };

  return (
    <div className="max-w-6xl mx-auto px-8 py-8">
      {/* Breadcrumb */}
      <div className="mb-8">
        <div className="flex items-center text-sm text-gray-500">
          <span className="text-orange-500">Event</span>
          <span className="mx-2">/</span>
          <span>Create Event</span>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="mb-12">
        <div className="flex items-center justify-between max-w-4xl">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center flex-1">
              <div className="flex flex-col items-center">
                 <div className="text-xs font-light mb-1 text-[#092C4C]">
                   {step.title}
                </div>
                <div className="flex flex-col items-center">
               
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                            index <= currentStep 
                            ? 'bg-[#f9fafa] border-[#092C4C] text-white' 
                            : 'border-[#092C4C] text-gray-400 bg-[#fff]'
                    }`}>
                        {index < currentStep ? (
                            <Check className="w-4 h-4 text-[#092C4C]" />
                        ) : (
                            null
                        )}
                    </div>
                </div>
              </div>
              {index < steps.length - 1 && (
                <div className={`flex-1 h-1.5 mx-2 mt-5 ${
                  index < currentStep ? 'bg-[#092C4C]' : 'bg-gray-200'
                }`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="bg-white rounded-lg">
        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Event</h1>
            <p className="text-gray-600">Let's get your event up and running!</p>
          </div>

          {currentStep === 0 && (
            <EventDetailsForm 
              data={eventData}
              onUpdate={updateEventData}
              onNext={handleNext}
            />
          )}

          {currentStep === 1 && (
            <AgendaScheduleForm 
              data={eventData}
              onUpdate={updateEventData}
              onNext={handleNext}
              onBack={handleBack}
            />
          )}

          {currentStep === 2 && (
            <div className="text-center py-12">
              <h2 className="text-xl font-semibold mb-4">Tickets Configuration</h2>
              <p className="text-gray-600 mb-8">Event tickets and pricing.</p>
              <div className="flex gap-4 justify-center">
                <button
                  onClick={handleBack}
                  className="px-6 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50"
                >
                  Back
                </button>
                <button
                  onClick={handleNext}
                  className="px-6 py-2 bg-[#092C4C] text-white rounded-lg font-medium hover:bg-[#092C4C]"
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="text-center py-12">
              <h2 className="text-xl font-semibold mb-4">Preview Your Event</h2>
              <p className="text-gray-600 mb-8">Review your event details before publishing.</p>
              <div className="flex gap-4 justify-center">
                <button
                  onClick={handleBack}
                  className="px-6 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50"
                >
                  Back
                </button>
                <button className="px-6 py-2 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600">
                  Publish Event
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}