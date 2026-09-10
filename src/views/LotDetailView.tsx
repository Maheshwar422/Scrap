import React, { useState } from "react";
import { UserAccount, MaterialLot, RecyclerBid, DigitalReceipt, Language } from "../types";
import { TRANSLATIONS } from "../data/translations";
import { TraceabilityTimeline } from "../components/TraceabilityTimeline";
import { SafetyCard } from "../components/SafetyCard";
import { AudioButton } from "../components/AudioButton";
import {
  ArrowLeft,
  ShieldCheck,
  Package,
  DollarSign,
  CheckCircle2,
  AlertCircle,
  Truck,
  CreditCard,
  FileCheck,
  TrendingUp,
  Clock,
  Sparkles,
} from "lucide-react";

interface LotDetailViewProps {
  currentUser: UserAccount;
  lot: MaterialLot;
  lang: Language;
  onBack: () => void;
  onAcceptBid: (lotId: string, bid: RecyclerBid) => void;
  onConfirmHandover: (lotId: string) => void;
  onRecordPayment: (lotId: string, paymentMethod: "UPI" | "Bank Transfer" | "Cash") => void;
  onViewReceipt: (receipt: DigitalReceipt) => void;
  existingReceipt?: DigitalReceipt;
  onPlaceBid?: (lotId: string, offerPrice: number) => void;
}

