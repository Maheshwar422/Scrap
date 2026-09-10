import React from "react";
import { X, CheckCircle2, QrCode, Printer, ShieldCheck, Download, Leaf, Award } from "lucide-react";
import { DigitalReceipt, Language } from "../types";
import { AudioButton } from "./AudioButton";

interface DigitalReceiptModalProps {
  receipt: DigitalReceipt | null;
  isOpen: boolean;
  onClose: () => void;
  lang?: Language;
}

export const DigitalReceiptModal: React.FC<DigitalReceiptModalProps> = ({
  receipt,
  isOpen,
  onClose,
  lang = "en",
}) => {
  if (!isOpen || !receipt) return null;

  const handlePrint = () => {
    window.print();
  };

  const receiptNarration = `Digital Receipt. Transaction ID: ${receipt.transactionId}. Lot: ${receipt.lotId}. Collector: ${receipt.collectorName}. Recycler: ${receipt.recyclerName}. Material: ${receipt.material}. Confirmed weight: ${receipt.weightKg} kilograms. Final payout: ₹${receipt.finalPrice}. Status: ${receipt.status}.`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-emerald-100 overflow-hidden max-h-[92vh] flex flex-col">
        {/* Receipt Header Banner */}
        <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-emerald-900 text-white p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
                <Award className="w-6 h-6 text-emerald-300" />
              </div>
              <div>
                <h2 className="text-lg font-bold">Formal E-Waste Certificate</h2>
                <p className="text-xs text-emerald-200">Traceable Digital Transaction Record</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Receipt Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-slate-800">
          {/* Readout button */}
          <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-2xl border border-emerald-200">
            <div className="text-xs text-emerald-900 font-medium">
              Listen to full receipt summary
            </div>
            <AudioButton textToSpeak={receiptNarration} lang={lang} size="sm" label="Read Receipt" />
          </div>

          {/* Verification Badge */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-200">
            <div>
              <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
                Transaction ID
              </span>
              <p className="font-mono font-bold text-base text-slate-900">{receipt.transactionId}</p>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-300">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              <span>FORMAL RECYCLER VERIFIED</span>
            </div>
          </div>

          {/* Key Details Grid */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-xs text-slate-500 block mb-0.5">Lot ID</span>
              <span className="font-semibold font-mono text-slate-900">{receipt.lotId}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-xs text-slate-500 block mb-0.5">Date & Time</span>
              <span className="font-semibold text-slate-900 text-xs">
                {new Date(receipt.date).toLocaleString([], {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-xs text-slate-500 block mb-0.5">Collector</span>
              <span className="font-semibold text-slate-900">{receipt.collectorName}</span>
              <span className="text-[11px] text-slate-500 block">({receipt.collectorUsername})</span>
            </div>
            <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-100">
              <span className="text-xs text-emerald-800 block mb-0.5">Verified Recycler</span>
              <span className="font-semibold text-emerald-950">{receipt.recyclerName}</span>
              <span className="text-[11px] text-emerald-700 block">✓ Authorized Facility</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-xs text-slate-500 block mb-0.5">Material Category</span>
              <span className="font-semibold text-slate-900">{receipt.material}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-xs text-slate-500 block mb-0.5">Confirmed Weight</span>
              <span className="font-bold text-slate-900 text-base">{receipt.weightKg} kg</span>
            </div>
          </div>

          {/* Amount Paid Banner */}
          <div className="rounded-2xl p-4 bg-gradient-to-br from-slate-900 to-slate-800 text-white flex items-center justify-between shadow-md">
            <div>
              <span className="text-xs text-slate-400 block font-medium">Final Settled Price</span>
              <span className="text-2xl font-black text-emerald-400">
                ₹{receipt.finalPrice.toLocaleString("en-IN")}
              </span>
            </div>
            <div className="text-right">
              <span className="text-[11px] text-slate-400 block">Payout Mode</span>
              <span className="text-xs font-semibold text-white">{receipt.paymentMethod}</span>
              <span className="text-[10px] text-emerald-300 block">✓ Confirmed Paid</span>
            </div>
          </div>

          {/* Environmental Impact & QR */}
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-teal-50/70 border border-teal-200">
            <div className="w-16 h-16 bg-white rounded-xl p-1.5 border border-teal-200 flex items-center justify-center flex-shrink-0">
              <QrCode className="w-12 h-12 text-teal-800" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-teal-900 text-xs font-bold">
                <Leaf className="w-4 h-4 text-emerald-600" />
                <span>Environmental Benefit</span>
              </div>
              <p className="text-xs text-teal-950">
                Diverted <span className="font-bold">{receipt.weightKg} kg</span> of hazardous e-waste from informal dumping.
                Avoided approx. <span className="font-bold">{receipt.carbonSavedKg || (receipt.weightKg * 1.8).toFixed(1)} kg CO₂e</span>.
              </p>
              <p className="text-[10px] font-mono text-slate-500">
                Cert: {receipt.recoveryCertificateNumber}
              </p>
            </div>
          </div>
        </div>

        {/* Receipt Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-sm font-semibold hover:bg-slate-100"
          >
            Close
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 text-white text-sm font-semibold hover:bg-slate-900 active:scale-95"
            >
              <Printer className="w-4 h-4" />
              <span>Print Receipt</span>
            </button>
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 active:scale-95"
            >
              <Download className="w-4 h-4" />
              <span>Download</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
