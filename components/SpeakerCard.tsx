"use client"
import ShareButton from "@/components/ShareButton"; 
import Image from "next/image";

interface SpeakerCardProps {
  sessionTitle: string;
  speakerName: string;
  startTime: string;
  endTime: string;
  // speakerImageUrl: string; // If you have speaker images
}

// NOTE: If you intend to use `Image` from `next/image` here AND this component
// needs any client-side interactivity, then this `SpeakerCard` itself MUST be
// a "use client" component in its own file.
function SpeakerCard({ sessionTitle, speakerName, startTime, endTime }: SpeakerCardProps) {
  return (
    <div className="flex items-center gap-4 bg-white p-4 rounded-lg shadow-sm">
      {/* Placeholder for Speaker Image */}
      <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
        <Image
          src="/images/placeholder_speaker.png" // Replace with actual speaker image URL or a more dynamic approach
          alt={speakerName}
          width={64}
          height={64}
          objectFit="cover"
        />
      </div>
      <div>
        <h3 className="text-md font-semibold text-gray-900">{sessionTitle}</h3>
        <p className="text-sm text-gray-600">{startTime} - {endTime} • {speakerName}</p>
      </div>
    </div>
  );
}

export default SpeakerCard;