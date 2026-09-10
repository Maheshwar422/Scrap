import { EWastePriceReference, ItemCondition, MaterialLot, UserAccount } from "../types";

export const SEEDED_COLLECTORS: UserAccount[] = [
  {
    username: "collector01",
    password: "demo123",
    name: "Ravi Kumar",
    role: "collector",
    phone: "+91 98401 23451",
    location: "Koyambedu Market Hub, Chennai",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
  },
  {
    username: "collector02",
    password: "demo123",
    name: "Suresh",
    role: "collector",
    phone: "+91 98402 34562",
    location: "T. Nagar Scrap Yard, Chennai",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
  },
  {
    username: "collector03",
    password: "demo123",
    name: "Mani",
    role: "collector",
    phone: "+91 98403 45673",
    location: "Guindy Labour Colony, Chennai",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80",
  },
  {
    username: "collector04",
    password: "demo123",
    name: "Arjun",
    role: "collector",
    phone: "+91 98404 56784",
    location: "Perambur Railway Yard, Chennai",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80",
  },
  {
    username: "collector05",
    password: "demo123",
    name: "Kumar",
    role: "collector",
    phone: "+91 98405 67895",
    location: "Ambattur Scrap Center, Chennai",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80",
  },
];

export const SEEDED_RECYCLERS: UserAccount[] = [
  {
    username: "recycler01",
    password: "demo123",
    name: "GreenCycle Recycling",
    role: "recycler",
    isVerified: true,
    phone: "+91 44 2250 8891",
    location: "Guindy Industrial Estate, Chennai",
    avatar: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=150&auto=format&fit=crop&q=80",
  },
  {
    username: "recycler02",
    password: "demo123",
    name: "EcoRecover Industries",
    role: "recycler",
    isVerified: true,
    phone: "+91 44 2625 4410",
    location: "Ambattur Industrial Estate, Chennai",
    avatar: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=150&auto=format&fit=crop&q=80",
  },
  {
    username: "recycler03",
    password: "demo123",
    name: "ReTech Recyclers",
    role: "recycler",
    isVerified: true,
    phone: "+91 44 2715 6602",
    location: "Sriperumbudur Clean Tech Zone",
    avatar: "https://images.unsplash.com/photo-1577495508048-b635879837f1?w=150&auto=format&fit=crop&q=80",
  },
];

export const ALL_USERS: UserAccount[] = [...SEEDED_COLLECTORS, ...SEEDED_RECYCLERS];

