import React, { useState } from "react";
import { UserAccount, MaterialLot, Language } from "../types";
import { TRANSLATIONS } from "../data/translations";
import { E_WASTE_PRICE_CATALOG } from "../data/pricingDataset";
import { ShieldCheck, Package, DollarSign, Filter, Search, ArrowRight, AlertCircle, CheckCircle2, Award } from "lucide-react";
import { AudioButton } from "../components/AudioButton";

interface RecyclerLotsMarketplaceProps {
  currentUser: UserAccount;
  lots: MaterialLot[];
  lang: Language;
  onViewLot: (lotId: string) => void;
  onPlaceBid: (lotId: string, offerPrice: number) => void;
}

export const RecyclerLotsMarketplace: React.FC<RecyclerLotsMarketplaceProps> = ({
  currentUser,
  lots,
  lang,
  onViewLot,
  onPlaceBid,
}) => {
  const t = TRANSLATIONS[lang];
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Bidding modal state
  const [biddingLot, setBiddingLot] = useState<MaterialLot | null>(null);
  const [bidPriceInput, setBidPriceInput] = useState<string>("");
  const [validationResult, setValidationResult] = useState<{
    status: "valid" | "warning" | "error";
    message: string;
  } | null>(null);

  // Available lots are active lots
  const availableLots = lots.filter((l) => l.status === "active");

  const filteredLots = availableLots.filter((lot) => {
    const matchesCat =
      selectedCategory === "all" || lot.category === selectedCategory;
    const matchesSearch =
      searchQuery === "" ||
      lot.detectedItem.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lot.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lot.collectorName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const openBidModal = (lot: MaterialLot, e: React.MouseEvent) => {
    e.stopPropagation();
    setBiddingLot(lot);
    setBidPriceInput(Math.round((lot.estimatedValueMin + lot.estimatedValueMax) / 2).toString());
    setValidationResult(null);
  };

  const handleValidateAndBid = (e: React.FormEvent) => {
    e.preventDefault();
    if (!biddingLot) return;

    const offer = parseFloat(bidPriceInput);
    if (isNaN(offer) || offer <= 0) {
      setValidationResult({
        status: "error",
        message: "Please enter a valid amount in ₹",
      });
      return;
    }

    // Bid validation rules (Section 12 MANDATE)
    if (offer < biddingLot.estimatedValueMin) {
      setValidationResult({
        status: "error",
        message: `${t.bidBelowRangeError} (Min: ₹${biddingLot.estimatedValueMin})`,
      });
      return;
    }

    if (offer > biddingLot.estimatedValueMax) {
      setValidationResult({
        status: "warning",
        message: `${t.bidAboveEstimate} (+₹${offer - biddingLot.estimatedValueMax})`,
      });
    } else {
      setValidationResult({
        status: "valid",
        message: t.bidAcceptedSuccess,
      });
    }

    onPlaceBid(biddingLot.id, offer);
    setTimeout(() => {
      setBiddingLot(null);
    }, 1200);
  };

  const narration = `Verified Recycler Marketplace. ${availableLots.length} e-waste lots are currently available from informal collectors for formal recycling.`;

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 sm:py-8 space-y-6 animate-fade-in">
      {/* Verified Notice Banner (Section 11 MANDATE) */}
      <div className="rounded-3xl p-6 bg-gradient-to-r from-teal-900 via-teal-800 to-slate-900 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 text-teal-300">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black tracking-tight">
                {t.marketplace} — Verified Recycler Access
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-400 text-slate-950 text-[10px] font-black uppercase">
                {t.verifiedRecycler}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-teal-200 mt-0.5">
              {t.verifiedRecyclerNotice}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <AudioButton
            textToSpeak={narration}
            lang={lang}
            size="md"
            label="Listen Overview"
            className="bg-white text-teal-950 hover:bg-teal-50 border-none shadow-md"
          />
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-white/80 backdrop-blur-md p-3 rounded-2xl border border-white/60 shadow-sm">
        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search material or collector..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-100/80 border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

        {/* Category pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 text-xs font-semibold">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-all ${
              selectedCategory === "all"
                ? "bg-teal-700 text-white shadow-sm"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            All Categories ({availableLots.length})
          </button>
          {Object.values(E_WASTE_PRICE_CATALOG).slice(0, 4).map((cat) => (
            <button
              key={cat.category}
              onClick={() => setSelectedCategory(cat.category)}
              className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-all ${
                selectedCategory === cat.category
                  ? "bg-teal-700 text-white shadow-sm"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              {cat.category}
            </button>
          ))}
        </div>
      </div>

      {/* Available Lots Grid */}
      {filteredLots.length === 0 ? (
        <div className="p-12 rounded-3xl bg-white/75 backdrop-blur-md border border-dashed border-slate-300 text-center space-y-3">
          <Package className="w-12 h-12 text-slate-400 mx-auto" />
          <h3 className="font-bold text-slate-800 text-base">No lots currently match your filter</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try switching categories or check back as collectors register new scrap.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredLots.map((lot) => {
            const myExistingBid = lot.bids?.find(
              (b) => b.recyclerUsername === currentUser.username
            );

            return (
              <div
                key={lot.id}
                onClick={() => onViewLot(lot.id)}
                className="rounded-3xl p-5 bg-white/85 backdrop-blur-xl border border-white/70 shadow-sm hover:shadow-lg transition-all cursor-pointer group flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="relative h-44 rounded-2xl overflow-hidden bg-slate-100">
                    <img
                      src={lot.photoUrl}
                      alt={lot.detectedItem}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-slate-900/80 backdrop-blur-md text-white font-mono text-xs font-bold">
                      {lot.id}
                    </div>
                    <div className="absolute top-3 right-3 px-2.5 py-1 rounded-lg text-xs font-bold shadow-sm bg-teal-600 text-white">
                      {lot.weightKg} kg
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-bold text-teal-800">{lot.category}</span>
                      <span className="text-slate-500">
                        Collector: <span className="font-semibold text-slate-800">{lot.collectorName}</span>
                      </span>
                    </div>
                    <h3 className="font-bold text-base text-slate-900 tracking-tight truncate">
                      {lot.detectedItem}
                    </h3>
                  </div>

                  {/* Fair Value Reference */}
                  <div className="p-3 rounded-2xl bg-teal-50/70 border border-teal-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-teal-800 uppercase tracking-wider font-bold block">
                        Fair Value Range
                      </span>
                      <span className="font-black text-slate-900 text-sm">
                        ₹{lot.estimatedValueMin} – ₹{lot.estimatedValueMax}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-500 block">Ref Rate</span>
                      <span className="text-xs font-semibold text-slate-700">
                        ₹{lot.referenceRateMin}-{lot.referenceRateMax}/kg
                      </span>
                    </div>
                  </div>

                  {myExistingBid && (
                    <div className="p-2 rounded-xl bg-emerald-50 text-emerald-900 text-xs font-semibold flex items-center justify-between border border-emerald-200">
                      <span>Your Active Offer:</span>
                      <span className="font-bold">₹{myExistingBid.amount}</span>
                    </div>
                  )}
                </div>

                {/* Quick Action */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-500 font-medium">
                    {lot.bids?.length || 0} Bid(s) placed
                  </span>

                  <button
                    onClick={(e) => openBidModal(lot, e)}
                    className="px-4 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs shadow-sm active:scale-95 transition-all flex items-center gap-1.5"
                  >
                    <DollarSign className="w-3.5 h-3.5" />
                    <span>{t.placeBid}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* QUICK BID MODAL WITH VALIDATION (Section 12) */}
      {biddingLot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-teal-100 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-6 h-6 text-teal-700" />
                <h3 className="font-bold text-base text-slate-900">
                  Place Validated Recycler Bid
                </h3>
              </div>
              <button
                onClick={() => setBiddingLot(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Lot ID:</span>
                <span className="font-mono font-bold text-slate-800">{biddingLot.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Material & Weight:</span>
                <span className="font-bold text-slate-800">
                  {biddingLot.detectedItem} ({biddingLot.weightKg} kg)
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Fair Value Range:</span>
                <span className="font-bold text-teal-800">
                  ₹{biddingLot.estimatedValueMin} – ₹{biddingLot.estimatedValueMax}
                </span>
              </div>
            </div>

            <form onSubmit={handleValidateAndBid} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  {t.enterOfferPrice}
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-3 text-lg font-bold text-slate-400">
                    ₹
                  </span>
                  <input
                    type="number"
                    value={bidPriceInput}
                    onChange={(e) => setBidPriceInput(e.target.value)}
                    className="w-full text-2xl font-black pl-8 pr-4 py-2.5 rounded-xl border-2 border-slate-300 focus:border-teal-500 focus:outline-none bg-white text-slate-900"
                    placeholder="1200"
                  />
                </div>
                <span className="text-[11px] text-slate-500 block mt-1">
                  {t.minimumAcceptableBid}: ₹{biddingLot.estimatedValueMin}
                </span>
              </div>

              {validationResult && (
                <div
                  className={`p-3 rounded-xl text-xs font-bold flex items-center gap-2 ${
                    validationResult.status === "error"
                      ? "bg-rose-100 text-rose-800 border border-rose-200"
                      : validationResult.status === "warning"
                      ? "bg-amber-100 text-amber-900 border border-amber-200"
                      : "bg-emerald-100 text-emerald-800 border border-emerald-200"
                  }`}
                >
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{validationResult.message}</span>
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setBiddingLot(null)}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold shadow-md"
                >
                  {t.submitBid}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
