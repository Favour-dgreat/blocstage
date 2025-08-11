"use client";

import { useState } from 'react';
import { Check } from 'lucide-react';
import EventDetailsForm from './EventDetailsForm';
import EventDetailsPreview from './EventDetailsPreview';

import AgendaScheduleForm from './AgendaScheduleForm';
import TicketsForm from './TicketsForm';
import EventPreview from './EventPreview';

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
    sessions: [],
    tickets: []
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
    <div className="ml-64 max-w-6xl mx-auto px-8 py-8">
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
              <div className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                  index <= currentStep 
                    ? 'bg-blue-900 border-blue-900 text-white' 
                    : 'border-gray-300 text-gray-400'
                }`}>
                  {index < currentStep ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <span className="text-sm font-medium">{index + 1}</span>
                  )}
                </div>
                <span className={`ml-3 text-sm font-medium ${
                  index <= currentStep ? 'text-blue-900' : 'text-gray-400'
                }`}>
                  {/* {step.title} */}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div className={`flex-1 h-0.5 mx-4 ${
                  index < currentStep ? 'bg-blue-900' : 'bg-gray-200'
                }`} />
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
              onUpdate={updateEventData}
              onNext={handleNext}
              onBack={handleBack}
            />
          )}

          {currentStep === 2 && (
            <TicketsForm 
              data={eventData}
              onUpdate={updateEventData}
              onNext={handleNext}
              onBack={handleBack}
            />
          )}

          {currentStep === 3 && (
            <EventPreview 
              data={eventData}
              onBack={handleBack}
              onPublish={() => {
                console.log('Publishing event:', eventData);
                // Handle event publishing logic here
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}