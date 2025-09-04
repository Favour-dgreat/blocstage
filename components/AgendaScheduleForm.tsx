"use client";

import { useState } from "react";
import { Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

interface Session {
  id: string;
  title: string;
  description: string;
  start_time: string;
  end_time: string;
  speaker_name: string;
  session_order: number;
}

interface AgendaScheduleFormProps {
  data: any;
  onUpdate: (data: any) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function AgendaScheduleForm({
  data,
  onUpdate,
  onNext,
  onBack,
}: AgendaScheduleFormProps) {
  const [sessions, setSessions] = useState<Session[]>(
    data.sessions?.length > 0
      ? data.sessions
      : [
          {
            id: "1",
            title: "",
            start_time: "",
            end_time: "",
            speaker_name: "",
            session_order: 0,
          },
        ]
  );

  const [showSkip, setShowSkip] = useState(true);
  const [nextEnabled, setNextEnabled] = useState(false);

  const addNewSession = () => {
    const newSession: Session = {
      id: Date.now().toString(),
      title: "",
      description: "",
      start_time: "",
      end_time: "",
      speaker_name: "",
      session_order: sessions.length,
    };
    setSessions((prev) => [...prev, newSession]);
    setShowSkip(false);
    setNextEnabled(true);
  };

  const updateSession = (id: string, field: keyof Session, value: any) => {
    const updatedSessions = sessions.map((session) =>
      session.id === id ? { ...session, [field]: value } : session
    );
    setSessions(updatedSessions);
    onUpdate({ sessions: updatedSessions });
  };

  const removeSession = (id: string) => {
    if (sessions.length > 1) {
      const updatedSessions = sessions
        .filter((session) => session.id !== id)
        .map((session, index) => ({ ...session, session_order: index }));
      setSessions(updatedSessions);
      onUpdate({ sessions: updatedSessions });
    }
  };

  return (
  <div>
    <h2 className="text-xl font-semibold text-[#092C4C] mb-2">
      Agenda 
    </h2>
    <p className="text-sm text-[#4F4F4F] mb-8">Set up your agenda of the day</p>

    <div className="space-y-6 flex flex-col gap-4">
      {sessions.map((session, index) => (
        <div key={session.id} className="rounded-lg">
          <h2 className="text-sm font-light text-[#121111] mb-6">
            Agenda & Schedule
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-[#BDBDBD] mb-4">
                Session title
              </label>
              <Input
                value={session.title}
                onChange={(e) =>
                  updateSession(session.id, "title", e.target.value)
                }
                placeholder={
                  index === 0 ? "Welcome & Introductions" : "Session Name"
                }
                className="w-full"
              />
            </div>

            {/* Start Date & Time */}
            <div>
              <label className="block text-sm font-medium text-[#BDBDBD] mb-4">
                Session Start
              </label>
              <div className="relative">
                <Input
                  type="datetime-local"
                  step="1"
                  placeholder="Pick date and time"
                  value={session.start_time}
                  onChange={(e) =>
                    updateSession(session.id, "start_time", e.target.value)
                  }
                  className="w-full"
                />
              </div>
            </div>

            {/* End Date & Time */}
            <div>
              <label className="block text-sm font-medium text-[#BDBDBD] mb-4">
                Session End
              </label>
              <div className="relative">
                <Input
                  type="datetime-local"
                  step="1"
                  placeholder="Pick date and time"
                  value={session.end_time}
                  onChange={(e) =>
                    updateSession(session.id, "end_time", e.target.value)
                  }
                  className="w-full"
                />
              </div>
            </div>

            {/* Speaker (full width on mobile, last column on desktop) */}
            <div className="md:col-span-2 lg:col-span-1">
              <label className="block text-sm font-medium text-[#BDBDBD] mb-4">
                Speaker
              </label>
              <div className="relative">
                <Input
                  type="text"
                  value={session.speaker_name}
                  onChange={(e) =>
                    updateSession(session.id, "speaker_name", e.target.value)
                  }
                  placeholder="Chioma Chiboo Ibekwe"
                  className="w-full"
                />
              </div>
            </div>
          </div>

          {/* Switch & Remove Button */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
            
            {sessions.length > 1 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeSession(session.id)}
                className="bg-[#EB5757] text-white hover:text-red-700 hover:bg-red-50"
              >
                Remove Session
              </Button>
            )}
          </div>
        </div>
      ))}
    </div>

    {/* Footer */}
    <div className="mt-8 flex flex-col md:flex-row items-center justify-between gap-4">
      <Button
        variant="outline"
        onClick={addNewSession}
        className="flex items-center gap-2 text-[#092C4C] text-xs font-light border-[#DBEBFB] bg-[#DBEBFB] hover:bg[#092C4C] w-full md:w-auto"
      >
        Add new agenda
      </Button>

      <div className="bb flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
        {showSkip && (
          <Button variant="ghost" onClick={onNext} className="text-gray-500 w-full md:w-auto">
            Skip this step
          </Button>
        )}
        <Button
          onClick={onNext}
          className={`px-8 py-2 text-white w-full md:w-auto ${
            "bg-[#092C4C] hover:bg-[#092C4C]" 
          }`}
        >
          Next
        </Button>
      </div>
    </div>
  </div>
);
}