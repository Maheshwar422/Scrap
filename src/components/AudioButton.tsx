import React, { useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { speechService } from "../services/speechService";
import { Language } from "../types";

interface AudioButtonProps {
  textToSpeak: string;
  lang?: Language;
  label?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const AudioButton: React.FC<AudioButtonProps> = ({
  textToSpeak,
  lang = "en",
  label = "Listen",
  size = "md",
  className = "",
}) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isPlaying) {
      speechService.stop();
      setIsPlaying(false);
      return;
    }

    setIsPlaying(true);
    speechService.speak(
      textToSpeak,
      (lang || "en") as Language,
      () => setIsPlaying(true),
      () => setIsPlaying(false)
    );
  };

  const sizeClasses = {
    sm: "px-2 py-1 text-xs gap-1.5",
    md: "px-2.5 py-1.5 text-xs font-medium gap-1.5",
    lg: "px-4 py-2 text-sm font-semibold gap-2",
  };

  const iconSizes = {
    sm: 14,
    md: 16,
    lg: 20,
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={`Read aloud: ${textToSpeak.slice(0, 30)}`}
      title="Click to hear read aloud"
      className={`inline-flex items-center rounded-full transition-all active:scale-95 select-none ${
        isPlaying
          ? "bg-amber-500 text-white shadow-md shadow-amber-500/30 animate-pulse"
          : "bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-300 shadow-sm"
      } ${sizeClasses[size]} ${className}`}
    >
      {isPlaying ? (
        <>
          <VolumeX size={iconSizes[size]} className="animate-spin" />
          <span>Stop</span>
        </>
      ) : (
        <>
          <Volume2 size={iconSizes[size]} className="text-emerald-700" />
          <span>{label}</span>
        </>
      )}
    </button>
  );
};