export const E_WASTE_PRICE_CATALOG: Record<string, EWastePriceReference> = {
  "Copper Wire": {
    category: "Copper Wire",
    minRate: 500,
    maxRate: 700,
    description: "Stripped or bundled electrical cable copper scrap",
    typicalMaterials: ["High-grade electrolytic copper", "PVC sheath residues"],
    safetyRules: [
      "Do not burn insulation in open air to prevent toxic dioxin release.",
      "Wear puncture-resistant gloves while coiling stiff wire bundles.",
    ],
    icon: "Cable",
  },
  "Computer Motherboard": {
    category: "Computer Motherboard",
    minRate: 400,
    maxRate: 650,
    description: "Desktop & workstation system boards with chipset & sockets",
    typicalMaterials: ["Gold-plated contacts", "Copper foil", "Aluminium heatsinks", "Silicon ICs"],
    safetyRules: [
      "Handle board edges carefully to avoid cuts from solder pins.",
      "Never attempt crude acid burning or cyanide soaking; formal recycling recovers 98% safely.",
    ],
    icon: "Cpu",
  },
  "Circuit Board / PCB": {
    category: "Circuit Board / PCB",
    minRate: 350,
    maxRate: 500,
    description: "Green/blue FR-4 printed circuit boards from monitors, TV, audio",
    typicalMaterials: ["Copper tracings", "Tantalum capacitors", "Silver solder", "Resins"],
    safetyRules: [
      "Store away from moisture and direct sunlight.",
      "Do not incinerate; thermal decomposition releases brominated flame retardants.",
    ],
    icon: "CircuitBoard",
  },
  "Laptop": {
    category: "Laptop",
    minRate: 150,
    maxRate: 300,
    description: "Intact or dismantled portable notebook computers",
    typicalMaterials: ["Lithium battery", "Magnesium/Aluminium chassis", "Copper heat pipes", "PCB"],
    safetyRules: [
      "Inspect battery pouch before dismantling; swollen batteries pose fire risk.",
      "Do not crush LCD screen panels containing backlights.",
    ],
    icon: "Laptop",
  },
  "Mobile Phone": {
    category: "Mobile Phone",
    minRate: 80,
    maxRate: 200,
    description: "Smartphones, feature phones, and handheld communications devices",
    typicalMaterials: ["Lithium-polymer cell", "Precious metal pins", "Camera optics", "Copper"],
    safetyRules: [
      "Do not puncture, pierce, or submerge lithium-ion batteries.",
      "Keep away from metal scrap piles that might short-circuit terminals.",
    ],
    icon: "Smartphone",
  },
  "Aluminium Components": {
    category: "Aluminium Components",
    minRate: 120,
    maxRate: 180,
    description: "Extruded heat sinks, CPU coolers, chassis brackets, casing",
    typicalMaterials: ["Extruded aluminium alloy", "Cast aluminium"],
    safetyRules: [
      "Watch for sharp sheared metal edges; use leather protective gloves.",
    ],
    icon: "Boxes",
  },
  "Iron / Steel Casing": {
    category: "Iron / Steel Casing",
    minRate: 25,
    maxRate: 40,
    description: "Ferrous desktop tower cases, printer frames, chassis",
    typicalMaterials: ["Galvanized steel", "Mild iron stamping"],
    safetyRules: [
      "Stack securely on flat surfaces to prevent toppling onto feet.",
    ],
    icon: "ShieldAlert",
  },
  "Mixed Electronic Scrap": {
    category: "Mixed Electronic Scrap",
    minRate: 50,
    maxRate: 150,
    description: "Assorted small domestic e-waste, unsorted electronics",
    typicalMaterials: ["Mixed plastics", "Copper coils", "Transformers", "Small PCBs"],
    safetyRules: [
      "Sort into dry batches; remove loose batteries immediately to avoid fires.",
    ],
    icon: "Layers",
  },
  "RAM Modules": {
    category: "RAM Modules",
    minRate: 600,
    maxRate: 900,
    description: "DDR3, DDR4, DDR5 desktop & laptop RAM sticks with gold fingers",
    typicalMaterials: ["High-karat edge contacts", "BGA chips", "Multi-layer PCB"],
    safetyRules: [
      "Do not snap or scrape contacts; high value depends on intact gold plating.",
    ],
    icon: "MemoryStick",
  },
  "Hard Disk Drive": {
    category: "Hard Disk Drive",
    minRate: 180,
    maxRate: 320,
    description: "Mechanical 3.5\" & 2.5\" HDDs with neodymium magnets & platters",
    typicalMaterials: ["Neodymium rare earth magnets", "Aluminium platters", "Controller board"],
    safetyRules: [
      "Pinch hazard from strong rare-earth magnets during disassembly.",
    ],
    icon: "HardDrive",
  },
  "SSD": {
    category: "SSD",
    minRate: 300,
    maxRate: 550,
    description: "SATA & NVMe solid state flash storage drives",
    typicalMaterials: ["NAND flash silicon", "High-density PCB", "Aluminium shell"],
    safetyRules: [
      "Keep dry and protected from static discharge.",
    ],
    icon: "Database",
  },
  "SMPS / Power Supply": {
    category: "SMPS / Power Supply",
    minRate: 60,
    maxRate: 110,
    description: "Computer ATX power supply units with heavy ferrite transformers",
    typicalMaterials: ["Copper transformer windings", "Aluminium heat spreaders", "Steel casing"],
    safetyRules: [
      "WARNING: High-voltage capacitors can hold a shock even after being unplugged.",
      "Do not cut capacitor leads with bare hands.",
    ],
    icon: "Zap",
  },
  "Battery": {
    category: "Battery",
    minRate: 100,
    maxRate: 220,
    description: "Lithium-ion, LiFePO4, and sealed lead-acid (SLA) secondary cells",
    typicalMaterials: ["Lithium cobalt oxide", "Nickel", "Cobalt", "Lead & sulfuric gel"],
    safetyRules: [
      "DO NOT puncture, crush, throw, or burn batteries.",
      "Isolate battery terminals with insulation tape to prevent spark fire.",
    ],
    icon: "BatteryCharging",
  },
  "Printer": {
    category: "Printer",
    minRate: 40,
    maxRate: 90,
    description: "Inkjet and laser printer assemblies with stepper motors",
    typicalMaterials: ["ABS plastics", "Copper stepper motors", "Ferrite rods"],
    safetyRules: [
      "Avoid inhaling laser toner black powder; wear a dust mask.",
    ],
    icon: "Printer",
  },
  "Charger / Adapter": {
    category: "Charger / Adapter",
    minRate: 70,
    maxRate: 140,
    description: "Wall chargers, laptop power bricks, and transformer plugs",
    typicalMaterials: ["Copper wire windings", "Flyback ferrite", "Flame-retardant casing"],
    safetyRules: [
      "Mechanical shredding only; do not burn outer plastic.",
    ],
    icon: "Plug",
  },
  "Keyboard & Mouse": {
    category: "Keyboard & Mouse",
    minRate: 30,
    maxRate: 70,
    description: "Peripherals, membrane keyboards, optical mice, and USB leads",
    typicalMaterials: ["HIPS plastic", "Silicone elastomer", "Thin copper cable"],
    safetyRules: [
      "Separate copper cords for higher scrap value recovery.",
    ],
    icon: "Mouse",
  },
};

