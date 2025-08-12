"use client";

import { useState } from "react";
import { Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

interface Session {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  speaker: string;
  isAssigned: boolean; // Added this for independent toggles
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
            startTime: "",
            endTime: "",
            speaker: "",
            isAssigned: false,
          },
        ]
  );

  const [showSkip, setShowSkip] = useState(true);
  const [nextEnabled, setNextEnabled] = useState(false);

  const addNewSession = () => {
    const newSession: Session = {
      id: Date.now().toString(),
      title: "",
      startTime: "",
      endTime: "",
      speaker: "",
      isAssigned: false,
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
      const updatedSessions = sessions.filter((session) => session.id !== id);
      setSessions(updatedSessions);
      onUpdate({ sessions: updatedSessions });
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900 mb-6">
        Agenda & Schedule
      </h2>

      <div className="space-y-6 flex flex-col gap-4">
        {sessions.map((session, index) => (
          <div key={session.id} className="bg-gray-50 rounded-lg p-6">
            <div className="grid grid-cols-3 lg:grid-cols-3 gap-4 mb-4">
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

              {/* Start Time */}
              <div>
                <label className="block text-sm font-medium text-[#BDBDBD] mb-4">
                  Session Start
                </label>
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="Pick time"
                    onFocus={(e) => (e.target.type = "time")}
                    value={session.startTime}
                    onChange={(e) =>
                      updateSession(session.id, "startTime", e.target.value)
                    }
                    className="w-full"
                  />
                  {/* <Clock className="absolute right-3 top-3 h-4 w-4 text-gray-400 pointer-events-none" /> */}
                </div>
              </div>

              {/* End Time */}
              <div>
                <label className="block text-sm font-medium text-[#BDBDBD] mb-4">
                  Session End
                </label>
                <div className="relative">
                  <Input
                   type="text"
                    placeholder="Pick time"
                      onFocus={(e) => (e.target.type = "time")}
                    value={session.endTime}
                    onChange={(e) =>
                      updateSession(session.id, "endTime", e.target.value)
                    }
                   
                    className="w-full"
                  />
                </div>
              </div>

              {/* Speaker */}
              <div>
                <label className="block text-sm font-medium text-[#BDBDBD] mb-4">
                  Speaker
                </label>
                <div className="relative">
                  <Input
                    type="text"
                    value={session.speaker}
                    onChange={(e) =>
                      updateSession(session.id, "speaker", e.target.value)
                    }
                    placeholder="Chioma Chiboo Ibekwe"
                    className="w-full"
                  />
                </div>
              </div>
            </div>

            {/* Switch & Remove Button */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <p className="text-sm font-light text-[#282828]">
                  Assign Speaker
                </p>
                <Switch
                  id={`assign-speaker-${session.id}`}
                  checked={session.isAssigned}
                  onCheckedChange={(checked) =>
                    updateSession(session.id, "isAssigned", checked)
                  }
                  className={
                    session.isAssigned
                      ? "bg-[#092C4C] text-white hover:bg-[#092C4C]"
                      : "text-gray-600 border-gray-300 hover:bg-gray-100"
                  }
                />
              </div>
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
      <div className="mt-8 flex items-center justify-between">
        <Button
          variant="outline"
          onClick={addNewSession}
          className="flex items-center gap-2 text-[#092C4C] text-xs font-light border-[#DBEBFB] bg-[#DBEBFB] hover:bg[#092C4C]"
        >
          Add new agenda
        </Button>

        <div className="bb flex items-center gap-4">
          {showSkip && (
            <Button variant="ghost" onClick={onNext} className="text-gray-500">
              Skip this step
            </Button>
          )}
          <Button
            onClick={onNext}
            disabled={!nextEnabled}
            className={`px-8 py-2 text-white ${
              nextEnabled ? "bg-[#092C4C] hover:bg-[#092C4C]" : "bg-gray-400"
            }`}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
