import React, { useState } from "react";
import { UserAccount, UserRole } from "../types";
import { SEEDED_COLLECTORS, SEEDED_RECYCLERS } from "../data/pricingDataset";
import { Users, CheckCircle2, ShieldCheck, ChevronRight, X, Sparkles } from "lucide-react";

interface RoleQuickSwitcherProps {
  currentUser: UserAccount;
  onSelectUser: (user: UserAccount) => void;
}

export const RoleQuickSwitcher: React.FC<RoleQuickSwitcherProps> = ({
  currentUser,
  onSelectUser,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating Demo Launcher Pill */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 z-40 flex items-center gap-2 px-3.5 py-2 rounded-full bg-slate-900/90 text-white shadow-xl shadow-slate-900/30 backdrop-blur-md border border-white/20 hover:bg-slate-900 hover:scale-105 transition-all text-xs font-semibold"
        title="Switch between 5 Collectors & 3 Verified Recyclers"
      >
        <Users className="w-4 h-4 text-emerald-400 animate-pulse" />
        <span className="hidden sm:inline">Demo Switcher:</span>
        <span className="text-emerald-300 font-bold truncate max-w-[120px]">
          {currentUser.name.split(" ")[0]}
        </span>
        <span className="px-1.5 py-0.5 rounded-full bg-white/20 text-[10px] uppercase tracking-wider">
          {currentUser.role}
        </span>
      </button>

      {/* Switcher Modal Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-md bg-white/95 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/60 p-6 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-800">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Demo Account Switcher</h3>
                  <p className="text-xs text-slate-500">
                    Test full collector ↔ verified recycler workflow
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Collectors Section */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  5 Collector Accounts
                </span>
                <span className="text-[11px] text-slate-500">Scrap Scrapers</span>
              </div>
              <div className="grid grid-cols-1 gap-1.5">
                {SEEDED_COLLECTORS.map((collector) => {
                  const isSelected = currentUser.username === collector.username;
                  return (
                    <button
                      key={collector.username}
                      onClick={() => {
                        onSelectUser(collector);
                        setIsOpen(false);
                      }}
                      className={`w-full flex items-center justify-between p-2.5 rounded-xl border text-left transition-all ${
                        isSelected
                          ? "bg-emerald-50 border-emerald-500 ring-2 ring-emerald-500/20 shadow-sm"
                          : "bg-slate-50/70 border-slate-200 hover:bg-white hover:border-slate-300"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <img
                          src={collector.avatar}
                          alt={collector.name}
                          className="w-8 h-8 rounded-full object-cover border border-slate-200"
                        />
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-sm text-slate-900">
                              {collector.name}
                            </span>
                            <span className="text-[11px] font-mono text-slate-500">
                              ({collector.username})
                            </span>
                          </div>
                          <span className="text-[11px] text-slate-500 block truncate max-w-[200px]">
                            {collector.location}
                          </span>
                        </div>
                      </div>
                      {isSelected ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-slate-400" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Recyclers Section */}
            <div className="space-y-2 pt-2 border-t border-slate-200">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-teal-800 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-teal-600" />
                  3 Verified Recyclers
                </span>
                <span className="px-2 py-0.5 rounded-full bg-teal-100 text-teal-900 text-[10px] font-bold">
                  VERIFIED
                </span>
              </div>
              <div className="grid grid-cols-1 gap-1.5">
                {SEEDED_RECYCLERS.map((recycler) => {
                  const isSelected = currentUser.username === recycler.username;
                  return (
                    <button
                      key={recycler.username}
                      onClick={() => {
                        onSelectUser(recycler);
                        setIsOpen(false);
                      }}
                      className={`w-full flex items-center justify-between p-2.5 rounded-xl border text-left transition-all ${
                        isSelected
                          ? "bg-teal-50 border-teal-500 ring-2 ring-teal-500/20 shadow-sm"
                          : "bg-slate-50/70 border-slate-200 hover:bg-white hover:border-slate-300"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <img
                          src={recycler.avatar}
                          alt={recycler.name}
                          className="w-8 h-8 rounded-full object-cover border border-slate-200"
                        />
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-sm text-slate-900">
                              {recycler.name}
                            </span>
                            <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-bold">
                              ✓ VERIFIED
                            </span>
                          </div>
                          <span className="text-[11px] text-slate-500 block truncate max-w-[200px]">
                            {recycler.location}
                          </span>
                        </div>
                      </div>
                      {isSelected ? (
                        <CheckCircle2 className="w-5 h-5 text-teal-600" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-slate-400" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-amber-50 text-[11px] text-amber-900 border border-amber-200 flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <span>
                <strong>Demo Tip:</strong> You can create a lot as <strong>Collector 01</strong>, then switch to <strong>Recycler 01</strong> to place a bid, and switch back to accept it and complete handover!
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