export function calculateFairValue(
  categoryName: string,
  weightKg: number,
  condition: ItemCondition
): { minTotal: number; maxTotal: number; minRate: number; maxRate: number } {
  const ref = E_WASTE_PRICE_CATALOG[categoryName] || E_WASTE_PRICE_CATALOG["Mixed Electronic Scrap"];
  
  // Condition multiplier
  let conditionFactor = 1.0;
  switch (condition) {
    case "intact":
      conditionFactor = 1.08;
      break;
    case "used":
      conditionFactor = 1.0;
      break;
    case "damaged":
      conditionFactor = 0.9;
      break;
    case "dismantled":
      conditionFactor = 0.85;
      break;
  }

  const effectiveMinRate = Math.round(ref.minRate * conditionFactor);
  const effectiveMaxRate = Math.round(ref.maxRate * conditionFactor);

  const minTotal = Math.round(weightKg * effectiveMinRate);
  const maxTotal = Math.round(weightKg * effectiveMaxRate);

  return {
    minTotal,
    maxTotal,
    minRate: ref.minRate,
    maxRate: ref.maxRate,
  };
}

// Seeded Material Lots (Per Section 24 of prompt)
export const INITIAL_SEEDED_LOTS: MaterialLot[] = [
  {
    id: "LOT-EW-0001",
    collectorUsername: "collector01",
    collectorName: "Ravi Kumar",
    photoUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=80",
    detectedItem: "Laptop Motherboard",
    category: "Computer Motherboard",
    confidence: 92,
    weightKg: 2.5,
    weightUnit: "kg",
    condition: "used",
    estimatedValueMin: 875,
    estimatedValueMax: 1250,
    referenceRateMin: 400,
    referenceRateMax: 650,
    createdAt: "2026-09-10T04:15:00.000Z",
    status: "active",
    safetyWarning: "Handle board edges carefully to avoid cuts from solder pins. Avoid open acid baths.",
    potentialMaterials: "Gold-plated connectors, copper tracings, aluminium heat sinks, silicon",
    bids: [],
    traceability: [
      {
        id: "tr-001-1",
        stage: "created",
        title: "Lot Created",
        description: "Collector Ravi Kumar registered item",
        timestamp: "2026-09-10T04:15:00.000Z",
        actor: "Ravi Kumar (Collector 01)",
      },
      {
        id: "tr-001-2",
        stage: "ai_identified",
        title: "AI Identified",
        description: "Classified as Computer Motherboard with 92% confidence",
        timestamp: "2026-09-10T04:15:12.000Z",
        actor: "Gemini Vision AI",
      },
      {
        id: "tr-001-3",
        stage: "valuation_estimated",
        title: "Value Estimated",
        description: "Fair-value engine calculated reference range ₹875–₹1,250 for 2.5 kg",
        timestamp: "2026-09-10T04:15:18.000Z",
        actor: "E-Waste Price Engine",
      },
      {
        id: "tr-001-4",
        stage: "sent_to_recyclers",
        title: "Sent to Recyclers",
        description: "Published to verified recycler network for competitive bidding",
        timestamp: "2026-09-10T04:15:30.000Z",
        actor: "Marketplace Router",
      },
    ],
  },
  {
    id: "LOT-EW-0002",
    collectorUsername: "collector02",
    collectorName: "Suresh",
    photoUrl: "https://images.unsplash.com/photo-1544724569-5f546fd6f2b6?w=600&auto=format&fit=crop&q=80",
    detectedItem: "Heavy Stripped Copper Cables",
    category: "Copper Wire",
    confidence: 95,
    weightKg: 3.0,
    weightUnit: "kg",
    condition: "used",
    estimatedValueMin: 1500,
    estimatedValueMax: 2100,
    referenceRateMin: 500,
    referenceRateMax: 700,
    createdAt: "2026-09-10T05:00:00.000Z",
    status: "active",
    safetyWarning: "Do not burn insulation in open air. Wear puncture-resistant gloves while bundling.",
    potentialMaterials: "Refined electrolytic copper, trace insulation",
    bids: [
      {
        id: "bid-002-1",
        lotId: "LOT-EW-0002",
        recyclerUsername: "recycler01",
        recyclerName: "GreenCycle Recycling",
        amount: 1850,
        bidAmount: 1850,
        timestamp: "2026-09-10T05:25:00.000Z",
        status: "pending",
        pickupAvailability: "Same day pickup available in Guindy / T. Nagar",
        isVerified: true,
      },
    ],
    traceability: [
      {
        id: "tr-002-1",
        stage: "created",
        title: "Lot Created",
        description: "Collector Suresh registered 3.0 kg copper wire",
        timestamp: "2026-09-10T05:00:00.000Z",
        actor: "Suresh (Collector 02)",
      },
      {
        id: "tr-002-2",
        stage: "ai_identified",
        title: "AI Identified",
        description: "Classified as Copper Wire (95% confidence)",
        timestamp: "2026-09-10T05:00:15.000Z",
        actor: "Gemini Vision AI",
      },
      {
        id: "tr-002-3",
        stage: "valuation_estimated",
        title: "Value Estimated",
        description: "Fair-value estimated ₹1,500–₹2,100",
        timestamp: "2026-09-10T05:00:20.000Z",
        actor: "E-Waste Price Engine",
      },
      {
        id: "tr-002-4",
        stage: "bid_received",
        title: "Bid Received",
        description: "GreenCycle Recycling placed valid offer of ₹1,850",
        timestamp: "2026-09-10T05:25:00.000Z",
        actor: "GreenCycle Recycling (Verified)",
      },
    ],
  },
  {
    id: "LOT-EW-0003",
    collectorUsername: "collector03",
    collectorName: "Mani",
    photoUrl: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600&auto=format&fit=crop&q=80",
    detectedItem: "Assorted Small Electronics Scrap",
    category: "Mixed Electronic Scrap",
    confidence: 88,
    weightKg: 8.0,
    weightUnit: "kg",
    condition: "used",
    estimatedValueMin: 400,
    estimatedValueMax: 1200,
    referenceRateMin: 50,
    referenceRateMax: 150,
    createdAt: "2026-09-09T18:30:00.000Z",
    status: "completed",
    safetyWarning: "Sort in ventilated area; discard ruptured button cells safely.",
    potentialMaterials: "Mixed copper windings, small capacitors, transformer cores",
    finalPrice: 850,
    paymentMethod: "UPI",
    paymentReference: "UPI/20260909/78219381029",
    selectedBid: {
      id: "bid-003-1",
      lotId: "LOT-EW-0003",
      recyclerUsername: "recycler02",
      recyclerName: "EcoRecover Industries",
      amount: 850,
      bidAmount: 850,
      timestamp: "2026-09-09T19:00:00.000Z",
      status: "accepted",
      pickupAvailability: "Completed doorstep collection",
      isVerified: true,
    },
    bids: [
      {
        id: "bid-003-1",
        lotId: "LOT-EW-0003",
        recyclerUsername: "recycler02",
        recyclerName: "EcoRecover Industries",
        amount: 850,
        bidAmount: 850,
        timestamp: "2026-09-09T19:00:00.000Z",
        status: "accepted",
        pickupAvailability: "Completed doorstep collection",
        isVerified: true,
      },
    ],
    traceability: [
      {
        id: "tr-003-1",
        stage: "created",
        title: "Lot Created",
        description: "Collector Mani submitted 8.0 kg mixed scrap",
        timestamp: "2026-09-09T18:30:00.000Z",
        actor: "Mani (Collector 03)",
      },
      {
        id: "tr-003-2",
        stage: "valuation_estimated",
        title: "Value Estimated",
        description: "Estimated fair-value ₹400–₹1,200",
        timestamp: "2026-09-09T18:30:10.000Z",
        actor: "E-Waste Price Engine",
      },
      {
        id: "tr-003-3",
        stage: "bid_received",
        title: "Bid Received",
        description: "EcoRecover Industries offered ₹850",
        timestamp: "2026-09-09T19:00:00.000Z",
        actor: "EcoRecover Industries (Verified)",
      },
      {
        id: "tr-003-4",
        stage: "bid_accepted",
        title: "Bid Accepted",
        description: "Collector Mani accepted ₹850 offer",
        timestamp: "2026-09-09T19:15:00.000Z",
        actor: "Mani (Collector 03)",
      },
      {
        id: "tr-003-5",
        stage: "handover_completed",
        title: "Handover Completed",
        description: "Physical inspection and weight (8.0 kg) verified on calibrated scale",
        timestamp: "2026-09-09T20:00:00.000Z",
        actor: "EcoRecover Industries (Verified)",
      },
      {
        id: "tr-003-6",
        stage: "payment_recorded",
        title: "Payment Recorded",
        description: "Instant UPI payout of ₹850 sent to Collector Mani",
        timestamp: "2026-09-09T20:02:15.000Z",
        actor: "Bank Payment Gateway",
      },
      {
        id: "tr-003-7",
        stage: "completed",
        title: "Digital Receipt Issued",
        description: "Formal transaction record TXN-EW-2026-0909 generated",
        timestamp: "2026-09-09T20:03:00.000Z",
        actor: "E-Waste Connect Platform",
      },
    ],
  },
];
