import React, { useState, useEffect } from "react";
import { UserAccount, MaterialLot, RecyclerBid, DigitalReceipt, Language } from "./types";
import { storageService } from "./services/storageService";
import { TRANSLATIONS } from "./data/translations";
import { Navbar } from "./components/Navbar";
import { RoleQuickSwitcher } from "./components/RoleQuickSwitcher";
import { DigitalReceiptModal } from "./components/DigitalReceiptModal";
import { LoginView } from "./views/LoginView";
import { CollectorDashboard } from "./views/CollectorDashboard";
import { CollectorScanView } from "./views/CollectorScanView";
import { CollectorLotsView } from "./views/CollectorLotsView";
import { LotDetailView } from "./views/LotDetailView";
import { RecyclerDashboard } from "./views/RecyclerDashboard";
import { RecyclerLotsMarketplace } from "./views/RecyclerLotsMarketplace";
import { TransactionsHistoryView } from "./views/TransactionsHistoryView";
import { WifiOff, RefreshCw, CheckCircle2 } from "lucide-react";

export default function App() {
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => {
    return storageService.getCurrentUser();
  });
  const [currentLang, setCurrentLang] = useState<Language>("en");
  const [currentRoute, setCurrentRoute] = useState<string>("/collector/dashboard");
  const [isOffline, setIsOffline] = useState<boolean>(false);
  const [lots, setLots] = useState<MaterialLot[]>(() => storageService.getLots());
  const [receipts, setReceipts] = useState<DigitalReceipt[]>(() => storageService.getReceipts());
  const [selectedLotId, setSelectedLotId] = useState<string | null>(null);
  const [selectedReceipt, setSelectedReceipt] = useState<DigitalReceipt | null>(null);
  const [syncNotice, setSyncNotice] = useState<string | null>(null);

  // Sync state changes with storageService
  useEffect(() => {
    if (currentUser) {
      storageService.setCurrentUser(currentUser);
      // Route appropriately if on mismatched dashboard
      if (currentUser.role === "collector" && currentRoute.startsWith("/recycler")) {
        setCurrentRoute("/collector/dashboard");
      } else if (currentUser.role === "recycler" && currentRoute.startsWith("/collector")) {
        setCurrentRoute("/recycler/dashboard");
      }
    }
  }, [currentUser]);

  // Handle Offline Toggle & Reconnect Sync
  const handleToggleOffline = () => {
    if (isOffline) {
      // Reconnecting! Sync any offline-pending lots (Section 22 MANDATE)
      setIsOffline(false);
      const pendingLots = lots.filter((l) => l.isOfflinePending);
      if (pendingLots.length > 0) {
        const synced = lots.map((l) => ({ ...l, isOfflinePending: false }));
        setLots(synced);
        storageService.saveLots(synced);
        setSyncNotice(`Synchronized ${pendingLots.length} offline lots to central recycler registry!`);
        setTimeout(() => setSyncNotice(null), 4000);
      }
    } else {
      setIsOffline(true);
    }
  };

  // Login handler
  const handleLogin = (user: UserAccount) => {
    setCurrentUser(user);
    if (user.role === "collector") {
      setCurrentRoute("/collector/dashboard");
    } else {
      setCurrentRoute("/recycler/dashboard");
    }
  };

  // Logout handler
  const handleLogout = () => {
    setCurrentRoute("/login");
  };

  // Create Lot Handler
  const handleLotCreated = (newLot: MaterialLot) => {
    storageService.addLot(newLot);
    setLots(storageService.getLots());
    setSelectedLotId(newLot.id);
    setCurrentRoute(`/collector/lot/${newLot.id}`);
  };

  // Place Recycler Bid Handler (Section 11 & 12 MANDATE)
  const handlePlaceBid = (lotId: string, offerPrice: number) => {
    if (!currentUser || currentUser.role !== "recycler") return;

    const targetLot = lots.find((l) => l.id === lotId);
    if (!targetLot) return;

    const timestamp = new Date().toISOString();
    const isAbove = offerPrice > targetLot.estimatedValueMax;

    const newBid: RecyclerBid = {
      id: `bid-${Date.now()}`,
      recyclerUsername: currentUser.username,
      recyclerName: currentUser.name,
      isVerifiedRecycler: true,
      amount: offerPrice,
      timestamp: timestamp,
      status: "pending",
      validationStatus: isAbove ? "above_range" : "in_range",
    };

    const updatedBids = [...(targetLot.bids || []), newBid];

    const updatedTraceability = [
      ...(targetLot.traceability || []),
      {
        id: `tr-bid-${Date.now()}`,
        stage: "bid_received" as const,
        title: "Bid Received",
        description: `Verified Recycler ${currentUser.name} placed a validated offer of ₹${offerPrice.toLocaleString("en-IN")}`,
        timestamp: timestamp,
        actor: `${currentUser.name} (Recycler)`,
      },
    ];

    const updatedLot: MaterialLot = {
      ...targetLot,
      bids: updatedBids,
      traceability: updatedTraceability,
    };

    storageService.updateLot(updatedLot);
    setLots(storageService.getLots());
  };

  // Accept Bid Handler (Section 13 MANDATE)
  const handleAcceptBid = (lotId: string, acceptedBid: RecyclerBid) => {
    const targetLot = lots.find((l) => l.id === lotId);
    if (!targetLot) return;

    const timestamp = new Date().toISOString();

    const updatedBids = (targetLot.bids || []).map((b) =>
      b.id === acceptedBid.id ? { ...b, status: "accepted" as const } : { ...b, status: "rejected" as const }
    );

    const updatedTraceability = [
      ...(targetLot.traceability || []),
      {
        id: `tr-accept-${Date.now()}`,
        stage: "bid_accepted" as const,
        title: "Bid Accepted",
        description: `Collector accepted offer of ₹${acceptedBid.amount} from ${acceptedBid.recyclerName}`,
        timestamp: timestamp,
        actor: `${targetLot.collectorName} (Collector)`,
      },
    ];

    const updatedLot: MaterialLot = {
      ...targetLot,
      status: "bid_accepted",
      bids: updatedBids,
      traceability: updatedTraceability,
    };

    storageService.updateLot(updatedLot);
    setLots(storageService.getLots());
  };

  // Confirm Handover Handler (Section 14 MANDATE)
  const handleConfirmHandover = (lotId: string) => {
    const targetLot = lots.find((l) => l.id === lotId);
    if (!targetLot) return;

    const timestamp = new Date().toISOString();

    const updatedTraceability = [
      ...(targetLot.traceability || []),
      {
        id: `tr-handover-${Date.now()}`,
        stage: "handover_completed" as const,
        title: "Handover Completed",
        description: `Physical verification and scrap handover of ${targetLot.weightKg} kg confirmed`,
        timestamp: timestamp,
        actor: "Collector & Recycler Joint Handover",
      },
    ];

    const updatedLot: MaterialLot = {
      ...targetLot,
      status: "handover_completed",
      traceability: updatedTraceability,
    };

    storageService.updateLot(updatedLot);
    setLots(storageService.getLots());
  };

  // Record Payment & Generate Receipt Handler (Section 15 MANDATE)
  const handleRecordPayment = (
    lotId: string,
    paymentMethod: "UPI" | "Bank Transfer" | "Cash"
  ) => {
    const targetLot = lots.find((l) => l.id === lotId);
    if (!targetLot) return;

    const acceptedBid = targetLot.bids?.find((b) => b.status === "accepted") || {
      amount: Math.round((targetLot.estimatedValueMin + targetLot.estimatedValueMax) / 2),
      recyclerName: currentUser?.role === "recycler" ? currentUser.name : "GreenCycle Recycling",
      recyclerUsername: currentUser?.role === "recycler" ? currentUser.username : "recycler01",
    };

    const timestamp = new Date().toISOString();
    const txnNumber = Math.floor(100000 + Math.random() * 900000);
    const txnId = `TXN-EW-2026-${txnNumber}`;

    const newReceipt: DigitalReceipt = {
      transactionId: txnId,
      lotId: targetLot.id,
      collectorName: targetLot.collectorName,
      collectorUsername: targetLot.collectorUsername,
      recyclerName: acceptedBid.recyclerName,
      recyclerUsername: acceptedBid.recyclerUsername,
      isRecyclerVerified: true,
      material: targetLot.category,
      category: targetLot.category,
      weightKg: targetLot.weightKg,
      finalPrice: acceptedBid.amount,
      date: timestamp,
      status: "Payment Completed",
      paymentMethod: paymentMethod,
      paymentReference: `${paymentMethod}/20260910/${txnNumber}`,
      carbonSavedKg: Number((targetLot.weightKg * 1.8).toFixed(1)),
      recoveryCertificateNumber: `CERT-TN-EWC-2026-${Math.floor(1000 + Math.random() * 9000)}`,
    };

    storageService.addReceipt(newReceipt);
    setReceipts(storageService.getReceipts());

    const updatedTraceability = [
      ...(targetLot.traceability || []),
      {
        id: `tr-pay-${Date.now()}`,
        stage: "payment_recorded" as const,
        title: "Payment Recorded",
        description: `Formal payout of ₹${acceptedBid.amount} settled via ${paymentMethod}. Traceable Receipt ID: ${txnId}`,
        timestamp: timestamp,
        actor: "Verified Recycler Settlement",
      },
    ];

    const updatedLot: MaterialLot = {
      ...targetLot,
      status: "completed",
      traceability: updatedTraceability,
    };

    storageService.updateLot(updatedLot);
    setLots(storageService.getLots());

    // Automatically reveal digital receipt
    setSelectedReceipt(newReceipt);
  };

  const handleNavigate = (route: string) => {
    setCurrentRoute(route);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleViewLot = (lotId: string) => {
    setSelectedLotId(lotId);
    if (currentUser?.role === "collector") {
      setCurrentRoute(`/collector/lot/${lotId}`);
    } else {
      setCurrentRoute(`/recycler/lot/${lotId}`);
    }
  };

  const t = TRANSLATIONS[currentLang];
  const activeLotForDetail = selectedLotId
    ? lots.find((l) => l.id === selectedLotId)
    : null;
  const activeReceiptForDetail = selectedLotId
    ? receipts.find((r) => r.lotId === selectedLotId)
    : null;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-100 via-emerald-50/25 to-teal-50/30 text-slate-900 font-sans selection:bg-emerald-500 selection:text-white">
      {/* Top Navigation */}
      {currentUser && currentRoute !== "/login" && (
        <Navbar
          currentUser={currentUser}
          currentLang={currentLang}
          onSelectLang={setCurrentLang}
          isOffline={isOffline}
          onToggleOffline={handleToggleOffline}
          currentRoute={currentRoute}
          onNavigate={handleNavigate}
          onLogout={handleLogout}
        />
      )}

      {/* Offline Alert Banner (Section 22) */}
      {isOffline && (
        <div className="bg-amber-500 text-white px-4 py-2 text-xs font-bold text-center flex items-center justify-center gap-2 shadow-md">
          <WifiOff className="w-4 h-4 animate-bounce" />
          <span>{t.offlineBanner}</span>
          <button
            onClick={handleToggleOffline}
            className="ml-2 underline hover:text-amber-100"
          >
            Reconnect to Sync
          </button>
        </div>
      )}

      {/* Synchronized alert */}
      {syncNotice && (
        <div className="bg-emerald-600 text-white px-4 py-2 text-xs font-bold text-center flex items-center justify-center gap-2 shadow-md animate-fade-in">
          <CheckCircle2 className="w-4 h-4" />
          <span>{syncNotice}</span>
        </div>
      )}

      {/* Main Content Router */}
      <main className="flex-1 pb-16">
        {(!currentUser || currentRoute === "/login") && (
          <LoginView onLogin={handleLogin} lang={currentLang} />
        )}

        {currentUser && currentRoute === "/collector/dashboard" && (
          <CollectorDashboard
            currentUser={currentUser}
            lots={lots}
            receipts={receipts}
            lang={currentLang}
            onNavigate={handleNavigate}
            onViewLot={handleViewLot}
            onViewReceipt={setSelectedReceipt}
          />
        )}

        {currentUser && currentRoute === "/collector/scan" && (
          <CollectorScanView
            currentUser={currentUser}
            lang={currentLang}
            isOffline={isOffline}
            onLotCreated={handleLotCreated}
            onCancel={() => handleNavigate("/collector/dashboard")}
          />
        )}

        {currentUser && currentRoute === "/collector/lots" && (
          <CollectorLotsView
            currentUser={currentUser}
            lots={lots}
            lang={currentLang}
            onNavigate={handleNavigate}
            onViewLot={handleViewLot}
          />
        )}

        {currentUser && currentRoute === "/collector/marketplace" && (
          <CollectorLotsView
            currentUser={currentUser}
            lots={lots.filter((l) => l.bids && l.bids.length > 0)}
            lang={currentLang}
            onNavigate={handleNavigate}
            onViewLot={handleViewLot}
          />
        )}

        {currentUser &&
          (currentRoute.startsWith("/collector/lot/") ||
            currentRoute.startsWith("/recycler/lot/")) &&
          activeLotForDetail && (
            <LotDetailView
              currentUser={currentUser}
              lot={activeLotForDetail}
              lang={currentLang}
              onBack={() =>
                handleNavigate(
                  currentUser.role === "collector"
                    ? "/collector/lots"
                    : "/recycler/lots"
                )
              }
              onAcceptBid={handleAcceptBid}
              onConfirmHandover={handleConfirmHandover}
              onRecordPayment={handleRecordPayment}
              onViewReceipt={setSelectedReceipt}
              existingReceipt={activeReceiptForDetail}
              onPlaceBid={handlePlaceBid}
            />
          )}

        {currentUser && currentRoute === "/recycler/dashboard" && (
          <RecyclerDashboard
            currentUser={currentUser}
            lots={lots}
            receipts={receipts}
            lang={currentLang}
            onNavigate={handleNavigate}
            onViewLot={handleViewLot}
            onViewReceipt={setSelectedReceipt}
          />
        )}

        {currentUser && (currentRoute === "/recycler/lots" || currentRoute === "/recycler/bids") && (
          <RecyclerLotsMarketplace
            currentUser={currentUser}
            lots={lots}
            lang={currentLang}
            onViewLot={handleViewLot}
            onPlaceBid={handlePlaceBid}
          />
        )}

        {currentUser &&
          (currentRoute === "/collector/transactions" ||
            currentRoute === "/recycler/transactions") && (
            <TransactionsHistoryView
              currentUser={currentUser}
              receipts={receipts}
              lang={currentLang}
              onViewReceipt={setSelectedReceipt}
            />
          )}
      </main>

      {/* Floating Demo Role Switcher (Always available for presenter) */}
      {currentUser && (
        <RoleQuickSwitcher
          currentUser={currentUser}
          onSelectUser={(user) => {
            setCurrentUser(user);
            if (user.role === "collector") {
              setCurrentRoute("/collector/dashboard");
            } else {
              setCurrentRoute("/recycler/dashboard");
            }
          }}
        />
      )}

      {/* Digital Receipt Modal (Section 15) */}
      <DigitalReceiptModal
        receipt={selectedReceipt}
        isOpen={selectedReceipt !== null}
        onClose={() => setSelectedReceipt(null)}
        lang={currentLang}
      />
    </div>
  );
}
