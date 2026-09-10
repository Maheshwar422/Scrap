import React, { useState } from "react";
import { UserAccount, Language } from "../types";
import { SEEDED_COLLECTORS, SEEDED_RECYCLERS, ALL_USERS } from "../data/pricingDataset";
import { TRANSLATIONS } from "../data/translations";
import { Recycle, ShieldCheck, UserCheck, ArrowRight, Sparkles, KeyRound } from "lucide-react";
import { AudioButton } from "../components/AudioButton";

interface LoginViewProps {
  onLogin: (user: UserAccount) => void;
  lang: Language;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLogin, lang }) => {
  const t = TRANSLATIONS[lang];
  const [selectedRoleTab, setSelectedRoleTab] = useState<"collector" | "recycler">("collector");
  const [customUsername, setCustomUsername] = useState("");
  const [customPassword, setCustomPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleCustomLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    const matched = ALL_USERS.find(
      (u) =>
        u.username.toLowerCase() === customUsername.trim().toLowerCase() &&
        u.password === customPassword.trim()
    );

    if (matched) {
      onLogin(matched);
    } else {
      setErrorMsg("Invalid credentials. Try collector01 / demo123 or recycler01 / demo123");
    }
  };

  const loginNarration = "Welcome to E-Waste Connect. Tap your collector name below or enter demo credentials to start formal e-waste collection.";

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 sm:p-6 bg-gradient-to-br from-slate-100 via-emerald-50/40 to-teal-50/30">
      <div className="w-full max-w-xl bg-white/85 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/70 p-6 sm:p-8 space-y-6">
        {/* Header Branding */}
        <div className="text-center space-y-2">
          <div className="inline-flex w-16 h-16 rounded-3xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white items-center justify-center shadow-lg shadow-emerald-700/20 mb-1">
            <Recycle className="w-9 h-9 animate-spin-slow" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            E-Waste Connect
          </h1>
          <p className="text-sm text-slate-600 max-w-md mx-auto">
            Digital Platform for Formal E-Waste Collection & Recycling connecting informal scrap workers with authorized recyclers.
          </p>

          <div className="pt-2">
            <AudioButton textToSpeak={loginNarration} lang={lang} size="sm" label="Listen Instructions" />
          </div>
        </div>

        {/* Role Tab Selector */}
        <div className="grid grid-cols-2 p-1.5 bg-slate-100/80 rounded-2xl border border-slate-200">
          <button
            onClick={() => setSelectedRoleTab("collector")}
            className={`py-3 px-4 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${
              selectedRoleTab === "collector"
                ? "bg-white text-emerald-900 shadow-md"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <UserCheck className="w-4 h-4 text-emerald-600" />
            <span>Collector Login (5 Demo)</span>
          </button>
          <button
            onClick={() => setSelectedRoleTab("recycler")}
            className={`py-3 px-4 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${
              selectedRoleTab === "recycler"
                ? "bg-white text-teal-900 shadow-md"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-teal-600" />
            <span>Verified Recycler (3 Demo)</span>
          </button>
        </div>

        {/* 1-Click Fast Login Grid */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold px-1">
            <span>
              {selectedRoleTab === "collector"
                ? "SELECT A SEEDED COLLECTOR (1-CLICK)"
                : "SELECT A VERIFIED RECYCLER (1-CLICK)"}
            </span>
            <span className="text-[11px] text-emerald-700 font-medium">Password: demo123</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {(selectedRoleTab === "collector" ? SEEDED_COLLECTORS : SEEDED_RECYCLERS).map((user) => (
              <button
                key={user.username}
                onClick={() => onLogin(user)}
                className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-50/90 border border-slate-200/80 hover:bg-white hover:border-emerald-400 hover:shadow-md transition-all text-left group active:scale-98"
              >
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-11 h-11 rounded-full object-cover border border-slate-200 flex-shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-sm text-slate-900 group-hover:text-emerald-800 transition-colors truncate">
                      {user.name}
                    </span>
                    {user.isVerified && (
                      <span className="px-1.5 py-0.2 rounded text-[9px] bg-teal-100 text-teal-800 font-bold">
                        ✓ VERIFIED
                      </span>
                    )}
                  </div>
                  <span className="text-xs font-mono text-slate-500 block">
                    {user.username}
                  </span>
                  <span className="text-[11px] text-slate-400 block truncate">
                    {user.location}
                  </span>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
              </button>
            ))}
          </div>
        </div>

        {/* Traditional Credentials Form */}
        <div className="pt-2 border-t border-slate-200">
          <form onSubmit={handleCustomLogin} className="space-y-3">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium px-1">
              <KeyRound className="w-3.5 h-3.5" />
              <span>Or sign in with custom credentials:</span>
            </div>

            {errorMsg && (
              <div className="p-2.5 rounded-xl bg-rose-50 text-rose-700 text-xs font-medium border border-rose-200">
                {errorMsg}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                value={customUsername}
                onChange={(e) => setCustomUsername(e.target.value)}
                placeholder="Username (e.g. collector01)"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
              />
              <input
                type="password"
                value={customPassword}
                onChange={(e) => setCustomPassword(e.target.value)}
                placeholder="Password (demo123)"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold transition-all shadow-sm"
            >
              Sign In with Credentials
            </button>
          </form>
        </div>

        {/* Challenge Footer */}
        <div className="text-center text-[11px] text-slate-400 pt-2 flex items-center justify-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>YHACK'26 Challenge 19 Demo — Verified Recycler Matching & Transparent Pricing</span>
        </div>
      </div>
    </div>
  );
};
