import React from "react";
import { UserAccount, MaterialLot, DigitalReceipt, Language } from "../types";
import { TRANSLATIONS } from "../data/translations";
import { ShieldCheck, Package, DollarSign, Leaf, ArrowRight, CheckCircle2, TrendingUp, Award, Layers } from "lucide-react";
import { AudioButton } from "../components/AudioButton";

interface RecyclerDashboardProps {
  currentUser: UserAccount;
  lots: MaterialLot[];
  receipts: DigitalReceipt[];
  lang: Language;
  onNavigate: (route: string) => void;
  onViewLot: (lotId: string) => void;
  onViewReceipt: (receipt: DigitalReceipt) => void;
}

export const RecyclerDashboard: React.FC<RecyclerDashboardProps> = ({
  currentUser,
  lots,
  receipts,
  lang,
  onNavigate,
  onViewLot,
  onViewReceipt,
}) => {
  const t = TRANSLATIONS[lang];

  // Available lots
  const availableLots = lots.filter((l) => l.status === "active");

  // Bids placed by this recycler
  const myBidsCount = lots.reduce((count, lot) => {
    const hasMyBid = lot.bids?.some((b) => b.recyclerUsername === currentUser.username);
    return hasMyBid ? count + 1 : count;
  }, 0);

  // Completed transactions by this recycler
  const myReceipts = receipts.filter((r) => r.recyclerUsername === currentUser.username);
  const totalSettledAmount = myReceipts.reduce((sum, r) => sum + r.finalPrice, 0);
  const totalRecoveredKg = myReceipts.reduce((sum, r) => sum + r.weightKg, 0);
  const totalCarbonAvoided = (totalRecoveredKg * 1.8).toFixed(1);

  const narration = `Welcome to the Authorized Recycler Dashboard, ${currentUser.name}. You have ${availableLots.length} material lots available to bid on, ${myReceipts.length} completed formal transactions, and ${totalRecoveredKg} kilograms of e-waste recycled.`;

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 sm:py-8 space-y-6 sm:space-y-8 animate-fade-in">
      {/* Recycler Hero Banner */}
      <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-teal-900 via-emerald-950 to-slate-950 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-bold backdrop-blur-md border border-teal-400/30">
              <ShieldCheck className="w-4 h-4 text-teal-400" />
              <span>GOVERNMENT COMPLIANT FORMAL RECYCLER</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              {currentUser.name}
            </h1>
            <p className="text-xs sm:text-sm text-teal-200/90 max-w-xl">
              Procure authenticated electronic scrap directly from informal collectors with end-to-end digital traceability, fair valuation, and compliance audit certificates.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <AudioButton
              textToSpeak={narration}
              lang={lang}
              size="lg"
              label="Listen Overview"
              className="bg-white text-teal-950 hover:bg-teal-50 border-none shadow-lg"
            />
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-6">
          <button
            onClick={() => onNavigate("/recycler/lots")}
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm shadow-lg shadow-emerald-950/20 active:scale-95 transition-all"
          >
            <Package className="w-5 h-5" />
            <span>Browse Available Collector Lots ({availableLots.length})</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Recycler Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white/80 backdrop-blur-md border border-white/70 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase">Market Lots Available</span>
            <Layers className="w-4 h-4 text-teal-600" />
          </div>
          <p className="text-2xl font-black text-slate-900">{availableLots.length}</p>
          <span className="text-[11px] text-slate-500">Verified collector lots</span>
        </div>

        <div className="p-5 rounded-2xl bg-white/80 backdrop-blur-md border border-white/70 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase">My Active Bids</span>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-black text-slate-900">{myBidsCount}</p>
          <span className="text-[11px] text-slate-500">Awaiting collector acceptance</span>
        </div>

        <div className="p-5 rounded-2xl bg-white/80 backdrop-blur-md border border-white/70 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase">E-Waste Recovered</span>
            <Package className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-2xl font-black text-slate-900">{totalRecoveredKg} kg</p>
          <span className="text-[11px] text-slate-500">From informal channels</span>
        </div>

        <div className="p-5 rounded-2xl bg-white/80 backdrop-blur-md border border-white/70 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase">CO₂ Emission Avoided</span>
            <Leaf className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-black text-emerald-600">{totalCarbonAvoided} kg</p>
          <span className="text-[11px] text-slate-500">ESG formal diversion impact</span>
        </div>
      </div>

      {/* Fresh Available Lots Preview */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">
            Available Lots Ready for Formal Bidding
          </h2>
          <button
            onClick={() => onNavigate("/recycler/lots")}
            className="text-xs font-bold text-teal-700 hover:text-teal-800 flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {availableLots.slice(0, 3).map((lot) => (
            <div
              key={lot.id}
              onClick={() => onViewLot(lot.id)}
              className="p-4 rounded-2xl bg-white/85 backdrop-blur-md border border-white/70 shadow-sm hover:shadow-md transition-all cursor-pointer group space-y-3"
            >
              <div className="relative h-36 rounded-xl overflow-hidden bg-slate-100">
                <img
                  src={lot.photoUrl}
                  alt={lot.detectedItem}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
                <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-slate-900/80 backdrop-blur-sm text-white font-mono text-[10px] font-bold">
                  {lot.id}
                </div>
                <div className="absolute top-2 right-2 px-2 py-0.5 rounded-md text-[10px] font-bold shadow-sm bg-teal-600 text-white">
                  {lot.weightKg} kg
                </div>
              </div>

              <div>
                <span className="text-xs font-bold text-teal-800 block">{lot.category}</span>
                <h3 className="font-bold text-sm text-slate-900 truncate">{lot.detectedItem}</h3>
                <span className="text-[11px] text-slate-500 block">Collector: {lot.collectorName}</span>
              </div>

              <div className="p-2 rounded-xl bg-teal-50/80 border border-teal-100 flex items-center justify-between text-xs">
                <span className="text-teal-900 font-semibold">Fair Estimate:</span>
                <span className="font-black text-slate-900">
                  ₹{lot.estimatedValueMin} – ₹{lot.estimatedValueMax}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
