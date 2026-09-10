import { INITIAL_SEEDED_LOTS, ALL_USERS } from "../data/pricingDataset";
import { DigitalReceipt, MaterialLot, UserAccount } from "../types";

const LOTS_STORAGE_KEY = "ewaste_connect_lots_v1";
const RECEIPTS_STORAGE_KEY = "ewaste_connect_receipts_v1";
const CURRENT_USER_KEY = "ewaste_connect_current_user_v1";
const LANGUAGE_KEY = "ewaste_connect_lang_v1";

export const storageService = {
  getLots(): MaterialLot[] {
    try {
      const data = localStorage.getItem(LOTS_STORAGE_KEY);
      if (!data) {
        this.saveLots(INITIAL_SEEDED_LOTS);
        return INITIAL_SEEDED_LOTS;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_SEEDED_LOTS;
    }
  },

  saveLots(lots: MaterialLot[]) {
    try {
      localStorage.setItem(LOTS_STORAGE_KEY, JSON.stringify(lots));
    } catch (err) {
      console.error("Failed to save lots to localStorage:", err);
    }
  },

  addLot(lot: MaterialLot) {
    const lots = this.getLots();
    lots.unshift(lot);
    this.saveLots(lots);
  },

  updateLot(updatedLot: MaterialLot) {
    const lots = this.getLots();
    const index = lots.findIndex((l) => l.id === updatedLot.id);
    if (index !== -1) {
      lots[index] = updatedLot;
    } else {
      lots.unshift(updatedLot);
    }
    this.saveLots(lots);
  },

  getLotById(id: string): MaterialLot | undefined {
    const lots = this.getLots();
    return lots.find((l) => l.id === id);
  },

  getReceipts(): DigitalReceipt[] {
    try {
      const data = localStorage.getItem(RECEIPTS_STORAGE_KEY);
      if (!data) {
        // Seed an initial completed receipt for Lot 003
        const initialReceipt: DigitalReceipt = {
          transactionId: "TXN-EW-2026-0909",
          lotId: "LOT-EW-0003",
          collectorName: "Mani",
          collectorUsername: "collector03",
          recyclerName: "EcoRecover Industries",
          recyclerUsername: "recycler02",
          isRecyclerVerified: true,
          material: "Mixed Electronic Scrap",
          category: "Mixed Electronic Scrap",
          weightKg: 8.0,
          finalPrice: 850,
          date: "2026-09-09T20:03:00.000Z",
          status: "Payment Completed",
          paymentMethod: "UPI",
          paymentReference: "UPI/20260909/78219381029",
          carbonSavedKg: 14.4,
          recoveryCertificateNumber: "CERT-TN-EWC-2026-0418",
        };
        this.saveReceipts([initialReceipt]);
        return [initialReceipt];
      }
      return JSON.parse(data);
    } catch {
      return [];
    }
  },

  saveReceipts(receipts: DigitalReceipt[]) {
    try {
      localStorage.setItem(RECEIPTS_STORAGE_KEY, JSON.stringify(receipts));
    } catch (err) {
      console.error("Failed to save receipts:", err);
    }
  },

  addReceipt(receipt: DigitalReceipt) {
    const receipts = this.getReceipts();
    receipts.unshift(receipt);
    this.saveReceipts(receipts);
  },

  getCurrentUser(): UserAccount {
    try {
      const stored = localStorage.getItem(CURRENT_USER_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {}
    // Default to Collector 01 (Ravi Kumar)
    return ALL_USERS[0];
  },

  setCurrentUser(user: UserAccount) {
    try {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    } catch {}
  },

  resetDemoData() {
    localStorage.removeItem(LOTS_STORAGE_KEY);
    localStorage.removeItem(RECEIPTS_STORAGE_KEY);
    return this.getLots();
  },
};
