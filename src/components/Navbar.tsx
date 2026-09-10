import React from "react";
import { UserAccount, Language } from "../types";
import { TRANSLATIONS } from "../data/translations";
import { Recycle, ShieldCheck, Wifi, WifiOff, Globe, Volume2, LogOut, Sparkles } from "lucide-react";
import { AudioButton } from "./AudioButton";

interface NavbarProps {
  currentUser: UserAccount;
  currentLang: Language;
  onSelectLang: (lang: Language) => void;
  isOffline: boolean;
  onToggleOffline: () => void;
  currentRoute: string;
  onNavigate: (route: string) => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  currentLang,
  onSelectLang,
  isOffline,
  onToggleOffline,
  currentRoute,
  onNavigate,
  onLogout,
}) => {
  const t = TRANSLATIONS[currentLang];

  return (
    <header className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-xl border-b border-emerald-100/80 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-2 sm:gap-4">
          {/* Logo and Tagline */}
          <div
            onClick={() => onNavigate(currentUser.role === "collector" ? "/collector/dashboard" : "/recycler/dashboard")}
            className="flex items-center gap-2.5 cursor-pointer select-none group"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center text-white shadow-md shadow-emerald-600/20 group-hover:scale-105 transition-transform">
              <Recycle className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base sm:text-lg text-slate-900 tracking-tight">
                  E-Waste Connect
                </span>
                <span className="hidden sm:inline-flex px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                  YHACK'26
                </span>
              </div>
              <p className="hidden md:block text-[11px] text-slate-500 font-medium">
                {t.tagline}
              </p>
            </div>
          </div>

          {/* Navigation Links based on role */}
          <nav className="hidden lg:flex items-center gap-1">
            {currentUser.role === "collector" ? (
              <>
                <button
                  onClick={() => onNavigate("/collector/dashboard")}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                    currentRoute === "/collector/dashboard"
                      ? "bg-emerald-100 text-emerald-900 font-bold"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  }`}
                >
                  {t.dashboard}
                </button>
                <button
                  onClick={() => onNavigate("/collector/scan")}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                    currentRoute === "/collector/scan"
                      ? "bg-emerald-600 text-white font-bold shadow-sm"
                      : "text-emerald-700 bg-emerald-50 hover:bg-emerald-100 font-bold"
                  }`}
                >
                  <span>📷</span>
                  <span>{t.scanWaste}</span>
                </button>
                <button
                  onClick={() => onNavigate("/collector/lots")}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                    currentRoute === "/collector/lots"
                      ? "bg-emerald-100 text-emerald-900 font-bold"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  }`}
                >
                  {t.myLots}
                </button>
                <button
                  onClick={() => onNavigate("/collector/marketplace")}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                    currentRoute === "/collector/marketplace"
                      ? "bg-emerald-100 text-emerald-900 font-bold"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  }`}
                >
                  {t.myOffers}
                </button>
                <button
                  onClick={() => onNavigate("/collector/transactions")}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                    currentRoute === "/collector/transactions"
                      ? "bg-emerald-100 text-emerald-900 font-bold"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  }`}
                >
                  {t.transactions}
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => onNavigate("/recycler/dashboard")}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                    currentRoute === "/recycler/dashboard"
                      ? "bg-teal-100 text-teal-900 font-bold"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  }`}
                >
                  {t.dashboard}
                </button>
                <button
                  onClick={() => onNavigate("/recycler/lots")}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                    currentRoute === "/recycler/lots"
                      ? "bg-teal-700 text-white font-bold shadow-sm"
                      : "text-teal-800 bg-teal-50 hover:bg-teal-100 font-bold"
                  }`}
                >
                  <span>📦</span>
                  <span>{t.availableLots}</span>
                </button>
                <button
                  onClick={() => onNavigate("/recycler/bids")}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                    currentRoute === "/recycler/bids"
                      ? "bg-teal-100 text-teal-900 font-bold"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  }`}
                >
                  {t.myBids}
                </button>
                <button
                  onClick={() => onNavigate("/recycler/transactions")}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                    currentRoute === "/recycler/transactions"
                      ? "bg-teal-100 text-teal-900 font-bold"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  }`}
                >
                  {t.transactions}
                </button>
              </>
            )}
          </nav>

          {/* Right Controls: Offline toggle, Language, User profile */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Audio Greeting button */}
            <AudioButton
              textToSpeak={`${t.audioGreeting} Logged in as ${currentUser.name}, role ${currentUser.role}.`}
              lang={currentLang}
              size="sm"
              label="Audio"
              className="hidden sm:inline-flex"
            />

            {/* Offline Simulation Toggle */}
            <button
              onClick={onToggleOffline}
              title={isOffline ? "Click to switch to Online mode" : "Click to test Offline-First mode"}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-bold transition-all border ${
                isOffline
                  ? "bg-amber-100 text-amber-900 border-amber-300"
                  : "bg-emerald-50 text-emerald-800 border-emerald-200"
              }`}
            >
              {isOffline ? (
                <>
                  <WifiOff className="w-3.5 h-3.5 text-amber-700" />
                  <span className="hidden sm:inline">Offline Mode</span>
                </>
              ) : (
                <>
                  <Wifi className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="hidden sm:inline">Online</span>
                </>
              )}
            </button>

            {/* Language Selector */}
            <div className="relative flex items-center bg-slate-100/90 rounded-xl p-0.5 border border-slate-200">
              <Globe className="w-3.5 h-3.5 text-slate-500 ml-1.5 mr-0.5 hidden sm:inline" />
              {(["en", "ta", "hi"] as Language[]).map((lang) => (
                <button
                  key={lang}
                  onClick={() => onSelectLang(lang)}
                  className={`px-2 py-1 rounded-lg text-xs font-bold transition-all ${
                    currentLang === lang
                      ? "bg-white text-emerald-800 shadow-sm"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {lang === "en" ? "EN" : lang === "ta" ? "தமிழ்" : "हिंदी"}
                </button>
              ))}
            </div>

            {/* User Profile Capsule */}
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-8 h-8 rounded-full object-cover border border-slate-300 shadow-sm"
              />
              <div className="hidden md:block text-left leading-tight">
                <div className="flex items-center gap-1">
                  <span className="font-bold text-xs text-slate-900">{currentUser.name}</span>
                  {currentUser.isVerified && (
                    <ShieldCheck className="w-3.5 h-3.5 text-teal-600" title="Verified Recycler" />
                  )}
                </div>
                <span className="text-[10px] text-slate-500 capitalize font-medium">
                  {currentUser.role === "recycler" ? "Verified Recycler" : "Scrap Collector"}
                </span>
              </div>

              <button
                onClick={onLogout}
                title="Log Out to Switch Account"
                className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-600 flex items-center justify-center transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
