import React from "react";
import { AlertTriangle, ShieldAlert, Sparkles } from "lucide-react";
import { AudioButton } from "./AudioButton";
import { Language } from "../types";

interface SafetyCardProps {
  safetyWarning: string;
  category: string;
  lang?: Language;
}

export const SafetyCard: React.FC<SafetyCardProps> = ({
  safetyWarning,
  category,
  lang = "en",
}) => {
  return (
    <div className="rounded-2xl p-4 bg-amber-50/90 border border-amber-200/80 shadow-sm">
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
          <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />
          <span>Collector Health & Safety Guidance</span>
        </div>
        <AudioButton
          textToSpeak={`Safety Guidance for ${category}: ${safetyWarning}`}
          lang={lang}
          size="sm"
          label="Listen Safety"
        />
      </div>

      <p className="text-xs text-amber-950/90 leading-relaxed font-medium pl-7">
        {safetyWarning}
      </p>

      <div className="mt-3 pl-7 flex items-center gap-2 text-[11px] text-amber-800/80">
        <Sparkles className="w-3.5 h-3.5 text-amber-600" />
        <span>Protect yourself: Always use gloves and avoid inhaling fumes or dust.</span>
      </div>
    </div>
  );
};
