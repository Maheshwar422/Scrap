import React, { useState } from "react";
import { UserAccount, MaterialLot, Language } from "../types";
import { TRANSLATIONS } from "../data/translations";
import { Package, Camera, ArrowRight, Filter, Clock, CheckCircle2 } from "lucide-react";
import { AudioButton } from "../components/AudioButton";

interface CollectorLotsViewProps {
  currentUser: UserAccount;
  lots: MaterialLot[];
  lang: Language;
  onNavigate: (route: string) => void;
  onViewLot: (lotId: string) => void;
}

export const CollectorLotsView: React.FC<CollectorLotsViewProps> = ({
  currentUser,
  lots,
  lang,
  onNavigate,
  onViewLot,
}) => {
  const t = TRANSLATIONS[lang];
  const [filter, setFilter] = useState<"all" | "active" | "in_progress" | "completed">("all");

  const myLots = lots.filter((l) => l.collectorUsername === currentUser.username);

  const filteredLots = myLots.filter((l) => {
    if (filter === "active") return l.status === "active";
    if (filter === "in_progress") return l.status === "bid_accepted" || l.status === "handover_completed";
    if (filter === "completed") return l.status === "payment_completed" || l.status === "completed";
    return true;
  });

  const narration = `Showing ${filteredLots.length} e-waste lots for collector ${currentUser.name}. Tap any lot to check recycler offers or handover progress.`;

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 sm:py-8 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {t.myLots} ({myLots.length})
            </h1>
            <AudioButton textToSpeak={narration} lang={lang} size="sm" />
          </div>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Track all electronic scrap batches registered from your collections
          </p>
        </div>

        <button
          onClick={() => onNavigate("/collector/scan")}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-700/20 active:scale-95 transition-all self-start sm:self-auto"
        >
          <Camera className="w-4 h-4" />
          <span>{t.startScanButton}</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-bold text-slate-600">
        {[
          { key: "all", label: `All (${myLots.length})` },
          { key: "active", label: `Active Bidding (${myLots.filter((l) => l.status === "active").length})` },
          { key: "in_progress", label: `In Handover (${myLots.filter((l) => l.status === "bid_accepted" || l.status === "handover_completed").length})` },
          { key: "completed", label: `Settled (${myLots.filter((l) => l.status === "payment_completed" || l.status === "completed").length})` },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key as any)}
            className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap border ${
              filter === tab.key
                ? "bg-emerald-600 text-white border-emerald-600 shadow-sm"
                : "bg-white/80 text-slate-700 border-slate-200 hover:bg-white"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Lots Grid */}
      {filteredLots.length === 0 ? (
        <div className="p-12 rounded-3xl bg-white/75 backdrop-blur-md border border-dashed border-slate-300 text-center space-y-4">
          <Package className="w-12 h-12 text-slate-400 mx-auto" />
          <h3 className="font-bold text-slate-800 text-base">No lots match this filter</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Scan your electronic scrap to register new lots and receive validated recycler offers.
          </p>
          <button
            onClick={() => onNavigate("/collector/scan")}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs"
          >
            <Camera className="w-4 h-4" />
            <span>Scan Scrap Now</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {filteredLots.map((lot) => {
            const hasBids = lot.bids && lot.bids.length > 0;
            const highestBid = hasBids
              ? Math.max(...lot.bids.map((b) => b.amount))
              : null;

            return (
              <div
                key={lot.id}
                onClick={() => onViewLot(lot.id)}
                className="rounded-3xl p-4 sm:p-5 bg-white/85 backdrop-blur-xl border border-white/70 shadow-sm hover:shadow-lg transition-all cursor-pointer group flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="relative h-40 rounded-2xl overflow-hidden bg-slate-100">
                    <img
                      src={lot.photoUrl}
                      alt={lot.detectedItem}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-lg bg-slate-900/80 backdrop-blur-md text-white font-mono text-[11px] font-bold">
                      {lot.id}
                    </div>
                    <div className="absolute top-2.5 right-2.5 px-2.5 py-0.5 rounded-lg text-[11px] font-bold capitalize shadow-sm bg-white text-slate-900">
                      {lot.status.replace("_", " ")}
                    </div>
                  </div>

                  <div>
                    <span className="text-xs font-bold text-emerald-700 block">
                      {lot.category}
                    </span>
                    <h3 className="font-bold text-base text-slate-900 tracking-tight truncate">
                      {lot.detectedItem}
                    </h3>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="text-slate-400 block text-[10px]">Weight</span>
                      <span className="font-bold text-slate-800 text-sm">{lot.weightKg} kg</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-100">
                      <span className="text-emerald-800 block text-[10px]">Fair Estimate</span>
                      <span className="font-bold text-emerald-900 text-xs">
                        ₹{lot.estimatedValueMin}–{lot.estimatedValueMax}
                      </span>
                    </div>
                  </div>

                  {hasBids && (
                    <div className="p-2.5 rounded-xl bg-amber-50/80 border border-amber-200 flex items-center justify-between text-xs">
                      <span className="text-amber-900 font-medium">
                        {lot.bids.length} Bid(s) • Best:
                      </span>
                      <span className="font-black text-amber-950 text-sm">
                        ₹{highestBid}
                      </span>
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-mono text-[11px]">
                    {new Date(lot.createdAt).toLocaleDateString()}
                  </span>
                  <span className="font-bold text-emerald-700 group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                    <span>View Workflow</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
