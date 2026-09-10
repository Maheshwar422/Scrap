export type UserRole = "collector" | "recycler";

export type Language = "en" | "ta" | "hi";

export interface UserAccount {
  username: string;
  password: string;
  name: string;
  role: UserRole;
  isVerified?: boolean;
  avatar?: string;
  phone?: string;
  location?: string;
}

export interface EWastePriceReference {
  category: string;
  minRate: number; // in ₹ per kg
  maxRate: number; // in ₹ per kg
  description: string;
  typicalMaterials: string[];
  safetyRules: string[];
  icon: string;
}

export type ItemCondition = "intact" | "used" | "damaged" | "dismantled";

export interface AIAnalysisResult {
  detectedItem: string;
  category: string;
  confidence: number;
  conditionAssessment: string;
  potentialMaterials: string;
  safetyWarning: string;
  provider?: string;
}

export interface RecyclerBid {
  id: string;
  lotId?: string;
  recyclerUsername: string;
  recyclerName: string;
  amount?: number;
  bidAmount?: number;
  timestamp: string;
  status: "pending" | "accepted" | "rejected" | "outbid";
  pickupAvailability?: string;
  notes?: string;
  isVerified?: boolean;
  isVerifiedRecycler?: boolean;
  validationStatus?: "in_range" | "above_range" | "below_range";
}

export type LotStatus =
  | "active"
  | "bid_accepted"
  | "handover_pending"
  | "handover_completed"
  | "payment_recorded"
  | "completed";

export interface TraceabilityEvent {
  id: string;
  stage:
    | "created"
    | "ai_identified"
    | "valuation_estimated"
    | "sent_to_recyclers"
    | "bid_received"
    | "bid_accepted"
    | "handover_completed"
    | "payment_recorded"
    | "completed";
  title: string;
  description: string;
  timestamp: string;
  actor: string;
  icon?: string;
}

export interface MaterialLot {
  id: string; // e.g. "LOT-EW-0001"
  collectorUsername: string;
  collectorName: string;
  photoUrl: string;
  detectedItem: string;
  category: string;
  confidence: number;
  weightKg: number;
  weightUnit: "kg" | "g";
  condition: ItemCondition;
  estimatedValueMin: number;
  estimatedValueMax: number;
  referenceRateMin: number;
  referenceRateMax: number;
  createdAt: string;
  status: LotStatus;
  safetyWarning: string;
  potentialMaterials: string;
  bids: RecyclerBid[];
  selectedBid?: RecyclerBid;
  finalPrice?: number;
  handoverNotes?: string;
  paymentMethod?: "UPI" | "Cash on Handover" | "Bank Transfer";
  paymentReference?: string;
  traceability: TraceabilityEvent[];
  isOfflinePending?: boolean;
}

export interface DigitalReceipt {
  transactionId: string; // e.g. "TXN-EW-2026-0941"
  lotId: string;
  collectorName: string;
  collectorUsername: string;
  recyclerName: string;
  recyclerUsername: string;
  isRecyclerVerified: boolean;
  material: string;
  category: string;
  weightKg: number;
  finalPrice: number;
  date: string;
  status: string;
  paymentMethod: string;
  paymentReference: string;
  carbonSavedKg: number;
  recoveryCertificateNumber: string;
}