export const LotDetailView: React.FC<LotDetailViewProps> = ({
  currentUser,
  lot,
  lang,
  onBack,
  onAcceptBid,
  onConfirmHandover,
  onRecordPayment,
  onViewReceipt,
  existingReceipt,
  onPlaceBid,
}) => {
  const t = TRANSLATIONS[lang];
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<"UPI" | "Bank Transfer" | "Cash">("UPI");
  const [bidAmountInput, setBidAmountInput] = useState<string>(
    Math.round((lot.estimatedValueMin + lot.estimatedValueMax) / 2).toString()
  );
  const [bidValidationFeedback, setBidValidationFeedback] = useState<{
    status: "valid" | "warning" | "error";
    message: string;
  } | null>(null);

  const isCollectorOwner = currentUser.username === lot.collectorUsername;
  const isRecycler = currentUser.role === "recycler";

  // Bid Validation logic (Section 12 MANDATE)
  const validateAndSubmitBid = (e: React.FormEvent) => {
    e.preventDefault();
    if (!onPlaceBid) return;

    const offerPrice = parseFloat(bidAmountInput);
    if (isNaN(offerPrice) || offerPrice <= 0) {
      setBidValidationFeedback({
        status: "error",
        message: "Please enter a valid numeric bid amount in INR.",
      });
      return;
    }

    // Validation rule (Section 12)
    if (offerPrice < lot.estimatedValueMin) {
      setBidValidationFeedback({
        status: "error",
        message: `${t.bidBelowRangeError} (Min: ₹${lot.estimatedValueMin})`,
      });
      return;
    }

    if (offerPrice > lot.estimatedValueMax) {
      setBidValidationFeedback({
        status: "warning",
        message: `${t.bidAboveEstimate} (+₹${offerPrice - lot.estimatedValueMax})`,
      });
    } else {
      setBidValidationFeedback({
        status: "valid",
        message: t.bidAcceptedSuccess,
      });
    }

    onPlaceBid(lot.id, offerPrice);
  };

  const narrationSummary = `Lot ${lot.id}. ${lot.detectedItem}, weight ${lot.weightKg} kilograms. Estimated fair value ₹${lot.estimatedValueMin} to ₹${lot.estimatedValueMax}. Status is ${lot.status.replace("_", " ")}.`;

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 sm:py-8 space-y-6 animate-fade-in">
      {/* Top Bar with Back and Audio */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/80 border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-bold transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <div className="flex items-center gap-2">
          <AudioButton textToSpeak={narrationSummary} lang={lang} size="sm" label="Read Lot" />
        </div>
      </div>

      {/* Lot Hero Card */}
      <div className="bg-white/85 backdrop-blur-xl rounded-3xl p-6 sm:p-8 shadow-xl border border-white/70 space-y-6">
        <div className="flex flex-col md:flex-row gap-6 items-start">
          {/* Scrap Image */}
          <div className="w-full md:w-5/12 h-64 sm:h-72 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 relative flex-shrink-0">
            <img
              src={lot.photoUrl}
              alt={lot.detectedItem}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-3 left-3 px-3 py-1 rounded-lg bg-slate-900/80 backdrop-blur-md text-white font-mono text-xs font-bold">
              {lot.id}
            </div>
            <div className="absolute bottom-3 left-3 right-3 p-2.5 rounded-xl bg-slate-900/80 backdrop-blur-md text-white flex items-center justify-between text-xs">
              <span className="text-slate-300">Authoritative Weight</span>
              <span className="font-black text-emerald-400 text-sm">{lot.weightKg} kg</span>
            </div>
          </div>

          {/* Details Column */}
          <div className="flex-1 space-y-4 w-full">
            <div>
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                  {lot.category}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold capitalize">
                  Condition: {lot.condition}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-xs font-bold">
                  {lot.confidence}% AI Confidence
                </span>
              </div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                {lot.detectedItem}
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                Registered by <span className="font-semibold text-slate-800">{lot.collectorName}</span> on {new Date(lot.createdAt).toLocaleDateString()}
              </p>
            </div>

            {/* Fair Value Banner */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 block">
                {t.estimatedFairValue}
              </span>
              <div className="text-2xl sm:text-3xl font-black text-emerald-950">
                ₹{lot.estimatedValueMin.toLocaleString("en-IN")} – ₹{lot.estimatedValueMax.toLocaleString("en-IN")}
              </div>
              <div className="text-xs text-emerald-800 font-medium">
                {t.referenceRate}: ₹{lot.referenceRateMin} – ₹{lot.referenceRateMax} / kg
              </div>
            </div>

            {/* Status Pill */}
            <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
              <Clock className="w-4 h-4 text-slate-600" />
              <div className="flex-1">
                <span className="text-slate-500 font-medium">Lifecycle Status:</span>
                <span className="font-bold text-slate-900 ml-1.5 capitalize text-sm">
                  {lot.status.replace("_", " ")}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Safety Guidance Card (Section 19) */}
        <SafetyCard
          safetyWarning={lot.safetyWarning}
          category={lot.category}
          lang={lang}
        />

        {/* WORKFLOW PHASE 1: RECYCLER BIDDING (Section 11 & 12) */}
        {isRecycler && lot.status === "active" && onPlaceBid && (
          <div className="p-5 rounded-3xl bg-teal-50/80 border-2 border-teal-300 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-teal-950 font-bold">
                <ShieldCheck className="w-5 h-5 text-teal-700" />
                <span>Place Validated Recycler Offer</span>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-teal-600 text-white font-bold text-[10px]">
                AUTHORIZED BIDDER
              </span>
            </div>

            <form onSubmit={validateAndSubmitBid} className="space-y-3">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1">
                  <label className="text-xs text-slate-600 font-bold block mb-1">
                    {t.enterOfferPrice} (Min range: ₹{lot.estimatedValueMin})
                  </label>
                  <input
                    type="number"
                    value={bidAmountInput}
                    onChange={(e) => setBidAmountInput(e.target.value)}
                    className="w-full text-xl font-bold px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
                  />
                </div>
                <div className="sm:self-end">
                  <button
                    type="submit"
                    className="w-full sm:w-auto px-6 py-3 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-black text-sm shadow-md active:scale-98 transition-all"
                  >
                    {t.submitBid}
                  </button>
                </div>
              </div>

              {bidValidationFeedback && (
                <div
                  className={`p-3 rounded-xl text-xs font-bold flex items-center gap-2 ${
                    bidValidationFeedback.status === "error"
                      ? "bg-rose-100 text-rose-800 border border-rose-200"
                      : bidValidationFeedback.status === "warning"
                      ? "bg-amber-100 text-amber-900 border border-amber-200"
                      : "bg-emerald-100 text-emerald-800 border border-emerald-200"
                  }`}
                >
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{bidValidationFeedback.message}</span>
                </div>
              )}
            </form>
          </div>
        )}

        {/* WORKFLOW PHASE 2: BIDS RECEIVED & COLLECTOR ACCEPTANCE (Section 13) */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-emerald-600" />
              <span>{t.bidsReceived} ({lot.bids?.length || 0})</span>
            </h3>
            {lot.bids && lot.bids.length > 0 && (
              <span className="text-xs text-slate-500">
                Sorted by highest validated offer
              </span>
            )}
          </div>

          {!lot.bids || lot.bids.length === 0 ? (
            <div className="p-4 rounded-2xl bg-slate-50 border border-dashed border-slate-300 text-center text-xs text-slate-500">
              {t.noBidsYet}
            </div>
          ) : (
            <div className="space-y-2.5">
              {lot.bids.map((bid) => {
                const isAccepted = bid.status === "accepted" || lot.status !== "active";
                return (
                  <div
                    key={bid.id}
                    className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                      bid.status === "accepted"
                        ? "bg-emerald-50/90 border-emerald-500 ring-2 ring-emerald-500/20 shadow-sm"
                        : "bg-slate-50/90 border-slate-200"
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-900">
                          {bid.recyclerName}
                        </span>
                        {bid.isVerifiedRecycler && (
                          <span className="px-2 py-0.5 rounded-md bg-teal-100 text-teal-800 text-[10px] font-bold">
                            ✓ VERIFIED RECYCLER
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-500">
                        Placed on {new Date(bid.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        {bid.validationStatus === "above_range" && (
                          <span className="ml-2 text-emerald-700 font-semibold">
                            (Premium rate above reference range)
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <span className="text-xs text-slate-500 block">Offer Amount</span>
                        <span className="text-xl font-black text-emerald-600">
                          ₹{bid.amount.toLocaleString("en-IN")}
                        </span>
                      </div>

                      {/* Accept Bid Button (Section 13 MANDATE: Collector can tap "Accept Bid") */}
                      {isCollectorOwner && lot.status === "active" && (
                        <button
                          onClick={() => onAcceptBid(lot.id, bid)}
                          className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md active:scale-95 transition-all"
                        >
                          {t.acceptBidButton}
                        </button>
                      )}

                      {bid.status === "accepted" && (
                        <span className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white font-bold text-xs flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>{t.bidAcceptedStatus}</span>
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* WORKFLOW PHASE 3: HANDOVER CONFIRMATION (Section 14 MANDATE) */}
        {lot.status === "bid_accepted" && (
          <div className="p-5 rounded-3xl bg-amber-50/90 border-2 border-amber-300 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-amber-950 font-bold">
                <Truck className="w-5 h-5 text-amber-700" />
                <span>Physical Scrap Handover</span>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-200 text-amber-900 text-xs font-bold">
                {t.handoverPending}
              </span>
            </div>

            <p className="text-xs text-amber-900">
              The accepted recycler will physically collect and verify the scrap weight ({lot.weightKg} kg). Both parties confirm handover below.
            </p>

            <button
              onClick={() => onConfirmHandover(lot.id)}
              className="w-full py-3.5 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-black text-sm shadow-md active:scale-98 transition-all flex items-center justify-center gap-2"
            >
              <Truck className="w-5 h-5" />
              <span>{t.confirmHandover}</span>
            </button>
          </div>
        )}

        {/* WORKFLOW PHASE 4: RECORD PAYMENT & RECEIPT (Section 15 MANDATE) */}
        {lot.status === "handover_completed" && (
          <div className="p-5 rounded-3xl bg-emerald-50/90 border-2 border-emerald-300 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-emerald-950 font-bold">
                <CreditCard className="w-5 h-5 text-emerald-700" />
                <span>Formal Payment Settlement</span>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-600 text-white text-xs font-bold">
                Ready for Settlement
              </span>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 block">
                Select Payment Method:
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(["UPI", "Bank Transfer", "Cash"] as const).map((method) => (
                  <button
                    key={method}
                    type="button"
                    onClick={() => setSelectedPaymentMethod(method)}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                      selectedPaymentMethod === method
                        ? "bg-emerald-600 text-white border-emerald-600 shadow-sm"
                        : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    {method}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => onRecordPayment(lot.id, selectedPaymentMethod)}
              className="w-full py-3.5 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-black text-sm shadow-md active:scale-98 transition-all flex items-center justify-center gap-2"
            >
              <FileCheck className="w-5 h-5" />
              <span>{t.recordPayment}</span>
            </button>
          </div>
        )}

        {/* VIEW RECEIPT BANNER (If completed) */}
        {(lot.status === "payment_completed" || lot.status === "completed") && existingReceipt && (
          <div className="p-5 rounded-3xl bg-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <FileCheck className="w-7 h-7" />
              </div>
              <div>
                <h4 className="font-bold text-base text-white">Digital Traceability Certificate</h4>
                <p className="text-xs text-slate-400">
                  Transaction {existingReceipt.transactionId} • Settled ₹{existingReceipt.finalPrice}
                </p>
              </div>
            </div>

            <button
              onClick={() => onViewReceipt(existingReceipt)}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs shadow-md transition-all flex items-center justify-center gap-2"
            >
              <span>{t.viewReceipt}</span>
            </button>
          </div>
        )}

        {/* WORKFLOW PHASE 5: DIGITAL TRACEABILITY AUDIT TRAIL (Section 16 MANDATE) */}
        <div className="pt-2">
          <TraceabilityTimeline events={lot.traceability || []} lang={lang} />
        </div>
      </div>
    </div>
  );
};
