import React from "react";
import { CheckCircle2, Clock, Cpu, FileText, ArrowRight, ShieldCheck, Banknote, PackageCheck } from "lucide-react";
import { TraceabilityEvent } from "../types";
import { AudioButton } from "./AudioButton";

interface TraceabilityTimelineProps {
  events: TraceabilityEvent[];
  lang?: "en" | "ta" | "hi";
}

export const TraceabilityTimeline: React.FC<TraceabilityTimelineProps> = ({ events, lang = "en" }) => {
  const getStageIcon = (stage: string) => {
    switch (stage) {
      case "created":
        return <Clock className="w-4 h-4 text-emerald-600" />;
      case "ai_identified":
        return <Cpu className="w-4 h-4 text-blue-600" />;
      case "valuation_estimated":
        return <FileText className="w-4 h-4 text-purple-600" />;
      case "sent_to_recyclers":
        return <ArrowRight className="w-4 h-4 text-indigo-600" />;
      case "bid_received":
      case "bid_accepted":
        return <ShieldCheck className="w-4 h-4 text-emerald-600" />;
      case "handover_completed":
        return <PackageCheck className="w-4 h-4 text-amber-600" />;
      case "payment_recorded":
      case "completed":
        return <Banknote className="w-4 h-4 text-emerald-600" />;
      default:
        return <CheckCircle2 className="w-4 h-4 text-emerald-600" />;
    }
  };

  const fullTimelineNarration = events
    .map((e) => `${e.title}: ${e.description} on ${new Date(e.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`)
    .join(". ");

  return (
    <div className="rounded-2xl p-5 bg-white/70 backdrop-blur-md border border-white/60 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-700" />
          <h3 className="text-base font-bold text-slate-800 tracking-tight">
            Digital Traceability Audit Trail
          </h3>
        </div>
        <AudioButton textToSpeak={`Traceability timeline: ${fullTimelineNarration}`} lang={lang} size="sm" />
      </div>

      <div className="relative pl-6 border-l-2 border-emerald-200/80 space-y-5 my-2">
        {events.map((event, index) => (
          <div key={event.id || index} className="relative group">
            {/* Timeline Dot */}
            <div className="absolute -left-[31px] top-1.5 w-6 h-6 rounded-full bg-white border-2 border-emerald-500 shadow-sm flex items-center justify-center">
              {getStageIcon(event.stage)}
            </div>

            <div className="bg-slate-50/80 rounded-xl p-3.5 border border-slate-200/70 hover:bg-slate-50 transition-colors">
              <div className="flex items-center justify-between gap-2 flex-wrap mb-1">
                <span className="font-semibold text-sm text-slate-900">{event.title}</span>
                <span className="text-xs text-slate-500 font-mono">
                  {new Date(event.timestamp).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed">{event.description}</p>
              <div className="mt-1.5 flex items-center gap-1.5 text-[11px] font-medium text-slate-500">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>Actor: {event.actor}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
