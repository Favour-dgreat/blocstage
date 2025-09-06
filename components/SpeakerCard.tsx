"use client"
import ShareButton from "@/components/ShareButton"; 
import Image from "next/image";

interface SpeakerCardProps {
  sessionTitle: string;
  speakerName: string;
  startTime: string;
  endTime: string;
  speakerImageUrl?: string; // Speaker image URL from Cloudinary
}

// NOTE: If you intend to use `Image` from `next/image` here AND this component
// needs any client-side interactivity, then this `SpeakerCard` itself MUST be
// a "use client" component in its own file.
function SpeakerCard({ sessionTitle, speakerName, startTime, endTime, speakerImageUrl }: SpeakerCardProps) {
  return (
    <div className="flex items-center gap-4 bg-white p-4 rounded-lg shadow-sm">
      {/* Speaker Image */}
      <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
        {speakerImageUrl ? (
          <Image
            src={speakerImageUrl}
            alt={speakerName}
            width={64}
            height={64}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-300 rounded-full flex items-center justify-center">
            <span className="text-gray-500 text-sm font-medium">
              {speakerName ? speakerName.charAt(0).toUpperCase() : 'S'}
            </span>
          </div>
        )}
      </div>
      <div>
        <h3 className="text-md font-semibold text-gray-900">{sessionTitle}</h3>
        <p className="text-sm text-gray-600">{startTime} - {endTime} • {speakerName}</p>
      </div>
    </div>
  );
}

export default SpeakerCard;