"use client";

import { useState } from 'react';
import { Plus, Clock, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Image from "next/image";
interface Session {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  speaker: string;
}

interface AgendaScheduleFormProps {
  data: any;
  onUpdate: (data: any) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function AgendaScheduleForm({ data, onUpdate, onNext, onBack }: AgendaScheduleFormProps) {
  const [sessions, setSessions] = useState<Session[]>(
    data.sessions?.length > 0 ? data.sessions : [
      {
        id: '1',
        title: '',
        startTime: '',
        endTime: '',
        speaker: ''
      }
    ]
  );

  const addNewSession = () => {
    const newSession: Session = {
      id: Date.now().toString(),
      title: '',
      startTime: '',
      endTime: '',
      speaker: ''
    };
    setSessions([...sessions, newSession]);
  };

  const updateSession = (id: string, field: string, value: string) => {
    const updatedSessions = sessions.map(session =>
      session.id === id ? { ...session, [field]: value } : session
    );
    setSessions(updatedSessions);
    onUpdate({ sessions: updatedSessions });
  };

  const removeSession = (id: string) => {
    if (sessions.length > 1) {
      const updatedSessions = sessions.filter(session => session.id !== id);
      setSessions(updatedSessions);
      onUpdate({ sessions: updatedSessions });
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Agenda & Schedule</h2>
      
      <div className="space-y-6 flex flex-row gap-4">
        {sessions.map((session, index) => (
          <div key={session.id} className="bg-gray-50 rounded-lg p-6">
            <div className="grid grid-cols-2 lg:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-2">
                  Session title
                </label>
                <Input
                  value={session.title}
                  onChange={(e) => updateSession(session.id, 'title', e.target.value)}
                  placeholder={index === 0 ? "Welcome & Introductions" : "Session Name"}
                  className="w-full"
                />
              </div>
              

              <div>
                <label className="block text-sm font-medium text-gray-500 mb-2">
                  Session Duration
                </label>
                <div className="relative">
                  <Input
                    type="time"
                    value={session.startTime}
                    onChange={(e) => updateSession(session.id, 'startTime', e.target.value)}
                    placeholder="7:30pm"
                    className="w-full"
                  />
                  <Clock className="absolute right-3 top-3 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 mb-2">
                  Session Duration
                </label>
                <div className="relative">
                  <Input
                    type="time"
                    value={session.endTime}
                    onChange={(e) => updateSession(session.id, 'endTime', e.target.value)}
                    placeholder="8:00pm"
                    className="w-full"
                  />
                  <Clock className="absolute right-3 top-3 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                size="sm"
                className="text-gray-600 border-gray-300 hover:bg-gray-100"
              >
                <User className="w-4 h-4 mr-2" />
                Assign Speaker
              </Button>
              
              {sessions.length > 1 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeSession(session.id)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  Remove
                </Button>
              )}
            </div>
            
          </div>
          
          
        ))}
      </div>

      <div className="mt-8 flex items-center justify-between">
        <Button
          variant="outline"
          onClick={addNewSession}
          className="flex items-center gap-2 text-gray-600 border-gray-300 hover:bg-gray-100"
        >
          <Plus className="w-4 h-4" />
          Add new agenda
        </Button>

        <div className="flex gap-4">
          <Button
            variant="outline"
            onClick={onBack}
            className="px-6 py-2"
          >
            Back
          </Button>
          <Button
            onClick={onNext}
            className="px-8 py-2 bg-[#092C4C] text-white hover:[#092C4C]"
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}