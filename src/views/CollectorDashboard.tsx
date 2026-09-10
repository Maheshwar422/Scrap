import React from "react";
import { UserAccount, MaterialLot, DigitalReceipt, Language } from "../types";
import { TRANSLATIONS } from "../data/translations";
import { Camera, Package, DollarSign, CreditCard, ArrowRight, ShieldCheck, Clock, CheckCircle2, TrendingUp, AlertCircle } from "lucide-react";
import { AudioButton } from "../components/AudioButton";

interface CollectorDashboardProps {
  currentUser: UserAccount;
  lots: MaterialLot[];
  receipts: DigitalReceipt[];
  lang: Language;
  onNavigate: (route: string) => void;
  onViewLot: (lotId: string) => void;
  onViewReceipt: (receipt: DigitalReceipt) => void;
}

export const CollectorDashboard: React.FC<CollectorDashboardProps> = ({
  currentUser,
  lots,
  receipts,
  lang,
  onNavigate,
  onViewLot,
  onViewReceipt,
}) => {
  const t = TRANSLATIONS[lang];

  // Filter lots belonging to current collector
  const myLots = lots.filter((l) => l.collectorUsername === currentUser.username);
  const activeLots = myLots.filter((l) => l.status === "active");
  const pendingOffers = myLots.filter((l) => l.bids && l.bids.length > 0 && l.status === "active");
  
  // Calculate total earnings for this collector
  const myReceipts = receipts.filter((r) => r.collectorUsername === currentUser.username);
  const totalEarnings = myReceipts.reduce((sum, r) => sum + r.finalPrice, 0);

  // Overall dashboard audio narration
  const dashboardNarration = `Hello ${currentUser.name}. You have ${activeLots.length} active lots, ${pendingOffers.length} pending recycler offers, and total recorded earnings of ₹${totalEarnings.toLocaleString("en-IN")}. Tap the big green button to scan new e-waste scrap.`;

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 sm:py-8 space-y-6 sm:space-y-8 animate-fade-in">
      {/* Welcome Banner with Audio */}
      <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-emerald-700 via-teal-800 to-slate-900 text-white shadow-xl shadow-emerald-900/15 relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-emerald-200 text-xs font-semibold backdrop-blur-md border border-white/15">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>Informal Scrap Collector Portal</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              {t.welcomeCollector}, {currentUser.name}!
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100/90 max-w-lg">
              {t.scanPrompt}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <AudioButton
              textToSpeak={dashboardNarration}
              lang={lang}
              size="lg"
              label="Listen Overview"
              className="bg-white text-emerald-950 hover:bg-emerald-50 border-none shadow-lg"
            />
          </div>
        </div>

        {/* 4 Large Action Cards (Section 4 MANDATE) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-6">
          {/* 1. SCAN E-WASTE */}
          <button
            onClick={() => onNavigate("/collector/scan")}
            className="flex flex-col items-center justify-center p-4 sm:p-5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black shadow-lg shadow-emerald-950/20 active:scale-95 transition-all text-center group"
          >
            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <Camera className="w-7 h-7 text-slate-950" />
            </div>
            <span className="text-sm sm:text-base leading-tight">📷 SCAN E-WASTE</span>
            <span className="text-[11px] font-medium text-emerald-950/80 mt-0.5">Take / Upload Photo</span>
          </button>

          {/* 2. MY LOTS */}
          <button
            onClick={() => onNavigate("/collector/lots")}
            className="flex flex-col items-center justify-center p-4 sm:p-5 rounded-2xl bg-white/15 hover:bg-white/25 text-white font-black backdrop-blur-md border border-white/20 active:scale-95 transition-all text-center group"
          >
            <div className="w-12 h-12 rounded-2xl bg-white/15 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <Package className="w-7 h-7 text-emerald-300" />
            </div>
            <span className="text-sm sm:text-base leading-tight">📦 MY LOTS</span>
            <span className="text-[11px] font-medium text-emerald-200 mt-0.5">{myLots.length} Created Lots</span>
          </button>

          {/* 3. MY OFFERS */}
          <button
            onClick={() => onNavigate("/collector/marketplace")}
            className="flex flex-col items-center justify-center p-4 sm:p-5 rounded-2xl bg-white/15 hover:bg-white/25 text-white font-black backdrop-blur-md border border-white/20 active:scale-95 transition-all text-center group"
          >
            <div className="w-12 h-12 rounded-2xl bg-white/15 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <DollarSign className="w-7 h-7 text-amber-300" />
            </div>
            <span className="text-sm sm:text-base leading-tight">💰 MY OFFERS</span>
            <span className="text-[11px] font-medium text-amber-200 mt-0.5">
              {pendingOffers.length} Recycler Bids
            </span>
          </button>

          {/* 4. MY EARNINGS */}
          <button
            onClick={() => onNavigate("/collector/transactions")}
            className="flex flex-col items-center justify-center p-4 sm:p-5 rounded-2xl bg-white/15 hover:bg-white/25 text-white font-black backdrop-blur-md border border-white/20 active:scale-95 transition-all text-center group"
          >
            <div className="w-12 h-12 rounded-2xl bg-white/15 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <CreditCard className="w-7 h-7 text-teal-300" />
            </div>
            <span className="text-sm sm:text-base leading-tight">💳 MY EARNINGS</span>
            <span className="text-[11px] font-medium text-teal-200 mt-0.5">
              ₹{totalEarnings.toLocaleString("en-IN")}
            </span>
          </button>
        </div>
      </div>

      {/* Summary Stat Tiles */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 sm:p-5 rounded-2xl bg-white/80 backdrop-blur-md border border-white/70 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase">{t.activeLotsCount}</span>
            <Package className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-black text-slate-900">{activeLots.length}</p>
          <span className="text-[11px] text-slate-500">Waiting for pickup / bids</span>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white/80 backdrop-blur-md border border-white/70 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase">{t.pendingOffersCount}</span>
            <DollarSign className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-2xl font-black text-slate-900">{pendingOffers.length}</p>
          <span className="text-[11px] text-slate-500">From verified recyclers</span>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white/80 backdrop-blur-md border border-white/70 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase">{t.completedTransactionsCount}</span>
            <CheckCircle2 className="w-4 h-4 text-teal-600" />
          </div>
          <p className="text-2xl font-black text-slate-900">{myReceipts.length}</p>
          <span className="text-[11px] text-slate-500">Digital receipts generated</span>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white/80 backdrop-blur-md border border-white/70 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase">{t.totalEarningsAmount}</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-black text-emerald-600">
            ₹{totalEarnings.toLocaleString("en-IN")}
          </p>
          <span className="text-[11px] text-slate-500">100% formal bank/UPI/cash</span>
        </div>
      </div>

      {/* Active Lots Quick View */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              Your Current E-Waste Lots ({myLots.length})
            </h2>
            <AudioButton
              textToSpeak={`You currently have ${myLots.length} lots registered under your account.`}
              lang={lang}
              size="sm"
            />
          </div>
          <button
            onClick={() => onNavigate("/collector/lots")}
            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
          >
            <span>View All Lots</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {myLots.length === 0 ? (
          <div className="p-8 rounded-3xl bg-white/70 backdrop-blur-md border border-dashed border-slate-300 text-center space-y-3">
            <Package className="w-10 h-10 text-slate-400 mx-auto" />
            <h3 className="font-bold text-slate-800 text-sm">No e-waste lots created yet</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Snap a photo of your electronic scrap to have our AI identify the category and calculate fair reference valuation.
            </p>
            <button
              onClick={() => onNavigate("/collector/scan")}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs shadow-md hover:bg-emerald-700"
            >
              <Camera className="w-4 h-4" />
              <span>{t.startScanButton}</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {myLots.map((lot) => {
              const hasBids = lot.bids && lot.bids.length > 0;
              return (
                <div
                  key={lot.id}
                  onClick={() => onViewLot(lot.id)}
                  className="rounded-2xl p-4 bg-white/85 backdrop-blur-md border border-white/70 shadow-sm hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-2">
                    <div className="relative h-36 rounded-xl overflow-hidden bg-slate-100">
                      <img
                        src={lot.photoUrl}
                        alt={lot.detectedItem}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-slate-900/80 backdrop-blur-sm text-white font-mono text-[10px] font-bold">
                        {lot.id}
                      </div>
                      <div className="absolute top-2 right-2 px-2 py-0.5 rounded-md text-[10px] font-bold capitalize shadow-sm bg-white/95 text-slate-800">
                        {lot.status.replace("_", " ")}
                      </div>
                    </div>

                    <div>
                      <h3 className="font-bold text-sm text-slate-900 truncate">
                        {lot.detectedItem}
                      </h3>
                      <span className="text-xs text-emerald-800 font-semibold block">
                        {lot.category}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs py-1 px-2.5 rounded-lg bg-slate-50 border border-slate-100">
                      <span className="text-slate-500 font-medium">Weight:</span>
                      <span className="font-bold text-slate-800">{lot.weightKg} kg</span>
                    </div>

                    <div className="flex items-center justify-between text-xs py-1 px-2.5 rounded-lg bg-emerald-50/70 border border-emerald-100">
                      <span className="text-emerald-900 font-medium">Fair Estimate:</span>
                      <span className="font-bold text-emerald-900">
                        ₹{lot.estimatedValueMin} – ₹{lot.estimatedValueMax}
                      </span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] text-slate-500">
                      {hasBids
                        ? `${lot.bids.length} recycler offer(s)`
                        : "Waiting for bids"}
                    </span>
                    <span className="text-xs font-bold text-emerald-700 group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                      <span>View</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Recent Completed Transactions */}
      {myReceipts.length > 0 && (
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              Recent Completed Settlements
            </h2>
            <button
              onClick={() => onNavigate("/collector/transactions")}
              className="text-xs font-bold text-emerald-700 hover:text-emerald-800"
            >
              View All
            </button>
          </div>

          <div className="divide-y divide-slate-100 rounded-2xl bg-white/80 backdrop-blur-md border border-white/70 overflow-hidden shadow-sm">
            {myReceipts.slice(0, 3).map((rcpt) => (
              <div
                key={rcpt.transactionId}
                onClick={() => onViewReceipt(rcpt)}
                className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                    ₹
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-900">{rcpt.material}</span>
                      <span className="px-1.5 py-0.5 rounded text-[10px] bg-teal-100 text-teal-800 font-semibold">
                        ✓ {rcpt.recyclerName}
                      </span>
                    </div>
                    <span className="text-xs text-slate-500 font-mono">
                      {rcpt.transactionId} • {rcpt.weightKg} kg
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-black text-emerald-600 text-base block">
                    +₹{rcpt.finalPrice}
                  </span>
                  <span className="text-[11px] text-slate-400 font-medium">Digital Receipt</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
