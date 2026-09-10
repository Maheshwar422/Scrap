import React from "react";
import { UserAccount, DigitalReceipt, Language } from "../types";
import { TRANSLATIONS } from "../data/translations";
import { FileCheck, ShieldCheck, QrCode, ArrowRight, Download, Award, Leaf } from "lucide-react";
import { AudioButton } from "../components/AudioButton";

interface TransactionsHistoryViewProps {
  currentUser: UserAccount;
  receipts: DigitalReceipt[];
  lang: Language;
  onViewReceipt: (receipt: DigitalReceipt) => void;
}

export const TransactionsHistoryView: React.FC<TransactionsHistoryViewProps> = ({
  currentUser,
  receipts,
  lang,
  onViewReceipt,
}) => {
  const t = TRANSLATIONS[lang];

  // Filter based on user
  const relevantReceipts = receipts.filter((r) =>
    currentUser.role === "collector"
      ? r.collectorUsername === currentUser.username
      : r.recyclerUsername === currentUser.username
  );

  const totalVolume = relevantReceipts.reduce((sum, r) => sum + r.weightKg, 0);
  const totalPayout = relevantReceipts.reduce((sum, r) => sum + r.finalPrice, 0);

  const narration = `Completed transactions ledger. You have ${relevantReceipts.length} formal settlements totaling ₹${totalPayout.toLocaleString("en-IN")} and ${totalVolume} kilograms of safely processed e-waste.`;

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 sm:py-8 space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Formal Transactions & Digital Receipts ({relevantReceipts.length})
            </h1>
            <AudioButton textToSpeak={narration} lang={lang} size="sm" />
          </div>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Verifiable digital records ensuring formal compensation and full regulatory traceability
          </p>
        </div>
      </div>

      {/* Summary Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-white/80 backdrop-blur-md border border-white/70 shadow-sm space-y-1">
          <span className="text-xs text-slate-500 font-semibold uppercase">Total Transactions</span>
          <p className="text-2xl font-black text-slate-900">{relevantReceipts.length}</p>
          <span className="text-[11px] text-slate-400">100% digitally certified</span>
        </div>

        <div className="p-4 rounded-2xl bg-white/80 backdrop-blur-md border border-white/70 shadow-sm space-y-1">
          <span className="text-xs text-slate-500 font-semibold uppercase">Total Scrap Diverted</span>
          <p className="text-2xl font-black text-teal-700">{totalVolume} kg</p>
          <span className="text-[11px] text-slate-400">Saved from open dumping</span>
        </div>

        <div className="p-4 rounded-2xl bg-white/80 backdrop-blur-md border border-white/70 shadow-sm space-y-1">
          <span className="text-xs text-slate-500 font-semibold uppercase">Total Settled Amount</span>
          <p className="text-2xl font-black text-emerald-600">₹{totalPayout.toLocaleString("en-IN")}</p>
          <span className="text-[11px] text-slate-400">Paid to informal collectors</span>
        </div>
      </div>

      {/* Receipts List */}
      {relevantReceipts.length === 0 ? (
        <div className="p-12 rounded-3xl bg-white/75 backdrop-blur-md border border-dashed border-slate-300 text-center space-y-3">
          <FileCheck className="w-12 h-12 text-slate-400 mx-auto" />
          <h3 className="font-bold text-slate-800 text-base">No completed transactions yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Once a lot progresses through handover and payment, a formal digital certificate and receipt will be stored here.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {relevantReceipts.map((rcpt) => (
            <div
              key={rcpt.transactionId}
              onClick={() => onViewReceipt(rcpt)}
              className="p-5 rounded-3xl bg-white/85 backdrop-blur-xl border border-white/70 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group"
            >
              <div className="flex items-start gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold flex-shrink-0 group-hover:scale-105 transition-transform">
                  <Award className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-sm text-slate-900">{rcpt.material}</span>
                    <span className="px-2 py-0.5 rounded-full bg-teal-100 text-teal-800 text-[10px] font-bold">
                      ✓ VERIFIED RECYCLER
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      {rcpt.transactionId}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600">
                    Collector: <span className="font-semibold text-slate-800">{rcpt.collectorName}</span> ↔ Recycler: <span className="font-semibold text-slate-800">{rcpt.recyclerName}</span>
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Settled on {new Date(rcpt.date).toLocaleString()} via {rcpt.paymentMethod}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-5 self-end sm:self-auto">
                <div className="text-right">
                  <span className="text-xs text-slate-400 block font-medium">Weight & Payout</span>
                  <span className="font-black text-emerald-600 text-lg">
                    ₹{rcpt.finalPrice}
                  </span>
                  <span className="text-[11px] font-bold text-slate-600 block">
                    {rcpt.weightKg} kg
                  </span>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onViewReceipt(rcpt);
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-sm flex items-center gap-1.5 transition-colors"
                >
                  <span>Receipt</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
